import { createMicrophonePitchSource } from "./audio/microphone.js";
import { getCHarmonicaHint } from "./core/harmonica.js";
import { describeFrequency, midiToFrequency, midiToNoteName } from "./core/music.js";
import { parseNumberedNotation } from "./core/notation.js";
import { PracticeSession } from "./practice/practice-session.js";

const elements = {
  notationInput: document.querySelector("#notationInput"),
  keySelect: document.querySelector("#keySelect"),
  tempoInput: document.querySelector("#tempoInput"),
  targetNotation: document.querySelector("#targetNotation"),
  targetMeta: document.querySelector("#targetMeta"),
  notationTrack: document.querySelector("#notationTrack"),
  feedback: document.querySelector("#feedback"),
  micStatus: document.querySelector("#micStatus"),
  detectedNote: document.querySelector("#detectedNote"),
  frequency: document.querySelector("#frequency"),
  cents: document.querySelector("#cents"),
  elapsed: document.querySelector("#elapsed"),
  startPractice: document.querySelector("#startPractice"),
  stopPractice: document.querySelector("#stopPractice"),
  prevNote: document.querySelector("#prevNote"),
  nextNote: document.querySelector("#nextNote"),
  startMic: document.querySelector("#startMic"),
  playTarget: document.querySelector("#playTarget"),
  inputLevel: document.querySelector("#inputLevel"),
  confidence: document.querySelector("#confidence"),
};

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
let toneContext = null;

function getTarget() {
  return session?.getTarget() ?? null;
}

function getTargetCentsOff(target, pitch) {
  if (!target || target.midi === null || !pitch.frequency) {
    return null;
  }

  return 1200 * Math.log2(pitch.frequency / midiToFrequency(target.midi));
}

function renderNotationTrack(state) {
  elements.notationTrack.innerHTML = "";

  parsed.notes.forEach((note, index) => {
    const token = document.createElement("button");
    token.type = "button";
    token.className = `notation-token${index === state.selectedIndex ? " active" : ""}`;
    token.textContent = note.notation;
    token.setAttribute("aria-label", `目标 ${note.notation}`);
    token.addEventListener("click", () => {
      session.selectIndex(index);
      renderSession();
    });
    elements.notationTrack.append(token);
  });
}

function renderTarget(target) {
  if (!target) {
    elements.targetNotation.textContent = "--";
    elements.targetMeta.textContent = "没有可练习音符";
    return;
  }

  const noteName = target.midi === null ? "Rest" : midiToNoteName(target.midi);
  elements.targetNotation.textContent = target.notation;
  elements.targetMeta.textContent = `${noteName} · ${getCHarmonicaHint(target.midi)}`;
}

function renderFeedback(result) {
  elements.feedback.className = `feedback ${result}`;
  const labels = {
    start: "开始",
    stopped: "已停止",
    perfect: "Perfect",
    good: "Good",
    early: "Early",
    late: "Late",
    wrong: "Wrong Note",
    miss: "Miss",
  };
  elements.feedback.textContent = labels[result] ?? "等待声音";
}

function renderSession() {
  const state = session.getState();
  renderTarget(state.activeNote);
  renderFeedback(state.feedback);
  renderNotationTrack(state);
  elements.elapsed.textContent = `${(state.elapsedMs / 1000).toFixed(1)}s`;
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

function renderPitch() {
  const inputPercent = Math.min(100, Math.round((latestPitch.rms ?? 0) * 800));
  elements.inputLevel.textContent = `${inputPercent}%`;
  elements.confidence.textContent = `${Math.round((latestPitch.confidence ?? 0) * 100)}%`;

  if (!latestPitch.frequency) {
    elements.detectedNote.textContent = "--";
    elements.frequency.textContent = "-- Hz";
    elements.cents.textContent = "-- cents";
    return;
  }

  elements.detectedNote.textContent = latestPitch.noteName;
  elements.frequency.textContent = `${latestPitch.frequency.toFixed(1)} Hz`;
  elements.cents.textContent = `${latestPitch.centsOff > 0 ? "+" : ""}${latestPitch.centsOff.toFixed(0)} cents`;
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
      renderPitch();
      if (!session.getState().isRunning) {
        updateSessionJudgment(getTarget()?.startMs ?? 0);
      }
    });
    elements.micStatus.textContent = "麦克风已开启";
    elements.micStatus.classList.add("ready");
    elements.startMic.textContent = "麦克风运行中";
  } catch (error) {
    elements.micStatus.textContent = "麦克风开启失败";
    elements.feedback.textContent = error.message;
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

function playTargetTone() {
  const target = getTarget();
  if (!target || target.midi === null) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  toneContext ??= new AudioContextClass();

  const oscillator = toneContext.createOscillator();
  const gain = toneContext.createGain();
  const now = toneContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = midiToFrequency(target.midi);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

  oscillator.connect(gain);
  gain.connect(toneContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.75);
}

elements.notationInput.addEventListener("input", parseInput);
elements.keySelect.addEventListener("change", parseInput);
elements.tempoInput.addEventListener("input", parseInput);
elements.startPractice.addEventListener("click", startPractice);
elements.stopPractice.addEventListener("click", stopPractice);
elements.startMic.addEventListener("click", startMicrophone);
elements.playTarget.addEventListener("click", playTargetTone);
elements.prevNote.addEventListener("click", () => {
  session.selectPrevious();
  renderSession();
});
elements.nextNote.addEventListener("click", () => {
  session.selectNext();
  renderSession();
});

parseInput();
