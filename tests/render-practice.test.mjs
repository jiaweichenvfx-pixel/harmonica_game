import assert from "node:assert/strict";
import test from "node:test";

import {
  formatFeedbackLabel,
  formatInputLevel,
  formatPitchReadout,
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
