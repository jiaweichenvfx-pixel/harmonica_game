# Harmonica Learning Machine Product Plan

## 1. Product Idea

Build a harmonica learning app that turns a song or melody into numbered musical notation, highlights each note in time, listens to the learner through the microphone, and gives real-time feedback on whether the player hit the right note.

The target experience is close to a music rhythm game, but designed for harmonica practice:

- The learner sees numbered notation.
- The current note is highlighted.
- The app listens to the harmonica.
- The app judges pitch and timing.
- The learner gets feedback such as Perfect, Good, Early, Late, Wrong Note, or Miss.

## 2. Recommended MVP

Do not start with "any song in, perfect score out." That is technically possible over time, but too difficult for a first version because full songs contain vocals, drums, chords, reverb, and overlapping instruments.

The first version should focus on the core practice loop:

1. Import or create a simple melody.
2. Convert it into numbered notation.
3. Display the notation with timed highlighting.
4. Listen to microphone input.
5. Detect the played pitch.
6. Compare played pitch with the expected note.
7. Show real-time feedback and a final practice score.

The product should also support two creator-facing workflows:

1. Turn a custom song or melody into a playable game chart.
2. Guide the user to clean up and standardize the arrangement before practice.
3. Help the user learn freestyle improvisation and compose original melodies.

### MVP Input Types

Support these first:

- Manual melody input using numbered notation.
- MIDI file import.
- Simple monophonic audio import, such as humming, flute, whistle, or clean harmonica.

Defer these until later:

- Full commercial song auto-transcription.
- Automatic vocal melody extraction from mixed music.
- Chord accompaniment generation.
- Multi-instrument arrangement.

## 3. Core User Flow

```text
Choose song or exercise
-> View generated numbered notation
-> Select harmonica key, for example C harmonica
-> Start practice
-> App highlights current note
-> User plays harmonica
-> App detects pitch
-> App compares detected pitch with target note
-> App gives feedback
-> User sees score and mistake summary
```

### Custom Song to Game Flow

```text
Import song source
-> Extract or enter melody
-> Choose key, tempo, and harmonica type
-> Quantize rhythm
-> Generate numbered notation
-> Generate timed game chart
-> Review warnings and suggestions
-> Edit notes if needed
-> Save as playable level
-> Practice like a music game
```

### Freestyle Learning Flow

```text
Choose freestyle mode
-> Select skill focus: rhythm, scale, phrase, call-and-response, or composition
-> App gives a backing groove or phrase prompt
-> User improvises on harmonica
-> App records and transcribes the attempt
-> App highlights strong notes, weak notes, timing issues, and repeated ideas
-> App suggests the next practice challenge
-> User saves good phrases into a personal lick library
```

## 4. Main Features

### 4.1 Notation Display

The app should display Chinese numbered notation:

```text
1=C
4/4

| 1  2  3  5 | 6  5  3 - |
| 2  3  5  6 | 5 -  0  5 |
```

Notation symbols:

- `1 2 3 4 5 6 7`: scale degrees.
- `0`: rest.
- `-`: sustain.
- `'`: high octave, for example `1'`.
- `,`: low octave, for example `5,`.
- `|`: bar line.

### 4.2 Harmonica Fingering / Hole Hints

For a C diatonic harmonica, the app can show hole and breath direction:

```text
Note: C4
Notation: 1
Harmonica: 4 blow
```

Example mapping for common C major notes:

```text
C4 = 4 blow
D4 = 4 draw
E4 = 5 blow
F4 = 5 draw
G4 = 6 blow
A4 = 6 draw
B4 = 7 draw
C5 = 7 blow
```

Later versions can add bends, overblows, alternate positions, and different harmonica keys.

### 4.3 Real-Time Pitch Detection

The app should use microphone input and estimate the fundamental frequency.

Recommended browser-side approaches:

- Web Audio API for microphone capture.
- Pitch detection algorithm:
  - YIN
  - McLeod Pitch Method
  - autocorrelation
  - Pitchy JavaScript library

The detected frequency is converted to a musical note:

```text
frequency -> MIDI note number -> note name -> scale degree -> expected notation
```

### 4.4 Feedback Logic

Each target note should have:

