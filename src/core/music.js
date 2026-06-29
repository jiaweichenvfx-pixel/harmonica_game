const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function frequencyToMidi(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return null;
  }

  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

export function frequencyToExactMidi(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return null;
  }

  return 69 + 12 * Math.log2(frequency / 440);
}

export function midiToNoteName(midi) {
  if (!Number.isInteger(midi)) {
    return "";
  }

  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[pitchClass]}${octave}`;
}

export function centsBetweenFrequencies(referenceFrequency, measuredFrequency) {
  if (
    !Number.isFinite(referenceFrequency) ||
    !Number.isFinite(measuredFrequency) ||
    referenceFrequency <= 0 ||
    measuredFrequency <= 0
  ) {
    return null;
  }

  return 1200 * Math.log2(measuredFrequency / referenceFrequency);
}

export function centsOffMidi(frequency, midi) {
  if (!Number.isFinite(frequency) || !Number.isInteger(midi)) {
    return null;
  }

  return centsBetweenFrequencies(midiToFrequency(midi), frequency);
}

export function describeFrequency(frequency) {
  const midi = frequencyToMidi(frequency);
  if (midi === null) {
    return {
      frequency: null,
      midi: null,
      noteName: "",
      centsOff: null,
    };
  }

  return {
    frequency,
    midi,
    noteName: midiToNoteName(midi),
    centsOff: centsOffMidi(frequency, midi),
  };
}
