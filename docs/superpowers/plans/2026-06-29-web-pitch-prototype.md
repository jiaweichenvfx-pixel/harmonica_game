# Web Pitch Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static desktop browser prototype that listens to any stable single-note sound, estimates pitch, compares it to a target numbered-notation note, and gives beginner-friendly feedback.

**Architecture:** The app is a no-build browser project. Pure logic lives in small ES modules under `src/core` and is tested with Node's built-in test runner. Browser-only microphone capture and autocorrelation pitch detection live under `src/audio`, with `src/app.js` wiring the UI.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Web Audio API, Node `node:test`.

---

### Task 1: Core Tests

**Files:**
- Create: `tests/core.test.mjs`

- [ ] **Step 1: Write failing tests for music math, notation parsing, and scoring**

Run: `node --test tests/core.test.mjs`
Expected: FAIL because imported modules do not exist yet.

### Task 2: Core Modules

**Files:**
- Create: `src/core/music.js`
- Create: `src/core/notation.js`
- Create: `src/core/scoring.js`

- [ ] **Step 1: Implement music conversion helpers**

`src/core/music.js` exports frequency/MIDI/note helpers and cents calculations.

- [ ] **Step 2: Implement numbered notation parser**

`src/core/notation.js` parses a small MVP notation subset into timed practice notes.

- [ ] **Step 3: Implement scoring**

`src/core/scoring.js` compares detected MIDI/cents/timing to the active target note.

- [ ] **Step 4: Run tests**

Run: `node --test tests/core.test.mjs`
Expected: PASS.

### Task 3: Browser App

**Files:**
- Create: `index.html`
- Create: `src/styles.css`
- Create: `src/audio/pitch-detector.js`
- Create: `src/audio/microphone.js`
- Create: `src/app.js`

- [ ] **Step 1: Add static UI**

Create a compact desktop practice screen with notation editor, target selector, mic controls, live pitch meter, and feedback panel.

- [ ] **Step 2: Add browser pitch detection**

Use Web Audio API analyser data and an autocorrelation detector tuned for stable monophonic input.

- [ ] **Step 3: Wire app state**

Parse notation, advance current target by timer, show detected pitch, show score feedback, and allow previous/next target selection when stopped.

### Task 4: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run automated tests**

Run: `node --test tests/core.test.mjs`
Expected: PASS.

- [ ] **Step 2: Start local server**

Run: `python3 -m http.server 5173`
Expected: server listens on `http://localhost:5173/`.

- [ ] **Step 3: Manual browser check**

Open `http://localhost:5173/`, confirm page loads. Microphone feedback requires user permission and a stable single-note sound.
