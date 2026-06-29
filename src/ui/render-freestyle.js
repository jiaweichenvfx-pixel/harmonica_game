import { BLUES_SHUFFLE_NOTES } from "../freestyle/blues-shuffle.js";

const SHUFFLE_STEPS = ["1", "1 a", "2", "2 a", "3", "3 a", "4", "4 a"];

export function renderMode(elements, mode) {
  const isFreestyle = mode === "freestyle";
  elements.practiceTab.classList.toggle("active", !isFreestyle);
  elements.freestyleTab.classList.toggle("active", isFreestyle);
  elements.practiceView.hidden = isFreestyle;
  elements.freestyleView.hidden = !isFreestyle;
}

export function renderFreestyle(elements, state) {
  renderScale(elements, state.pitchEvaluation?.notation);
  elements.freestyleNote.textContent = state.pitchEvaluation?.notation ?? "--";
  elements.freestyleRole.textContent = state.pitchEvaluation?.role ?? "silent";
  elements.shufflePosition.textContent = state.shufflePosition.label;
  elements.shuffleFeel.textContent = state.shufflePosition.feel;
  elements.freestyleFeedback.textContent = state.pitchEvaluation.feedback;
  renderShuffleGrid(elements, state.shufflePosition.step);
}

export function renderScale(elements, activeNotation) {
  elements.freestyleScale.innerHTML = "";
  for (const note of BLUES_SHUFFLE_NOTES) {
    const pill = document.createElement("span");
    pill.className = `scale-pill${note.notation === activeNotation ? " active" : ""}`;
    pill.textContent = note.notation;
    elements.freestyleScale.append(pill);
  }
}

export function renderShuffleGrid(elements, activeStep) {
  elements.shuffleGrid.innerHTML = "";
  SHUFFLE_STEPS.forEach((label, index) => {
    const step = document.createElement("span");
    step.className = `shuffle-step${index === activeStep % SHUFFLE_STEPS.length ? " active" : ""}${
      label.includes("a") ? " short" : ""
    }`;
    step.textContent = label;
    elements.shuffleGrid.append(step);
  });
}