- Start time.
- End time.
- Expected pitch.
- Acceptable pitch tolerance.
- Acceptable timing window.

Suggested judgment:

```text
Perfect: pitch correct and timing very close
Good: pitch correct but slightly early or late
Early: correct note, played too early
Late: correct note, played too late
Wrong Note: timing is close, pitch is wrong
Miss: no stable pitch detected during the note window
```

Suggested tolerance:

- Pitch: +/- 40 cents for beginners.
- Timing: +/- 120 ms for beginners.
- Stable detection: detected pitch must be stable for at least 80-120 ms.

### 4.5 Custom Song to Game Builder

The app should let users turn their own songs, exercises, or melody ideas into playable game levels.

Supported creation paths:

- Manual numbered notation input.
- MIDI import.
- Clean monophonic audio import.
- Later: full-song melody extraction.

The builder should produce two linked outputs:

1. Human-readable numbered notation.
2. Machine-readable timed game chart.

The timed game chart is what drives highlighting, scoring, and feedback.

Example chart concept:

```text
Bar 1:
  0ms    1    C4    4 blow
  500ms  2    D4    4 draw
  1000ms 3    E4    5 blow
  1500ms 5    G4    6 blow
```

The builder should include an edit-and-preview loop:

```text
Generate draft
-> Show notation and timeline
-> User edits wrong notes or rhythms
-> App replays preview
-> User saves final game chart
```

### 4.6 Arrangement Coach

The app should not only generate notation; it should help the user make the arrangement playable and clean.

The Arrangement Coach gives suggestions such as:

- This note is outside the selected harmonica's easy range.
- This phrase has too many fast notes for beginner mode.
- This rhythm is irregular; consider quantizing to eighth notes.
- This bar has too many sustained notes and may feel empty in game mode.
- This melody jumps too far; consider transposing or simplifying.
- This section should be looped separately for practice.
- This imported audio has unclear pitch; try a cleaner recording or manual correction.

The coach should have three modes:

```text
Beginner: simplify rhythm, avoid bends, keep notes in easy range.
Standard: keep original melody mostly intact, only flag hard spots.
Advanced: allow bends, fast notes, wide jumps, and expressive timing.
```

The coach should never silently rewrite the user's melody. It should show suggestions and let the user accept or ignore them.

### 4.7 Freestyle and Composition Learning

The app should teach users how to move from copying songs to creating their own phrases.

This should be designed as a training system, not just a blank recorder. Beginners usually do not know what to play when told to "improvise", so the app should give constraints, prompts, and feedback.

Core freestyle modes:

```text
Scale Playground:
  User can only use a small note set, such as 1 2 3 5 6.
  Goal is to build confidence and hear safe notes.

Rhythm Imitation:
  App plays or shows a rhythm.
  User repeats the rhythm using any allowed notes.

Call and Response:
  App plays a short phrase.
  User answers with a related phrase.

Motif Variation:
  App gives a 2-4 note idea.
  User changes rhythm, ending note, octave, or direction.

Backing Track Jam:
  App loops a simple chord progression or drone.
  User improvises freely within suggested notes.

Composition Builder:
  User records short phrases.
  App helps arrange them into A/B sections, repeats, and endings.
```

Freestyle feedback should be different from strict song practice. It should not mark every unexpected note as wrong. Instead, it should evaluate musical fit:

- Did the phrase use notes from the selected scale?
- Did it land on stable notes at phrase endings?
- Was the rhythm steady?
- Did the user repeat and develop a motif?
- Did the phrase have enough space, or was it too crowded?
- Did the phrase start and end clearly?

Example feedback:

```text
Good ending: you landed on 1 at the end of the phrase.
Try more space: your phrase used notes almost continuously for 2 bars.
Nice motif: you repeated 3-5-6 and changed the ending.
Risky note: 4 sounded tense over this backing. Try resolving it to 3 or 5.
```

### 4.8 Personal Lick Library

The app should let users save useful freestyle ideas as reusable "licks".

A lick is a short phrase that can be practiced, reused, modified, and inserted into original songs.

Each saved lick should include:

- Numbered notation.
- Audio recording.
- Harmonica hole hints.
- Key and scale.
- Difficulty.
- Tags, such as blues, folk, sad, bright, ending, transition.

The app can recommend licks during composition:

