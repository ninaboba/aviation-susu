# AGENTS.md — AI Agent Guide for CATC Exam Quiz App

> **Read this file first before making any changes.**
> This document describes the project architecture, source-of-truth rules, and workflow.

---

## Project Overview

A multi-subject CAAT/EASA aviation exam practice web app hosted on GitHub Pages.
Currently supports two subjects:
- **Subject 081** – Principles of Flight (Aeroplanes), 200 questions
- **Subject 040** – Human Performance & Limitations, 271 questions

---

## Architecture & Directory Structure

The project is structured as a clean, modular static web application:

```
pof/
├── index.html                    ← Primary HTML entrypoint (loaded by GitHub Pages & dev server)
├── js/
│   ├── app.js                    ← Core application logic & UI handlers
│   └── storage.js                ← Scoped localStorage layer (mistakes, bookmarks, history)
├── data/
│   ├── subjects.json             ← Subject manifest (id, code, title, questionCount, file)
│   └── subjects/
│       ├── pof.json              ← Subject 081 questions (200 MCQs)
│       └── human_factors.json   ← Subject 040 questions (271 MCQs)
│
├── build_html.js                 ← Bundles index.html + data + JS into offline single-file website
├── PoF-QuestionBank-website.html ← Auto-generated offline bundle (do NOT edit directly)
└── AGENTS.md                     ← AI instructions & architecture reference
```

---

## Source of Truth & Editing Workflow

| Task | File to Edit |
|------|--------------|
| **HTML / CSS / Layout changes** | `index.html` |
| **Quiz logic / features / interactions** | `js/app.js` |
| **Storage / persistence logic** | `js/storage.js` |
| **Subject metadata** | `data/subjects.json` |
| **Questions / explanations** | `data/subjects/pof.json` or `data/subjects/human_factors.json` |
| **Offline single-file build** | Run `node build_html.js` (generates `PoF-QuestionBank-website.html`) |

### Critical Rules

1. **`index.html` is the primary web entrypoint** — it loads `js/storage.js` and `js/app.js`.
2. **`PoF-QuestionBank-website.html` is AUTO-GENERATED** — never edit it directly.
3. **`build_html.js` only produces `PoF-QuestionBank-website.html`** — it reads `index.html`, inlines the question datasets and JS scripts, and never overwrites or alters `index.html`.
4. **After any changes to `index.html`, `js/`, or `data/`, run `node build_html.js`** to keep the offline bundle synced.

---

## UI Components & Key Elements

### Header Layout
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

- Visible Header Controls: **Search (Ctrl+K)**, **Theme Toggle (Sun/Moon)**, **Font Size (T 100%)**, **⋯ Menu**
- Inside ⋯ Overflow Dropdown: **Sound Effects**, **Mistake Bank**, **Bookmarks**
- Red dot on ⋯ button appears when `mistakes.size > 0`.

### Key Element IDs

| ID | Purpose |
|----|---------|
| `viewSetup` | Dashboard / setup view |
| `viewExam` | Active quiz / exam view |
| `viewSummary` | Quiz results & analytics view |
| `headerSubjectSelect` | Subject selector dropdown in header |
| `dashboardSubjectSelect` | Subject selector dropdown on dashboard |
| `heroSubjectTitle` | Hero title badge |
| `heroBankTotal` | Total questions in bank badge |
| `heroAvgScore` | Average user score |
| `explanationBox` | Explanation panel (revealed on answer) |
| `btnNextQ` | Top navigation Next question button |
| `btnNextQBottom` | In-explanation Next question button (inside explanationBox) |
| `headerOverflowBtn` | "⋯" button in header |
| `headerOverflowDropdown` | Overflow dropdown menu |
| `headerMenuDot` | Red notification dot on ⋯ button |
| `headerMistakeCount` | Mistake count badge |
| `headerBookmarkCount` | Bookmark count badge |
| `soundToggleBtn` / `soundIcon` | Audio toggle button |

---

## Question Data Schema

```json
{
  "id": 1,
  "topic": "081 01",
  "topicName": "Subsonic Aerodynamics",
  "question": "Which SI unit is used for density?",
  "options": [
    "kg/m³",
    "N",
    "Pa",
    "W/m²"
  ],
  "correct": "kg/m³",
  "answer": 0,
  "LO": "081 01 01 01",
  "difficulty": "Easy",
  "cognitive": "KNOW",
  "verb": "Identify",
  "explanation": "Density is mass per unit volume, kg/m³.",
  "explanation_quick": "Density = Mass / Volume (kg/m³)"
}
```

---

## Git Workflow

```bash
# Make changes to index.html, js/app.js, js/storage.js, or data/
node build_html.js          # sync PoF-QuestionBank-website.html
git add -A
git commit -m "feat/fix: ..."
git push
```
