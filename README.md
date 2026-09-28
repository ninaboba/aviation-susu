# ✈️ Aviation MCQ Examination Training Platform

> ชุดข้อสอบฝึกหัดสำหรับการสอบใบอนุญาตนักบิน CAAT TCAR PEL Part-FCL (Revision 2025)
> รองรับหลายวิชา · ออฟไลน์ได้ · ไม่ต้องติดตั้ง · เปิดในเบราว์เซอร์เลย

---

## 🌐 เข้าใช้งานออนไลน์

| ช่องทาง | URL |
|---------|-----|
| **GitHub Pages (หลัก)** | **https://ninaboba.github.io/aviation-susu/** |
| **Offline Bundle** | ดาวน์โหลดไฟล์ `PoF-QuestionBank-website.html` แล้วเปิดในเบราว์เซอร์ |

---

## 📚 วิชาที่รองรับ

| รหัส | ชื่อวิชา | จำนวนข้อ |
|------|---------|---------|
| **081** | Principles of Flight (Aeroplanes) | 200 ข้อ |
| **040** | Human Performance & Limitations | 271 ข้อ |
| **010** | Air Law | 200 ข้อ |
| **050** | Meteorology | 200 ข้อ |

---

## ✨ Features สำหรับผู้ใช้

### 🎯 โหมดการสอบ
- **Study Mode** — ทำข้อสอบแบบเรียนรู้ กดดูเฉลยทีละข้อได้ทันที พร้อม explanation ละเอียด
- **Exam Mode** — จำลองสอบจริง ไม่เห็นเฉลยระหว่างทำ มีจับเวลา สรุปผลหลังจบ

### ⚙️ ตั้งค่าชุดข้อสอบ
- **เลือกจำนวนข้อ** — กำหนดเองได้ว่าจะทำกี่ข้อต่อรอบ
- **เลือก Topic** — เลือกเฉพาะหัวข้อย่อยที่ต้องการฝึก
- **Unattempted Only** — กรองเฉพาะข้อที่ยังไม่เคยทำ
- **Mistake Bank** — ทำเฉพาะข้อที่เคยตอบผิด เพื่อทบทวนจุดอ่อน
- **Bookmarks Only** — ทำเฉพาะข้อที่บุ๊กมาร์กไว้

### 📊 Analytics & History
- **สรุปผลหลังสอบ** — แสดง score, เวลาที่ใช้, ข้อถูก/ผิด
- **ประวัติการสอบ** (Exam History) — บันทึกผลการสอบทุกรอบ
- **Review ข้อผิด** — กลับไปดูข้อที่ตอบผิดทั้งหมดพร้อมเฉลยในหน้า Summary
- **Topic breakdown** — เห็นว่า topic ไหนยังอ่อนอยู่

### 🔍 ระบบค้นหา (Search · Ctrl+K)
- ค้นหาจากคำถาม, เฉลย, explanation ได้ทั้งหมด
- กรองตาม Topic และ Difficulty ได้
- กด `Ctrl+K` เพื่อเปิด Search ได้ทันที

### 🔖 Mistake Bank & Bookmarks
- **Mistake Bank** — บันทึกข้อที่ตอบผิดอัตโนมัติ พร้อม badge แจ้งจำนวน
- **Bookmarks** — กดบุ๊กมาร์กข้อไหนก็ได้ระหว่างทำ เพื่อกลับมาทบทวนทีหลัง
- ข้อมูลเก็บในเครื่อง (localStorage) ไม่หายแม้ปิดเบราว์เซอร์

### 💾 Auto-Save & Resume
- **บันทึก session อัตโนมัติ** ระหว่างทำ ถ้าปิดหน้าต่างหรือพลาด ข้อมูลไม่หาย
- **Resume Session** — ครั้งต่อไปที่เปิดเว็บ มี banner ให้กดทำต่อจากที่ค้างไว้

### 🎨 UI / UX
- **Dark / Light Mode** — สลับธีมได้ บันทึกค่าไว้ในเครื่อง
- **ปรับขนาดตัวอักษร** — 4 ระดับ (90% / 100% / 115% / 130%)
- **เสียง Sound Effects** — เสียงตอบถูก/ผิด เปิด-ปิดได้
- **Touch Swipe** — บน iPad/มือถือ ปัดซ้าย-ขวาเพื่อเปลี่ยนข้อได้
- **Responsive** — ใช้งานได้ทั้งมือถือ, iPad (landscape 2-column), และ Desktop
- **Explanation** — ทุกข้อมีเฉลยละเอียด + Quick Tip สั้นๆ

---
---

# 🛠️ Developer & AI Reference

> ส่วนนี้สำหรับ Developer และ AI Agent ที่ต้องการเข้าใจโปรเจกต์ก่อนแก้ไข
> **อ่านส่วนนี้ก่อนทำการเปลี่ยนแปลงใดๆ**

---

## Architecture

Static web app ที่ host บน GitHub Pages — ไม่มี backend, ไม่มี build step ปกติ
ข้อมูลทั้งหมดโหลดผ่าน `fetch()` จาก JSON files หรือจาก embedded data ใน offline bundle

```
pof/
├── index.html                    ← Primary entrypoint (GitHub Pages & dev server)
├── js/
│   ├── app.js                    ← Core logic: quiz engine, UI, state, search, analytics
│   └── storage.js                ← localStorage layer (session, mistakes, bookmarks, history)
├── data/
│   ├── subjects.json             ← Subject manifest (id, code, title, questionCount, file)
│   └── subjects/
│       ├── pof.json              ← Subject 081 — Principles of Flight (200 ข้อ)
│       ├── human_factors.json    ← Subject 040 — Human Performance (271 ข้อ)
│       ├── air_law.json          ← Subject 010 — Air Law (200 ข้อ)
│       └── meteorology.json      ← Subject 050 — Meteorology (200 ข้อ)
├── build_html.js                 ← Bundles index.html + data + JS → offline single-file HTML
├── PoF-QuestionBank-website.html ← AUTO-GENERATED offline bundle (do NOT edit directly)
├── AGENTS.md                     ← AI agent instructions (architecture + workflow rules)
└── README.md                     ← This file
```

