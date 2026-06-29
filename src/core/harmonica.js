const C_DIATONIC_HINTS = new Map([
  [60, "4 blow"],
  [61, "4 draw bend -2"],
  [62, "4 draw"],
  [63, "3 draw bend -3"],
  [64, "5 blow"],
  [65, "5 draw"],
  [66, "4 draw bend -1"],
  [67, "6 blow"],
  [68, "6 draw bend -2"],
  [69, "6 draw"],
  [70, "6 draw bend -1"],
  [71, "7 draw"],
  [72, "7 blow"],
  [73, "8 draw bend -1"],
  [74, "8 draw"],
  [75, "10 draw bend -2"],
  [76, "8 blow"],
]);

export function getCHarmonicaHint(midi) {
  if (midi === null) {
    return "rest";
  }

  return C_DIATONIC_HINTS.get(midi) ?? "C harmonica: advanced/out of first-position range";
}
