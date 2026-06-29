# Practice Session Modularization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract practice timing, active-note selection, manual note navigation, and judgment state from `src/app.js` into a tested `PracticeSession` module.

**Architecture:** `src/practice/practice-session.js` becomes the stateful practice coordinator. It depends only on parsed notes and `src/core/scoring.js`, not on DOM or microphone APIs. `src/app.js` remains the browser adapter that parses input, renders UI, starts animation frames, and forwards pitch samples to the session.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, existing no-build browser app.

---

### Task 1: Practice Session Tests

**Files:**
- Create: `tests/practice-session.test.mjs`

- [ ] **Step 1: Write tests for start/stop, active note lookup, manual navigation, and judgment update.**
- [ ] **Step 2: Run `node --test tests/practice-session.test.mjs` and confirm it fails because the module does not exist.**

### Task 2: Practice Session Module

**Files:**
- Create: `src/practice/practice-session.js`

- [ ] **Step 1: Implement `PracticeSession` with `start`, `stop`, `selectPrevious`, `selectNext`, `getState`, `updateElapsed`, and `updatePitch`.**
- [ ] **Step 2: Run `node --test tests/practice-session.test.mjs` and confirm it passes.**

### Task 3: Browser Adapter Refactor

**Files:**
- Modify: `src/app.js`

- [ ] **Step 1: Replace local practice state with `PracticeSession`.**
- [ ] **Step 2: Keep DOM rendering behavior unchanged.**
- [ ] **Step 3: Run all tests and JS syntax checks.**

### Task 4: Browser Verification

**Files:**
- No new files.

- [ ] **Step 1: Reload `http://127.0.0.1:5173/`.**
- [ ] **Step 2: Confirm initial target and feedback render correctly and no console errors appear.**
