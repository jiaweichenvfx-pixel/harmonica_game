import assert from "node:assert/strict";
import test from "node:test";

import {
  formatFeedbackLabel,
  formatInputLevel,
  formatPitchReadout,
  formatPracticeStats,
  getNotationTokenClass,
  formatTargetMeta,
} from "../src/ui/render-practice.js";

test("formats practice feedback labels", () => {
  assert.equal(formatFeedbackLabel("start"), "开始");
  assert.equal(formatFeedbackLabel("stopped"), "已停止");
  assert.equal(formatFeedbackLabel("perfect"), "Perfect");
  assert.equal(formatFeedbackLabel("wrong"), "Wrong Note");
  assert.equal(formatFeedbackLabel("unknown"), "等待声音");
});

test("formats target metadata with note names and harmonica hints", () => {
  assert.equal(formatTargetMeta({ midi: 60 }), "C4 · 4 blow");
  assert.equal(formatTargetMeta({ midi: 63 }), "D#4 · 3 draw bend -3");
  assert.equal(formatTargetMeta({ midi: null }), "Rest · rest");
  assert.equal(formatTargetMeta(null), "没有可练习音符");
});

test("formats pitch and input level readouts", () => {
  assert.deepEqual(
    formatPitchReadout({
      frequency: 440,
      noteName: "A4",
      centsOff: 7.4,
    }),
    {
      cents: "+7 cents",
      detectedNote: "A4",
      frequency: "440.0 Hz",
    },
  );

  assert.deepEqual(formatPitchReadout({ frequency: null }), {
    cents: "-- cents",
    detectedNote: "--",
    frequency: "-- Hz",
  });

  assert.equal(formatInputLevel({ rms: 0.03, confidence: 0.82 }).inputLevel, "24%");
  assert.equal(formatInputLevel({ rms: 0.03, confidence: 0.82 }).confidence, "82%");
});

test("formats practice stats and notation judgment classes", () => {
  const stats = formatPracticeStats({
    accuracyPercent: 67,
    attemptedNotes: 3,
    counts: {
      perfect: 1,
      good: 1,
      early: 0,
      late: 0,
      wrong: 1,
      miss: 0,
    },
    difficultNotes: [
      {
        notation: "b3",
        result: "wrong",
      },
    ],
  });

  assert.equal(stats.accuracy, "67%");
  assert.equal(stats.attempted, "3");
  assert.equal(stats.difficultNotes, "b3 · wrong");
  assert.equal(
    getNotationTokenClass({
      isActive: true,
      judgment: { result: "wrong" },
    }),
    "notation-token active judged-wrong",
  );
});
