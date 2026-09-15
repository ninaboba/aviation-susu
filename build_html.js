const fs = require('fs');

const questionsData = fs.readFileSync('questions_data.json', 'utf8');
const donateQrBase64 = fs.existsSync('donate_qr.jpg')
  ? 'data:image/jpeg;base64,' + fs.readFileSync('donate_qr.jpg').toString('base64')
  : 'donate_qr.jpg';

const htmlContent = `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subject 081 Principles of Flight (Aeroplanes) - 200 MCQ Practice Bank</title>
  <meta name="description" content="CAAT Subject 081 Principles of Flight 200 MCQ interactive training application with Study & Exam modes, LO traceability, and detailed analytics.">

  <!-- Anti-FOUC theme & font size detector -->
  <script>
    (function() {
      const savedTheme = localStorage.getItem('pof_theme');
      if (savedTheme === 'light' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }

      const savedFontSize = localStorage.getItem('pof_font_size') || 'normal';
      document.documentElement.classList.add('font-size-' + savedFontSize);
    })();
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'Sarabun', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            cockpit: {
              950: 'var(--bg-cockpit-950)',
              900: 'var(--bg-cockpit-900)',
              850: 'var(--bg-cockpit-850)',
              800: 'var(--bg-cockpit-800)',
              700: 'var(--bg-cockpit-700)',
              border: 'var(--border-cockpit)',
              cyan: '#00d2ff',
              emerald: '#10b981',
              amber: '#f59e0b',
              rose: '#f43f5e',
            }
          },
          boxShadow: {
            'glow-cyan': '0 0 25px -5px rgba(0, 210, 255, 0.3)',
            'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
            'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg-cockpit-950: #f4f7fb;
      --bg-cockpit-900: #ffffff;
      --bg-cockpit-850: #f8fafc;
      --bg-cockpit-800: #e2e8f0;
      --bg-cockpit-700: #cbd5e1;
      --border-cockpit: #cbd5e1;
      --glass-panel-bg: rgba(255, 255, 255, 0.94);
      --glass-panel-border: rgba(203, 213, 225, 0.9);
      --glass-card-bg: rgba(248, 250, 252, 0.95);
      --glass-card-border: rgba(226, 232, 240, 0.95);
      --grid-line-color: rgba(0, 0, 0, 0.04);
      --scrollbar-track: #f1f5f9;
      --scrollbar-thumb: #cbd5e1;
      --scrollbar-hover: #94a3b8;
    }

    html.dark {
      --bg-cockpit-950: #060913;
      --bg-cockpit-900: #0c1222;
      --bg-cockpit-850: #111a30;
      --bg-cockpit-800: #162340;
      --bg-cockpit-700: #21335a;
      --border-cockpit: #1f2e4d;
      --glass-panel-bg: rgba(12, 18, 34, 0.85);
      --glass-panel-border: rgba(33, 51, 90, 0.7);
      --glass-card-bg: rgba(17, 26, 48, 0.65);
      --glass-card-border: rgba(31, 46, 77, 0.6);
      --grid-line-color: rgba(255, 255, 255, 0.03);
      --scrollbar-track: #0c1222;
      --scrollbar-thumb: #21335a;
      --scrollbar-hover: #3b82f6;
    }

    /* Custom scrollbar and animations */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-hover);
    }
    .glass-panel {
      background: var(--glass-panel-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-panel-border);
    }
    .glass-card {
      background: var(--glass-card-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--glass-card-border);
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.02); }
    }
    .animate-pulse-subtle {
      animation: pulse-slow 3s ease-in-out infinite;
    }
    .grid-pattern {
      background-size: 30px 30px;
      background-image: 
        linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out forwards;
    }

    /* ============================================================ */
    /* THEME SYSTEM: DARK MODE STYLES */
    /* ============================================================ */
    html.dark .review-card-correct {
      border-color: rgba(16, 185, 129, 0.4);
      background-color: rgba(6, 78, 59, 0.1);
    }
    html.dark .review-card-incorrect {
      border-color: rgba(244, 63, 94, 0.4);
      background-color: rgba(136, 19, 55, 0.1);
    }
    html.dark .review-correct-box {
      border-color: rgba(16, 185, 129, 0.6);
      background-color: rgba(6, 78, 59, 0.35);
      color: #a7f3d0;
    }
    html.dark .review-incorrect-box {
      border-color: rgba(244, 63, 94, 0.6);
      background-color: rgba(136, 19, 55, 0.35);
      color: #fecdd3;
    }
    html.dark .review-status-correct {
      background-color: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    html.dark .review-status-incorrect {
      background-color: rgba(244, 63, 94, 0.2);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.4);
    }
    html.dark .review-exp-box,
    html.dark .search-exp-box {
      background-color: rgba(12, 18, 34, 0.8);
      border: 1px solid #1f2e4d;
      color: #cbd5e1;
    }
    html.dark .exp-header {
      color: #22d3ee;
    }

    /* Dark Mode Search Options */
    html.dark .search-correct-option {
      border-color: rgba(16, 185, 129, 0.6);
      background-color: rgba(6, 78, 59, 0.35);
      color: #a7f3d0;
    }
    html.dark .search-correct-option .badge-letter {
      background-color: #10b981;
      color: #020617;
    }
    html.dark .search-correct-option .correct-tag {
      color: #34d399;
    }
    html.dark .search-normal-option {
      border-color: rgba(31, 46, 77, 0.8);
      background-color: rgba(12, 18, 34, 0.6);
      color: #cbd5e1;
    }
    html.dark .search-normal-option .badge-letter {
      background-color: #162340;
      color: #94a3b8;
    }

    /* Dark Mode Badges */
    html.dark .search-badge-id {
      background-color: rgba(6, 182, 212, 0.2);
      color: #22d3ee;
      border: 1px solid rgba(8, 145, 178, 0.6);
    }
    html.dark .search-badge-topic {
      background-color: #111a30;
      color: #cbd5e1;
      border: 1px solid #1f2e4d;
    }
    html.dark .search-badge-lo {
      background-color: rgba(30, 58, 138, 0.5);
      color: #93c5fd;
      border: 1px solid rgba(29, 78, 216, 0.5);
    }
    html.dark .search-badge-diff {
      background-color: rgba(6, 78, 59, 0.5);
      color: #6ee7b7;
      border: 1px solid rgba(5, 150, 105, 0.5);
    }
    html.dark .search-badge-mistake {
      background-color: rgba(136, 19, 55, 0.5);
      color: #fb7185;
      border: 1px solid rgba(225, 29, 72, 0.5);
    }
    html.dark mark,
    html.dark .search-highlight {
      background-color: rgba(6, 182, 212, 0.3);
      color: #a5f3fc;
      border: 1px solid rgba(34, 211, 238, 0.5);
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
    }

    /* ============================================================ */
    /* THEME SYSTEM: LIGHT MODE STYLES */
    /* ============================================================ */
    html:not(.dark) {
      color-scheme: light;
    }
    html:not(.dark) body {
      color: #0f172a;
    }
    html:not(.dark) h1, 
    html:not(.dark) h2, 
    html:not(.dark) h3, 
    html:not(.dark) h4,
    html:not(.dark) h5,
    html:not(.dark) h6 {
      color: #0f172a !important;
    }
    html:not(.dark) label {
      color: #0f172a !important;
    }
    html:not(.dark) p {
      color: #334155 !important;
    }

    /* All text-slate-xxx utility overrides in Light Mode */
    html:not(.dark) .text-slate-100 {
      color: #0f172a !important;
    }
    html:not(.dark) .text-slate-200 {
      color: #1e293b !important;
    }
    html:not(.dark) .text-slate-300 {
      color: #334155 !important;
    }
    html:not(.dark) .text-slate-400 {
      color: #475569 !important;
    }
    html:not(.dark) .text-slate-500 {
      color: #64748b !important;
    }
    html:not(.dark) .text-slate-600 {
      color: #475569 !important;
    }
    html:not(.dark) .text-slate-700 {
      color: #334155 !important;
    }
    html:not(.dark) .text-white {
      color: #0f172a !important;
    }

    /* Modal Backdrop */
    html:not(.dark) .bg-cockpit-950\/80,
    html:not(.dark) .bg-cockpit-950\/85 {
      background-color: rgba(15, 23, 42, 0.6) !important;
    }

    /* Inputs & Selects */
    html:not(.dark) select,
    html:not(.dark) input[type="text"] {
      background-color: #ffffff !important;
      color: #0f172a !important;
      border-color: #cbd5e1 !important;
    }
    html:not(.dark) input[type="text"]::placeholder {
      color: #94a3b8 !important;
    }

    /* Solid & Gradient Action Buttons (Always White text) */
    html:not(.dark) #btnFinishExam,
    html:not(.dark) #btnFinishExam *,
    html:not(.dark) #btnNextQ,
    html:not(.dark) #btnNextQ *,
    html:not(.dark) #btnRetrySessionMistakes,
    html:not(.dark) #btnRetrySessionMistakes *,
    html:not(.dark) #searchActionButtons button,
    html:not(.dark) #searchActionButtons button *,
    html:not(.dark) #badgeModeExam,
    html:not(.dark) .bg-emerald-600,
    html:not(.dark) .bg-rose-600,
    html:not(.dark) .bg-blue-600,
    html:not(.dark) .bg-gradient-to-tr,
    html:not(.dark) header .w-10.h-10 i {
      color: #ffffff !important;
    }

    /* Start Practice Button */
    html:not(.dark) #btnStartExam {
      color: #020617 !important;
    }
    html:not(.dark) #btnStartExam span,
    html:not(.dark) #btnStartExam i {
      color: #020617 !important;
    }

    /* Check Answer Button */
    html:not(.dark) #btnCheckStudy {
      background-color: #0284c7 !important;
      color: #ffffff !important;
    }
    html:not(.dark) #btnCheckStudy:hover {
      background-color: #0369a1 !important;
    }

    /* Header Logo text */
    html:not(.dark) header .w-10.h-10 {
      color: #ffffff !important;
    }

    /* Question Quantity Display & Notices */
    html:not(.dark) #questionCountDisplay {
      background-color: #e0f2fe !important;
      color: #0284c7 !important;
      border-color: #7dd3fc !important;
    }
    html:not(.dark) #matchingCountNotice {
      color: #0f172a !important;
    }
    html:not(.dark) #estimatedTimeNotice {
      color: #64748b !important;
    }

    /* Preset Buttons on Slider */
    html:not(.dark) button[onclick*="setCountPreset"] {
      background-color: #ffffff !important;
      border-color: #cbd5e1 !important;
      color: #1e293b !important;
    }
    html:not(.dark) button[onclick*="setCountPreset"]:hover {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
    }

    /* Target Options Switches & Cards */
    html:not(.dark) #toggleMistakesOnly ~ div,
    html:not(.dark) #toggleBookmarksOnly ~ div {
      background-color: #cbd5e1 !important;
    }
    html:not(.dark) #toggleMistakesOnly:checked ~ div {
      background-color: #f43f5e !important;
    }
    html:not(.dark) #toggleBookmarksOnly:checked ~ div {
      background-color: #f59e0b !important;
    }

    /* Question Badges in Exam Screen */
    html:not(.dark) #questionPromptText {
      color: #0f172a !important;
    }
    html:not(.dark) #badgeQuestionId {
      background-color: #f1f5f9 !important;
      color: #334155 !important;
      border-color: #cbd5e1 !important;
    }
    html:not(.dark) #badgeLO {
      background-color: #eff6ff !important;
      color: #1d4ed8 !important;
      border-color: #bfdbfe !important;
    }
    html:not(.dark) #badgeDifficulty {
      background-color: #ecfdf5 !important;
      color: #047857 !important;
      border-color: #a7f3d0 !important;
    }
    html:not(.dark) #badgeCognitive {
      background-color: #faf5ff !important;
      color: #7e22ce !important;
      border-color: #e9d5ff !important;
    }
    html:not(.dark) #examActiveModeBadge {
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      border-color: #7dd3fc !important;
    }
    html:not(.dark) #currentQuestionNumBadge {
      color: #0284c7 !important;
    }
    html:not(.dark) #liveTimerText {
      color: #0f172a !important;
    }

    /* Mode Selection Badges */
    html:not(.dark) #badgeModeStudy {
      background-color: #06b6d4 !important;
      color: #020617 !important;
    }
    html:not(.dark) #badgeModeExam {
      background-color: #2563eb !important;
      color: #ffffff !important;
    }

    /* Option Cards in Practice Screen */
    html:not(.dark) #optionsContainer > div:not(.border-cyan-400):not(.border-emerald-500):not(.border-rose-500) {
      background-color: #ffffff !important;
      border-color: #cbd5e1 !important;
      color: #1e293b !important;
    }
    html:not(.dark) #optionsContainer > div:not(.border-cyan-400):not(.border-emerald-500):not(.border-rose-500) > div:first-child {
      background-color: #f1f5f9 !important;
      color: #475569 !important;
    }
    html:not(.dark) #optionsContainer > div.border-cyan-400 {
      background-color: #f0f9ff !important;
      border-color: #0284c7 !important;
      color: #0c4a6e !important;
    }
    html:not(.dark) #optionsContainer > div.border-cyan-400 > div:first-child {
      background-color: #0284c7 !important;
      color: #ffffff !important;
    }
    html:not(.dark) #optionsContainer > div.border-emerald-500 {
      background-color: #ecfdf5 !important;
      border-color: #10b981 !important;
      color: #064e3b !important;
    }
    html:not(.dark) #optionsContainer > div.border-emerald-500 > div:first-child {
      background-color: #10b981 !important;
      color: #ffffff !important;
    }
    html:not(.dark) #optionsContainer > div.border-rose-500 {
      background-color: #fff1f2 !important;
      border-color: #f43f5e !important;
      color: #881337 !important;
    }
    html:not(.dark) #optionsContainer > div.border-rose-500 > div:first-child {
      background-color: #f43f5e !important;
      color: #ffffff !important;
    }

    /* Explanation Panel */
    html:not(.dark) #explanationBox {
      background-color: #f8fafc !important;
      border-color: #7dd3fc !important;
    }
    html:not(.dark) #explanationText {
      color: #1e293b !important;
    }

    /* Topic Grid Items */
    html:not(.dark) #topicGridContainer label {
      background-color: #ffffff !important;
      border-color: #cbd5e1 !important;
    }
    html:not(.dark) #topicGridContainer label:hover {
      background-color: #f8fafc !important;
      border-color: #94a3b8 !important;
    }
    html:not(.dark) #topicGridContainer p {
      color: #1e293b !important;
    }
    html:not(.dark) #topicGridContainer .text-cyan-300 {
      color: #0284c7 !important;
    }

    /* Light Mode Review Cards */
    html:not(.dark) .review-card-correct {
      border-color: #a7f3d0 !important;
      background-color: #ffffff !important;
    }
    html:not(.dark) .review-card-incorrect {
      border-color: #fecdd3 !important;
      background-color: #ffffff !important;
    }
    html:not(.dark) .review-id-badge.text-emerald-400 {
      color: #047857 !important;
    }
    html:not(.dark) .review-id-badge.text-rose-400 {
      color: #be123c !important;
    }
    html:not(.dark) .review-correct-box {
      border-color: #10b981 !important;
      background-color: #ecfdf5 !important;
      color: #064e3b !important;
    }
    html:not(.dark) .review-correct-box * {
      color: #064e3b !important;
    }
    html:not(.dark) .review-incorrect-box {
      border-color: #f43f5e !important;
      background-color: #fff1f2 !important;
      color: #881337 !important;
    }
    html:not(.dark) .review-incorrect-box * {
      color: #881337 !important;
    }
    html:not(.dark) .review-status-correct {
      background-color: #d1fae5 !important;
      color: #047857 !important;
      border: 1px solid #6ee7b7 !important;
    }
    html:not(.dark) .review-status-incorrect {
      background-color: #ffe4e6 !important;
      color: #be123c !important;
      border: 1px solid #fda4af !important;
    }
    html:not(.dark) .review-exp-box,
    html:not(.dark) .search-exp-box {
      background-color: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      color: #1e293b !important;
    }
    html:not(.dark) .review-exp-box p,
    html:not(.dark) .search-exp-box p {
      color: #334155 !important;
    }
    html:not(.dark) .exp-header {
      color: #0284c7 !important;
    }

    /* Light Mode Search Options */
    html:not(.dark) .search-correct-option {
      border-color: #10b981 !important;
      background-color: #ecfdf5 !important;
      color: #064e3b !important;
    }
    html:not(.dark) .search-correct-option * {
      color: #064e3b !important;
    }
    html:not(.dark) .search-correct-option .badge-letter {
      background-color: #10b981 !important;
      color: #ffffff !important;
    }
    html:not(.dark) .search-correct-option .correct-tag {
      color: #047857 !important;
    }
    html:not(.dark) .search-normal-option {
      border-color: #cbd5e1 !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
    }
    html:not(.dark) .search-normal-option * {
      color: #0f172a !important;
    }
    html:not(.dark) .search-normal-option .badge-letter {
      background-color: #f1f5f9 !important;
      color: #334155 !important;
    }

    /* Light Mode Badges */
    html:not(.dark) .search-badge-id {
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      border: 1px solid #7dd3fc !important;
    }
    html:not(.dark) .search-badge-topic {
      background-color: #f8fafc !important;
      color: #1e293b !important;
      border: 1px solid #cbd5e1 !important;
    }
    html:not(.dark) .search-badge-lo {
      background-color: #eff6ff !important;
      color: #1d4ed8 !important;
      border: 1px solid #bfdbfe !important;
    }
    html:not(.dark) .search-badge-diff {
      background-color: #ecfdf5 !important;
      color: #047857 !important;
      border: 1px solid #a7f3d0 !important;
    }
    html:not(.dark) .search-badge-mistake {
      background-color: #fff1f2 !important;
      color: #be123c !important;
      border: 1px solid #fecdd3 !important;
    }
    html:not(.dark) mark,
    html:not(.dark) .search-highlight {
      background-color: #fef08a !important;
      color: #713f12 !important;
      border: 1px solid #facc15 !important;
      font-weight: 700 !important;
      padding: 1px 4px !important;
      border-radius: 3px !important;
    }

    /* Search Scope Active Tab */
    html:not(.dark) #searchScopeTab_all.bg-cyan-600,
    html:not(.dark) #searchScopeTab_question.bg-cyan-600,
    html:not(.dark) #searchScopeTab_correct.bg-cyan-600,
    html:not(.dark) #searchScopeTab_explanation.bg-cyan-600 {
      background-color: #0284c7 !important;
      color: #ffffff !important;
    }

    /* Question Palette Buttons */
    html:not(.dark) #paletteGridButtons button {
      border-color: #cbd5e1 !important;
    }
    html:not(.dark) #paletteGridButtons .bg-emerald-500 {
      background-color: #10b981 !important;
      color: #ffffff !important;
    }
    html:not(.dark) #paletteGridButtons .bg-amber-500 {
      background-color: #f59e0b !important;
      color: #ffffff !important;
    }
    html:not(.dark) #paletteGridButtons .bg-cockpit-800 {
      background-color: #f1f5f9 !important;
      color: #475569 !important;
    }

    /* Summary & Review Screen */
    html:not(.dark) #summaryScoreCircle {
      background-color: #ffffff !important;
    }
    html:not(.dark) #summaryPercentScore {
      color: #0f172a !important;
    }
    html:not(.dark) #summaryFractionScore {
      color: #475569 !important;
    }
    html:not(.dark) #summaryTimeTaken {
      color: #0284c7 !important;
    }
    html:not(.dark) #summaryCorrectCount {
      color: #047857 !important;
    }
    html:not(.dark) #summaryIncorrectCount {
      color: #be123c !important;
    }
    html:not(.dark) #summaryUnansweredCount {
      color: #475569 !important;
    }
    html:not(.dark) #reviewQuestionsContainer .glass-card {
      background-color: #ffffff !important;
      border-color: #e2e8f0 !important;
    }
    html:not(.dark) #reviewQuestionsContainer h4 {
      color: #0f172a !important;
    }

    /* Review Tabs */
    html:not(.dark) #tabReviewAll.bg-cyan-600,
    html:not(.dark) #tabReviewIncorrect.bg-cyan-600,
    html:not(.dark) #tabReviewCorrect.bg-cyan-600,
    html:not(.dark) #tabReviewFlagged.bg-cyan-600 {
      background-color: #0284c7 !important;
      color: #ffffff !important;
    }

    /* Header Counters & Stats */
    html:not(.dark) #headerMistakeCount {
      color: #e11d48 !important;
    }
    html:not(.dark) #headerBookmarkCount {
      color: #d97706 !important;
    }
    html:not(.dark) #heroAvgScore {
      color: #d97706 !important;
    }

    /* Keyboard kbd helper */
    html:not(.dark) kbd {
      background-color: #f1f5f9 !important;
      color: #475569 !important;
      border-color: #cbd5e1 !important;
    }

    /* Donation Card & Pagination Light Mode */
    html:not(.dark) #donationCard {
      background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%) !important;
      border-color: #fcd34d !important;
    }
    html:not(.dark) #donationCard h3 {
      color: #78350f !important;
    }
    html:not(.dark) #donationCard p {
      color: #451a03 !important;
    }
    html:not(.dark) .pagination-btn-active {
      background-color: #0284c7 !important;
      color: #ffffff !important;
      border-color: #0284c7 !important;
    }
    html:not(.dark) .pagination-btn-inactive {
      background-color: #ffffff !important;
      color: #334155 !important;
      border-color: #cbd5e1 !important;
    }
    html:not(.dark) .pagination-btn-inactive:hover {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
    }

    /* ============================================================ */
    /* FONT SIZE SCALING SYSTEM */
    /* ============================================================ */
    :root {
      --font-prompt: 1.25rem;
      --font-option: 0.9375rem;
      --font-exp: 0.875rem;
    }

    html.font-size-sm {
      --font-prompt: 1.05rem;
      --font-option: 0.8125rem;
      --font-exp: 0.8rem;
    }

    html.font-size-normal {
      --font-prompt: 1.25rem;
      --font-option: 0.9375rem;
      --font-exp: 0.875rem;
    }

    html.font-size-lg {
      --font-prompt: 1.45rem;
      --font-option: 1.1rem;
      --font-exp: 1.025rem;
    }

    html.font-size-xl {
      --font-prompt: 1.7rem;
      --font-option: 1.25rem;
      --font-exp: 1.15rem;
    }

    /* Exam Mode Question Area */
    #questionPromptText {
      font-size: var(--font-prompt) !important;
      line-height: 1.6 !important;
    }
    #optionsContainer .leading-relaxed {
      font-size: var(--font-option) !important;
      line-height: 1.55 !important;
    }
    #explanationText {
      font-size: var(--font-exp) !important;
      line-height: 1.65 !important;
    }

    /* Review Screen */
    #reviewQuestionsContainer h4 {
      font-size: var(--font-prompt) !important;
      line-height: 1.55 !important;
    }
    #reviewQuestionsContainer .review-correct-box,
    #reviewQuestionsContainer .review-incorrect-box,
    #reviewQuestionsContainer .review-exp-box p {
      font-size: var(--font-option) !important;
      line-height: 1.55 !important;
    }

    /* Search Results Modal */
    #searchResultsContainer h4 {
      font-size: var(--font-prompt) !important;
      line-height: 1.5 !important;
    }
    #searchResultsContainer .search-correct-option,
    #searchResultsContainer .search-normal-option,
    #searchResultsContainer .search-exp-box p {
      font-size: var(--font-option) !important;
      line-height: 1.5 !important;
    }
  </style>
</head>

<body class="bg-cockpit-950 text-slate-100 min-h-screen font-sans antialiased grid-pattern selection:bg-cyan-500 selection:text-white flex flex-col justify-between transition-colors duration-200">

  <!-- APP HEADER -->
  <header class="sticky top-0 z-40 border-b border-cockpit-border glass-panel transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo & Subject Badge -->
      <div class="flex items-center space-x-3 cursor-pointer" onclick="app.goHome()">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-glow-cyan text-white">
          <i data-lucide="plane" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">SUBJECT 081</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">POF (Aeroplanes)</span>
          </div>
          <p class="text-xs text-slate-400 font-medium">CAAT / EASA 200 MCQ Bank</p>
        </div>
      </div>

      <!-- Right Controls: Search, Theme Toggle, Sound Toggle, Mistakes Badge, Bookmarks -->
      <div class="flex items-center space-x-1.5 sm:space-x-2.5">
        <!-- Search Button in Header -->
        <button onclick="app.openSearchModal()" class="px-3 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-cyan-400 border border-cockpit-border transition text-xs font-mono flex items-center space-x-1.5 shadow-sm group" title="Search Questions (Ctrl + K)">
          <i data-lucide="search" class="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform"></i>
          <span class="font-sans font-medium text-slate-200 hidden xs:inline">Search</span>
          <span class="hidden sm:inline-block px-1.5 py-0.2 rounded bg-cockpit-900 border border-cockpit-border text-[10px] text-slate-400 font-mono">Ctrl+K</span>
        </button>

        <!-- Light / Dark Theme Toggle Button -->
        <button id="themeToggleBtn" onclick="app.toggleTheme()" class="p-2 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-amber-400 border border-cockpit-border transition text-xs flex items-center justify-center" title="Toggle Light / Dark Mode">
          <i id="themeIcon" data-lucide="sun" class="w-4 h-4 text-amber-400"></i>
        </button>

        <!-- Audio Toggle -->
        <button id="soundToggleBtn" onclick="app.toggleSound()" class="p-2 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-cyan-400 border border-cockpit-border transition text-xs flex items-center space-x-1" title="Toggle Sound">
          <i id="soundIcon" data-lucide="volume-2" class="w-4 h-4"></i>
        </button>

        <!-- Font Size Cycle Button -->
        <button id="fontSizeHeaderBtn" onclick="app.cycleFontSize()" class="px-2.5 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-cyan-400 border border-cockpit-border transition text-xs font-mono flex items-center space-x-1.5 shadow-sm active:scale-95" title="ปรับขนาดตัวอักษร (คลิกเพื่อเปลี่ยนขนาด: 90% / 100% / 115% / 130%)">
          <i data-lucide="type" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span id="fontSizeHeaderBadge" class="text-[11px] font-bold text-cyan-300">100%</span>
        </button>

        <!-- Stored Mistakes Counter -->
        <button onclick="app.openMistakesManager()" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 border border-cockpit-border transition text-xs font-mono flex items-center space-x-1.5" title="View Mistake Bank">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span class="hidden sm:inline">Mistakes:</span>
          <span id="headerMistakeCount" class="text-rose-400 font-bold">0</span>
        </button>

        <!-- Bookmarks Counter -->
        <button onclick="app.openBookmarksManager()" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 border border-cockpit-border transition text-xs font-mono flex items-center space-x-1.5" title="View Flagged Questions">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-400"></i>
          <span id="headerBookmarkCount" class="text-amber-400 font-bold">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN VIEWPORT CONTAINER -->
  <main id="mainContainer" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">

    <!-- ============================================================ -->
    <!-- VIEW 1: SETUP / DASHBOARD SCREEN -->
    <!-- ============================================================ -->
    <section id="viewSetup" class="space-y-6">
      
      <!-- HERO BANNER -->
      <div class="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-cockpit-border">
        <div class="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              <span>CAAT LO Traceability (TCAR PEL Part-FCL Revision 2025)</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Principles of Flight — Examination Trainer
            </h1>
            <p class="text-sm text-slate-300 max-w-2xl leading-relaxed">
              ชุดข้อสอบ 200 ข้อพร้อมระบบสุ่มคำตอบแบบ <span class="text-cyan-400 font-medium">Fisher-Yates Shuffle</span>, เฉลยละเอียดแยกตามบทเรียน (081 01 ถึง 081 08), ระบบจับเวลา และการวิเคราะห์ผลลัพธ์เพื่อเตรียมสอบอย่างมั่นใจ
            </p>
          </div>

          <!-- Overall Quick Metric Cards -->
          <div class="grid grid-cols-3 gap-3 shrink-0">
            <div class="bg-cockpit-850/80 p-3.5 rounded-xl border border-cockpit-border text-center">
              <span class="text-xs text-slate-400 block font-medium">Bank Total</span>
              <span class="text-xl font-bold font-mono text-cyan-400">200</span>
              <span class="text-[10px] text-slate-500 block">Questions</span>
            </div>
            <div class="bg-cockpit-850/80 p-3.5 rounded-xl border border-cockpit-border text-center">
              <span class="text-xs text-slate-400 block font-medium">Pass Mark</span>
              <span class="text-xl font-bold font-mono text-emerald-400">75%</span>
              <span class="text-[10px] text-slate-500 block">CAAT Standard</span>
            </div>
            <div class="bg-cockpit-850/80 p-3.5 rounded-xl border border-cockpit-border text-center">
              <span class="text-xs text-slate-400 block font-medium">Avg Score</span>
              <span id="heroAvgScore" class="text-xl font-bold font-mono text-amber-400">-%</span>
              <span id="heroExamCount" class="text-[10px] text-slate-500 block">0 Tests</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PRACTICE CONFIGURATION FORM -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- LEFT 2 COLUMNS: FILTERS & SETTINGS -->
        <div class="lg:col-span-2 space-y-6">

          <!-- 1. MODE SELECTION CARDS -->
          <div class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-4">
            <label class="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span class="flex items-center space-x-2">
                <i data-lucide="sliders" class="w-4 h-4 text-cyan-400"></i>
                <span>1. เลือกระบบการทำข้อสอบ (Practice Mode)</span>
              </span>
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Study Mode Option -->
              <div id="modeCardStudy" onclick="app.setMode('study')" class="cursor-pointer p-4 rounded-xl border-2 transition-all relative glass-card hover:border-cyan-500 border-cyan-500 bg-cyan-950/20 shadow-glow-cyan">
                <div class="flex items-start justify-between">
                  <div class="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 mb-2">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                  </div>
                  <span id="badgeModeStudy" class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold">Selected</span>
                </div>
                <h3 class="font-bold text-white text-base">Study Mode (โหมดเรียนรู้)</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  ตรวจคำตอบได้ทันทีทีละข้อ พร้อมอ่านคำอธิบาย (Explanation) และ Learning Objective ละเอียด เหมาะสำหรับการทบทวนเนื้อหา
                </p>
              </div>

              <!-- Exam Mode Option -->
              <div id="modeCardExam" onclick="app.setMode('exam')" class="cursor-pointer p-4 rounded-xl border-2 transition-all relative glass-card hover:border-blue-500 border-cockpit-border bg-cockpit-850/40">
                <div class="flex items-start justify-between">
                  <div class="p-2 rounded-lg bg-blue-500/20 text-blue-300 mb-2">
                    <i data-lucide="timer" class="w-5 h-5"></i>
                  </div>
                  <span id="badgeModeExam" class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold hidden">Selected</span>
                </div>
                <h3 class="font-bold text-white text-base">Exam Mode (โหมดสอบจริง)</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  จำลองการสอบแบบจับเวลา ไม่แสดงเฉลยระหว่างทำ สามารถ Flag ข้อที่ติดไว้ได้ แล้วสรุปคะแนนพร้อม Analytics เมื่อกดส่งข้อสอบ
                </p>
              </div>
            </div>
          </div>

          <!-- 2. TOPIC SELECTION -->
          <div class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <label class="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
                <span>2. เลือกหมวดวิชา (Subject 081 Topics)</span>
              </label>
              <div class="flex items-center space-x-2">
                <button type="button" onclick="app.selectAllTopics(true)" class="text-[11px] text-cyan-400 hover:underline">Select All</button>
                <span class="text-slate-600">•</span>
                <button type="button" onclick="app.selectAllTopics(false)" class="text-[11px] text-slate-400 hover:underline">Clear</button>
              </div>
            </div>

            <!-- Topic Grid Checkboxes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="topicGridContainer">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- 3. QUESTION COUNT & DIFFICULTY -->
          <div class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <i data-lucide="hash" class="w-4 h-4 text-cyan-400"></i>
                <span>3. จำนวนข้อสอบ (Question Quantity)</span>
              </label>
              <span id="questionCountDisplay" class="font-mono text-cyan-400 font-bold text-lg bg-cyan-950/60 px-3 py-0.5 rounded-lg border border-cyan-800/60">
                20 ข้อ
              </span>
            </div>

            <!-- Slider -->
            <div class="space-y-2">
              <input type="range" id="countSlider" min="5" max="200" step="1" value="20" oninput="app.updateQuestionCount(this.value)" class="w-full h-2 bg-cockpit-800 rounded-lg appearance-none cursor-pointer accent-cyan-400">
              <div class="flex justify-between text-[11px] font-mono text-slate-400">
                <span>5 ข้อ</span>
                <span>50 ข้อ</span>
                <span>100 ข้อ</span>
                <span id="maxAvailableLabel" onclick="app.setCountPreset('max')" class="cursor-pointer hover:text-cyan-400 transition" title="คลิกเพื่อเลือกจำนวนข้อทั้งหมด (Max)">200 ข้อ</span>
              </div>
            </div>

            <!-- Preset Buttons -->
            <div class="flex flex-wrap gap-2 pt-1">
              <button type="button" onclick="app.setCountPreset(10)" class="px-3 py-1 text-xs rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 font-mono">10 ข้อ</button>
              <button type="button" onclick="app.setCountPreset(20)" class="px-3 py-1 text-xs rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 font-mono">20 ข้อ (Quick)</button>
              <button type="button" onclick="app.setCountPreset(50)" class="px-3 py-1 text-xs rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 font-mono">50 ข้อ (Medium)</button>
              <button type="button" onclick="app.setCountPreset(60)" class="px-3 py-1 text-xs rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 font-mono">60 ข้อ (Standard Exam)</button>
              <button type="button" onclick="app.setCountPreset('max')" class="px-3 py-1 text-xs rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 font-mono">Max (ทั้งหมด)</button>
            </div>
          </div>

        </div>

        <!-- RIGHT 1 COLUMN: SPECIAL FILTERS & START ACTION -->
        <div class="space-y-6">

          <!-- SPECIAL MODES / FILTERS -->
          <div class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-4">
            <h3 class="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <i data-lucide="target" class="w-4 h-4 text-cyan-400"></i>
              <span>ตัวเลือกเสริม (Target Options)</span>
            </h3>

            <!-- Retry Mistakes Only Toggle -->
            <div class="p-3.5 rounded-xl border border-cockpit-border bg-cockpit-850/50 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-white block">Retry Mistakes Only</span>
                <span class="text-[11px] text-slate-400">ทำเฉพาะข้อที่เคยตอบผิด (<span id="panelMistakeCount" class="text-rose-400 font-bold">0</span> ข้อ)</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="toggleMistakesOnly" onchange="app.handleMistakesToggle(this.checked)" class="sr-only peer">
                <div class="w-9 h-5 bg-cockpit-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            <!-- Bookmarked Only Toggle -->
            <div class="p-3.5 rounded-xl border border-cockpit-border bg-cockpit-850/50 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-white block">Bookmarked Only</span>
                <span class="text-[11px] text-slate-400">ทำเฉพาะข้อที่ติดดาวไว้ (<span id="panelBookmarkCount" class="text-amber-400 font-bold">0</span> ข้อ)</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="toggleBookmarksOnly" onchange="app.handleBookmarksToggle(this.checked)" class="sr-only peer">
                <div class="w-9 h-5 bg-cockpit-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <!-- Difficulty Filter -->
            <div class="space-y-1.5 pt-1">
              <label class="text-xs text-slate-300 font-medium">ระดับความยาก (Difficulty Level):</label>
              <select id="selectDifficulty" onchange="app.updateFilterCounts()" class="w-full bg-cockpit-850 border border-cockpit-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
                <option value="All">All Difficulties (ทั้งหมด 200 ข้อ)</option>
                <option value="Easy">Easy Only (74 ข้อ)</option>
                <option value="Medium">Medium Only (97 ข้อ)</option>
                <option value="Hard">Hard Only (29 ข้อ)</option>
              </select>
            </div>

            <!-- Shuffle Question Sequence -->
            <div class="p-3 rounded-xl border border-cockpit-border bg-cockpit-850/50 flex items-center justify-between">
              <span class="text-xs text-slate-300">สลับลำดับข้อ (Shuffle Questions)</span>
              <input type="checkbox" id="toggleShuffleQuestions" checked class="w-4 h-4 rounded text-cyan-500 bg-cockpit-700 border-cockpit-border focus:ring-cyan-500">
            </div>

          </div>

          <!-- SUMMARY & START BUTTON -->
          <div class="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-cockpit-900 space-y-4">
            <div class="space-y-1 text-center">
              <span class="text-xs text-cyan-400 font-mono tracking-wider uppercase font-semibold">Ready to test</span>
              <div class="text-2xl font-black text-white font-mono" id="matchingCountNotice">20 Questions Selected</div>
              <p class="text-[11px] text-slate-400" id="estimatedTimeNotice">Estimated time: ~20 mins (1 min/Q)</p>
            </div>

            <!-- Big Start Button -->
            <button id="btnStartExam" onclick="app.startPracticeSession()" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center space-x-2">
              <i data-lucide="play" class="w-5 h-5 fill-current"></i>
              <span>START PRACTICE</span>
            </button>

            <div class="text-[11px] text-center text-slate-400 font-mono flex items-center justify-center space-x-1">
              <i data-lucide="shuffle" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>Fisher-Yates option shuffle active</span>
            </div>
          </div>

          <!-- SEARCH BANK QUICK ACTION CARD -->
          <div onclick="app.openSearchModal()" class="cursor-pointer glass-card p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/20 transition-all flex items-center justify-between group shadow-sm">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                <i data-lucide="search" class="w-4 h-4"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white group-hover:text-cyan-300 transition">ค้นหาคลังข้อสอบ (Search Bank)</div>
                <div class="text-[11px] text-slate-400">ค้นหาจากโจทย์ เฉลย หรือคำอธิบาย 200 ข้อ</div>
              </div>
            </div>
            <div class="flex items-center space-x-1 text-xs font-mono text-cyan-400 bg-cockpit-900 px-2 py-1 rounded border border-cockpit-border">
              <span>Ctrl+K</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </div>
          </div>

          <!-- STATS & STORAGE ACTIONS -->
          <div class="glass-card p-4 rounded-xl text-center space-y-2 text-xs text-slate-400">
            <div class="flex justify-between items-center px-2">
              <span>Exam History: <strong class="text-slate-200" id="historyCountText">0</strong> records</span>
              <button onclick="app.clearAllData()" class="text-rose-400 hover:underline">Reset Progress</button>
            </div>
          </div>

        </div>

      </div>

    </section>

    <!-- ============================================================ -->
    <!-- VIEW 2: EXAM / PRACTICE ACTIVE SCREEN -->
    <!-- ============================================================ -->
    <section id="viewExam" class="hidden space-y-6">

      <!-- TOP CONTROL & STATUS BAR -->
      <div class="glass-panel p-4 rounded-2xl border border-cockpit-border flex flex-wrap items-center justify-between gap-4">
        
        <!-- Left: Question Tracker & Mode Badge -->
        <div class="flex items-center space-x-3">
          <button onclick="app.confirmExitExam()" class="p-2 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-rose-400 transition" title="Exit to Menu">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <div class="flex items-center space-x-2">
              <span id="currentQuestionNumBadge" class="text-lg font-bold font-mono text-cyan-400">Q 1 / 20</span>
              <span id="examActiveModeBadge" class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">STUDY MODE</span>
            </div>
            <div class="text-[11px] text-slate-400 font-mono" id="topicBreadcrumb">081 01 Subsonic Aerodynamics</div>
          </div>
        </div>

        <!-- Center: Progress Bar -->
        <div class="flex-grow max-w-md hidden md:block">
          <div class="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Progress</span>
            <span id="progressPercentText">5%</span>
          </div>
          <div class="w-full bg-cockpit-800 rounded-full h-2 overflow-hidden border border-cockpit-border">
            <div id="progressBarFill" class="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style="width: 5%"></div>
          </div>
        </div>

        <!-- Right: Timer, Bookmark Button, Question Grid Launcher, Finish Button -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          
          <!-- Timer Box -->
          <div class="px-3 py-1.5 rounded-lg bg-cockpit-850 border border-cockpit-border flex items-center space-x-2 font-mono text-sm">
            <i data-lucide="clock" class="w-4 h-4 text-cyan-400"></i>
            <span id="liveTimerText" class="font-bold text-slate-100">00:00</span>
          </div>

          <!-- Flag / Bookmark Button -->
          <button id="btnBookmark" onclick="app.toggleBookmarkCurrent()" class="p-2 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-400 transition" title="Flag / Bookmark this question (Shortcut: Space in Exam mode)">
            <i id="bookmarkIcon" data-lucide="bookmark" class="w-4 h-4"></i>
          </button>

          <!-- Question Grid Modal Launcher -->
          <button onclick="app.toggleGridDrawer(true)" class="p-2 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-300 hover:text-cyan-400 transition" title="Open Question Palette">
            <i data-lucide="grid" class="w-4 h-4"></i>
          </button>

          <!-- Submit / Finish Button -->
          <button id="btnFinishExam" onclick="app.confirmFinishExam()" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition flex items-center space-x-1">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>SUBMIT</span>
          </button>

        </div>

      </div>

      <!-- QUESTION CARD -->
      <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-cockpit-border relative space-y-6">
        
        <!-- Metadata Badges -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cockpit-border/60">
          <div class="flex flex-wrap items-center gap-2">
            <span id="badgeQuestionId" class="px-2.5 py-1 rounded-md bg-cockpit-850 border border-cockpit-border text-slate-300 text-xs font-mono font-semibold">Bank ID: #1</span>
            <span id="badgeLO" class="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-mono font-medium">LO: 081 01 01 01</span>
            <span id="badgeDifficulty" class="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-medium">Easy</span>
            <span id="badgeCognitive" class="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono font-medium">KNOW</span>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Answer Status Pill in Study Mode -->
            <div id="studyAnswerStatusPill" class="hidden text-xs font-mono px-3 py-0.5 rounded-full font-bold"></div>

            <!-- In-card Quick Font Size Controller -->
            <div class="flex items-center space-x-1 bg-cockpit-900 border border-cockpit-border rounded-lg p-0.5 text-xs font-mono" title="ปรับขนาดตัวอักษรของโจทย์และคำตอบ">
              <button type="button" onclick="app.adjustFontSizeStep(-1)" class="w-6 h-6 rounded flex items-center justify-center hover:bg-cockpit-800 text-slate-400 hover:text-white transition font-bold" title="ลดขนาดตัวอักษร (A-)">A-</button>
              <span id="fontSizeExamIndicator" class="px-1 text-[10px] text-cyan-400 font-bold select-none min-w-[32px] text-center">100%</span>
              <button type="button" onclick="app.adjustFontSizeStep(1)" class="w-6 h-6 rounded flex items-center justify-center hover:bg-cockpit-800 text-slate-400 hover:text-white transition font-bold" title="เพิ่มขนาดตัวอักษร (A+)">A+</button>
            </div>
          </div>
        </div>

        <!-- Question Prompt Text -->
        <div class="space-y-2">
          <h2 id="questionPromptText" class="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed">
            Which SI unit is used for density?
          </h2>
        </div>

        <!-- Multiple Choice Options (A, B, C, D) -->
        <div id="optionsContainer" class="space-y-3 pt-2">
          <!-- Rendered dynamically -->
        </div>

        <!-- EXPLANATION PANEL (Visible in Study Mode after answer check, or review) -->
        <div id="explanationBox" class="hidden rounded-xl p-5 bg-cockpit-900 border border-cyan-500/40 space-y-3 animate-fadeIn">
          <div class="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <i data-lucide="info" class="w-4 h-4"></i>
            <span>EXPLANATION & CAAT PRINCIPLE</span>
          </div>
          <p id="explanationText" class="text-sm text-slate-200 leading-relaxed font-sans">
            Density is mass per unit volume, kg/m³.
          </p>
          <div class="pt-2 border-t border-cockpit-border/60 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div><span class="text-slate-500">Learning Objective:</span> <span id="expLODisplay" class="text-cyan-300">081 01 01 01</span></div>
            <div><span class="text-slate-500">Cognitive Demand:</span> <span id="expCognitiveDisplay" class="text-slate-300">KNOW</span></div>
            <div><span class="text-slate-500">Action Verb:</span> <span id="expVerbDisplay" class="text-slate-300">Identify</span></div>
          </div>
        </div>

        <!-- BOTTOM NAV CONTROLS -->
        <div class="pt-4 border-t border-cockpit-border/60 flex flex-wrap items-center justify-between gap-3">
          <!-- Keyboard shortcut guide helper -->
          <div class="hidden sm:flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span>Keys: <kbd class="px-1.5 py-0.5 rounded bg-cockpit-850 border border-cockpit-border text-slate-300">1-4</kbd> / <kbd class="px-1.5 py-0.5 rounded bg-cockpit-850 border border-cockpit-border text-slate-300">A-D</kbd> Select</span>
            <span><kbd class="px-1.5 py-0.5 rounded bg-cockpit-850 border border-cockpit-border text-slate-300">Space</kbd> Check</span>
            <span><kbd class="px-1.5 py-0.5 rounded bg-cockpit-850 border border-cockpit-border text-slate-300">Enter</kbd> Next</span>
          </div>

          <div class="flex items-center space-x-2 ml-auto">
            <button id="btnPrevQ" onclick="app.prevQuestion()" class="px-4 py-2 rounded-xl bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5">
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
              <span>Prev</span>
            </button>

            <!-- In Study mode: Check Answer / Next Question Button -->
            <button id="btnCheckStudy" onclick="app.checkCurrentStudyAnswer()" class="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition flex items-center space-x-1.5">
              <i data-lucide="eye" class="w-4 h-4"></i>
              <span>Check Answer</span>
            </button>

            <button id="btnNextQ" onclick="app.nextQuestion()" class="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-glow-cyan transition flex items-center space-x-1.5">
              <span>Next</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

      </div>

    </section>

    <!-- ============================================================ -->
    <!-- VIEW 3: SUMMARY & DETAILED ANALYTICS SCREEN -->
    <!-- ============================================================ -->
    <section id="viewSummary" class="hidden space-y-6">

      <!-- HERO SCORE CARD -->
      <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-cockpit-border text-center relative overflow-hidden space-y-6">
        <div id="summaryHeroGlow" class="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-3 max-w-xl mx-auto">
          <!-- Pass/Fail Badge -->
          <div id="summaryPassBadge" class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-bold font-mono uppercase tracking-wider">
            <!-- Rendered by JS -->
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Performance Summary</h2>
          <p id="summarySubtitle" class="text-sm text-slate-300">
            เกณฑ์ผ่านการทดสอบตามมาตรฐาน CAAT คือ 75%
          </p>

          <!-- Big Circle Percentage -->
          <div class="py-4">
            <div class="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-emerald-500 bg-cockpit-900/90 shadow-glow-emerald" id="summaryScoreCircle">
              <span id="summaryPercentScore" class="text-4xl font-black font-mono text-white">85%</span>
              <span id="summaryFractionScore" class="text-xs font-mono text-slate-400">17 / 20 Correct</span>
            </div>
          </div>
        </div>

        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          <div class="bg-cockpit-850/80 p-3 rounded-xl border border-cockpit-border">
            <span class="text-xs text-slate-400 block font-medium">Time Taken</span>
            <span id="summaryTimeTaken" class="text-lg font-bold font-mono text-cyan-400">12:45</span>
          </div>
          <div class="bg-cockpit-850/80 p-3 rounded-xl border border-cockpit-border">
            <span class="text-xs text-slate-400 block font-medium">Correct</span>
            <span id="summaryCorrectCount" class="text-lg font-bold font-mono text-emerald-400">17</span>
          </div>
          <div class="bg-cockpit-850/80 p-3 rounded-xl border border-cockpit-border">
            <span class="text-xs text-slate-400 block font-medium">Incorrect</span>
            <span id="summaryIncorrectCount" class="text-lg font-bold font-mono text-rose-400">3</span>
          </div>
          <div class="bg-cockpit-850/80 p-3 rounded-xl border border-cockpit-border">
            <span class="text-xs text-slate-400 block font-medium">Unanswered</span>
            <span id="summaryUnansweredCount" class="text-lg font-bold font-mono text-slate-400">0</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button onclick="app.retakeCurrentConfig()" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition flex items-center space-x-1.5">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            <span>Retake Practice</span>
          </button>
          
          <button id="btnRetrySessionMistakes" onclick="app.practiceSessionMistakes()" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-glow-rose transition flex items-center space-x-1.5">
            <i data-lucide="alert-circle" class="w-4 h-4"></i>
            <span>Practice Session Mistakes (<span id="sessionMistakesBtnCount">0</span>)</span>
          </button>

          <button onclick="app.goHome()" class="px-5 py-2.5 rounded-xl bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-slate-200 font-semibold text-xs transition flex items-center space-x-1.5">
            <i data-lucide="home" class="w-4 h-4"></i>
            <span>Return to Menu</span>
          </button>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- DONATION CARD: MAYDAY AIR LAW & COFFEE FUND -->
      <!-- ============================================================ -->
      <div id="donationCard" class="glass-panel p-5 sm:p-7 rounded-2xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-br from-cockpit-900 via-cockpit-850 to-amber-950/25 shadow-lg">
        <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
          
          <!-- Left / Text Info -->
          <div class="flex-1 text-center md:text-left space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-xs font-mono font-bold tracking-wide">
              <span class="animate-pulse">🚨</span>
              <span>MAYDAY MAYDAY! กัปตันต้องการความช่วยเหลือฉุกเฉิน</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>กองทุนต่อชีวิตกัปตัน: ช่วยค่าสอบแก้ Air Law</span>
              <span class="text-lg">✈️☕</span>
            </h3>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              คนทำเว็บก็ยังไม่ได้สอบ POF แถม <strong class="text-amber-300">Air Law ก็ส่อแววได้ไปบินรอบสอง... 💀</strong><br class="hidden sm:inline">
              หากเว็บฝึกข้อสอบนี้มีประโยชน์กับคุณ ร่วมสมทบทุนค่าลงทะเบียนสอบซ่อม Air Law (หรือค่ากาแฟแก้ง่วงตอนนั่งอ่าน Annex) ให้ผู้พัฒนาได้นะค้าบ เพื่อไม่ให้กัปตันโดน Ground ถาวร 🥺
            </p>

            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs">
              <div class="bg-cockpit-900/90 border border-cockpit-border px-3.5 py-2 rounded-xl flex items-center gap-2 font-mono shadow-inner">
                <span class="text-slate-400 text-xs">พร้อมเพย์:</span>
                <span class="text-cyan-400 font-bold text-sm tracking-wider select-all">082-574-3651</span>
              </div>
              <button type="button" onclick="app.copyPromptPay('0825743651')" id="btnCopyPromptPay" class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono transition flex items-center gap-1.5 shadow-glow-cyan active:scale-95">
                <i data-lucide="copy" class="w-4 h-4"></i>
                <span id="btnCopyPromptPayText">คัดลอกเบอร์พร้อมเพย์</span>
              </button>
            </div>

            <p class="text-[11px] text-slate-400 italic">
              *ไม่สะดวกเปย์ไม่เป็นไรเลยครับ แค่คุณสอบผ่านกัปตันก็ดีใจแล้ว! (แต่ถ้าเลี้ยงกาแฟจะแฮปปี้มาก 😆)
            </p>
          </div>

          <!-- Right / QR Box -->
          <div class="shrink-0 flex flex-col items-center">
            <div class="p-2.5 bg-white rounded-2xl shadow-2xl border-2 border-amber-400/70 transition transform hover:scale-105">
              <img src="${donateQrBase64}" alt="PromptPay QR Code 0825743651" class="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-xl block">
            </div>
            <span class="text-[10px] font-mono text-amber-300/90 mt-2 flex items-center gap-1">
              <i data-lucide="scan-line" class="w-3 h-3"></i>
              <span>Scan via Mobile Banking</span>
            </span>
          </div>

        </div>
      </div>

      <!-- TOPIC BREAKDOWN ACCURACY -->
      <div class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-4">
        <h3 class="text-base font-bold text-white flex items-center space-x-2">
          <i data-lucide="bar-chart-2" class="w-5 h-5 text-cyan-400"></i>
          <span>Accuracy Breakdown by Subject 081 Topics</span>
        </h3>
        <p class="text-xs text-slate-400">
          ตรวจสอบความแม่นยำรายหมวดวิชาเพื่อระบุจุดที่ควรทบทวนเพิ่มเติม
        </p>

        <div id="topicAccuracyGrid" class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- DETAILED QUESTION REVIEW LIST -->
      <div id="reviewSectionWrapper" class="glass-panel p-6 rounded-2xl border border-cockpit-border space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-cockpit-border">
          <div>
            <h3 class="text-base font-bold text-white flex items-center space-x-2">
              <i data-lucide="list-checks" class="w-5 h-5 text-cyan-400"></i>
              <span>Question Review & Explanations</span>
            </h3>
            <p class="text-xs text-slate-400">ตรวจสอบคำตอบที่เลือก พร้อมเฉลยและคำอธิบายฉบับสมบูรณ์</p>
          </div>

          <!-- Filter Review Tabs -->
          <div class="flex flex-wrap gap-1 bg-cockpit-900 p-1 rounded-xl border border-cockpit-border text-xs font-mono">
            <button onclick="app.filterReviewList('all')" id="tabReviewAll" class="px-3 py-1 rounded-lg bg-cyan-600 text-slate-950 font-bold">All</button>
            <button onclick="app.filterReviewList('incorrect')" id="tabReviewIncorrect" class="px-3 py-1 rounded-lg text-slate-300 hover:text-white">Incorrect Only</button>
            <button onclick="app.filterReviewList('correct')" id="tabReviewCorrect" class="px-3 py-1 rounded-lg text-slate-300 hover:text-white">Correct Only</button>
            <button onclick="app.filterReviewList('flagged')" id="tabReviewFlagged" class="px-3 py-1 rounded-lg text-slate-300 hover:text-white">Flagged</button>
          </div>
        </div>

        <!-- Top Pagination Info Bar -->
        <div id="reviewPaginationTop" class="hidden flex-wrap items-center justify-between gap-2 py-2 px-1 text-xs font-mono text-slate-300 border-b border-cockpit-border/40">
          <!-- Rendered by JS -->
        </div>

        <div id="reviewQuestionsContainer" class="space-y-4 pt-2">
          <!-- Rendered by JS -->
        </div>

        <!-- Bottom Pagination Controls -->
        <div id="reviewPaginationBottom" class="hidden pt-4 border-t border-cockpit-border/60">
          <!-- Rendered by JS -->
        </div>
      </div>

    </section>

  </main>

  <!-- ============================================================ -->
  <!-- SEARCH MODAL / QUESTION BANK EXPLORER -->
  <!-- ============================================================ -->
  <div id="modalSearch" class="fixed inset-0 z-50 bg-cockpit-950/85 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4">
    <div class="glass-panel max-w-4xl w-full h-[90vh] rounded-2xl border border-cockpit-border p-4 sm:p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden animate-fadeIn">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-cockpit-border pb-3 shrink-0">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <i data-lucide="search" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white flex items-center space-x-2">
              <span>Question Bank Search</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-normal">200 Qs</span>
            </h3>
            <p class="text-[11px] text-slate-400">ค้นหาจากคำในคำถาม คำตอบที่ถูกต้อง คำอธิบาย หรือรหัส LO</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <kbd class="hidden sm:inline-block px-2 py-1 rounded bg-cockpit-900 border border-cockpit-border text-[10px] font-mono text-slate-400">ESC to close</kbd>
          <button onclick="app.closeSearchModal()" class="p-1.5 rounded-lg hover:bg-cockpit-800 text-slate-400 hover:text-white transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Search Input Bar & Filter Controls -->
      <div class="space-y-3 shrink-0">
        <div class="relative flex items-center">
          <i data-lucide="search" class="w-5 h-5 text-cyan-400 absolute left-3.5 pointer-events-none"></i>
          <input type="text" id="searchInputField" oninput="app.handleSearchInput(this.value)" placeholder="พิมพ์คำค้นหา เช่น &quot;density&quot;, &quot;Mach&quot;, &quot;dihedral&quot;, &quot;kg/m³&quot;... (ขั้นต่ำ 3 ตัวอักษร)" class="w-full bg-cockpit-900 border-2 border-cockpit-border hover:border-cockpit-700 focus:border-cyan-500 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition font-sans shadow-inner">
          <button id="searchClearBtn" onclick="app.clearSearchQuery()" class="hidden absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-cockpit-800" title="Clear Search">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Scope Tabs & Secondary Filters -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <!-- Search Scope Tabs -->
          <div class="flex flex-wrap gap-1 bg-cockpit-900/90 p-1 rounded-xl border border-cockpit-border text-xs font-mono">
            <button type="button" id="searchScopeTab_all" onclick="app.setSearchScope('all')" class="px-2.5 py-1 rounded-lg bg-cyan-600 text-slate-950 font-bold transition">All Fields</button>
            <button type="button" id="searchScopeTab_question" onclick="app.setSearchScope('question')" class="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition">Question Only</button>
            <button type="button" id="searchScopeTab_correct" onclick="app.setSearchScope('correct')" class="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition">Correct Answer Only</button>
            <button type="button" id="searchScopeTab_explanation" onclick="app.setSearchScope('explanation')" class="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition">Explanation & LO</button>
          </div>

          <!-- Secondary Filters: Topic & Difficulty -->
          <div class="flex items-center space-x-2">
            <select id="searchFilterTopic" onchange="app.executeSearch()" class="bg-cockpit-900 border border-cockpit-border rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 max-w-[140px] sm:max-w-[180px] truncate">
              <option value="all">All Topics (ทุกหมวด)</option>
            </select>

            <select id="searchFilterDifficulty" onchange="app.executeSearch()" class="bg-cockpit-900 border border-cockpit-border rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
              <option value="all">All Diff</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <!-- Result Stats & Quick Action Bar -->
        <div id="searchMetaBar" class="flex flex-wrap items-center justify-between gap-2 px-1 py-1 text-xs">
          <div id="searchResultsCountText" class="font-mono text-slate-400">
            พิมพ์อย่างน้อย 3 ตัวอักษรเพื่อค้นหา (Min 3 characters)
          </div>
          <div id="searchActionButtons" class="hidden items-center space-x-2">
            <button onclick="app.startPracticeFromSearch('study')" class="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center space-x-1 shadow-glow-cyan transition">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>Study These (<span id="searchStudyCount">0</span>)</span>
            </button>
            <button onclick="app.startPracticeFromSearch('exam')" class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs flex items-center space-x-1 shadow-sm transition">
              <i data-lucide="timer" class="w-3.5 h-3.5"></i>
              <span>Exam Mode</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Scrollable List -->
      <div id="searchResultsContainer" class="flex-grow overflow-y-auto pr-1 space-y-3.5 min-h-0">
        <!-- Dynamic Result Cards or Empty / Initial State -->
      </div>

      <!-- Search Pagination Controls (when > 10) -->
      <div id="searchPaginationBottom" class="hidden shrink-0 pt-2 border-t border-cockpit-border/60">
        <!-- Rendered by JS -->
      </div>

      <!-- Modal Footer -->
      <div class="pt-2 border-t border-cockpit-border flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div class="font-mono text-[11px] hidden sm:block">
          💡 ทิป: สามารถคลิกคำค้นหาแนะนำ หรือกดปุ่ม Flag เพื่อติดดาวข้อสอบได้ทันที
        </div>
        <button onclick="app.closeSearchModal()" class="px-4 py-1.5 rounded-xl bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-xs text-slate-200 font-semibold ml-auto">
          Close
        </button>
      </div>

    </div>
  </div>

  <!-- QUESTION PALETTE / GRID MODAL -->
  <div id="modalQuestionGrid" class="fixed inset-0 z-50 bg-cockpit-950/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="glass-panel max-w-2xl w-full max-h-[85vh] rounded-2xl border border-cockpit-border p-6 flex flex-col space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-cockpit-border pb-3">
        <h3 class="text-base font-bold text-white flex items-center space-x-2">
          <i data-lucide="grid" class="w-5 h-5 text-cyan-400"></i>
          <span>Question Navigator Palette</span>
        </h3>
        <button onclick="app.toggleGridDrawer(false)" class="p-1 rounded-lg hover:bg-cockpit-800 text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-4 text-xs font-mono text-slate-300 bg-cockpit-900/60 p-2.5 rounded-xl border border-cockpit-border">
        <div class="flex items-center space-x-1.5">
          <span class="w-3.5 h-3.5 rounded bg-emerald-500"></span>
          <span>Answered</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <span class="w-3.5 h-3.5 rounded bg-cockpit-800 border border-cockpit-border"></span>
          <span>Unanswered</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <span class="w-3.5 h-3.5 rounded bg-amber-500"></span>
          <span>Flagged</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <span class="w-3.5 h-3.5 rounded border-2 border-cyan-400"></span>
          <span>Current</span>
        </div>
      </div>

      <!-- Grid Buttons -->
      <div id="paletteGridButtons" class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 overflow-y-auto py-2 flex-grow pr-1 max-h-[50vh]">
        <!-- Rendered by JS -->
      </div>

      <div class="pt-2 border-t border-cockpit-border flex justify-end">
        <button onclick="app.toggleGridDrawer(false)" class="px-4 py-2 rounded-xl bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-xs text-slate-200 font-semibold">
          Close Navigator
        </button>
      </div>
    </div>
  </div>

  <!-- GENERIC CONFIRMATION MODAL -->
  <div id="modalConfirm" class="fixed inset-0 z-50 bg-cockpit-950/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="glass-panel max-w-md w-full rounded-2xl border border-cockpit-border p-6 space-y-4 shadow-2xl">
      <div class="flex items-center space-x-3 text-cyan-400">
        <i id="confirmModalIcon" data-lucide="alert-triangle" class="w-6 h-6 text-amber-400"></i>
        <h3 id="confirmModalTitle" class="text-base font-bold text-white">Confirm Action</h3>
      </div>
      <p id="confirmModalMessage" class="text-sm text-slate-300 leading-relaxed font-sans">
        Are you sure you want to proceed?
      </p>
      <div class="flex justify-end space-x-2 pt-2">
        <button id="confirmModalCancelBtn" class="px-4 py-2 rounded-xl bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-xs text-slate-300 font-semibold">
          Cancel
        </button>
        <button id="confirmModalOkBtn" class="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs">
          Confirm
        </button>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-cockpit-border py-4 text-center text-xs text-slate-500 font-mono">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>Subject 081 Principles of Flight (Aeroplanes) • 200 MCQ Training Bank</div>
      <div>Designed for CAAT / EASA Exam Readiness • Single File HTML</div>
    </div>
  </footer>

  <!-- JAVASCRIPT APPLICATION CORE -->
  <script>
    // Embedded 200 Questions
    const questions = ${questionsData};

    const topicMetadata = [
      { code: '081 01', name: 'Subsonic Aerodynamics', count: 44 },
      { code: '081 02', name: 'High-Speed Aerodynamics', count: 20 },
      { code: '081 03', name: 'Stall, Mach Tuck & Upset Prevention/Recovery', count: 36 },
      { code: '081 04', name: 'Stability', count: 26 },
      { code: '081 05', name: 'Control', count: 16 },
      { code: '081 06', name: 'Limitations', count: 14 },
      { code: '081 07', name: 'Propellers', count: 14 },
      { code: '081 08', name: 'Flight Mechanics', count: 30 }
    ];

    class SoundEffects {
      constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('pof_sound_enabled') !== 'false';
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
      }
      playTone(freq, type, duration, startVol = 0.1, endVol = 0) {
        if (!this.enabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          if (this.ctx.state === 'suspended') this.ctx.resume();
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      }
      click() { this.playTone(800, 'sine', 0.04, 0.05, 0.001); }
      correct() {
        if (!this.enabled) return;
        this.playTone(587.33, 'triangle', 0.1, 0.1, 0.01);
        setTimeout(() => this.playTone(880, 'triangle', 0.2, 0.12, 0.001), 100);
      }
      incorrect() {
        if (!this.enabled) return;
        this.playTone(300, 'sawtooth', 0.15, 0.1, 0.01);
        setTimeout(() => this.playTone(220, 'sawtooth', 0.25, 0.12, 0.001), 120);
      }
      complete() {
        if (!this.enabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, i) => {
          setTimeout(() => this.playTone(n, 'triangle', 0.25, 0.12, 0.001), i * 120);
        });
      }
    }

    const sound = new SoundEffects();

    function shuffleArray(array) {
      const arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }

    const app = {
      mode: 'study',
      selectedTopics: new Set(topicMetadata.map(t => t.code)),
      questionCount: 20,
      mistakesOnly: false,
      bookmarksOnly: false,

      sessionQuestions: [],
      currentIndex: 0,
      userAnswers: {},
      revealedInStudy: {},
      timerInterval: null,
      timeElapsedSeconds: 0,
      activeReviewFilter: 'all',
      reviewCurrentPage: 1,
      reviewPageSize: 10,
      reviewFilteredList: [],

      mistakes: new Set(),
      bookmarks: new Set(),
      examHistory: [],

      // Theme State
      theme: 'dark',

      // Font Size State ('sm', 'normal', 'lg', 'xl')
      fontSize: 'normal',
      fontSizes: ['sm', 'normal', 'lg', 'xl'],
      fontSizeLabels: {
        sm: '90%',
        normal: '100%',
        lg: '115%',
        xl: '130%'
      },

      // Search State
      searchScope: 'all',
      searchQuery: '',
      searchTopic: 'all',
      searchDifficulty: 'all',
      lastSearchResults: [],
      searchCurrentPage: 1,
      searchPageSize: 10,

      init() {
        this.initTheme();
        this.initFontSize();
        this.loadStorage();
        this.renderTopicGrid();
        this.updateFilterCounts();
        this.updateHeaderStats();
        this.setupKeyboardShortcuts();
        this.updateSoundIcon();
        lucide.createIcons();
      },

      initFontSize() {
        const saved = localStorage.getItem('pof_font_size') || 'normal';
        this.setFontSize(saved, false);
      },

      setFontSize(size, playSound = true) {
        if (!this.fontSizes.includes(size)) size = 'normal';
        this.fontSize = size;
        this.fontSizes.forEach(s => {
          document.documentElement.classList.remove('font-size-' + s);
        });
        document.documentElement.classList.add('font-size-' + size);
        localStorage.setItem('pof_font_size', size);

        const pct = this.fontSizeLabels[size] || '100%';
        const headerBadge = document.getElementById('fontSizeHeaderBadge');
        if (headerBadge) headerBadge.textContent = pct;

        const examIndicator = document.getElementById('fontSizeExamIndicator');
        if (examIndicator) examIndicator.textContent = pct;

        if (playSound && sound.enabled) sound.click();
      },

      cycleFontSize() {
        const currentIndex = this.fontSizes.indexOf(this.fontSize);
        const nextIndex = (currentIndex + 1) % this.fontSizes.length;
        this.setFontSize(this.fontSizes[nextIndex], true);
      },

      adjustFontSizeStep(delta) {
        const currentIndex = this.fontSizes.indexOf(this.fontSize);
        let nextIndex = currentIndex + delta;
        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= this.fontSizes.length) nextIndex = this.fontSizes.length - 1;
        this.setFontSize(this.fontSizes[nextIndex], true);
      },

      initTheme() {
        const saved = localStorage.getItem('pof_theme');
        if (saved === 'light' || saved === 'dark') {
          this.theme = saved;
        } else {
          this.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
        }
        this.applyTheme();
      },

      toggleTheme() {
        this.theme = (this.theme === 'dark') ? 'light' : 'dark';
        localStorage.setItem('pof_theme', this.theme);
        this.applyTheme();
        if (sound.enabled) sound.click();
      },

      applyTheme() {
        const html = document.documentElement;
        const icon = document.getElementById('themeIcon');
        const btn = document.getElementById('themeToggleBtn');
        if (this.theme === 'light') {
          html.classList.remove('dark');
          html.classList.add('light');
          if (icon) {
            icon.setAttribute('data-lucide', 'moon');
            icon.className = 'w-4 h-4 text-blue-600';
          }
          if (btn) btn.title = 'Switch to Dark Mode';
        } else {
          html.classList.remove('light');
          html.classList.add('dark');
          if (icon) {
            icon.setAttribute('data-lucide', 'sun');
            icon.className = 'w-4 h-4 text-amber-400';
          }
          if (btn) btn.title = 'Switch to Light Mode';
        }
        lucide.createIcons();
      },

      loadStorage() {
        try {
          const m = localStorage.getItem('pof_mistakes');
          if (m) this.mistakes = new Set(JSON.parse(m));
          const b = localStorage.getItem('pof_bookmarks');
          if (b) this.bookmarks = new Set(JSON.parse(b));
          const h = localStorage.getItem('pof_history');
          if (h) this.examHistory = JSON.parse(h);
        } catch (e) {
          console.error('Storage error', e);
        }
      },

      saveStorage() {
        localStorage.setItem('pof_mistakes', JSON.stringify(Array.from(this.mistakes)));
        localStorage.setItem('pof_bookmarks', JSON.stringify(Array.from(this.bookmarks)));
        localStorage.setItem('pof_history', JSON.stringify(this.examHistory));
        this.updateHeaderStats();
      },

      updateHeaderStats() {
        document.getElementById('headerMistakeCount').textContent = this.mistakes.size;
        document.getElementById('panelMistakeCount').textContent = this.mistakes.size;
        document.getElementById('headerBookmarkCount').textContent = this.bookmarks.size;
        document.getElementById('panelBookmarkCount').textContent = this.bookmarks.size;

        const histCount = this.examHistory.length;
        document.getElementById('historyCountText').textContent = histCount;
        document.getElementById('heroExamCount').textContent = histCount + (histCount === 1 ? ' Test' : ' Tests');
        
        if (histCount > 0) {
          const avg = Math.round(this.examHistory.reduce((acc, c) => acc + c.percentage, 0) / histCount);
          document.getElementById('heroAvgScore').textContent = avg + '%';
        } else {
          document.getElementById('heroAvgScore').textContent = '-%';
        }
      },

      toggleSound() {
        sound.enabled = !sound.enabled;
        localStorage.setItem('pof_sound_enabled', sound.enabled ? 'true' : 'false');
        this.updateSoundIcon();
        if (sound.enabled) sound.click();
      },

      updateSoundIcon() {
        const icon = document.getElementById('soundIcon');
        if (sound.enabled) {
          icon.setAttribute('data-lucide', 'volume-2');
          icon.classList.remove('text-slate-500');
          icon.classList.add('text-cyan-400');
        } else {
          icon.setAttribute('data-lucide', 'volume-x');
          icon.classList.remove('text-cyan-400');
          icon.classList.add('text-slate-500');
        }
        lucide.createIcons();
      },

      renderTopicGrid() {
        const container = document.getElementById('topicGridContainer');
        container.innerHTML = topicMetadata.map(t => {
          const checked = this.selectedTopics.has(t.code) ? 'checked' : '';
          return '<label class="flex items-center space-x-3 p-3 rounded-xl border border-cockpit-border bg-cockpit-850/60 hover:bg-cockpit-800/80 cursor-pointer transition">' +
            '<input type="checkbox" value="' + t.code + '" ' + checked + ' onchange="app.handleTopicToggle(\\'' + t.code + '\\', this.checked)" class="w-4 h-4 rounded text-cyan-500 bg-cockpit-700 border-cockpit-border focus:ring-cyan-500">' +
            '<div class="flex-grow min-w-0">' +
              '<div class="flex items-center justify-between">' +
                '<span class="text-xs font-mono font-bold text-cyan-300">' + t.code + '</span>' +
                '<span class="text-[11px] font-mono text-slate-400">' + t.count + ' Qs</span>' +
              '</div>' +
              '<p class="text-xs text-slate-200 truncate">' + t.name + '</p>' +
            '</div>' +
          '</label>';
        }).join('');
      },

      handleTopicToggle(code, checked) {
        if (checked) this.selectedTopics.add(code);
        else this.selectedTopics.delete(code);
        this.updateFilterCounts();
      },

      selectAllTopics(select) {
        if (select) {
          this.selectedTopics = new Set(topicMetadata.map(t => t.code));
        } else {
          this.selectedTopics.clear();
        }
        this.renderTopicGrid();
        this.updateFilterCounts();
        sound.click();
      },

      setMode(mode) {
        this.mode = mode;
        const studyCard = document.getElementById('modeCardStudy');
        const examCard = document.getElementById('modeCardExam');
        const badgeStudy = document.getElementById('badgeModeStudy');
        const badgeExam = document.getElementById('badgeModeExam');

        if (mode === 'study') {
          studyCard.classList.add('border-cyan-500', 'bg-cyan-950/20', 'shadow-glow-cyan');
          studyCard.classList.remove('border-cockpit-border', 'bg-cockpit-850/40');
          badgeStudy.classList.remove('hidden');

          examCard.classList.remove('border-blue-500', 'bg-blue-950/20', 'shadow-glow-cyan');
          examCard.classList.add('border-cockpit-border', 'bg-cockpit-850/40');
          badgeExam.classList.add('hidden');
        } else {
          examCard.classList.add('border-blue-500', 'bg-blue-950/20', 'shadow-glow-cyan');
          examCard.classList.remove('border-cockpit-border', 'bg-cockpit-850/40');
          badgeExam.classList.remove('hidden');

          studyCard.classList.remove('border-cyan-500', 'bg-cyan-950/20', 'shadow-glow-cyan');
          studyCard.classList.add('border-cockpit-border', 'bg-cockpit-850/40');
          badgeStudy.classList.add('hidden');
        }
        sound.click();
      },

      handleMistakesToggle(checked) {
        this.mistakesOnly = checked;
        if (checked) {
          document.getElementById('toggleBookmarksOnly').checked = false;
          this.bookmarksOnly = false;
        }
        this.updateFilterCounts();
        sound.click();
      },

      handleBookmarksToggle(checked) {
        this.bookmarksOnly = checked;
        if (checked) {
          document.getElementById('toggleMistakesOnly').checked = false;
          this.mistakesOnly = false;
        }
        this.updateFilterCounts();
        sound.click();
      },

      getFilteredCandidateQuestions() {
        let list = questions;
        if (this.selectedTopics.size < topicMetadata.length) {
          list = list.filter(q => this.selectedTopics.has(q.topic));
        }

        const diff = document.getElementById('selectDifficulty').value;
        if (diff !== 'All') {
          list = list.filter(q => q.difficulty === diff);
        }

        if (this.mistakesOnly) {
          list = list.filter(q => this.mistakes.has(q.id));
        }

        if (this.bookmarksOnly) {
          list = list.filter(q => this.bookmarks.has(q.id));
        }

        return list;
      },

      updateFilterCounts() {
        const matching = this.getFilteredCandidateQuestions();
        const max = matching.length;
        const slider = document.getElementById('countSlider');
        if (!slider) return;

        slider.min = Math.min(5, Math.max(1, max));
        slider.max = Math.max(1, max);
        slider.step = 1;

        const maxLabel = document.getElementById('maxAvailableLabel');
        if (maxLabel) {
          maxLabel.textContent = max + ' ข้อ';
        }

        if (this.questionCount > max) {
          this.questionCount = Math.max(1, max);
          slider.value = this.questionCount;
        }

        document.getElementById('questionCountDisplay').textContent = (max === 0 ? 0 : this.questionCount) + ' ข้อ';
        document.getElementById('matchingCountNotice').textContent = (max === 0 ? '0 Questions' : (this.questionCount + ' Questions Selected'));
        document.getElementById('estimatedTimeNotice').textContent = 'Estimated time: ~' + Math.max(1, Math.round(this.questionCount * 1)) + ' mins (1 min/Q)';

        const btn = document.getElementById('btnStartExam');
        if (max === 0) {
          btn.disabled = true;
          btn.classList.add('opacity-50', 'cursor-not-allowed');
          btn.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5"></i> <span>No Matching Questions</span>';
        } else {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
          btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> <span>START ' + this.mode.toUpperCase() + ' (' + this.questionCount + ' Qs)</span>';
        }
        lucide.createIcons();
      },

      updateQuestionCount(val) {
        this.questionCount = parseInt(val, 10);
        document.getElementById('questionCountDisplay').textContent = this.questionCount + ' ข้อ';
        document.getElementById('matchingCountNotice').textContent = this.questionCount + ' Questions Selected';
        document.getElementById('estimatedTimeNotice').textContent = 'Estimated time: ~' + Math.max(1, Math.round(this.questionCount * 1)) + ' mins';
        const btn = document.getElementById('btnStartExam');
        btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> <span>START ' + this.mode.toUpperCase() + ' (' + this.questionCount + ' Qs)</span>';
        lucide.createIcons();
      },

      setCountPreset(val) {
        const matching = this.getFilteredCandidateQuestions();
        const max = matching.length;
        let target;
        if (val === 'all' || val === 'max' || val === Infinity || (typeof val === 'number' && val === 200 && max > 200)) {
          target = max;
        } else if (typeof val === 'number') {
          target = Math.min(val, max);
        } else {
          target = max;
        }
        target = Math.max(1, target);
        const slider = document.getElementById('countSlider');
        if (slider) {
          slider.value = target;
        }
        this.updateQuestionCount(target);
        sound.click();
      },

      startPracticeSession(customQuestionList = null) {
        sound.click();
        let candidatePool = customQuestionList || this.getFilteredCandidateQuestions();
        if (candidatePool.length === 0) {
          alert('ไม่พบข้อสอบที่ตรงกับเงื่อนไขที่เลือก กรุณาปรับตัวกรองใหม่');
          return;
        }

        let chosen = candidatePool.slice();
        const doShuffle = document.getElementById('toggleShuffleQuestions').checked;
        if (doShuffle) {
          chosen = shuffleArray(chosen);
        }

        const count = customQuestionList ? chosen.length : Math.min(this.questionCount, chosen.length);
        chosen = chosen.slice(0, count);

        // Mandatory Fisher-Yates shuffle for options of each question
        this.sessionQuestions = chosen.map(q => {
          return {
            id: q.id,
            topic: q.topic,
            topicName: q.topicName,
            question: q.question,
            options: q.options,
            correct: q.correct,
            LO: q.LO,
            difficulty: q.difficulty,
            cognitive: q.cognitive,
            verb: q.verb,
            explanation: q.explanation,
            shuffledOptions: shuffleArray(q.options)
          };
        });

        this.currentIndex = 0;
        this.userAnswers = {};
        this.revealedInStudy = {};
        this.timeElapsedSeconds = 0;

        document.getElementById('viewSetup').classList.add('hidden');
        document.getElementById('viewSummary').classList.add('hidden');
        document.getElementById('viewExam').classList.remove('hidden');

        const badge = document.getElementById('examActiveModeBadge');
        if (this.mode === 'study') {
          badge.textContent = 'STUDY MODE';
          badge.className = 'text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold';
          document.getElementById('btnCheckStudy').classList.remove('hidden');
        } else {
          badge.textContent = 'EXAM MODE';
          badge.className = 'text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-semibold';
          document.getElementById('btnCheckStudy').classList.add('hidden');
        }

        this.startTimer();
        this.renderCurrentQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          this.timeElapsedSeconds++;
          const mins = Math.floor(this.timeElapsedSeconds / 60).toString().padStart(2, '0');
          const secs = (this.timeElapsedSeconds % 60).toString().padStart(2, '0');
          document.getElementById('liveTimerText').textContent = mins + ':' + secs;
        }, 1000);
      },

      stopTimer() {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
      },

      renderCurrentQuestion() {
        const q = this.sessionQuestions[this.currentIndex];
        const total = this.sessionQuestions.length;
        const progressPct = Math.round(((this.currentIndex + 1) / total) * 100);

        document.getElementById('currentQuestionNumBadge').textContent = 'Q ' + (this.currentIndex + 1) + ' / ' + total;
        document.getElementById('topicBreadcrumb').textContent = q.topic + ' ' + (q.topicName || '');
        document.getElementById('progressPercentText').textContent = progressPct + '%';
        document.getElementById('progressBarFill').style.width = progressPct + '%';

        document.getElementById('badgeQuestionId').textContent = 'Bank ID: #' + q.id;
        document.getElementById('badgeLO').textContent = 'LO: ' + q.LO;
        document.getElementById('badgeDifficulty').textContent = q.difficulty;
        document.getElementById('badgeDifficulty').className = 'px-2.5 py-1 rounded-md text-xs font-mono font-medium ' + (
          q.difficulty === 'Easy' ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' :
          q.difficulty === 'Medium' ? 'bg-amber-950/60 border border-amber-800/60 text-amber-300' :
          'bg-rose-950/60 border border-rose-800/60 text-rose-300'
        );
        document.getElementById('badgeCognitive').textContent = q.cognitive || 'KNOW';

        const isBookmarked = this.bookmarks.has(q.id);
        const btnB = document.getElementById('btnBookmark');
        const iconB = document.getElementById('bookmarkIcon');
        if (isBookmarked) {
          btnB.classList.add('bg-amber-500/20', 'border-amber-500', 'text-amber-400');
          iconB.classList.add('fill-current');
        } else {
          btnB.classList.remove('bg-amber-500/20', 'border-amber-500', 'text-amber-400');
          iconB.classList.remove('fill-current');
        }

        document.getElementById('questionPromptText').textContent = q.question;

        const selected = this.userAnswers[this.currentIndex];
        const isRevealed = this.mode === 'study' && this.revealedInStudy[this.currentIndex];
        const letters = ['A', 'B', 'C', 'D'];

        const container = document.getElementById('optionsContainer');
        container.innerHTML = q.shuffledOptions.map((opt, idx) => {
          const letter = letters[idx];
          const isSelected = selected === opt;
          const isCorrect = opt === q.correct;

          let cardClass = 'p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-sm ';
          let badgeClass = 'w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ';

          if (isRevealed) {
            if (isCorrect) {
              cardClass += 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-glow-emerald';
              badgeClass += 'bg-emerald-500 text-slate-950';
            } else if (isSelected && !isCorrect) {
              cardClass += 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-glow-rose';
              badgeClass += 'bg-rose-500 text-white';
            } else {
              cardClass += 'border-cockpit-border/40 bg-cockpit-900/40 text-slate-400 opacity-60';
              badgeClass += 'bg-cockpit-800 text-slate-500';
            }
          } else {
            if (isSelected) {
              cardClass += 'border-cyan-400 bg-cyan-950/30 text-white shadow-glow-cyan';
              badgeClass += 'bg-cyan-400 text-slate-950';
            } else {
              cardClass += 'border-cockpit-border bg-cockpit-850/60 hover:bg-cockpit-800/90 text-slate-200 hover:border-slate-500';
              badgeClass += 'bg-cockpit-800 text-slate-300';
            }
          }

          return '<div onclick="app.selectOptionByIndex(' + idx + ')" class="' + cardClass + '">' +
            '<div class="' + badgeClass + '">' + letter + '</div>' +
            '<div class="flex-grow pt-0.5 leading-relaxed">' + opt + '</div>' +
            (isRevealed ? (
              isCorrect ? '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400 shrink-0"></i>' :
              (isSelected ? '<i data-lucide="x-circle" class="w-5 h-5 text-rose-400 shrink-0"></i>' : '')
            ) : '') +
          '</div>';
        }).join('');

        const expBox = document.getElementById('explanationBox');
        const statusPill = document.getElementById('studyAnswerStatusPill');

        if (isRevealed) {
          expBox.classList.remove('hidden');
          document.getElementById('explanationText').textContent = q.explanation;
          document.getElementById('expLODisplay').textContent = q.LO;
          document.getElementById('expCognitiveDisplay').textContent = q.cognitive || 'KNOW';
          document.getElementById('expVerbDisplay').textContent = q.verb || 'Identify';

          statusPill.classList.remove('hidden');
          if (selected === q.correct) {
            statusPill.textContent = 'CORRECT';
            statusPill.className = 'text-xs font-mono px-3 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          } else {
            statusPill.textContent = 'INCORRECT';
            statusPill.className = 'text-xs font-mono px-3 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40';
          }
        } else {
          expBox.classList.add('hidden');
          statusPill.classList.add('hidden');
        }

        document.getElementById('btnPrevQ').disabled = (this.currentIndex === 0);
        document.getElementById('btnPrevQ').classList.toggle('opacity-40', this.currentIndex === 0);

        const isLast = (this.currentIndex === total - 1);
        const nextBtn = document.getElementById('btnNextQ');
        if (isLast) {
          nextBtn.innerHTML = '<span>Review / Submit</span> <i data-lucide="check" class="w-4 h-4"></i>';
        } else {
          nextBtn.innerHTML = '<span>Next</span> <i data-lucide="chevron-right" class="w-4 h-4"></i>';
        }

        lucide.createIcons();
      },

      selectOptionByIndex(idx) {
        const q = this.sessionQuestions[this.currentIndex];
        if (!q || !q.shuffledOptions || idx < 0 || idx >= q.shuffledOptions.length) return;
        this.selectOption(q.shuffledOptions[idx]);
      },

      selectOption(optionText) {
        sound.click();
        this.userAnswers[this.currentIndex] = optionText;

        const currentQ = this.sessionQuestions[this.currentIndex];
        if (this.mode === 'study') {
          this.revealedInStudy[this.currentIndex] = true;
          if (optionText === currentQ.correct) {
            sound.correct();
            if (this.mistakes.has(currentQ.id)) {
              this.mistakes.delete(currentQ.id);
              this.saveStorage();
            }
          } else {
            sound.incorrect();
            this.mistakes.add(currentQ.id);
            this.saveStorage();
          }
        }

        this.renderCurrentQuestion();
      },

      checkCurrentStudyAnswer() {
        if (!this.userAnswers[this.currentIndex]) {
          alert('กรุณาเลือกคำตอบก่อนตรวจ');
          return;
        }
        const q = this.sessionQuestions[this.currentIndex];
        this.revealedInStudy[this.currentIndex] = true;
        if (this.userAnswers[this.currentIndex] === q.correct) {
          sound.correct();
        } else {
          sound.incorrect();
          this.mistakes.add(q.id);
          this.saveStorage();
        }
        this.renderCurrentQuestion();
      },

      nextQuestion() {
        sound.click();
        if (this.currentIndex < this.sessionQuestions.length - 1) {
          this.currentIndex++;
          this.renderCurrentQuestion();
        } else {
          this.confirmFinishExam();
        }
      },

      prevQuestion() {
        sound.click();
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderCurrentQuestion();
        }
      },

      jumpToQuestion(index) {
        sound.click();
        this.currentIndex = index;
        this.toggleGridDrawer(false);
        this.renderCurrentQuestion();
      },

      toggleBookmarkCurrent() {
        const q = this.sessionQuestions[this.currentIndex];
        if (this.bookmarks.has(q.id)) {
          this.bookmarks.delete(q.id);
        } else {
          this.bookmarks.add(q.id);
        }
        sound.click();
        this.saveStorage();
        this.renderCurrentQuestion();
      },

      toggleGridDrawer(show) {
        sound.click();
        const modal = document.getElementById('modalQuestionGrid');
        if (show) {
          modal.classList.remove('hidden');
          this.renderPaletteGrid();
        } else {
          modal.classList.add('hidden');
        }
      },

      renderPaletteGrid() {
        const container = document.getElementById('paletteGridButtons');
        container.innerHTML = this.sessionQuestions.map((q, idx) => {
          const isAnswered = !!this.userAnswers[idx];
          const isFlagged = this.bookmarks.has(q.id);
          const isCurrent = idx === this.currentIndex;

          let btnClass = 'h-10 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center relative ';
          if (isCurrent) {
            btnClass += 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-cockpit-950 ';
          }
          if (isFlagged) {
            btnClass += 'bg-amber-500 text-slate-950 ';
          } else if (isAnswered) {
            btnClass += 'bg-emerald-600 text-white ';
          } else {
            btnClass += 'bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 border border-cockpit-border ';
          }

          return '<button onclick="app.jumpToQuestion(' + idx + ')" class="' + btnClass + '">' +
            (idx + 1) +
            (isFlagged ? '<span class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white"></span>' : '') +
          '</button>';
        }).join('');
      },

      confirmExitExam() {
        sound.click();
        this.showConfirmModal({
          title: 'Exit Practice Session?',
          message: 'Are you sure you want to exit? Your current progress in this session will not be graded.',
          okText: 'Exit to Menu',
          onOk: () => {
            this.stopTimer();
            this.goHome();
          }
        });
      },

      confirmFinishExam() {
        sound.click();
        const total = this.sessionQuestions.length;
        const answeredCount = Object.keys(this.userAnswers).length;
        const unansweredCount = total - answeredCount;

        let msg = 'You have answered ' + answeredCount + ' of ' + total + ' questions.';
        if (unansweredCount > 0) {
          msg += ' There are ' + unansweredCount + ' unanswered questions remaining. Do you still want to submit?';
        } else {
          msg += ' Are you ready to submit and view your detailed analytics?';
        }

        this.showConfirmModal({
          title: 'Submit Examination?',
          message: msg,
          okText: 'Submit & View Results',
          onOk: () => {
            this.calculateAndShowSummary();
          }
        });
      },

      calculateAndShowSummary() {
        this.stopTimer();
        sound.complete();

        let correctCount = 0;
        let incorrectCount = 0;
        let unansweredCount = 0;

        const topicStats = {};
        topicMetadata.forEach(t => {
          topicStats[t.code] = { name: t.name, total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        });

        const sessionMistakesList = [];

        this.sessionQuestions.forEach((q, idx) => {
          const userAns = this.userAnswers[idx];
          const t = topicStats[q.topic] || { name: q.topic, total: 0, correct: 0, incorrect: 0, unanswered: 0 };
          t.total++;

          if (!userAns) {
            unansweredCount++;
            t.unanswered++;
            this.mistakes.add(q.id);
            sessionMistakesList.push(q);
          } else if (userAns === q.correct) {
            correctCount++;
            t.correct++;
            if (this.mistakes.has(q.id)) this.mistakes.delete(q.id);
          } else {
            incorrectCount++;
            t.incorrect++;
            this.mistakes.add(q.id);
            sessionMistakesList.push(q);
          }
        });

        this.sessionMistakesList = sessionMistakesList;
        this.saveStorage();

        const total = this.sessionQuestions.length;
        const percentage = Math.round((correctCount / total) * 100);
        const isPass = percentage >= 75;

        const sessionLog = {
          date: new Date().toISOString(),
          mode: this.mode,
          total: total,
          correctCount: correctCount,
          percentage: percentage,
          timeSpent: this.timeElapsedSeconds,
          isPass: isPass
        };
        this.examHistory.unshift(sessionLog);
        if (this.examHistory.length > 50) this.examHistory.pop();
        this.saveStorage();

        if (isPass && typeof confetti === 'function') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        document.getElementById('viewExam').classList.add('hidden');
        document.getElementById('viewSetup').classList.add('hidden');
        document.getElementById('viewSummary').classList.remove('hidden');

        const passBadge = document.getElementById('summaryPassBadge');
        const heroGlow = document.getElementById('summaryHeroGlow');
        const scoreCircle = document.getElementById('summaryScoreCircle');
        const scoreText = document.getElementById('summaryPercentScore');

        scoreText.textContent = percentage + '%';
        document.getElementById('summaryFractionScore').textContent = correctCount + ' / ' + total + ' Correct';

        if (isPass) {
          passBadge.className = 'inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 shadow-glow-emerald';
          passBadge.innerHTML = '<i data-lucide="check-circle-2" class="w-4 h-4"></i> <span>RESULT: PASS (CAAT STANDARDS MET)</span>';
          heroGlow.className = 'absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none';
          scoreCircle.className = 'inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-emerald-500 bg-cockpit-900/90 shadow-glow-emerald';
        } else {
          passBadge.className = 'inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold font-mono uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/60 shadow-glow-rose';
          passBadge.innerHTML = '<i data-lucide="alert-triangle" class="w-4 h-4"></i> <span>RESULT: FAIL (BELOW 75% THRESHOLD)</span>';
          heroGlow.className = 'absolute inset-0 bg-rose-500/10 blur-3xl pointer-events-none';
          scoreCircle.className = 'inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-rose-500 bg-cockpit-900/90 shadow-glow-rose';
        }

        const mins = Math.floor(this.timeElapsedSeconds / 60).toString().padStart(2, '0');
        const secs = (this.timeElapsedSeconds % 60).toString().padStart(2, '0');
        document.getElementById('summaryTimeTaken').textContent = mins + ':' + secs;
        document.getElementById('summaryCorrectCount').textContent = correctCount;
        document.getElementById('summaryIncorrectCount').textContent = incorrectCount;
        document.getElementById('summaryUnansweredCount').textContent = unansweredCount;
        document.getElementById('sessionMistakesBtnCount').textContent = sessionMistakesList.length;

        const btnMistakes = document.getElementById('btnRetrySessionMistakes');
        if (sessionMistakesList.length === 0) {
          btnMistakes.classList.add('hidden');
        } else {
          btnMistakes.classList.remove('hidden');
        }

        const topicGrid = document.getElementById('topicAccuracyGrid');
        topicGrid.innerHTML = Object.entries(topicStats)
          .filter(([code, data]) => data.total > 0)
          .map(([code, data]) => {
            const pct = Math.round((data.correct / data.total) * 100);
            const isTopicPass = pct >= 75;
            return '<div class="glass-card p-4 rounded-xl border border-cockpit-border space-y-2">' +
              '<div class="flex items-center justify-between">' +
                '<span class="text-xs font-mono font-bold text-cyan-300">' + code + '</span>' +
                '<span class="text-xs font-mono font-bold ' + (isTopicPass ? 'text-emerald-400' : 'text-rose-400') + '">' + pct + '% (' + data.correct + '/' + data.total + ')</span>' +
              '</div>' +
              '<p class="text-xs text-slate-300 truncate">' + data.name + '</p>' +
              '<div class="w-full bg-cockpit-800 rounded-full h-1.5 overflow-hidden">' +
                '<div class="h-full ' + (isTopicPass ? 'bg-emerald-500' : 'bg-rose-500') + '" style="width: ' + pct + '%"></div>' +
              '</div>' +
            '</div>';
          }).join('');

        this.filterReviewList('all');
        lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      filterReviewList(filterType, page = 1, shouldScroll = false) {
        this.activeReviewFilter = filterType;
        sound.click();

        const tabs = {
          all: document.getElementById('tabReviewAll'),
          incorrect: document.getElementById('tabReviewIncorrect'),
          correct: document.getElementById('tabReviewCorrect'),
          flagged: document.getElementById('tabReviewFlagged')
        };
        Object.entries(tabs).forEach(([key, btn]) => {
          if (btn) {
            if (key === filterType) {
              btn.className = 'px-3 py-1 rounded-lg bg-cyan-600 text-slate-950 font-bold';
            } else {
              btn.className = 'px-3 py-1 rounded-lg text-slate-300 hover:text-white';
            }
          }
        });

        this.reviewFilteredList = this.sessionQuestions.map((q, idx) => {
          const userAns = this.userAnswers[idx];
          const isCorrect = userAns === q.correct;
          const isFlagged = this.bookmarks.has(q.id);

          return { q, idx, userAns, isCorrect, isFlagged };
        }).filter(item => {
          if (filterType === 'incorrect') return !item.isCorrect;
          if (filterType === 'correct') return item.isCorrect;
          if (filterType === 'flagged') return item.isFlagged;
          return true;
        });

        this.renderReviewPage(page, shouldScroll);
      },

      renderReviewPage(page, shouldScroll = false) {
        const total = this.reviewFilteredList.length;
        const pageSize = this.reviewPageSize;
        const totalPages = Math.ceil(total / pageSize) || 1;

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        this.reviewCurrentPage = page;

        const container = document.getElementById('reviewQuestionsContainer');
        const topBar = document.getElementById('reviewPaginationTop');
        const bottomBar = document.getElementById('reviewPaginationBottom');

        if (total === 0) {
          container.innerHTML = '<div class="p-8 text-center text-slate-500 glass-card rounded-xl">' +
            '<i data-lucide="info" class="w-6 h-6 mx-auto mb-2 opacity-50"></i>' +
            '<p class="text-xs">No questions match this review filter.</p>' +
          '</div>';
          if (topBar) { topBar.classList.add('hidden'); topBar.classList.remove('flex'); }
          if (bottomBar) { bottomBar.classList.add('hidden'); bottomBar.innerHTML = ''; }
          lucide.createIcons();
          return;
        }

        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, total);
        const pagedItems = this.reviewFilteredList.slice(startIndex, endIndex);

        container.innerHTML = pagedItems.map(({ q, idx, userAns, isCorrect, isFlagged }) => {
          return '<div class="glass-card p-5 rounded-xl border space-y-4 ' + (isCorrect ? 'review-card-correct' : 'review-card-incorrect') + '">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<div class="flex items-center space-x-2">' +
                '<span class="font-mono font-bold text-xs review-id-badge ' + (isCorrect ? 'text-emerald-400' : 'text-rose-400') + '">' +
                  '#' + (idx + 1) + ' (Bank ID ' + q.id + ')' +
                '</span>' +
                '<span class="search-badge-topic text-[10px] font-mono px-2 py-0.5 rounded">' + q.topic + '</span>' +
                '<span class="search-badge-lo text-[10px] font-mono px-2 py-0.5 rounded">LO: ' + q.LO + '</span>' +
              '</div>' +
              '<div class="flex items-center space-x-2">' +
                (isFlagged ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1"><i data-lucide="bookmark" class="w-3 h-3 fill-current"></i><span>Flagged</span></span>' : '') +
                '<span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded ' + (isCorrect ? 'review-status-correct' : 'review-status-incorrect') + '">' +
                  (isCorrect ? 'CORRECT' : (userAns ? 'INCORRECT' : 'SKIPPED')) +
                '</span>' +
              '</div>' +
            '</div>' +

            '<h4 class="text-sm font-semibold text-white leading-relaxed">' + q.question + '</h4>' +

            '<div class="space-y-1.5 text-xs font-sans">' +
              '<div class="p-2.5 rounded-lg border ' + (isCorrect ? 'review-correct-box' : 'review-incorrect-box') + '">' +
                '<span class="font-bold">คำตอบที่คุณเลือก:</span> ' + (userAns || '<em class="opacity-70">ไม่ได้ตอบ (Unanswered)</em>') +
              '</div>' +
              (!isCorrect ? (
                '<div class="p-2.5 rounded-lg border review-correct-box">' +
                  '<span class="font-bold">เฉลยที่ถูกต้อง:</span> ' + q.correct +
                '</div>'
              ) : '') +
            '</div>' +

            '<div class="p-3 rounded-lg review-exp-box text-xs space-y-1">' +
              '<div class="text-[11px] font-mono font-semibold exp-header flex items-center space-x-1">' +
                '<i data-lucide="info" class="w-3.5 h-3.5"></i>' +
                '<span>EXPLANATION:</span>' +
              '</div>' +
              '<p class="leading-relaxed">' + q.explanation + '</p>' +
            '</div>' +
          '</div>';
        }).join('');

        if (total > pageSize) {
          const infoText = '<span>แสดงข้อ <strong>' + (startIndex + 1) + ' - ' + endIndex + '</strong> จากทั้งหมด <strong>' + total + '</strong> ข้อ</span>' +
            '<span class="text-slate-400">หน้า ' + page + ' / ' + totalPages + '</span>';

          if (topBar) {
            topBar.innerHTML = infoText;
            topBar.classList.remove('hidden');
            topBar.classList.add('flex');
          }

          if (bottomBar) {
            bottomBar.innerHTML = this.buildPaginationHtml(page, totalPages, 'app.goToReviewPage');
            bottomBar.classList.remove('hidden');
          }
        } else {
          if (topBar) { topBar.classList.add('hidden'); topBar.classList.remove('flex'); }
          if (bottomBar) { bottomBar.classList.add('hidden'); bottomBar.innerHTML = ''; }
        }

        lucide.createIcons();

        if (shouldScroll) {
          const target = document.getElementById('reviewSectionWrapper');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      },

      goToReviewPage(targetPage) {
        sound.click();
        this.renderReviewPage(targetPage, true);
      },

      buildPaginationHtml(currentPage, totalPages, callbackName) {
        let html = '<div class="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">';
        
        const isFirst = currentPage <= 1;
        const isLast = currentPage >= totalPages;

        html += '<div class="flex flex-wrap items-center gap-1.5">';
        html += '<button type="button" onclick="' + (isFirst ? '' : callbackName + '(' + (currentPage - 1) + ')') + '" ' +
          'class="px-2.5 py-1.5 rounded-lg border transition flex items-center space-x-1 ' +
          (isFirst ? 'opacity-40 cursor-not-allowed bg-cockpit-900 border-cockpit-border text-slate-500' : 'bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-white border-cockpit-border') + '">' +
          '<i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>' +
          '<span>ก่อนหน้า</span>' +
        '</button>';

        let pagesToShow = [];
        if (totalPages <= 7) {
          for (let p = 1; p <= totalPages; p++) pagesToShow.push(p);
        } else {
          pagesToShow.push(1);
          if (currentPage > 3) pagesToShow.push('...');
          
          let start = Math.max(2, currentPage - 1);
          let end = Math.min(totalPages - 1, currentPage + 1);
          for (let p = start; p <= end; p++) pagesToShow.push(p);

          if (currentPage < totalPages - 2) pagesToShow.push('...');
          pagesToShow.push(totalPages);
        }

        pagesToShow.forEach(item => {
          if (item === '...') {
            html += '<span class="px-2 py-1 text-slate-500 select-none">...</span>';
          } else {
            const isActive = item === currentPage;
            html += '<button type="button" onclick="' + callbackName + '(' + item + ')" ' +
              'class="w-8 h-8 rounded-lg border text-xs font-bold transition flex items-center justify-center ' +
              (isActive ? 'bg-cyan-600 border-cyan-500 text-slate-950 shadow-glow-cyan pagination-btn-active' : 'bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-white border-cockpit-border pagination-btn-inactive') + '">' +
              item +
            '</button>';
          }
        });

        html += '<button type="button" onclick="' + (isLast ? '' : callbackName + '(' + (currentPage + 1) + ')') + '" ' +
          'class="px-2.5 py-1.5 rounded-lg border transition flex items-center space-x-1 ' +
          (isLast ? 'opacity-40 cursor-not-allowed bg-cockpit-900 border-cockpit-border text-slate-500' : 'bg-cockpit-850 hover:bg-cockpit-800 text-slate-300 hover:text-white border-cockpit-border') + '">' +
          '<span>ถัดไป</span>' +
          '<i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>' +
        '</button>';
        html += '</div>';

        html += '<div class="text-slate-400 text-[11px]">' +
          'หน้า <strong class="text-cyan-400">' + currentPage + '</strong> จากทั้งหมด <strong>' + totalPages + '</strong> หน้า' +
        '</div>';

        html += '</div>';
        return html;
      },

      copyPromptPay(number) {
        sound.click();
        const copyAction = () => {
          const btn = document.getElementById('btnCopyPromptPay');
          const btnText = document.getElementById('btnCopyPromptPayText');
          if (btn && btnText) {
            const originalContent = btn.innerHTML;
            btn.classList.remove('bg-cyan-600', 'hover:bg-cyan-500');
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>คัดลอกสำเร็จ!</span>';
            lucide.createIcons();
            setTimeout(() => {
              btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
              btn.classList.add('bg-cyan-600', 'hover:bg-cyan-500');
              btn.innerHTML = originalContent;
              lucide.createIcons();
            }, 2200);
          }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(number).then(copyAction).catch(() => {
            prompt('คัดลอกเลขพร้อมเพย์:', number);
          });
        } else {
          prompt('คัดลอกเลขพร้อมเพย์:', number);
        }
      },

      practiceSessionMistakes() {
        if (!this.sessionMistakesList || this.sessionMistakesList.length === 0) {
          alert('ไม่มีข้อที่ตอบผิดในรอบนี้');
          return;
        }
        this.startPracticeSession(this.sessionMistakesList);
      },

      retakeCurrentConfig() {
        this.startPracticeSession();
      },

      goHome() {
        sound.click();
        this.stopTimer();
        document.getElementById('viewExam').classList.add('hidden');
        document.getElementById('viewSummary').classList.add('hidden');
        document.getElementById('viewSetup').classList.remove('hidden');
        this.updateHeaderStats();
        this.updateFilterCounts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      openMistakesManager() {
        if (this.mistakes.size === 0) {
          alert('ยินดีด้วย! คุณยังไม่มีรายการข้อที่ตอบผิดสะสม');
          return;
        }
        this.setMode('study');
        this.mistakesOnly = true;
        document.getElementById('toggleMistakesOnly').checked = true;
        this.updateFilterCounts();
        this.startPracticeSession();
      },

      openBookmarksManager() {
        if (this.bookmarks.size === 0) {
          alert('คุณยังไม่ได้ติดดาว/Flag ข้อสอบใดไว้');
          return;
        }
        this.setMode('study');
        this.bookmarksOnly = true;
        document.getElementById('toggleBookmarksOnly').checked = true;
        this.updateFilterCounts();
        this.startPracticeSession();
      },

      clearAllData() {
        sound.click();
        this.showConfirmModal({
          title: 'Reset All Progress & Storage?',
          message: 'This will reset your recorded mistakes, bookmarks, and test history. This action cannot be undone.',
          okText: 'Reset Everything',
          onOk: () => {
            localStorage.removeItem('pof_mistakes');
            localStorage.removeItem('pof_bookmarks');
            localStorage.removeItem('pof_history');
            this.mistakes.clear();
            this.bookmarks.clear();
            this.examHistory = [];
            this.updateHeaderStats();
            this.updateFilterCounts();
            alert('ล้างข้อมูลความคืบหน้าทั้งหมดเรียบร้อยแล้ว');
          }
        });
      },

      showConfirmModal(options) {
        const modal = document.getElementById('modalConfirm');
        document.getElementById('confirmModalTitle').textContent = options.title;
        document.getElementById('confirmModalMessage').textContent = options.message;
        
        const okBtn = document.getElementById('confirmModalOkBtn');
        const cancelBtn = document.getElementById('confirmModalCancelBtn');
        
        okBtn.textContent = options.okText || 'Confirm';
        cancelBtn.textContent = options.cancelText || 'Cancel';

        const close = () => {
          modal.classList.add('hidden');
          okBtn.onclick = null;
          cancelBtn.onclick = null;
        };

        okBtn.onclick = () => {
          close();
          if (options.onOk) options.onOk();
        };

        cancelBtn.onclick = () => {
          close();
        };

        modal.classList.remove('hidden');
      },

      // ==========================================
      // SEARCH ENGINE & MODAL METHODS
      // ==========================================
      openSearchModal(initialQuery = '') {
        sound.click();
        const modal = document.getElementById('modalSearch');
        modal.classList.remove('hidden');
        
        // Populate topic filter dropdown once
        const topicSelect = document.getElementById('searchFilterTopic');
        if (topicSelect && topicSelect.options.length <= 1) {
          topicMetadata.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.code;
            opt.textContent = t.code + ' ' + t.name;
            topicSelect.appendChild(opt);
          });
        }

        const input = document.getElementById('searchInputField');
        if (initialQuery) {
          input.value = initialQuery;
          this.searchQuery = initialQuery;
        }
        input.focus();
        this.executeSearch();
        lucide.createIcons();
      },

      closeSearchModal() {
        document.getElementById('modalSearch').classList.add('hidden');
      },

      setSearchScope(scope) {
        this.searchScope = scope;
        const tabs = ['all', 'question', 'correct', 'explanation'];
        tabs.forEach(t => {
          const btn = document.getElementById('searchScopeTab_' + t);
          if (btn) {
            if (t === scope) {
              btn.className = 'px-2.5 py-1 rounded-lg bg-cyan-600 text-slate-950 font-bold transition';
            } else {
              btn.className = 'px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition';
            }
          }
        });
        sound.click();
        this.executeSearch();
      },

      handleSearchInput(val) {
        this.searchQuery = val;
        const clearBtn = document.getElementById('searchClearBtn');
        if (val && val.length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
        this.executeSearch();
      },

      clearSearchQuery() {
        const input = document.getElementById('searchInputField');
        input.value = '';
        this.searchQuery = '';
        document.getElementById('searchClearBtn').classList.add('hidden');
        input.focus();
        this.executeSearch();
      },

      setSuggestedSearch(keyword) {
        const input = document.getElementById('searchInputField');
        input.value = keyword;
        this.searchQuery = keyword;
        document.getElementById('searchClearBtn').classList.remove('hidden');
        input.focus();
        sound.click();
        this.executeSearch();
      },

      escapeHtml(text) {
        if (!text) return '';
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      },

      highlightText(text, query) {
        if (!text) return '';
        const escapedText = this.escapeHtml(text);
        if (!query || query.trim().length < 3) return escapedText;
        
        const q = query.trim();
        const specials = ['\\\\', '^', '$', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '/'];
        let escapedQ = q;
        specials.forEach(ch => {
          escapedQ = escapedQ.split(ch).join('\\\\' + ch);
        });
        try {
          const regex = new RegExp('(' + escapedQ + ')', 'gi');
          return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
        } catch (e) {
          return escapedText;
        }
      },

      executeSearch() {
        const topicVal = document.getElementById('searchFilterTopic').value;
        const diffVal = document.getElementById('searchFilterDifficulty').value;
        this.searchTopic = topicVal;
        this.searchDifficulty = diffVal;

        const rawQ = (this.searchQuery || '').trim();
        const qLower = rawQ.toLowerCase();

        const countText = document.getElementById('searchResultsCountText');
        const actionBtns = document.getElementById('searchActionButtons');
        const container = document.getElementById('searchResultsContainer');
        const bottomBar = document.getElementById('searchPaginationBottom');

        if (qLower.length < 3) {
          actionBtns.classList.add('hidden');
          actionBtns.classList.remove('flex');
          if (bottomBar) { bottomBar.classList.add('hidden'); bottomBar.innerHTML = ''; }
          this.lastSearchResults = [];

          if (qLower.length === 0) {
            countText.innerHTML = '<span class="text-slate-400">พิมพ์คำค้นหาเพื่อเริ่มค้นหาในคลังข้อสอบ 200 ข้อ (ขั้นต่ำ 3 ตัวอักษร)</span>';
          } else {
            countText.innerHTML = '<span class="text-amber-400 font-semibold">⚠️ กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร (พิมพ์แล้ว ' + qLower.length + '/3 ตัวอักษร)</span>';
          }

          // Render Suggestions and instructions
          const suggestedKeywords = [
            'density', 'stalling angle', 'boundary layer', 'aspect ratio',
            'sweepback', 'dihedral', 'mach tuck', 'ground effect',
            'adverse yaw', 'kg/m³', 'weight', 'parasite drag', 'induced drag',
            'critical Mach', 'slipstream', 'flutter', 'elevator'
          ];

          container.innerHTML = '<div class="p-6 rounded-2xl glass-card border border-cockpit-border text-center space-y-4">' +
            '<div class="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">' +
              '<i data-lucide="sparkles" class="w-6 h-6"></i>' +
            '</div>' +
            '<div>' +
              '<h4 class="text-sm font-bold text-white">ค้นหาคำศัพท์หรือประเด็นที่ต้องการทบทวน</h4>' +
              '<p class="text-xs text-slate-400 mt-1">ระบบจะค้นหาโจทย์ ตัวเลือก เฉลยที่ถูกต้อง และคำอธิบายอย่างละเอียด</p>' +
            '</div>' +
            '<div class="pt-2">' +
              '<span class="text-[11px] font-mono text-cyan-300 block mb-2 font-semibold">คำค้นหายอดนิยม (คลิกเพื่อค้นหา):</span>' +
              '<div class="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">' +
                suggestedKeywords.map(k => {
                  return '<button type="button" onclick="app.setSuggestedSearch(\\x27' + k + '\\x27)" class="px-2.5 py-1 rounded-lg bg-cockpit-850 hover:bg-cyan-950/60 border border-cockpit-border hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-cyan-300 transition">' +
                    k +
                  '</button>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>';

          lucide.createIcons();
          return;
        }

        // Perform search across questions
        const results = questions.filter(q => {
          // Topic Filter
          if (this.searchTopic !== 'all' && q.topic !== this.searchTopic) {
            return false;
          }
          // Difficulty Filter
          if (this.searchDifficulty !== 'all' && q.difficulty !== this.searchDifficulty) {
            return false;
          }

          const qText = (q.question || '').toLowerCase();
          const correctText = (q.correct || '').toLowerCase();
          const expText = (q.explanation || '').toLowerCase();
          const loText = (q.LO || '').toLowerCase();
          const topicNameText = (q.topicName || '').toLowerCase();
          const optionsText = (q.options || []).join(' ').toLowerCase();

          if (this.searchScope === 'question') {
            return qText.includes(qLower);
          } else if (this.searchScope === 'correct') {
            return correctText.includes(qLower);
          } else if (this.searchScope === 'explanation') {
            return expText.includes(qLower) || loText.includes(qLower);
          } else {
            // 'all'
            return qText.includes(qLower) ||
                   correctText.includes(qLower) ||
                   expText.includes(qLower) ||
                   loText.includes(qLower) ||
                   topicNameText.includes(qLower) ||
                   optionsText.includes(qLower);
          }
        });

        this.lastSearchResults = results;

        if (results.length === 0) {
          countText.innerHTML = '<span class="text-rose-400 font-semibold">ไม่พบข้อสอบที่ตรงกับ "' + this.escapeHtml(rawQ) + '"</span>';
          actionBtns.classList.add('hidden');
          actionBtns.classList.remove('flex');
          if (bottomBar) { bottomBar.classList.add('hidden'); bottomBar.innerHTML = ''; }

          container.innerHTML = '<div class="p-8 rounded-2xl glass-card border border-cockpit-border text-center space-y-3">' +
            '<div class="w-12 h-12 mx-auto rounded-2xl bg-cockpit-850 text-slate-400 flex items-center justify-center">' +
              '<i data-lucide="search-x" class="w-6 h-6"></i>' +
            '</div>' +
            '<h4 class="text-sm font-bold text-white">ไม่พบผลลัพธ์การค้นหา</h4>' +
            '<p class="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">' +
              'ลองปรับคำค้นหาให้สั้นลง ตรวจสอบตัวสะกด หรือเปลี่ยนตัวเลือก Scope เป็น <span class="text-cyan-400">All Fields</span>' +
            '</p>' +
            '<button onclick="app.setSearchScope(\\x27all\\x27)" class="px-4 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-xs text-cyan-300 font-mono">' +
              'Reset Scope to All Fields' +
            '</button>' +
          '</div>';
        } else {
          countText.innerHTML = '<span class="text-cyan-400 font-bold font-mono">พบ ' + results.length + ' ข้อ</span> <span class="text-slate-400">จาก 200 ข้อ ในคลังข้อสอบ</span>';
          actionBtns.classList.remove('hidden');
          actionBtns.classList.add('flex');
          document.getElementById('searchStudyCount').textContent = results.length;

          this.searchCurrentPage = 1;
          this.renderSearchResults(1);
        }

        lucide.createIcons();
      },

      renderSearchResults(page = 1, shouldScroll = false) {
        const container = document.getElementById('searchResultsContainer');
        const bottomBar = document.getElementById('searchPaginationBottom');
        const rawQ = (this.searchQuery || '').trim();

        const total = this.lastSearchResults.length;
        const pageSize = this.searchPageSize;
        const totalPages = Math.ceil(total / pageSize) || 1;

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        this.searchCurrentPage = page;

        if (total === 0) {
          if (bottomBar) { bottomBar.classList.add('hidden'); bottomBar.innerHTML = ''; }
          return;
        }

        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, total);
        const pagedResults = this.lastSearchResults.slice(startIndex, endIndex);

        container.innerHTML = pagedResults.map((q, idx) => {
          const isFlagged = this.bookmarks.has(q.id);
          const isMistake = this.mistakes.has(q.id);

          return '<div class="p-4 sm:p-5 rounded-2xl glass-card border border-cockpit-border hover:border-cyan-500/40 transition space-y-3.5 search-result-card">' +
            // Header Bar
            '<div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cockpit-border/60">' +
              '<div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">' +
                '<span class="search-badge-id font-bold px-2.5 py-0.5 rounded-md">ID: #' + q.id + '</span>' +
                '<span class="search-badge-topic px-2 py-0.5 rounded-md">' + q.topic + ' ' + q.topicName + '</span>' +
                '<span class="search-badge-lo px-2 py-0.5 rounded-md">' + q.LO + '</span>' +
                '<span class="search-badge-diff px-2 py-0.5 rounded-md">' + q.difficulty + '</span>' +
                (isMistake ? '<span class="search-badge-mistake px-2 py-0.5 rounded-md">Mistake Bank</span>' : '') +
              '</div>' +
              // Bookmark toggle button
              '<button type="button" onclick="app.toggleBookmarkFromSearch(' + q.id + ', event)" class="p-1.5 rounded-lg border transition flex items-center space-x-1 text-xs font-mono ' +
                (isFlagged ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-cockpit-850 text-slate-400 hover:text-amber-300 border-cockpit-border') + '" title="' + (isFlagged ? 'Remove Bookmark' : 'Bookmark Question') + '">' +
                '<i data-lucide="bookmark" class="w-3.5 h-3.5 ' + (isFlagged ? 'fill-current' : '') + '"></i>' +
                '<span class="text-[11px]">' + (isFlagged ? 'Flagged' : 'Flag') + '</span>' +
              '</button>' +
            '</div>' +

            // Question Prompt
            '<h4 class="text-sm sm:text-base font-semibold text-white leading-relaxed">' +
              this.highlightText(q.question, rawQ) +
            '</h4>' +

            // Options List
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">' +
              q.options.map((opt, oIdx) => {
                const isCorrect = (opt === q.correct);
                const optLetter = String.fromCharCode(65 + oIdx);
                return '<div class="p-2.5 rounded-xl border flex items-start space-x-2 ' +
                  (isCorrect ? 'search-correct-option' : 'search-normal-option') + '">' +
                  '<span class="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 badge-letter">' +
                    optLetter +
                  '</span>' +
                  '<div class="flex-grow">' +
                    '<span>' + this.highlightText(opt, rawQ) + '</span>' +
                    (isCorrect ? '<span class="ml-1 text-[10px] font-mono font-bold correct-tag">✓ (เฉลยที่ถูกต้อง)</span>' : '') +
                  '</div>' +
                '</div>';
              }).join('') +
            '</div>' +

            // Explanation & LO
            '<div class="p-3 rounded-xl search-exp-box border text-xs space-y-1">' +
              '<div class="text-[11px] font-mono font-semibold exp-header flex items-center space-x-1">' +
                '<i data-lucide="info" class="w-3.5 h-3.5"></i>' +
                '<span>EXPLANATION:</span>' +
              '</div>' +
              '<p class="leading-relaxed">' + this.highlightText(q.explanation, rawQ) + '</p>' +
            '</div>' +
          '</div>';
        }).join('');

        if (total > pageSize && bottomBar) {
          bottomBar.innerHTML = this.buildPaginationHtml(page, totalPages, 'app.goToSearchPage');
          bottomBar.classList.remove('hidden');
        } else if (bottomBar) {
          bottomBar.classList.add('hidden');
          bottomBar.innerHTML = '';
        }

        lucide.createIcons();

        if (shouldScroll) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goToSearchPage(targetPage) {
        sound.click();
        this.renderSearchResults(targetPage, true);
      },

      toggleBookmarkFromSearch(id, event) {
        if (event) event.stopPropagation();
        if (this.bookmarks.has(id)) {
          this.bookmarks.delete(id);
        } else {
          this.bookmarks.add(id);
        }
        this.saveStorage();
        this.renderSearchResults(this.searchCurrentPage, false);
        sound.click();
      },

      startPracticeFromSearch(mode = 'study') {
        if (!this.lastSearchResults || this.lastSearchResults.length === 0) return;
        this.setMode(mode);
        this.closeSearchModal();
        this.startPracticeSession(this.lastSearchResults);
      },

      setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
          // Open search modal with Ctrl+K or Cmd+K
          if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            const searchModal = document.getElementById('modalSearch');
            if (searchModal.classList.contains('hidden')) {
              this.openSearchModal();
            } else {
              this.closeSearchModal();
            }
            return;
          }

          const isSearchOpen = !document.getElementById('modalSearch').classList.contains('hidden');
          const isGridOpen = !document.getElementById('modalQuestionGrid').classList.contains('hidden');
          const isConfirmOpen = !document.getElementById('modalConfirm').classList.contains('hidden');

          if (e.key === 'Escape') {
            if (isSearchOpen) {
              this.closeSearchModal();
              return;
            }
            if (isGridOpen) {
              document.getElementById('modalQuestionGrid').classList.add('hidden');
              return;
            }
            if (isConfirmOpen) {
              document.getElementById('modalConfirm').classList.add('hidden');
              return;
            }
          }

          if (isSearchOpen || isGridOpen || isConfirmOpen) return;

          const isExamScreen = !document.getElementById('viewExam').classList.contains('hidden');
          if (!isExamScreen) return;

          const q = this.sessionQuestions[this.currentIndex];
          if (!q) return;

          const key = e.key.toUpperCase();
          const optionMap = {
            '1': 0, 'A': 0,
            '2': 1, 'B': 1,
            '3': 2, 'C': 2,
            '4': 3, 'D': 3
          };

          if (key in optionMap) {
            e.preventDefault();
            const optIdx = optionMap[key];
            if (q.shuffledOptions[optIdx]) {
              this.selectOption(q.shuffledOptions[optIdx]);
            }
          } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (this.mode === 'study') {
              this.checkCurrentStudyAnswer();
            } else {
              this.toggleBookmarkCurrent();
            }
          } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextQuestion();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevQuestion();
          }
        });
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
if (fs.existsSync('PoF-QuestionBank-website.html')) {
  fs.writeFileSync('PoF-QuestionBank-website.html', htmlContent, 'utf8');
}
console.log('Generated index.html and PoF-QuestionBank-website.html successfully!');
