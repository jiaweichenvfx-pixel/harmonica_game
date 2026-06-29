import { BLUES_SHUFFLE_NOTES, BLUES_SHUFFLE_RIFF } from "../freestyle/blues-shuffle.js";

const SHUFFLE_STEPS = ["1", "1 a", "2", "2 a", "3", "3 a", "4", "4 a"];

export function renderMode(elements, mode) {
  const isFreestyle = mode === "freestyle";
  elements.practiceTab.classList.toggle("active", !isFreestyle);
  elements.freestyleTab.classList.toggle("active", isFreestyle);
  elements.practiceView.hidden = isFreestyle;
  elements.freestyleView.hidden = !isFreestyle;
}

export function renderFreestyle(elements, state) {
  elements.freestyleKey.textContent = `${BLUES_SHUFFLE_RIFF.keyLabel} · ${BLUES_SHUFFLE_RIFF.feelLabel}`;
  elements.freestyleTitle.textContent = BLUES_SHUFFLE_RIFF.title;
  renderScore(elements, state.shufflePosition.step);
  renderScale(elements, state.pitchEvaluation?.notation);
  elements.freestyleNote.textContent = state.pitchEvaluation?.notation ?? "--";
  elements.freestyleRole.textContent = state.pitchEvaluation?.role ?? "silent";
  elements.shufflePosition.textContent = state.shufflePosition.label;
  elements.shuffleFeel.textContent = state.shufflePosition.feel;
  elements.freestyleFeedback.textContent = state.pitchEvaluation.feedback;
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

export function renderScore(elements, activeStep) {
  elements.freestyleScore.innerHTML = "";
  for (const row of BLUES_SHUFFLE_RIFF.rows) {
    const rowElement = document.createElement("div");
    rowElement.className = "score-row";

    for (const bar of row.bars) {
      rowElement.append(renderScoreBar(bar, activeStep));
    }

    elements.freestyleScore.append(rowElement);
  }
}

function renderScoreBar(bar, activeStep) {
  const barElement = document.createElement("div");
  barElement.className = "score-bar";

  const notesElement = document.createElement("div");
  notesElement.className = "score-notes";
  for (const note of bar.notes) {
    const noteElement = document.createElement("span");
    noteElement.className = `score-note ${note.role}`;
    noteElement.textContent = note.notation;
    notesElement.append(noteElement);
  }

  const gridElement = document.createElement("div");
  gridElement.className = "score-grid";
  for (let beat = 0; beat < 4; beat += 1) {
    const beatElement = document.createElement("div");
    beatElement.className = "score-beat";
    const longStep = beat * 2;
    const shortStep = beat * 2 + 1;
    beatElement.append(renderScoreStep(BLUES_SHUFFLE_RIFF.shuffleLabels[longStep], activeStep, longStep, false));
    beatElement.append(renderScoreStep(BLUES_SHUFFLE_RIFF.shuffleLabels[shortStep], activeStep, shortStep, true));
    gridElement.append(beatElement);
  }

  barElement.append(notesElement, gridElement);
  return barElement;
}

function renderScoreStep(label, activeStep, stepIndex, isShort) {
  const step = document.createElement("span");
  step.className = `score-step${activeStep % 8 === stepIndex ? " active" : ""}${isShort ? " short" : ""}`;
  step.textContent = label;
  return step;
}
