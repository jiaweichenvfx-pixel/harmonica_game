# Visual Blues Shuffle Score UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract Blues Shuffle Freestyle panel with a direct numbered-notation score UI that shows bars, notes, shuffle long/short grid positions, current groove position, and live note feedback.

**Architecture:** `src/freestyle/blues-shuffle.js` exposes a reusable demo riff score model. `src/ui/render-freestyle.js` renders that model as a visible score. `src/app.js` continues to pass pitch and groove state to the renderer without owning score details.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, static browser UI.

---

### Task 1: Score Model Tests

**Files:**
- Modify: `tests/blues-shuffle.test.mjs`

- [x] **Step 1: Add tests for demo riff bars and note/groove labels.**
- [x] **Step 2: Run test and confirm it fails before the score model exists.**

### Task 2: Score Model

**Files:**
- Modify: `src/freestyle/blues-shuffle.js`

- [x] **Step 1: Add `BLUES_SHUFFLE_RIFF` with two visible phrase rows and four bars.**

### Task 3: Visual Score UI

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/ui/render-freestyle.js`

- [x] **Step 1: Add score containers and current-input summary.**
- [x] **Step 2: Render bars, notation notes, and shuffle grid labels.**
- [x] **Step 3: Highlight current shuffle step and live detected note.**

### Task 4: Verification

**Files:**
- No new files.

- [x] **Step 1: Run all tests and syntax checks.**
- [x] **Step 2: Reload browser, switch to Freestyle, and confirm the visual score is present.**
