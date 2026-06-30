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
  const parsedToken = parseNotationToken(token);

  if (parsedToken.display === "0") {
    return null;
  }

  const rootMidi = KEY_ROOT_MIDI[key];
  if (!Number.isInteger(rootMidi)) {
    throw new Error(`Unsupported key: ${key}`);
  }

  const accidentalShift =
    parsedToken.accidental === "b" || parsedToken.accidental === "♭"
      ? -1
      : parsedToken.accidental === "#" || parsedToken.accidental === "♯"
        ? 1
        : 0;

  return rootMidi + MAJOR_SCALE_OFFSETS[parsedToken.degree] + accidentalShift + parsedToken.octave * 12;
}

export function parseNotationToken(token) {
  const match = token.match(/^([b#♭♯]?)([0-7])([',]*)(\/(?:2|4))?(\.)?(~)?$/);
  if (!match) {
    throw new Error(`Unsupported notation token: ${token}`);
  }

  const [, accidental, degree, octaveMarks, durationMark, dottedMark, tieMark] = match;
  const octave = [...octaveMarks].reduce((shift, mark) => shift + (mark === "'" ? 1 : -1), 0);
  const durationBeats = (durationMark === "/2" ? 0.5 : durationMark === "/4" ? 0.25 : 1) * (dottedMark ? 1.5 : 1);

  return {
    accidental: accidental || null,
    degree,
    display: degree,
    dotted: Boolean(dottedMark),
    durationBeats,
    octave,
    rhythmLines: durationMark === "/2" ? 1 : durationMark === "/4" ? 2 : 0,
    tie: tieMark ? "start" : null,
  };
}

export function parseNumberedNotation(text, options = {}) {
  const tempo = options.tempo ?? 80;
  const key = options.key ?? "C";
  const [beatsPerBar] = options.timeSignature ?? [4, 4];
  const beatMs = 60000 / tempo;
  const rawTokens = text.match(/[b#♭♯]?[0-7](?:[',]*)(?:\/(?:2|4))?\.?~?|-|\|/g) ?? [];

  const notes = [];
  let cursorMs = 0;
  let noteIndex = 1;
  let previousNote = null;
  let openTie = null;

  for (const token of rawTokens) {
    if (token === "|") {
      continue;
    }

    if (token === "-") {
      if (previousNote) {
        previousNote.durationMs += beatMs;
      }
      cursorMs += beatMs;
      continue;
    }

    const tokenMeta = parseNotationToken(token);
    const midi = notationTokenToMidi(token, key);
    const durationMs = beatMs * tokenMeta.durationBeats;
    const bar = Math.max(1, Math.floor(cursorMs / (beatMs * beatsPerBar)) + 1);
    const startBeat = cursorMs / beatMs + 1;
    const tie = openTie && openTie.display === tokenMeta.display && openTie.midi === midi ? "stop" : tokenMeta.tie;
    const note = {
      id: `n${noteIndex}`,
      notation: token,
      display: tokenMeta.display,
      startMs: Math.round(cursorMs),
      durationMs: Math.round(durationMs),
      durationBeats: tokenMeta.durationBeats,
      midi,
      bar,
      beat: ((startBeat - 1) % beatsPerBar) + 1,
      startBeat,
      accidental: tokenMeta.accidental,
      dotted: tokenMeta.dotted,
      octave: tokenMeta.octave,
      rhythmLines: tokenMeta.rhythmLines,
      tie,
    };

    notes.push(note);
    previousNote = note;
    openTie = tokenMeta.tie ? { display: tokenMeta.display, midi } : null;
    noteIndex += 1;
    cursorMs += durationMs;
  }

  return {
    key,
    tempo,
    timeSignature: options.timeSignature ?? [4, 4],
    durationMs: Math.round(cursorMs),
    notes,
  };
}
