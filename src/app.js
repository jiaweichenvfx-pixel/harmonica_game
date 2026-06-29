import { createMicrophonePitchSource } from "./audio/microphone.js";
import { describeFrequency, midiToFrequency, midiToNoteName } from "./core/music.js";
import { parseNumberedNotation } from "./core/notation.js";
import { getActiveNote, judgePlayedNote } from "./core/scoring.js";

const HARMONICA_C = new Map([
  [60, "4 blow"],
  [62, "4 draw"],
  [64, "5 blow"],
  [65, "5 draw"],
  [67, "6 blow"],
  [69, "6 draw"],
  [71, "7 draw"],
  [72, "7 blow"],
]);

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
let selectedIndex = 0;
let practiceStart = null;
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
  return parsed?.notes[selectedIndex] ?? null;
}

function getHarmonicaHint(note) {
  if (!note || note.midi === null) {
    return "rest";
  }

  return HARMONICA_C.get(note.midi) ?? "C harmonica: advanced/out of first-position range";
}

function renderNotationTrack() {
  elements.notationTrack.innerHTML = "";
  parsed.notes.forEach((note, index) => {
    const token = document.createElement("button");
    token.type = "button";
    token.className = `notation-token${index === selectedIndex ? " active" : ""}`;
    token.textContent = note.notation;
    token.setAttribute("aria-label", `目标 ${note.notation}`);
    token.addEventListener("click", () => {
      selectedIndex = index;
      updateTarget();
    });
    elements.notationTrack.append(token);
  });
}

function updateTarget() {
  const target = getTarget();
  if (!target) {
    elements.targetNotation.textContent = "--";
    elements.targetMeta.textContent = "没有可练习音符";
    return;
  }

  const noteName = target.midi === null ? "Rest" : midiToNoteName(target.midi);
  elements.targetNotation.textContent = target.notation;
  elements.targetMeta.textContent = `${noteName} · ${getHarmonicaHint(target)}`;
  renderNotationTrack();
}

function parseInput() {
  parsed = parseNumberedNotation(elements.notationInput.value, {
    key: elements.keySelect.value,
    tempo: Number(elements.tempoInput.value) || 80,
    timeSignature: [4, 4],
  });
  selectedIndex = Math.min(selectedIndex, Math.max(0, parsed.notes.length - 1));
  updateTarget();
}

function setFeedback(result) {
  elements.feedback.className = `feedback ${result}`;
  const labels = {
    perfect: "Perfect",
    good: "Good",
    early: "Early",
    late: "Late",
    wrong: "Wrong Note",
    miss: "Miss",
  };
  elements.feedback.textContent = labels[result] ?? "等待声音";
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

function updateJudgment(elapsedMs) {
  const target = getTarget();
  if (!target) {
    return;
  }

  if (!latestPitch.frequency) {
    setFeedback("miss");
    return;
  }

  const targetFrequency = target.midi === null ? null : midiToFrequency(target.midi);
  const centsOffTarget =
    targetFrequency === null ? null : 1200 * Math.log2(latestPitch.frequency / targetFrequency);
  const judgment = judgePlayedNote({
    target,
    playedMidi: latestPitch.midi,
    centsOff: centsOffTarget,
    playedAtMs: elapsedMs,
  });

  setFeedback(judgment.result);
}

function practiceTick() {
  if (practiceStart === null || !parsed) {
    return;
  }

  const elapsedMs = performance.now() - practiceStart;
  const activeNote = getActiveNote(parsed.notes, elapsedMs);
  if (activeNote) {
    selectedIndex = parsed.notes.indexOf(activeNote);
    updateTarget();
    updateJudgment(elapsedMs);
  }

  elements.elapsed.textContent = `${(elapsedMs / 1000).toFixed(1)}s`;

  if (elapsedMs <= parsed.durationMs + 500) {
    practiceFrame = requestAnimationFrame(practiceTick);
  } else {
    practiceStart = null;
    setFeedback("miss");
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
      if (practiceStart === null) {
        updateJudgment(getTarget()?.startMs ?? 0);
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
  practiceStart = performance.now();
  if (practiceFrame !== null) {
    cancelAnimationFrame(practiceFrame);
  }
  setFeedback("miss");
  practiceTick();
}

function stopPractice() {
  practiceStart = null;
  if (practiceFrame !== null) {
    cancelAnimationFrame(practiceFrame);
    practiceFrame = null;
  }
  elements.elapsed.textContent = "0.0s";
  elements.feedback.className = "feedback";
  elements.feedback.textContent = "已停止";
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
  selectedIndex = Math.max(0, selectedIndex - 1);
  updateTarget();
});
elements.nextNote.addEventListener("click", () => {
  selectedIndex = Math.min(parsed.notes.length - 1, selectedIndex + 1);
  updateTarget();
});

parseInput();
