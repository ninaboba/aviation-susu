# AGENTS.md — AI Agent Guide for CATC Exam Quiz App

> **Read this file first before making any changes.**
> This document describes the project architecture, source-of-truth rules, and common pitfalls
> that have caused bugs in past AI-assisted sessions.

---

## Project Overview

A multi-subject CAAT/EASA aviation exam practice web app hosted on GitHub Pages.
Currently supports two subjects:
- **Subject 081** – Principles of Flight (Aeroplanes), 200 questions
- **Subject 040** – Human Performance & Limitations, 271 questions

---

## Directory Structure

```
pof/
├── index.html                    ← SOURCE OF TRUTH (edit this only)
├── PoF-QuestionBank-website.html ← AUTO-GENERATED (never edit directly)
├── build_html.js                 ← Bundle script: copies index.html → website file
├── build_data.js                 ← Data builder: processes question JSONs
│
├── js/
│   ├── app.js                    ← Dev-reference JS (NOT loaded by index.html)
│   └── storage.js                ← Dev-reference JS (NOT loaded by index.html)
│
├── data/
│   ├── subjects.json             ← Subject manifest (id, title, file path, count)
│   └── subjects/
│       ├── pof.json              ← Subject 081 questions
│       └── human_factors.json   ← Subject 040 questions
│
├── questions_data.json           ← Legacy question data (Subject 081 only)
├── css/                          ← Dev CSS reference (not loaded by index.html)
├── scripts/                      ← Python utility scripts
└── pdf/                          ← Source PDFs
```

---

## CRITICAL: Source of Truth

```
index.html  ←  THE ONLY FILE YOU SHOULD EDIT FOR UI/LOGIC CHANGES
    │
    └──►  node build_html.js  ──►  PoF-QuestionBank-website.html
```

### Rules (must follow every session)

1. **NEVER edit `PoF-QuestionBank-website.html` directly** — it is always overwritten.
2. **NEVER run `node build_html.js` to generate `index.html`** — it does NOT do this anymore.
3. **NEVER edit `index.html` through `build_html.js`** — the script only reads, never writes `index.html`.
4. **DO edit `index.html` directly** for all HTML, CSS, and JS changes.
5. **Run `node build_html.js` after editing `index.html`** to sync `PoF-QuestionBank-website.html`.
6. `js/app.js` and `js/storage.js` are **dev references only** — they are NOT loaded by `index.html`.
   All JS lives inside `index.html`'s `<script>` tag. Do not create external script references.

### Why this matters

In a previous session, `build_html.js` contained a 3,400-line hardcoded HTML template.
Running it would **overwrite `index.html`** with an older version, losing all recent changes.
The script has been refactored to a simple copy-only script to eliminate this bug permanently.

---

## index.html Architecture

`index.html` is self-contained (~310 KB). It includes:

- **Anti-FOUC theme script** (inline, top of `<head>`)
- **Tailwind CSS CDN** + custom config
- **Lucide Icons CDN**
- **Canvas Confetti CDN**
- **All CSS** inline in `<style>` block (dark/light mode, font sizes, animations)
- **All HTML** — Header, Views (Setup, Exam, Summary, Review), Modals
- **All JS** — inline `<script>` at end of `<body>` (includes `SoundEffects`, `QuizStorage`, `app`)

### Key HTML IDs to know

| ID | Purpose |
|----|---------|
| `viewSetup` | Dashboard / setup screen |
| `viewExam` | Active quiz screen |
| `viewSummary` | Results screen |
| `headerSubjectSelect` | Subject dropdown in header |
| `dashboardSubjectSelect` | Subject dropdown on dashboard |
| `heroSubjectTitle` | Hero banner title (updated on subject switch) |
| `heroSubjectDescription` | Hero banner description |
| `heroBankTotal` | Total question count badge |
| `heroAvgScore` | Average score display |
| `heroExamCount` | Number of tests taken |
| `explanationBox` | Answer explanation panel (shown after answering) |
| `btnNextQ` | Next question button (top nav) |
| `btnNextQBottom` | Next question button (bottom of explanation box) |
| `topicGridContainer` | Topic selection checkboxes |
| `headerOverflowBtn` | "..." overflow menu button |
| `headerOverflowDropdown` | Overflow menu dropdown |
| `headerMenuDot` | Red dot on "..." when mistakes > 0 |
| `headerMistakeCount` | Mistake count (inside overflow menu) |
| `headerBookmarkCount` | Bookmark count (inside overflow menu) |
| `soundToggleBtn` / `soundIcon` | Sound toggle (inside overflow menu) |

