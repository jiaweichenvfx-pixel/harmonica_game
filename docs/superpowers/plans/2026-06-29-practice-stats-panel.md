# Practice Stats Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visible practice statistics panel that records note judgments and shows counts, accuracy, and difficult notes during practice.

**Architecture:** `PracticeSession` records one latest judgment per note and exposes summary stats in `getState()`. UI rendering reads those stats and applies judgment classes to notation tokens. `src/app.js` remains orchestration-only.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, static browser UI.

---

### Task 1: Practice Stats Tests

**Files:**
- Modify: `tests/practice-session.test.mjs`
- Modify: `tests/render-practice.test.mjs`

- [ ] **Step 1: Add failing tests for judgment counts, accuracy, difficult notes, and judgment classes.**

### Task 2: Session Stats

**Files:**
- Modify: `src/practice/practice-session.js`

- [ ] **Step 1: Store one result per note after `updatePitch`.**
- [ ] **Step 2: Expose `stats` and `judgmentsByNoteId` from `getState()`.**

### Task 3: UI Rendering

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/ui/dom-elements.js`
- Modify: `src/ui/render-practice.js`

- [ ] **Step 1: Add a practice stats panel to the markup.**
- [ ] **Step 2: Render counts, accuracy, difficult notes, and token judgment classes.**

### Task 4: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run all tests and syntax checks.**
- [ ] **Step 2: Reload browser and verify the stats panel appears with no console errors.**
