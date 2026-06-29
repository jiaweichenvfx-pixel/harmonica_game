# Blues Shuffle Freestyle Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visible Freestyle tab focused on C blues shuffle practice with allowed blues-scale notes, shuffle groove positions, and real-time scale feedback from microphone pitch.

**Architecture:** `src/freestyle/blues-shuffle.js` owns the musical model: C blues scale notes, note membership, target feedback, and shuffle grid position. UI rendering lives in `src/ui/render-freestyle.js`. `src/app.js` wires existing pitch samples into both practice and freestyle renderers.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, static browser UI.

---

### Task 1: Freestyle Core Tests

**Files:**
- Create: `tests/blues-shuffle.test.mjs`

- [ ] **Step 1: Test blues-scale membership for C, Eb, F, F#, G, Bb, C.**
- [ ] **Step 2: Test outside-note feedback.**
- [ ] **Step 3: Test shuffle grid labels and long/short feel.**

### Task 2: Freestyle Core Module

**Files:**
- Create: `src/freestyle/blues-shuffle.js`

- [ ] **Step 1: Implement scale definitions and pitch evaluation.**
- [ ] **Step 2: Implement shuffle position calculation.**

### Task 3: Freestyle UI

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/ui/dom-elements.js`
- Create: `src/ui/render-freestyle.js`
- Modify: `src/app.js`

- [ ] **Step 1: Add Practice/Freestyle tabs.**
- [ ] **Step 2: Add Blues Shuffle panel showing allowed notes, groove grid, current note status, and feedback.**
- [ ] **Step 3: Wire microphone pitch into freestyle feedback.**

### Task 4: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run all tests and syntax checks.**
- [ ] **Step 2: Reload browser, switch to Freestyle, and confirm the panel renders without console errors.**