```text
You need a 2-bar ending in C major.
Try one of these saved phrases:
  - 6 5 3 2 | 1 -
  - 3 5 6 5 | 3 -
```

### 4.9 Composition Coach

The Composition Coach should help users build complete original melodies from small ideas.

It should teach simple composition principles:

- Use short motifs.
- Repeat ideas so the listener can remember them.
- Change one thing at a time: rhythm, direction, ending, or octave.
- Use question-and-answer phrases.
- Leave space.
- End sections on stable notes.
- Keep phrases playable on the selected harmonica.

The coach can guide users with prompts:

```text
Create a 2-bar question phrase using only 1 2 3 5.
Now answer it and end on 1.
Now repeat the first bar, but change the final note.
Now make a B section that starts higher.
```

The output should be a custom song that can immediately become a playable game chart.

## 5. System Architecture

Recommended first implementation: browser app.

```text
Frontend App
  - Song library
  - Notation editor
  - Custom song builder
  - Arrangement coach
  - Freestyle trainer
  - Lick library
  - Composition coach
  - Practice screen
  - Microphone permission
  - Real-time pitch detector
  - Scoring engine

Optional Backend
  - Audio transcription jobs
  - User accounts
  - Saved songs
  - Cloud sync
  - Backing track generation
  - AI composition suggestions
```

For MVP, the backend can be skipped. A local browser app is enough.

## 6. Suggested Tech Stack

### Frontend

- React or Next.js
- TypeScript
- Web Audio API
- Canvas or SVG for animated notation/game lane
- Zustand or Redux for practice state

### Audio / Pitch

- Web Audio API
- `pitchy` or custom YIN implementation
- Optional later: Python backend with `librosa`, `pretty_midi`, or `basic-pitch`

### File Inputs

- Manual notation parser for MVP
- MIDI parser:
  - `@tonejs/midi`
- Audio transcription later:
  - Spotify Basic Pitch
  - librosa
  - CREPE or similar pitch models

## 7. Data Model

### Song

```ts
type Song = {
  id: string;
  title: string;
  key: string;
  tempo: number;
  timeSignature: [number, number];
  sourceType: "manual" | "midi" | "audio" | "preset";
  notes: PracticeNote[];
  chart?: GameChart;
};
```

### Freestyle Session

```ts
type FreestyleSession = {
  id: string;
  mode: "scale-playground" | "rhythm-imitation" | "call-response" | "motif-variation" | "backing-track-jam" | "composition-builder";
  key: string;
  scale: string;
  tempo: number;
  allowedMidiNotes: number[];
  prompt?: FreestylePrompt;
  recordedNotes: PlayedNote[];
  generatedNotation: PracticeNote[];
  feedback: FreestyleFeedback[];
};
```

### Freestyle Prompt

```ts
type FreestylePrompt = {
  id: string;
  instruction: string;
  targetBars: number;
  allowedDegrees: string[];
  rhythmPattern?: string;
  callPhrase?: PracticeNote[];
};
```

### Freestyle Feedback

```ts
type FreestyleFeedback = {
  id: string;
  type: "pitch-fit" | "rhythm" | "motif" | "space" | "phrase-ending" | "playability";
  severity: "praise" | "tip" | "warning";
  message: string;
  relatedNoteIds?: string[];
};
```

### Lick

```ts
type Lick = {
  id: string;
  title: string;
  key: string;
  scale: string;
  difficulty: "beginner" | "standard" | "advanced";
  tags: string[];
  notes: PracticeNote[];
  sourceSessionId?: string;
  audioUrl?: string;
};
```

### Practice Note

```ts
type PracticeNote = {
  id: string;
  startMs: number;
  durationMs: number;
  midi: number | null;
  notation: string;
  lyric?: string;
  harmonica?: {
    hole: number;
    breath: "blow" | "draw";
    bend?: string;
  };
};
```

### Played Note

```ts
type PlayedNote = {
  timeMs: number;
  frequency: number;
  midi: number;
  centsOff: number;
  confidence: number;
};
```

### Judgment

```ts
type Judgment = {
  noteId: string;
  result: "perfect" | "good" | "early" | "late" | "wrong" | "miss";
  centsOff?: number;
  timingOffsetMs?: number;
};
```