---

## Header Layout (current)

```
[✈ Plane] [Subject Dropdown ▼]   [🔍 Search | Ctrl+K]  [☀ Theme]  [T 100%]  [⋯]
                                                                            │
                                                              ┌─────────────┘
                                                              │ 🔊 Sound Effects
                                                              │ ─────────────
                                                              │ ● Mistake Bank  [N]
                                                              │ 🔖 Bookmarks    [N]
                                                              └─────────────────
```

Header buttons visible at all times: **Search**, **Theme Toggle**, **Font Size**, **⋯ Menu**
Inside ⋯ dropdown: **Sound**, **Mistake Bank**, **Bookmarks**

---

## Question Data Format (subjects/pof.json, subjects/human_factors.json)

```json
[
  {
    "id": 1,
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "answer": 0,
    "topic": "081 01",
    "topicName": "Subsonic Aerodynamics",
    "LO": "081 01 01 01",
    "difficulty": "Easy",
    "cognitive": "KNOW",
    "verb": "Identify",
    "explanation": "...",
    "explanation_quick": "..."
  }
]
```

---

## Subject Manifest (data/subjects.json)

```json
[
  { "id": "pof",           "code": "081", "title": "...", "file": "./data/subjects/pof.json",           "questionCount": 200 },
  { "id": "human_factors", "code": "040", "title": "...", "file": "./data/subjects/human_factors.json", "questionCount": 271 }
]
```

To add a new subject: add an entry here and create the corresponding JSON file.

---

## App State & Key Methods (inside index.html `<script>`)

| Method | Purpose |
|--------|---------|
| `app.init()` | Bootstrap on DOMContentLoaded |
| `app.loadSubjects()` | Fetch subjects.json, populate dropdowns |
| `app.switchSubject(id)` | Load a subject's questions, reset topic grid |
| `app.handleSubjectChange(id)` | Called by both subject dropdowns |
| `app.renderTopicGrid()` | Render topic checkboxes |
| `app.renderCurrentQuestion()` | Render question + show/hide explanation |
| `app.updateHeaderStats()` | Update mistake/bookmark counts + menu dot |
| `app.toggleHeaderMenu()` | Open/close overflow menu |
| `app.closeHeaderMenu()` | Close overflow menu (also removes outside-click handler) |
| `app.updateMenuDot()` | Show/hide red dot on ⋯ button |
| `app.nextQuestion()` | Advance to next question |
| `app.prevQuestion()` | Go back |
| `app.goHome()` | Return to viewSetup |

---

## Common Pitfalls (learned from past sessions)

1. **Do NOT run `node build_html.js` on an old version of the script** — it may still contain the old 3,400-line template. Always verify the script is the new copy-only version (<100 lines).
2. **Do NOT make parallel edits to both `index.html` and `build_html.js`** — `build_html.js` must not contain HTML.
3. **After any edit to `index.html`, run `node build_html.js` before committing** to keep both files in sync.
4. **`js/app.js` is for development reference only** — it is NOT the live code. The live code is the inline `<script>` in `index.html`. If you need to update logic, edit `index.html`.

---

## Git Workflow

```bash
# Make changes to index.html
node build_html.js          # sync PoF-QuestionBank-website.html
git add -A
git commit -m "feat: ..."
git push
```

GitHub Pages serves from `main` branch root.

---

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `quiz_active_subject_id` | Last selected subject |
| `quiz_session_{subjectId}` | Auto-saved session |
| `quiz_mistakes_{subjectId}` | Mistake bank (Set of question IDs) |
| `quiz_bookmarks_{subjectId}` | Bookmarks (Set of question IDs) |
| `quiz_attempted_{subjectId}` | Attempted questions |
| `quiz_history_{subjectId}` | Exam history array |
| `pof_theme` | `'dark'` or `'light'` |
| `pof_font_size` | `'sm'` / `'normal'` / `'lg'` / `'xl'` |
| `pof_sound_enabled` | `'true'` / `'false'` |
