# Numbered Score Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable numbered-notation score structure for Freestyle, including octave dots, dotted rhythm, ties, eighth-note underlines, and sixteenth-note double underlines.

**Architecture:** `src/core/notation.js` owns token parsing and timing metadata. `src/freestyle/blues-shuffle.js` stores score notes with parsed display metadata. `src/ui/render-freestyle.js` renders the score from that metadata without knowing MIDI parsing rules.

**Tech Stack:** Vanilla JavaScript ES modules, Node `node:test`, static HTML/CSS.

---

### Task 1: Numbered Notation Token Metadata

**Files:**
- Modify: `tests/core.test.mjs`
- Modify: `src/core/notation.js`

- [x] **Step 1: Add failing tests for octave dots, dotted values, eighth and sixteenth durations, and ties.**
- [x] **Step 2: Implement token parsing metadata in `parseNumberedNotation`.**
- [x] **Step 3: Run core tests and confirm the notation metadata passes.**

### Task 2: Freestyle Score Data

**Files:**
- Modify: `tests/blues-shuffle.test.mjs`
- Modify: `src/freestyle/blues-shuffle.js`

- [x] **Step 1: Add failing tests proving the demo riff has chords and rhythm metadata.**
- [x] **Step 2: Add chord labels and parsed score notes to the demo riff.**
- [x] **Step 3: Run freestyle tests and confirm the score model passes.**

### Task 3: Numbered Score UI

**Files:**
- Modify: `src/ui/render-freestyle.js`
- Modify: `src/styles.css`

- [x] **Step 1: Render chord labels, note glyph layers, octave dots, rhythm underlines, dotted notes, and tie arcs.**
- [x] **Step 2: Style the score to resemble a numbered notation sheet rather than cards.**
- [x] **Step 3: Verify tests, syntax checks, and browser rendering.**
