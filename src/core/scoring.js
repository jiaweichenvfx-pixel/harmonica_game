const DEFAULT_OPTIONS = {
  perfectCents: 25,
  goodCents: 45,
  perfectTimingMs: 80,
  timingWindowMs: 180,
};

export function judgePlayedNote(input, options = {}) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const { target, playedMidi, centsOff, playedAtMs } = input;

  if (!target || target.midi === null || playedMidi === null || centsOff === null) {
    return {
      noteId: target?.id ?? null,
      result: "miss",
    };
  }

  const timingOffsetMs = playedAtMs - target.startMs;
  const targetEndMs = target.startMs + target.durationMs;

  if (playedAtMs < target.startMs - settings.timingWindowMs) {
    return {
      noteId: target.id,
      result: "early",
      centsOff,
      timingOffsetMs,
    };
  }

  if (playedAtMs > targetEndMs + settings.timingWindowMs) {
    return {
      noteId: target.id,
      result: "late",
      centsOff,
      timingOffsetMs: playedAtMs - targetEndMs,
    };
  }

  if (playedMidi !== target.midi || Math.abs(centsOff) > settings.goodCents) {
    return {
      noteId: target.id,
      result: "wrong",
      centsOff,
      timingOffsetMs,
    };
  }

  if (Math.abs(centsOff) <= settings.perfectCents && Math.abs(timingOffsetMs) <= settings.perfectTimingMs) {
    return {
      noteId: target.id,
      result: "perfect",
      centsOff,
      timingOffsetMs,
    };
  }

  return {
    noteId: target.id,
    result: "good",
    centsOff,
    timingOffsetMs,
  };
}

export function getActiveNote(notes, elapsedMs) {
  return notes.find((note) => elapsedMs >= note.startMs && elapsedMs < note.startMs + note.durationMs) ?? null;
}
