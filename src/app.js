import { createMicrophonePitchSource } from "./audio/microphone.js";
import { createTargetTonePlayer } from "./audio/target-tone.js";
import { describeFrequency, midiToFrequency } from "./core/music.js";
import { evaluateBluesPitch, getShufflePosition } from "./freestyle/blues-shuffle.js";
import { parseNumberedNotation } from "./core/notation.js";
import { PracticeSession } from "./practice/practice-session.js";
import { getDomElements } from "./ui/dom-elements.js";
import { renderFreestyle, renderMode } from "./ui/render-freestyle.js";
import {
  renderMicrophoneError,
  renderMicrophoneReady,
  renderPitch,
  renderSession as renderPracticeSession,
} from "./ui/render-practice.js";

const elements = getDomElements();
const targetTonePlayer = createTargetTonePlayer();

let mode = "practice";
let appStartedAtMs = performance.now();
let parsed = null;
let session = null;
let practiceFrame = null;
let microphone = null;
let latestPitch = {
  frequency: null,
  midi: null,
  noteName: "",
  centsOff: null,
  rms: 0,
  peak: 0,
  confidence: 0,
};

function getFreestyleState(nowMs = performance.now()) {
  return {
    pitchEvaluation: evaluateBluesPitch(latestPitch),
    shufflePosition: getShufflePosition(nowMs - appStartedAtMs, Number(elements.tempoInput.value) || 80),
  };
}

function getTarget() {
  return session?.getTarget() ?? null;
}

function getTargetCentsOff(target, pitch) {
  if (!target || target.midi === null || !pitch.frequency) {
    return null;
  }

  return 1200 * Math.log2(pitch.frequency / midiToFrequency(target.midi));
}

function renderSession() {
  renderPracticeSession(elements, parsed, session.getState(), (index) => {
    session.selectIndex(index);
    renderSession();
  });
}

function renderFreestyleState() {
  renderFreestyle(elements, getFreestyleState());
}

function setMode(nextMode) {
  mode = nextMode;
  renderMode(elements, mode);
  if (mode === "freestyle") {
    renderFreestyleState();
  }
}

function parseInput() {
  parsed = parseNumberedNotation(elements.notationInput.value, {
    key: elements.keySelect.value,
    tempo: Number(elements.tempoInput.value) || 80,
    timeSignature: [4, 4],
  });
  session = new PracticeSession(parsed.notes);
  renderSession();
}

function updateSessionJudgment(playedAtMs = session.getState().elapsedMs) {
  const target = getTarget();
  const centsOffTarget = getTargetCentsOff(target, latestPitch);

  session.updatePitch(latestPitch, {
    centsOff: centsOffTarget,
    playedAtMs,
  });
  renderSession();
}

function practiceTick() {
  if (!session?.getState().isRunning) {
    return;
  }

  const state = session.updateElapsed(performance.now());
  if (latestPitch.frequency) {
    updateSessionJudgment(state.elapsedMs);
  } else {
    renderSession();
  }

  if (session.getState().isRunning) {
    practiceFrame = requestAnimationFrame(practiceTick);
  }
}

async function startMicrophone() {
  if (microphone) {
    return;
  }

  try {
    microphone = await createMicrophonePitchSource((pitch) => {
      latestPitch = describeFrequency(pitch.frequency);
      latestPitch.rms = pitch.rms;
      latestPitch.peak = pitch.peak;
      latestPitch.confidence = pitch.confidence;
      renderPitch(elements, latestPitch);
      renderFreestyleState();
      if (!session.getState().isRunning) {
        updateSessionJudgment(getTarget()?.startMs ?? 0);
      }
    });
    renderMicrophoneReady(elements);
  } catch (error) {
    renderMicrophoneError(elements, error);
  }
}

function startPractice() {
  parseInput();
  session.start(performance.now());
  if (practiceFrame !== null) {
    cancelAnimationFrame(practiceFrame);
  }
  renderSession();
  practiceTick();
}

function stopPractice() {
  session.stop();
  if (practiceFrame !== null) {
    cancelAnimationFrame(practiceFrame);
    practiceFrame = null;
  }
  renderSession();
}

elements.notationInput.addEventListener("input", parseInput);
elements.keySelect.addEventListener("change", parseInput);
elements.tempoInput.addEventListener("input", parseInput);
elements.startPractice.addEventListener("click", startPractice);
elements.stopPractice.addEventListener("click", stopPractice);
elements.startMic.addEventListener("click", startMicrophone);
elements.playTarget.addEventListener("click", () => {
  targetTonePlayer.play(getTarget());
});
elements.practiceTab.addEventListener("click", () => setMode("practice"));
elements.freestyleTab.addEventListener("click", () => setMode("freestyle"));
elements.prevNote.addEventListener("click", () => {
  session.selectPrevious();
  renderSession();
});
elements.nextNote.addEventListener("click", () => {
  session.selectNext();
  renderSession();
});

parseInput();
renderMode(elements, mode);
renderFreestyleState();