---

## Source of Truth — What to Edit

| Task | File |
|------|------|
| HTML layout / CSS / UI structure | `index.html` |
| Quiz logic / features / interactions | `js/app.js` |
| localStorage / persistence | `js/storage.js` |
| Subject list (add/remove subject) | `data/subjects.json` |
| Question data | `data/subjects/<subject>.json` |
| Offline bundle | Run `node build_html.js` (never edit directly) |

### ⚠️ Critical Rules

1. **`index.html` = source of truth** for HTML/CSS — always edit this, not the bundle.
2. **`PoF-QuestionBank-website.html` is AUTO-GENERATED** — ห้ามแก้ตรงๆ จะถูก overwrite ทุกครั้งที่ build.
3. **หลังแก้ `index.html`, `js/`, หรือ `data/` ทุกครั้ง** — ต้อง run `node build_html.js` เพื่อ sync offline bundle.

---

## Subject Manifest Schema (`data/subjects.json`)

```jsonc
[
  {
    "id": "meteorology",       // unique ID (used as localStorage key prefix)
    "code": "050",             // EASA/ICAO subject code
    "title": "Subject 050 - Meteorology",
    "description": "...",      // shown on dashboard hero card
    "file": "./data/subjects/meteorology.json",
    "questionCount": 200
  }
]
```

---

## Question Data Schema (`data/subjects/*.json`)

```jsonc
{
  "id": 1,
  "question": "Which SI unit...",
  "options": ["kg/m³", "N", "Pa", "W/m²"],
  "answer": 0,                     // 0-indexed correct answer
  "correct": "kg/m³",              // correct option text (can be derived from options[answer])
  "topic": "081 01",               // LO chapter code
  "topicName": "Subsonic Aerodynamics",
  "LO": "081 01 01 01",
  "difficulty": "Easy",            // Easy | Medium | Hard
  "cognitive": "KNOW",             // KNOW | RECALL | UNDERSTAND | APPLY | ANALYSE
  "verb": "Identify",
  "explanation": "...",            // detailed explanation (Thai or English)
  "explanation_quick": "..."       // short one-liner (Quick Tip)
}
```

**Note:** ถ้า `correct` ไม่มี app จะ derive จาก `options[answer]` อัตโนมัติ

---

## How to Add a New Subject

1. วาง question JSON ไว้ที่ `data/subjects/<id>.json`
2. เพิ่ม entry ใน `data/subjects.json`
3. Run `node build_html.js`
4. Commit + push → GitHub Pages update อัตโนมัติ

```bash
node build_html.js
git add -A
git commit -m "feat: add Subject <code> <name>"
git push
```

---

## Key App State (app.js)

| Variable | Type | Description |
|----------|------|-------------|
| `app.subjects` | Array | Loaded from subjects.json |
| `app.currentSubject` | Object | Active subject metadata |
| `app.questions` | Array | All questions for active subject |
| `app.mode` | `'study'` or `'exam'` | Current quiz mode |
| `app.sessionQuestions` | Array | Questions in current session (shuffled) |
| `app.userAnswers` | Object | `{ questionId: selectedOptionIndex }` |
| `app.mistakes` | Set | Question IDs answered incorrectly |
| `app.bookmarks` | Set | Question IDs bookmarked by user |
| `app.examHistory` | Array | Past exam results for current subject |

---

## Key Element IDs (index.html)

| ID | Purpose |
|----|---------|
| `viewSetup` | Dashboard / setup view |
| `viewExam` | Active quiz view |
| `viewSummary` | Results & analytics view |
| `headerSubjectSelect` | Subject selector dropdown (header) |
| `dashboardSubjectSelect` | Subject selector dropdown (dashboard) |
| `explanationBox` | Explanation panel (shown after answering) |
| `btnNextQ` / `btnNextQBottom` | Next question buttons |
| `headerOverflowBtn` | `⋯` menu button |
| `headerMenuDot` | Red notification dot on `⋯` |
| `soundToggleBtn` | Audio on/off toggle |

---

## localStorage Key Prefixes (storage.js)

| Key | Content |
|-----|---------|
| `quiz_session_<subjectId>` | Active session state (auto-save/resume) |
| `quiz_mistakes_<subjectId>` | Set of question IDs answered wrong |
| `quiz_bookmarks_<subjectId>` | Set of bookmarked question IDs |
| `quiz_attempted_<subjectId>` | Set of attempted question IDs |
| `quiz_history_<subjectId>` | Array of past exam results |
| `quiz_theme` | `'dark'` or `'light'` |
| `quiz_font_size` | `'sm'` / `'normal'` / `'lg'` / `'xl'` |
| `quiz_sound_enabled` | `'true'` or `'false'` |

---

## Git Workflow

```bash
# แก้ไขใน index.html, js/app.js, js/storage.js หรือ data/
node build_html.js          # sync offline bundle
git add -A
git commit -m "feat/fix: <description>"
git push
```

GitHub Pages จะ deploy อัตโนมัติหลัง push ภายใน ~1 นาที

---

## App Version

Current: **v2.4.0** — ดูได้ที่ `app.version` และ `app.releaseDate` ใน `js/app.js`
