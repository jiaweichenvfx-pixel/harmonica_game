import { getActiveNote, judgePlayedNote } from "../core/scoring.js";

const DEFAULT_FEEDBACK = "start";

export class PracticeSession {
  constructor(notes, options = {}) {
    this.notes = notes;
    this.endGraceMs = options.endGraceMs ?? 500;
    this.selectedIndex = 0;
    this.elapsedMs = 0;
    this.startedAtMs = null;
    this.feedback = DEFAULT_FEEDBACK;
    this.lastPitch = null;
  }

  start(nowMs) {
    this.startedAtMs = nowMs;
    this.elapsedMs = 0;
    this.feedback = "miss";
    this.selectedIndex = 0;
  }

  stop(feedback = "stopped") {
    this.startedAtMs = null;
    this.elapsedMs = 0;
    this.feedback = feedback;
  }

  selectPrevious() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
  }

  selectNext() {
    this.selectedIndex = Math.min(Math.max(0, this.notes.length - 1), this.selectedIndex + 1);
  }

  selectIndex(index) {
    this.selectedIndex = Math.min(Math.max(0, this.notes.length - 1), Math.max(0, index));
  }

  getTarget() {
    return this.notes[this.selectedIndex] ?? null;
  }

  updateElapsed(nowMs) {
    if (!this.isRunning()) {
      return this.getState();
    }

    this.elapsedMs = nowMs - this.startedAtMs;
    const activeNote = getActiveNote(this.notes, this.elapsedMs);

    if (activeNote) {
      this.selectedIndex = this.notes.indexOf(activeNote);
    }

    if (this.elapsedMs > this.getDurationMs() + this.endGraceMs) {
      this.stop("miss");
    }

    return this.getState();
  }

  updatePitch(pitch, options = {}) {
    this.lastPitch = pitch;
    const target = this.getTarget();

    if (!target || !pitch?.frequency) {
      this.feedback = "miss";
      return this.getState();
    }

    const judgment = judgePlayedNote({
      target,
      playedMidi: pitch.midi,
      centsOff: options.centsOff ?? pitch.centsOff,
      playedAtMs: options.playedAtMs ?? this.elapsedMs,
    });

    this.feedback = judgment.result;
    return this.getState();
  }

  getState() {
    return {
      activeNote: this.getTarget(),
      elapsedMs: this.elapsedMs,
      feedback: this.feedback,
      isRunning: this.isRunning(),
      lastPitch: this.lastPitch,
      selectedIndex: this.selectedIndex,
    };
  }

  getDurationMs() {
    const lastNote = this.notes.at(-1);
    return lastNote ? lastNote.startMs + lastNote.durationMs : 0;
  }

  isRunning() {
    return this.startedAtMs !== null;
  }
}
