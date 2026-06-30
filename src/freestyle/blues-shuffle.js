import { parseNotationToken } from "../core/notation.js";

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
          chord: "C7",
          notes: buildScoreNotes([
            { notation: "1/2", role: "root", label: "1" },
            { notation: "b3/4", role: "blue", label: "b3" },
            { notation: "4/4.", role: "color", label: "4" },
            { notation: "#4~", role: "tension", label: "#4" },
          ]),
        },
        {
          id: "a2",
          chord: "F7",
          notes: buildScoreNotes([
            { notation: "5", role: "stable", tie: "stop" },
            { notation: "b7/2", role: "blue" },
            { notation: "5/2", role: "stable" },
            { notation: "b3", role: "blue" },
          ]),
        },
      ],
    },
    {
      id: "phrase-b",
      bars: [
        {
          id: "b1",
          chord: "C7",
          notes: buildScoreNotes([
            { notation: "1,", role: "root", label: "1" },
            { notation: "-", role: "hold" },
            { notation: "b3/2", role: "blue" },
            { notation: "4/2", role: "color" },
          ]),
        },
        {
          id: "b2",
          chord: "G7",
          notes: buildScoreNotes([
            { notation: "5/4", role: "stable" },
            { notation: "b7/4", role: "blue" },
            { notation: "1'", role: "root" },
            { notation: "-", role: "hold" },
          ]),
        },
      ],
    },
  ],
};

function buildScoreNotes(notes) {
  return notes.map((note) => {
    if (note.notation === "-") {
      return {
        notation: "-",
        display: "-",
        dotted: false,
        octave: 0,
        rhythmLines: 0,
        role: note.role,
        tie: null,
      };
    }

    const parsed = parseNotationToken(note.notation);
    return {
      ...note,
      notation: note.label ?? note.notation.replace(/\/(?:2|4)|\.|~/g, ""),
      sourceNotation: note.notation,
      display: `${parsed.accidental ?? ""}${parsed.display}`,
      dotted: parsed.dotted,
      octave: parsed.octave,
      rhythmLines: parsed.rhythmLines,
      tie: note.tie ?? parsed.tie,
    };
  });
}

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
