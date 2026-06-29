import { getCHarmonicaHint } from "../core/harmonica.js";
import { midiToNoteName } from "../core/music.js";

const FEEDBACK_LABELS = {
  start: "开始",
  stopped: "已停止",
  perfect: "Perfect",
  good: "Good",
  early: "Early",
  late: "Late",
  wrong: "Wrong Note",
  miss: "Miss",
};

export function formatFeedbackLabel(result) {
  return FEEDBACK_LABELS[result] ?? "等待声音";
}

export function formatTargetMeta(target) {
  if (!target) {
    return "没有可练习音符";
  }

  const noteName = target.midi === null ? "Rest" : midiToNoteName(target.midi);
  return `${noteName} · ${getCHarmonicaHint(target.midi)}`;
}

export function formatPitchReadout(pitch) {
  if (!pitch?.frequency) {
    return {
      cents: "-- cents",
      detectedNote: "--",
      frequency: "-- Hz",
    };
  }

  return {
    cents: `${pitch.centsOff > 0 ? "+" : ""}${pitch.centsOff.toFixed(0)} cents`,
    detectedNote: pitch.noteName,
    frequency: `${pitch.frequency.toFixed(1)} Hz`,
  };
}

export function formatInputLevel(pitch) {
  const inputPercent = Math.min(100, Math.round((pitch?.rms ?? 0) * 800));
  return {
    confidence: `${Math.round((pitch?.confidence ?? 0) * 100)}%`,
    inputLevel: `${inputPercent}%`,
  };
}

export function formatPracticeStats(stats) {
  const difficultNotes =
    stats.difficultNotes.length === 0
      ? "--"
      : stats.difficultNotes.map((note) => `${note.notation} · ${note.result}`).join(", ");

  return {
    accuracy: `${stats.accuracyPercent}%`,
    attempted: String(stats.attemptedNotes),
    counts: {
      good: String(stats.counts.good),
      miss: String(stats.counts.miss),
      perfect: String(stats.counts.perfect),
      wrong: String(stats.counts.wrong),
    },
    difficultNotes,
  };
}

export function getNotationTokenClass({ isActive, judgment }) {
  const classes = ["notation-token"];
  if (isActive) {
    classes.push("active");
  }
  if (judgment?.result) {
    classes.push(`judged-${judgment.result}`);
  }
  return classes.join(" ");
}

export function renderSession(elements, parsed, state, onSelectIndex) {
  renderTarget(elements, state.activeNote);
  renderFeedback(elements, state.feedback);
  renderNotationTrack(elements, parsed.notes, state.selectedIndex, state.judgmentsByNoteId, onSelectIndex);
  renderStats(elements, state.stats);
  elements.elapsed.textContent = `${(state.elapsedMs / 1000).toFixed(1)}s`;
}

export function renderTarget(elements, target) {
  if (!target) {
    elements.targetNotation.textContent = "--";
    elements.targetMeta.textContent = formatTargetMeta(null);
    return;
  }

  elements.targetNotation.textContent = target.notation;
  elements.targetMeta.textContent = formatTargetMeta(target);
}

export function renderFeedback(elements, result) {
  elements.feedback.className = `feedback ${result}`;
  elements.feedback.textContent = formatFeedbackLabel(result);
}

export function renderNotationTrack(elements, notes, selectedIndex, judgmentsByNoteId, onSelectIndex) {
  elements.notationTrack.innerHTML = "";

  notes.forEach((note, index) => {
    const token = document.createElement("button");
    token.type = "button";
    token.className = getNotationTokenClass({
      isActive: index === selectedIndex,
      judgment: judgmentsByNoteId[note.id],
    });
    token.textContent = note.notation;
    token.setAttribute("aria-label", `目标 ${note.notation}`);
    token.addEventListener("click", () => onSelectIndex(index));
    elements.notationTrack.append(token);
  });
}

export function renderPitch(elements, pitch) {
  const readout = formatPitchReadout(pitch);
  const levels = formatInputLevel(pitch);

  elements.detectedNote.textContent = readout.detectedNote;
  elements.frequency.textContent = readout.frequency;
  elements.cents.textContent = readout.cents;
  elements.inputLevel.textContent = levels.inputLevel;
  elements.confidence.textContent = levels.confidence;
}

export function renderStats(elements, stats) {
  const formatted = formatPracticeStats(stats);
  elements.accuracy.textContent = formatted.accuracy;
  elements.attemptedNotes.textContent = formatted.attempted;
  elements.perfectCount.textContent = formatted.counts.perfect;
  elements.goodCount.textContent = formatted.counts.good;
  elements.wrongCount.textContent = formatted.counts.wrong;
  elements.missCount.textContent = formatted.counts.miss;
  elements.difficultNotes.textContent = formatted.difficultNotes;
}

export function renderMicrophoneReady(elements) {
  elements.micStatus.textContent = "麦克风已开启";
  elements.micStatus.classList.add("ready");
  elements.startMic.textContent = "麦克风运行中";
}

export function renderMicrophoneError(elements, error) {
  elements.micStatus.textContent = "麦克风开启失败";
  elements.feedback.textContent = error.message;
}
