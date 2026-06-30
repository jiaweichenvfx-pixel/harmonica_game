import assert from "node:assert/strict";
import test from "node:test";

import {
  BLUES_SHUFFLE_RIFF,
  BLUES_SHUFFLE_NOTES,
  evaluateBluesPitch,
  getShufflePosition,
} from "../src/freestyle/blues-shuffle.js";

test("defines C blues scale notes for freestyle practice", () => {
  assert.deepEqual(
    BLUES_SHUFFLE_NOTES.map((note) => [note.notation, note.midi, note.role]),
    [
      ["1", 60, "root"],
      ["b3", 63, "blue"],
      ["4", 65, "color"],
      ["#4", 66, "tension"],
      ["5", 67, "stable"],
      ["b7", 70, "blue"],
      ["1'", 72, "root"],
    ],
  );
});

test("evaluates whether detected pitch belongs to the blues scale", () => {
  assert.deepEqual(evaluateBluesPitch({ midi: 63, noteName: "D#4" }), {
    feedback: "blue note",
    inScale: true,
    notation: "b3",
    role: "blue",
  });

  assert.deepEqual(evaluateBluesPitch({ midi: 64, noteName: "E4" }), {
    feedback: "outside",
    inScale: false,
    notation: "E4",
    role: "outside",
  });

  assert.deepEqual(evaluateBluesPitch({ midi: null }), {
    feedback: "waiting",
    inScale: false,
    notation: "--",
    role: "silent",
  });
});

test("reports shuffle grid positions with long-short feel", () => {
  assert.deepEqual(getShufflePosition(0, 120), {
    beat: 1,
    feel: "long",
    label: "1",
    step: 0,
  });

  assert.deepEqual(getShufflePosition(335, 120), {
    beat: 1,
    feel: "short",
    label: "1 a",
    step: 1,
  });

  assert.deepEqual(getShufflePosition(500, 120), {
    beat: 2,
    feel: "long",
    label: "2",
    step: 2,
  });
});

test("defines a visible blues shuffle riff score", () => {
  assert.equal(BLUES_SHUFFLE_RIFF.title, "C Blues Shuffle Riff");
  assert.deepEqual(BLUES_SHUFFLE_RIFF.shuffleLabels, ["1", "a", "2", "a", "3", "a", "4", "a"]);
  assert.equal(BLUES_SHUFFLE_RIFF.rows.length, 2);
  assert.deepEqual(
    BLUES_SHUFFLE_RIFF.rows.map((row) => row.bars.map((bar) => bar.notes.map((note) => note.notation))),
    [
      [
        ["1", "b3", "4", "#4"],
        ["5", "b7", "5", "b3"],
      ],
      [
        ["1", "-", "b3", "4"],
        ["5", "b7", "1'", "-"],
      ],
    ],
  );
  assert.deepEqual(
    BLUES_SHUFFLE_RIFF.rows.map((row) => row.bars.map((bar) => bar.chord)),
    [
      ["C7", "F7"],
      ["C7", "G7"],
    ],
  );
  assert.deepEqual(
    BLUES_SHUFFLE_RIFF.rows[0].bars[0].notes.map((note) => ({
      display: note.display,
      rhythmLines: note.rhythmLines,
      dotted: note.dotted,
      octave: note.octave,
      tie: note.tie,
    })),
    [
      { display: "1", rhythmLines: 1, dotted: false, octave: 0, tie: null },
      { display: "b3", rhythmLines: 2, dotted: false, octave: 0, tie: null },
      { display: "4", rhythmLines: 2, dotted: true, octave: 0, tie: null },
      { display: "#4", rhythmLines: 0, dotted: false, octave: 0, tie: "start" },
    ],
  );
  assert.equal(BLUES_SHUFFLE_RIFF.rows[0].bars[1].notes[0].tie, "stop");
});
