import assert from "node:assert/strict";
import test from "node:test";

import { PracticeSession } from "../src/practice/practice-session.js";

const notes = [
  {
    id: "n1",
    notation: "1",
    startMs: 0,
    durationMs: 500,
    midi: 60,
  },
  {
    id: "n2",
    notation: "2",
    startMs: 500,
    durationMs: 500,
    midi: 62,
  },
  {
    id: "n3",
    notation: "0",
    startMs: 1000,
    durationMs: 500,
    midi: null,
  },
];

test("starts, advances active notes by elapsed time, and stops after duration", () => {
  const session = new PracticeSession(notes);

  assert.equal(session.getState().selectedIndex, 0);
  assert.equal(session.getState().isRunning, false);

  session.start(1000);
  assert.equal(session.getState().isRunning, true);
  assert.equal(session.getState().elapsedMs, 0);

  session.updateElapsed(1260);
  assert.equal(session.getState().selectedIndex, 0);
  assert.equal(session.getState().activeNote.id, "n1");

  session.updateElapsed(1620);
  assert.equal(session.getState().selectedIndex, 1);
  assert.equal(session.getState().activeNote.id, "n2");

  session.updateElapsed(3100);
  assert.equal(session.getState().isRunning, false);
  assert.equal(session.getState().feedback, "miss");
});

test("supports manual note navigation while stopped", () => {
  const session = new PracticeSession(notes);

  session.selectNext();
  session.selectNext();
  session.selectNext();
  assert.equal(session.getState().selectedIndex, 2);
  assert.equal(session.getTarget().id, "n3");

  session.selectPrevious();
  assert.equal(session.getState().selectedIndex, 1);
  assert.equal(session.getTarget().id, "n2");

  session.selectIndex(0);
  assert.equal(session.getState().selectedIndex, 0);
  assert.equal(session.getTarget().id, "n1");
});

test("updates feedback from pitch samples against the current target", () => {
  const session = new PracticeSession(notes);

  session.start(0);
  session.updateElapsed(40);
  session.updatePitch({
    frequency: 261.625565,
    midi: 60,
    centsOff: 0,
  });

  assert.equal(session.getState().feedback, "perfect");

  session.updatePitch({
    frequency: 277.182631,
    midi: 61,
    centsOff: 100,
  });

  assert.equal(session.getState().feedback, "wrong");
});

test("accepts target-relative pitch options from browser adapters", () => {
  const session = new PracticeSession(notes);

  session.updatePitch(
    {
      frequency: 263,
      midi: 60,
      centsOff: 8,
    },
    {
      centsOff: 12,
      playedAtMs: 30,
    },
  );

  assert.equal(session.getState().feedback, "perfect");
});

test("records latest note judgments and exposes practice stats", () => {
  const session = new PracticeSession(notes);

  session.start(0);
  session.updateElapsed(40);
  session.updatePitch({ frequency: 261.625565, midi: 60, centsOff: 0 });

  session.updateElapsed(620);
  session.updatePitch({ frequency: 277.182631, midi: 61, centsOff: 100 });

  const state = session.getState();

  assert.deepEqual(state.stats.counts, {
    perfect: 1,
    good: 0,
    early: 0,
    late: 0,
    wrong: 1,
    miss: 0,
  });
  assert.equal(state.stats.attemptedNotes, 2);
  assert.equal(state.stats.accuracyPercent, 50);
  assert.deepEqual(state.stats.difficultNotes, [
    {
      id: "n2",
      notation: "2",
      result: "wrong",
    },
  ]);
  assert.equal(state.judgmentsByNoteId.n1.result, "perfect");
  assert.equal(state.judgmentsByNoteId.n2.result, "wrong");
});
