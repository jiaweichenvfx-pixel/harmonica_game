export const BLUES_SHUFFLE_NOTES = [
  { notation: "1", midi: 60, role: "root" },
  { notation: "b3", midi: 63, role: "blue" },
  { notation: "4", midi: 65, role: "color" },
  { notation: "#4", midi: 66, role: "tension" },
  { notation: "5", midi: 67, role: "stable" },
  { notation: "b7", midi: 70, role: "blue" },
  { notation: "1'", midi: 72, role: "root" },
];

export const BLUES_SHUFFLE_RIFF = {
  title: "C Blues Shuffle Riff",
  keyLabel: "1=C",
  feelLabel: "Shuffle",
  shuffleLabels: ["1", "a", "2", "a", "3", "a", "4", "a"],
  rows: [
    {
      id: "phrase-a",
      bars: [
        {
          id: "a1",
          notes: [
            { notation: "1", role: "root" },
            { notation: "b3", role: "blue" },
            { notation: "4", role: "color" },
            { notation: "#4", role: "tension" },
          ],
        },
        {
          id: "a2",
          notes: [
            { notation: "5", role: "stable" },
            { notation: "b7", role: "blue" },
            { notation: "5", role: "stable" },
            { notation: "b3", role: "blue" },
          ],
        },
      ],
    },
    {
      id: "phrase-b",
      bars: [
        {
          id: "b1",
          notes: [
            { notation: "1", role: "root" },
            { notation: "-", role: "hold" },
            { notation: "b3", role: "blue" },
            { notation: "4", role: "color" },
          ],
        },
        {
          id: "b2",
          notes: [
            { notation: "5", role: "stable" },
            { notation: "b7", role: "blue" },
            { notation: "1'", role: "root" },
            { notation: "-", role: "hold" },
          ],
        },
      ],
    },
  ],
};

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