### Game Chart

```ts
type GameChart = {
  id: string;
  songId: string;
  version: number;
  difficulty: "beginner" | "standard" | "advanced";
  leadInMs: number;
  notes: PracticeNote[];
  checkpoints: ChartCheckpoint[];
  warnings: ArrangementWarning[];
};
```

### Chart Checkpoint

```ts
type ChartCheckpoint = {
  id: string;
  label: string;
  startMs: number;
  endMs: number;
};
```

### Arrangement Warning

```ts
type ArrangementWarning = {
  id: string;
  severity: "info" | "warning" | "error";
  noteId?: string;
  bar?: number;
  message: string;
  suggestion?: string;
};
```

## 8. MVP Screens

### 8.1 Home / Song List

- List of exercises and imported songs.
- Button to create a melody manually.
- Button to import MIDI.

### 8.2 Notation Editor

- Text input for numbered notation.
- Tempo and key settings.
- Preview parsed notes.
- Optional harmonica key selector.

### 8.3 Custom Song Builder

- Import source: manual, MIDI, or audio.
- Choose melody track for MIDI.
- Choose key, tempo, time signature, and harmonica key.
- Generate notation.
- Generate timed game chart.
- Preview chart with metronome.
- Save playable level.

### 8.4 Arrangement Coach Screen

- Show warnings by bar or note.
- Show range and difficulty summary.
- Suggest transposition.
- Suggest rhythm quantization.
- Suggest beginner simplification.
- Let user accept or ignore each suggestion.

### 8.5 Freestyle Trainer Screen

- Choose mode: scale playground, rhythm imitation, call-and-response, motif variation, backing track jam, or composition builder.
- Show allowed notes and harmonica holes.
- Show current prompt.
- Record user's improvisation.
- Show live pitch and phrase timeline.
- Give musical feedback after each attempt.
- Save good phrases to lick library.

### 8.6 Lick Library Screen

- List saved phrases.
- Filter by key, mood, difficulty, tag, or harmonica technique.
- Practice a lick like a normal game chart.
- Insert a lick into a composition.

### 8.7 Composition Builder Screen

- Build sections such as Intro, A, B, Ending.
- Record or enter short phrases.
- Get suggestions for repetition, contrast, and endings.
- Convert final composition into a playable game chart.

### 8.8 Practice Screen

- Large current note.
- Upcoming notes.
- Harmonica hole hint.
- Microphone status.
- Pitch meter.
- Feedback label.
- Score and combo.

### 8.9 Result Screen

- Accuracy percentage.
- Pitch accuracy summary.
- Timing accuracy summary.
- List of difficult notes.
- Retry button.

## 9. Development Milestones

### Milestone 1: Static Practice Prototype

Goal: prove the game loop without audio recognition.

- Hardcode a simple melody.
- Display numbered notation.
- Highlight notes by time.
- Add play/pause/restart.

### Milestone 2: Microphone Pitch Detection

Goal: listen to harmonica and detect pitch.

- Ask for microphone permission.
- Show live frequency.
- Convert frequency to note name.
- Show cents offset.

### Milestone 3: Scoring Engine

Goal: compare detected pitch against highlighted notes.

- Add pitch tolerance.
- Add timing tolerance.
- Show Perfect/Good/Wrong/Miss.
- Add score and combo.

### Milestone 4: Notation Editor

Goal: allow users to enter custom numbered notation.

- Parse notation text.
- Convert notation to MIDI notes.
- Generate timed note events from tempo.
- Preview and practice the entered melody.

### Milestone 5: Custom Song to Game Builder

Goal: turn a user-created melody into a playable chart.

- Add song creation flow.
- Generate `GameChart` from parsed notes.
- Add chart preview.
- Add save/load for custom songs.
- Add editable note timeline.

### Milestone 6: Arrangement Coach

Goal: help users make their melody playable and well-structured.

- Detect out-of-range notes.
- Detect difficult jumps.
- Detect overly dense rhythm.
- Suggest transposition.
- Suggest simplification for beginner mode.
- Show warnings without silently changing the melody.

### Milestone 7: Freestyle Trainer

Goal: help users practice improvising with constraints.

