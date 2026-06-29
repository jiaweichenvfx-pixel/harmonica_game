export const BLUES_SHUFFLE_NOTES = [
  { notation: "1", midi: 60, role: "root" },
  { notation: "b3", midi: 63, role: "blue" },
  { notation: "4", midi: 65, role: "color" },
  { notation: "#4", midi: 66, role: "tension" },
  { notation: "5", midi: 67, role: "stable" },
  { notation: "b7", midi: 70, role: "blue" },
  { notation: "1'", midi: 72, role: "root" },
];

const FEEDBACK_BY_ROLE = {
  blue: "blue note",
  color: "color tone",
  root: "resolved",
  stable: "stable",
  tension: "spicy tension",
};

export function evaluateBluesPitch(pitch) {
  if (!pitch?.midi) {
    return {
      feedback: "waiting",
      inScale: false,
      notation: "--",
      role: "silent",
    };
  }

  const scaleNote = BLUES_SHUFFLE_NOTES.find((note) => note.midi === pitch.midi);
  if (!scaleNote) {
    return {
      feedback: "outside",
      inScale: false,
      notation: pitch.noteName,
      role: "outside",
    };
  }

  return {
    feedback: FEEDBACK_BY_ROLE[scaleNote.role],
    inScale: true,
    notation: scaleNote.notation,
    role: scaleNote.role,
  };
}

export function getShufflePosition(elapsedMs, tempo) {
  const beatMs = 60000 / tempo;
  const beatIndex = Math.floor(elapsedMs / beatMs);
  const offsetInBeat = elapsedMs - beatIndex * beatMs;
  const isShortStep = offsetInBeat >= (beatMs * 2) / 3;
  const beat = (beatIndex % 4) + 1;
  const step = beatIndex * 2 + (isShortStep ? 1 : 0);

  return {
    beat,
    feel: isShortStep ? "short" : "long",
    label: isShortStep ? `${beat} a` : String(beat),
    step,
  };
}
