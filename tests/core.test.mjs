import assert from "node:assert/strict";
import test from "node:test";

import {
  centsBetweenFrequencies,
  frequencyToMidi,
  midiToFrequency,
  midiToNoteName,
} from "../src/core/music.js";
import { detectPitchAutocorrelation } from "../src/audio/pitch-detector.js";
import { getCHarmonicaHint } from "../src/core/harmonica.js";
import { parseNumberedNotation } from "../src/core/notation.js";
import { judgePlayedNote } from "../src/core/scoring.js";

test("converts between frequency, MIDI, note names, and cents", () => {
  assert.equal(frequencyToMidi(440), 69);
  assert.equal(midiToNoteName(60), "C4");
  assert.equal(Math.round(midiToFrequency(69)), 440);
  assert.equal(Math.round(centsBetweenFrequencies(440, 466.1637615)), 100);
});

test("parses numbered notation into timed notes for C major", () => {
  const result = parseNumberedNotation("| 1 2 3 5 | 6 5 3 - |", {
    key: "C",
    tempo: 120,
    timeSignature: [4, 4],
  });

  assert.equal(result.notes.length, 7);
  assert.deepEqual(
    result.notes.map((note) => [note.notation, note.startMs, note.durationMs, note.midi]),
    [
      ["1", 0, 500, 60],
      ["2", 500, 500, 62],
      ["3", 1000, 500, 64],
      ["5", 1500, 500, 67],
      ["6", 2000, 500, 69],
      ["5", 2500, 500, 67],
      ["3", 3000, 1000, 64],
    ],
  );
});

test("parses rests and octave marks", () => {
  const result = parseNumberedNotation("| 0 1' 7 5, |", {
    key: "C",
    tempo: 60,
    timeSignature: [4, 4],
  });

  assert.deepEqual(
    result.notes.map((note) => [note.notation, note.startMs, note.durationMs, note.midi]),
    [
      ["0", 0, 1000, null],
      ["1'", 1000, 1000, 72],
      ["7", 2000, 1000, 71],
      ["5,", 3000, 1000, 55],
    ],
  );
});

test("parses accidentals for bend notes in numbered notation", () => {
  const result = parseNumberedNotation("| b3 #4 b7 b3' |", {
    key: "C",
    tempo: 60,
    timeSignature: [4, 4],
  });

  assert.deepEqual(
    result.notes.map((note) => [note.notation, note.midi]),
    [
      ["b3", 63],
      ["#4", 66],
      ["b7", 70],
      ["b3'", 75],
    ],
  );
});

test("describes common C diatonic harmonica bends", () => {
  assert.equal(getCHarmonicaHint(60), "4 blow");
  assert.equal(getCHarmonicaHint(63), "3 draw bend -3");
  assert.equal(getCHarmonicaHint(66), "4 draw bend -1");
  assert.equal(getCHarmonicaHint(70), "6 draw bend -1");
  assert.equal(getCHarmonicaHint(75), "10 draw bend -2");
});

test("judges pitch and timing against a target note", () => {
  const target = {
    id: "n1",
    startMs: 1000,
    durationMs: 500,
    midi: 60,
    notation: "1",
  };

  assert.equal(
    judgePlayedNote({
      target,
      playedMidi: 60,
      centsOff: 12,
      playedAtMs: 1030,
    }).result,
    "perfect",
  );

  assert.equal(
    judgePlayedNote({
      target,
      playedMidi: 61,
      centsOff: 80,
      playedAtMs: 1040,
    }).result,
    "wrong",
  );

  assert.equal(
    judgePlayedNote({
      target,
      playedMidi: null,
      centsOff: null,
      playedAtMs: 1120,
    }).result,
    "miss",
  );

  assert.equal(
    judgePlayedNote({
      target,
      playedMidi: 60,
      centsOff: 15,
      playedAtMs: 760,
    }).result,
    "early",
  );

  assert.equal(
    judgePlayedNote({
      target,
      playedMidi: 60,
      centsOff: 15,
      playedAtMs: 1700,
    }).result,
    "late",
  );
});

test("detects a quiet stable 440 Hz tone but rejects silence", () => {
  const sampleRate = 44100;
  const tone = Float32Array.from({ length: 4096 }, (_, index) => {
    return Math.sin((2 * Math.PI * 440 * index) / sampleRate) * 0.01;
  });
  const silence = new Float32Array(4096);

  const toneResult = detectPitchAutocorrelation(tone, sampleRate);
  const silenceResult = detectPitchAutocorrelation(silence, sampleRate);

  assert.equal(Math.round(toneResult.frequency), 441);
  assert.equal(silenceResult.frequency, null);
});