- Add scale playground mode.
- Add rhythm imitation mode.
- Add call-and-response mode.
- Record improvisation attempts.
- Transcribe attempts into rough notation.
- Give feedback on rhythm, phrase endings, and note fit.

### Milestone 8: Lick Library and Composition Coach

Goal: help users turn freestyle ideas into original songs.

- Let users save short phrases as licks.
- Tag licks by key, mood, and difficulty.
- Add composition builder sections.
- Suggest repetition, variation, and endings.
- Convert original composition into playable game chart.

### Milestone 9: MIDI Import

Goal: support reliable song import.

- Import MIDI.
- Choose melody track.
- Quantize rhythm.
- Convert notes to numbered notation.
- Generate playable game chart.

### Milestone 10: Simple Audio Transcription

Goal: support clean monophonic audio.

- Upload audio.
- Extract pitch curve.
- Segment into notes.
- Quantize rhythm.
- Generate editable notation.
- Generate playable game chart after user review.

## 10. Hard Problems and Practical Solutions

### Problem: Full songs are hard to transcribe

Full recordings contain many overlapping sounds. Start with MIDI and monophonic audio. Add full-song melody extraction later.

### Problem: Harmonica pitch is unstable

Use a forgiving pitch window for beginners. Track stable pitch over a short time window instead of judging every audio frame.

### Problem: Microphone latency

Measure device latency during calibration. Let users adjust timing offset manually.

### Problem: Bends and expressive notes

Ignore bends in the first version. Add bend training as a special mode later.

### Problem: Copyrighted songs

Let users import their own files. Avoid shipping copyrighted sheet music or full transcriptions without permission.

### Problem: Freestyle feedback can feel too judgmental

Improvisation is not the same as playing a fixed song. The app should avoid saying "wrong" unless the task has strict rules. Use language such as "try resolving", "add more space", or "this note sounds tense" instead of treating every surprise as a mistake.

### Problem: Beginners do not know what to play

Do not start with an empty freestyle screen. Give narrow prompts first: two bars, three allowed notes, one rhythm, one ending target. Increase freedom gradually.

## 11. Recommended First Build

Build this first:

```text
Browser app
Manual numbered notation input
Custom song to game builder
Arrangement coach warnings
Freestyle trainer with constrained prompts
Personal lick library
Timed note highlighting
Microphone pitch detection
Real-time correctness feedback
C harmonica hole hints
Practice result screen
```

This version is realistic, fun, and testable. Once the core loop feels good, add MIDI import. After MIDI import works, add simple audio transcription.

The first build should treat user-created songs as first-class content. Even if auto-transcription is not perfect yet, users should be able to manually edit notation and still turn it into a playable level.

Freestyle learning can start simply: scale playground, rhythm imitation, and saving short licks. Advanced AI composition help can come later.

## 12. Example Exercise

```text
Title: Simple C Harmonica Exercise
Key: 1=C
Tempo: 80
Time: 4/4

| 1  2  3  5 | 6  5  3 - |
| 2  3  5  6 | 5 -  0  5 |
| 1'  7  6  5 | 3  2  1 - |
```

Possible harmonica hints:

```text
1  = 4 blow
2  = 4 draw
3  = 5 blow
5  = 6 blow
6  = 6 draw
7  = 7 draw
1' = 7 blow
```

## 13. Success Criteria

The MVP is successful if:

- A beginner can load or enter a melody.
- A user can turn a custom melody into a playable game chart.
- The app can warn when an arrangement is too hard or outside the harmonica's comfortable range.
- A user can complete a guided freestyle exercise without needing to know music theory first.
- A user can save an improvised phrase and reuse it in an original composition.
- The app highlights notes in time.
- The app can hear harmonica notes through the microphone.
- The feedback feels responsive.
- The user can clearly tell which notes were wrong.
- The system is forgiving enough for real harmonica practice.

## 14. Future Features

- Slow practice mode.
- Loop difficult bars.
- Automatic mistake practice playlist.
- Bend training.
- Multiple harmonica keys.
- Backing track playback.
- Freestyle challenge mode.
- Call-and-response AI partner.
- Lick recommendation engine.
- AI-assisted original melody builder.
- Vocal melody extraction.
- AI-assisted notation cleanup.
- Mobile app version.
- User accounts and song cloud sync.
- Leaderboards and daily exercises.
