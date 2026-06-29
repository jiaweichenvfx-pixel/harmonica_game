const MAJOR_SCALE_OFFSETS = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
};

const KEY_ROOT_MIDI = {
  C: 60,
  "C#": 61,
  Db: 61,
  D: 62,
  "D#": 63,
  Eb: 63,
  E: 64,
  F: 65,
  "F#": 66,
  Gb: 66,
  G: 67,
  "G#": 68,
  Ab: 68,
  A: 69,
  "A#": 70,
  Bb: 70,
  B: 71,
};

export function notationTokenToMidi(token, key = "C") {
  if (token === "0") {
    return null;
  }

  const match = token.match(/^([1-7])([',]*)$/);
  if (!match) {
    throw new Error(`Unsupported notation token: ${token}`);
  }

  const [, degree, octaveMarks] = match;
  const rootMidi = KEY_ROOT_MIDI[key];
  if (!Number.isInteger(rootMidi)) {
    throw new Error(`Unsupported key: ${key}`);
  }

  let octaveShift = 0;
  for (const mark of octaveMarks) {
    octaveShift += mark === "'" ? 12 : -12;
  }

  return rootMidi + MAJOR_SCALE_OFFSETS[degree] + octaveShift;
}

export function parseNumberedNotation(text, options = {}) {
  const tempo = options.tempo ?? 80;
  const key = options.key ?? "C";
  const [beatsPerBar] = options.timeSignature ?? [4, 4];
  const beatMs = 60000 / tempo;
  const rawTokens = text.match(/[1-7](?:[',]*)|0|-|\|/g) ?? [];

  const notes = [];
  let cursorMs = 0;
  let currentBar = 1;
  let noteIndex = 1;
  let previousNote = null;

  for (const token of rawTokens) {
    if (token === "|") {
      currentBar += 1;
      continue;
    }

    if (token === "-") {
      if (previousNote) {
        previousNote.durationMs += beatMs;
      }
      cursorMs += beatMs;
      continue;
    }

    const midi = notationTokenToMidi(token, key);
    const note = {
      id: `n${noteIndex}`,
      notation: token,
      startMs: Math.round(cursorMs),
      durationMs: Math.round(beatMs),
      midi,
      bar: Math.max(1, Math.floor(cursorMs / (beatMs * beatsPerBar)) + 1 || currentBar),
    };

    notes.push(note);
    previousNote = note;
    noteIndex += 1;
    cursorMs += beatMs;
  }

  return {
    key,
    tempo,
    timeSignature: options.timeSignature ?? [4, 4],
    durationMs: Math.round(cursorMs),
    notes,
  };
}
