# UI Adapter Modularization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract DOM lookup, practice rendering, pitch rendering, and target-tone playback from `src/app.js` so app startup only wires modules together.

**Architecture:** `src/ui/dom-elements.js` owns DOM queries, `src/ui/render-practice.js` owns DOM rendering, and `src/audio/target-tone.js` owns generated target tone playback. `src/app.js` remains the composition root that creates `PracticeSession`, subscribes button events, receives microphone pitch samples, and calls render helpers.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, no-build browser app.

---

### Task 1: Rendering Tests

**Files:**
- Create: `tests/render-practice.test.mjs`

- [ ] **Step 1: Write tests for feedback labels and target metadata formatting.**
- [ ] **Step 2: Run the test and confirm it fails before the renderer module exists.**

### Task 2: UI Modules

**Files:**
- Create: `src/ui/dom-elements.js`
- Create: `src/ui/render-practice.js`

- [ ] **Step 1: Implement DOM lookup and pure formatting helpers.**
- [ ] **Step 2: Move practice, notation track, feedback, target, and pitch rendering out of `src/app.js`.**

### Task 3: Target Tone Module

**Files:**
- Create: `src/audio/target-tone.js`

- [ ] **Step 1: Move oscillator target-tone playback out of `src/app.js`.**

### Task 4: App Wiring

**Files:**
- Modify: `src/app.js`

- [ ] **Step 1: Keep `src/app.js` as the browser composition root.**
- [ ] **Step 2: Run all tests and syntax checks.**
- [ ] **Step 3: Reload the browser and confirm the existing interaction still works.**
