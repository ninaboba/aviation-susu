/**
 * Quiz Web Application - Core Application Logic
 * Modular Static Site Engine with Dynamic Subject Loading,
 * State Persistence, Audio Effects, Search, and Analytics.
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = QuizStorage.getSoundEnabled();
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
  // Subjects and active questions
  subjects: [],
  currentSubject: null,
  questions: [],
  topicMetadata: [],

  // Quiz Engine State
  mode: 'study',
  selectedTopics: new Set(),
  questionCount: 20,
  unattemptedOnly: false,
  mistakesOnly: false,
  bookmarksOnly: false,
  isRetrySession: false,
  minMistakes: 1,

  sessionQuestions: [],
  currentIndex: 0,
  userAnswers: {},
  revealedInStudy: {},
  timerInterval: null,
  timeElapsedSeconds: 0,

  // User History & Bookmarks (scoped to active subject)
  attempted: new Set(),
  mistakes: new Set(),
  bookmarks: new Set(),
  examHistory: [],
  sessionMistakesList: [],

  // Review & Summary State
  activeReviewFilter: 'all',
  reviewCurrentPage: 1,
  reviewPageSize: 10,
  reviewFilteredList: [],

  // Theme & Font Size
  theme: 'dark',
  fontSize: 'normal',
  fontSizes: ['sm', 'normal', 'lg', 'xl'],
  fontSizeLabels: {
    sm: '90%',
    normal: '100%',
    lg: '115%',
    xl: '130%'
  },

  // Search Engine State
  searchScope: 'all',
  searchQuery: '',
  searchTopic: 'all',
  searchDifficulty: 'all',
  lastSearchResults: [],
  searchCurrentPage: 1,
  searchPageSize: 10,

  // Application Version & Release Metadata
  version: 'v2.3.2',
  releaseDate: '17 Sep 2026, 01:25',

  get currentSubjectId() {
    return this.currentSubject ? this.currentSubject.id : (this.subjects[0] ? this.subjects[0].id : 'pof');
  },

  async init() {
    this.initVersionInfo();
    this.initTheme();
    this.initFontSize();
    this.setupKeyboardShortcuts();
    this.updateSoundIcon();

    await this.loadSubjects();
    lucide.createIcons();
  },

  initVersionInfo() {
    const heroVer = document.getElementById('heroAppVersion');
    if (heroVer) {
      heroVer.textContent = `${this.version} (${this.releaseDate})`;
    }
    const footerVer = document.getElementById('footerAppVersion');
    if (footerVer) {
      footerVer.textContent = this.version;
    }
    const footerDate = document.getElementById('footerAppDate');
    if (footerDate) {
      footerDate.textContent = `Updated: ${this.releaseDate} ICT`;
    }
  },

  /* ============================================================ */
  /* DYNAMIC SUBJECT LOADING                                       */
  /* ============================================================ */
  async loadSubjects() {
    try {
      if (window.EMBEDDED_SUBJECTS && Array.isArray(window.EMBEDDED_SUBJECTS)) {
        this.subjects = window.EMBEDDED_SUBJECTS;
      } else {
        const res = await fetch('./data/subjects.json?v=20260916_0025');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading subjects.json`);
        this.subjects = await res.json();
      }
      
      this.renderSubjectSelectors();

      // Check for saved subject or default to first
      const savedSubjectId = localStorage.getItem('quiz_active_subject_id');
      const targetSubject = this.subjects.find(s => s.id === savedSubjectId) || this.subjects[0];

      if (targetSubject) {
        await this.switchSubject(targetSubject.id);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
      const banner = document.getElementById('subjectTitleText');
      if (banner) banner.textContent = 'Error loading subject list';
    }
  },

  renderSubjectSelectors() {
    // Header subject dropdown
    const headerSelect = document.getElementById('headerSubjectSelect');
    if (headerSelect) {
      headerSelect.innerHTML = this.subjects.map(s => 
        `<option value="${s.id}">${s.title}</option>`
      ).join('');
    }

    // Setup dashboard subject selector (if present)
    const setupSelect = document.getElementById('dashboardSubjectSelect');
    if (setupSelect) {
      setupSelect.innerHTML = this.subjects.map(s => 
        `<option value="${s.id}">${s.title}</option>`
      ).join('');
    }
  },

  async switchSubject(subjectId) {
    const subject = this.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    this.currentSubject = subject;
    localStorage.setItem('quiz_active_subject_id', subject.id);

    // Sync select dropdowns
    const headerSelect = document.getElementById('headerSubjectSelect');
    if (headerSelect && headerSelect.value !== subject.id) headerSelect.value = subject.id;
    const setupSelect = document.getElementById('dashboardSubjectSelect');
    if (setupSelect && setupSelect.value !== subject.id) setupSelect.value = subject.id;

    // Load question data for this subject
    try {
      let rawQuestions;
      if (window.EMBEDDED_DATA && window.EMBEDDED_DATA[subject.id]) {
        rawQuestions = window.EMBEDDED_DATA[subject.id];
      } else {
        const res = await fetch(subject.file + '?v=20260916_0025');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${subject.file}`);
        rawQuestions = await res.json();
      }

      // Normalize questions to ensure options, correct, answer index
      this.questions = rawQuestions.map(q => {
        let correct = q.correct;
        if (!correct && q.options && q.answer !== undefined) {
          correct = q.options[q.answer];
        }
        return {
          ...q,
          correct: correct || (q.options ? q.options[0] : ''),
          answer: q.answer !== undefined ? q.answer : (q.options ? q.options.indexOf(correct) : 0)
        };
      });

      // Extract dynamic topic metadata
      const topicMap = new Map();
      this.questions.forEach(q => {
        const code = q.topic || 'General';
        const name = q.topicName || code;
        if (!topicMap.has(code)) {
          topicMap.set(code, { code, name, count: 0 });
        }
        topicMap.get(code).count++;
      });
      this.topicMetadata = Array.from(topicMap.values()).sort((a, b) => a.code.localeCompare(b.code));
      this.selectedTopics = new Set(this.topicMetadata.map(t => t.code));

      // Load user storage data for this subject
      this.attempted = QuizStorage.getAttempted(subject.id);
      this.mistakes = QuizStorage.getMistakes(subject.id);
      this.bookmarks = QuizStorage.getBookmarks(subject.id);
      this.examHistory = QuizStorage.getHistory(subject.id);

      // Update UI displays
      this.updateSubjectHeaderInfo();
      this.renderTopicGrid();
      this.populateSearchTopicFilter();
      this.updateFilterCounts();
      this.updateHeaderStats();

      // Check for an active session to offer Resume
      this.checkResumeSession();

      lucide.createIcons();
    } catch (err) {
      console.error(`Failed to load questions for subject ${subject.id}:`, err);
      alert(`ไม่สามารถโหลดข้อสอบวิชา ${subject.title} ได้ กรุณาตรวจสอบไฟล์ ${subject.file}`);
    }
  },

  handleSubjectChange(newSubjectId) {
    sound.click();
    this.switchSubject(newSubjectId);
  },

  updateSubjectHeaderInfo() {
    if (!this.currentSubject) return;

    // Header badge
    const headerBadge = document.getElementById('headerSubjectCode');
    if (headerBadge) headerBadge.textContent = this.currentSubject.code || this.currentSubject.id.toUpperCase();

    // Hero title & description
    const heroTitle = document.getElementById('heroSubjectTitle');
    if (heroTitle) heroTitle.textContent = this.currentSubject.title;

    const heroDesc = document.getElementById('heroSubjectDescription');
    if (heroDesc) {
      heroDesc.textContent = this.currentSubject.description || 
        `ชุดข้อสอบ ${this.questions.length} ข้อพร้อมระบบสุ่มคำตอบแบบ Fisher-Yates Shuffle, เฉลยละเอียด, ระบบจับเวลา และการวิเคราะห์ผลลัพธ์`;
    }

    const heroTotal = document.getElementById('heroBankTotal');
    if (heroTotal) heroTotal.textContent = this.questions.length;
  },

  /* ============================================================ */
  /* STATE PERSISTENCE & AUTO-SAVE / RESUME                      */
  /* ============================================================ */
  autoSaveSession() {
    if (!this.currentSubject || !this.sessionQuestions || this.sessionQuestions.length === 0) return;
    
    // Only save when actively on the exam screen
    const isExamActive = !document.getElementById('viewExam').classList.contains('hidden');
    if (!isExamActive) return;

    const payload = {
      subjectId: this.currentSubject.id,
      mode: this.mode,
      isRetrySession: this.isRetrySession,
      currentIndex: this.currentIndex,
      userAnswers: this.userAnswers,
      revealedInStudy: this.revealedInStudy,
      timeElapsedSeconds: this.timeElapsedSeconds,
      sessionQuestions: this.sessionQuestions
    };
    QuizStorage.saveSession(this.currentSubject.id, payload);
  },

  checkResumeSession() {
    const banner = document.getElementById('resumeSessionBanner');
    if (!banner || !this.currentSubject) return;

    const session = QuizStorage.getSession(this.currentSubject.id);
    if (session && session.sessionQuestions && session.sessionQuestions.length > 0) {
      const answeredCount = Object.keys(session.userAnswers || {}).length;
      const totalCount = session.sessionQuestions.length;
      const currentQNum = Math.min((session.currentIndex || 0) + 1, totalCount);

      document.getElementById('resumeSubjectName').textContent = this.currentSubject.title;
      document.getElementById('resumeModeBadge').textContent = (session.mode || 'exam').toUpperCase();
      document.getElementById('resumeCurrentIndex').textContent = currentQNum;
      document.getElementById('resumeTotalCount').textContent = totalCount;
      document.getElementById('resumeAnsweredCount').textContent = answeredCount;

      const mins = Math.floor((session.timeElapsedSeconds || 0) / 60);
      document.getElementById('resumeTimeSpent').textContent = `${mins} นาที`;

      banner.classList.remove('hidden');
      banner.classList.add('flex');
    } else {
      banner.classList.add('hidden');
      banner.classList.remove('flex');
    }
  },

  resumeSession() {
    sound.click();
    if (!this.currentSubject) return;
    const session = QuizStorage.getSession(this.currentSubject.id);
    if (!session || !session.sessionQuestions) return;

    this.mode = session.mode || 'exam';
    this.isRetrySession = session.isRetrySession || false;
    this.sessionQuestions = session.sessionQuestions;
    this.currentIndex = session.currentIndex || 0;
    this.userAnswers = session.userAnswers || {};
    this.revealedInStudy = session.revealedInStudy || {};
    this.timeElapsedSeconds = session.timeElapsedSeconds || 0;

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

  discardSession() {
    sound.click();
    if (!this.currentSubject) return;
    QuizStorage.clearSession(this.currentSubject.id);
    this.checkResumeSession();
  },

  /* ============================================================ */
  /* THEME & FONT SIZE                                            */
  /* ============================================================ */
  initFontSize() {
    const saved = QuizStorage.getFontSize();
    this.setFontSize(saved, false);
  },

  setFontSize(size, playSound = true) {
    if (!this.fontSizes.includes(size)) size = 'normal';
    this.fontSize = size;
    this.fontSizes.forEach(s => {
      document.documentElement.classList.remove('font-size-' + s);
    });
    document.documentElement.classList.add('font-size-' + size);
    QuizStorage.setFontSize(size);

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
    this.theme = QuizStorage.getTheme();
    this.applyTheme();
  },

  toggleTheme() {
    this.theme = (this.theme === 'dark') ? 'light' : 'dark';
    QuizStorage.setTheme(this.theme);
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

  /* ============================================================ */
  /* SOUND & STATS                                                */
  /* ============================================================ */
  toggleSound() {
    sound.enabled = !sound.enabled;
    QuizStorage.setSoundEnabled(sound.enabled);
    this.updateSoundIcon();
    if (sound.enabled) sound.click();
  },

  /* ============================================================ */
  /* HEADER OVERFLOW MENU                                         */
  /* ============================================================ */
  toggleHeaderMenu() {
    const dropdown = document.getElementById('headerOverflowDropdown');
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      dropdown.classList.remove('hidden');
      // Close when clicking outside
      setTimeout(() => {
        document.addEventListener('click', this._headerMenuOutsideHandler = (e) => {
          const wrap = document.getElementById('headerOverflowMenuWrap');
          if (wrap && !wrap.contains(e.target)) {
            this.closeHeaderMenu();
          }
        });
      }, 0);
    } else {
      this.closeHeaderMenu();
    }
  },

  closeHeaderMenu() {
    const dropdown = document.getElementById('headerOverflowDropdown');
    if (dropdown) dropdown.classList.add('hidden');
    if (this._headerMenuOutsideHandler) {
      document.removeEventListener('click', this._headerMenuOutsideHandler);
      this._headerMenuOutsideHandler = null;
    }
  },

  updateMenuDot() {
    const dot = document.getElementById('headerMenuDot');
    if (!dot) return;
    const mistakeCount = this.mistakes ? this.mistakes.size : 0;
    if (mistakeCount > 0) {
      dot.classList.remove('hidden');
    } else {
      dot.classList.add('hidden');
    }
  },

  updateSoundIcon() {
    const icon = document.getElementById('soundIcon');
    if (!icon) return;
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

  saveUserData() {
    if (!this.currentSubject) return;
    QuizStorage.saveAttempted(this.currentSubject.id, this.attempted);
    QuizStorage.saveMistakes(this.currentSubject.id, this.mistakes);
    QuizStorage.saveBookmarks(this.currentSubject.id, this.bookmarks);
    QuizStorage.saveHistory(this.currentSubject.id, this.examHistory);
    this.updateHeaderStats();
  },

  updateHeaderStats() {
    const unattemptedCount = this.questions ? this.questions.filter(q => !this.attempted.has(q.id)).length : 0;
    const minN = Math.max(1, parseInt(this.minMistakes, 10) || 1);
    const mistakeCount = this.mistakes ? this.mistakes.size : 0;
    const filteredMistakeCount = this.questions ? this.questions.filter(q => {
      const cnt = QuizStorage.getMistakeCount(this.currentSubjectId, q.id);
      const effectiveCount = Math.max(cnt, this.mistakes.has(q.id) ? 1 : 0);
      return effectiveCount >= minN;
    }).length : 0;
    const bookmarkCount = this.bookmarks ? this.bookmarks.size : 0;

    const elPanelUnattempted = document.getElementById('panelUnattemptedCount');
    if (elPanelUnattempted) elPanelUnattempted.textContent = unattemptedCount;

    const elHeaderMistakes = document.getElementById('headerMistakeCount');
    if (elHeaderMistakes) elHeaderMistakes.textContent = mistakeCount;
    const elPanelMistakes = document.getElementById('panelMistakeCount');
    if (elPanelMistakes) elPanelMistakes.textContent = this.mistakesOnly ? filteredMistakeCount : mistakeCount;

    const elHeaderBookmarks = document.getElementById('headerBookmarkCount');
    if (elHeaderBookmarks) elHeaderBookmarks.textContent = bookmarkCount;
    const elPanelBookmarks = document.getElementById('panelBookmarkCount');
    if (elPanelBookmarks) elPanelBookmarks.textContent = bookmarkCount;

    const histCount = this.examHistory ? this.examHistory.length : 0;
    const elHistCount = document.getElementById('historyCountText');
    if (elHistCount) elHistCount.textContent = histCount;
    const elHeroExamCount = document.getElementById('heroExamCount');
    if (elHeroExamCount) elHeroExamCount.textContent = histCount + (histCount === 1 ? ' Test' : ' Tests');

    const elHeroAvg = document.getElementById('heroAvgScore');
    if (elHeroAvg) {
      if (histCount > 0) {
        const avg = Math.round(this.examHistory.reduce((acc, c) => acc + c.percentage, 0) / histCount);
        elHeroAvg.textContent = avg + '%';
      } else {
        elHeroAvg.textContent = '-%';
      }
    }

    this.updateMenuDot();
  },

  /* ============================================================ */
  /* QUIZ SETUP CONFIGURATION                                     */
  /* ============================================================ */
  renderTopicGrid() {
    const container = document.getElementById('topicGridContainer');
    if (!container) return;

    // Calculate mistakes per topic in O(N) where N = ~271 (< 0.05ms)
    const mistakeCountByTopic = {};
    if (this.questions && this.mistakes) {
      this.questions.forEach(q => {
        if (this.mistakes.has(q.id)) {
          mistakeCountByTopic[q.topic] = (mistakeCountByTopic[q.topic] || 0) + 1;
        }
      });
    }

    const badgeEl = document.getElementById('topicMistakeTotalCount');
    if (badgeEl) {
      badgeEl.textContent = this.mistakes ? this.mistakes.size : 0;
    }

    container.innerHTML = this.topicMetadata.map(t => {
      const checked = this.selectedTopics.has(t.code) ? 'checked' : '';
      const mistakesInTopic = mistakeCountByTopic[t.code] || 0;

      let mistakeBadges = '';
      if (mistakesInTopic > 0) {
        mistakeBadges = '<div class="flex items-center space-x-1.5 shrink-0">' +
          '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300" title="เคยตอบผิดในบทนี้ ' + mistakesInTopic + ' ข้อ">' +
            'ผิด ' + mistakesInTopic + ' ข้อ' +
          '</span>' +
          '<button type="button" onclick="event.preventDefault(); event.stopPropagation(); app.practiceTopicMistakes(\'' + t.code + '\')" class="px-2.5 py-1 min-h-[28px] rounded-md text-[11px] font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition active:scale-95 flex items-center space-x-1" title="ทำเฉพาะข้อที่เคยตอบผิดในบท ' + t.code + ' ทันที">' +
            '<i data-lucide="rotate-ccw" class="w-3 h-3"></i>' +
            '<span>Retry</span>' +
          '</button>' +
        '</div>';
      }

      return '<label class="flex items-center space-x-3 p-3 rounded-xl border border-cockpit-border bg-cockpit-850/60 hover:bg-cockpit-800/80 cursor-pointer transition ' + (mistakesInTopic > 0 ? 'hover:border-rose-500/40' : '') + '">' +
        '<input type="checkbox" value="' + t.code + '" ' + checked + ' onchange="app.handleTopicToggle(\'' + t.code + '\', this.checked)" class="w-4 h-4 rounded text-cyan-500 bg-cockpit-700 border-cockpit-border focus:ring-cyan-500">' +
        '<div class="flex-grow min-w-0">' +
          '<div class="flex items-center justify-between gap-1 flex-wrap">' +
            '<span class="text-xs font-mono font-bold text-cyan-300">' + t.code + '</span>' +
            '<div class="flex items-center space-x-2">' +
              mistakeBadges +
              '<span class="text-[11px] font-mono text-slate-400">' + t.count + ' Qs</span>' +
            '</div>' +
          '</div>' +
          '<p class="text-xs text-slate-200 truncate mt-0.5" title="' + t.name + '">' + t.name + '</p>' +
        '</div>' +
      '</label>';
    }).join('');

    lucide.createIcons();
  },

  handleTopicToggle(code, checked) {
    if (checked) this.selectedTopics.add(code);
    else this.selectedTopics.delete(code);
    this.updateFilterCounts();
  },

  selectAllTopics(select) {
    if (select) {
      this.selectedTopics = new Set(this.topicMetadata.map(t => t.code));
    } else {
      this.selectedTopics.clear();
    }
    this.renderTopicGrid();
    this.updateFilterCounts();
    sound.click();
  },

  selectMistakeTopicsOnly() {
    sound.click();
    const topicsWithMistakes = new Set();
    if (this.questions && this.mistakes) {
      this.questions.forEach(q => {
        if (this.mistakes.has(q.id)) {
          topicsWithMistakes.add(q.topic);
        }
      });
    }

    if (topicsWithMistakes.size === 0) {
      alert('ยินดีด้วย! ยังไม่มีข้อที่ตอบผิดสะสมในวิชานี้');
      return;
    }

    this.selectedTopics = topicsWithMistakes;
    this.mistakesOnly = true;
    const mistakesToggle = document.getElementById('toggleMistakesOnly');
    if (mistakesToggle) mistakesToggle.checked = true;
    const minContainer = document.getElementById('minMistakesContainer');
    if (minContainer) minContainer.classList.remove('hidden');

    this.renderTopicGrid();
    this.updateFilterCounts();
  },

  practiceTopicMistakes(topicCode) {
    sound.click();
    const mistakeQuestions = this.questions.filter(q => q.topic === topicCode && this.mistakes.has(q.id));
    if (mistakeQuestions.length === 0) {
      alert('ไม่มีข้อที่เคยตอบผิดในบทนี้');
      return;
    }
    this.setMode('study');
    this.startPracticeSession(mistakeQuestions, true);
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
    this.updateFilterCounts();
  },

  toggleUnattemptedOnly() {
    this.unattemptedOnly = document.getElementById('toggleUnattemptedOnly').checked;
    if (this.unattemptedOnly && this.mistakesOnly) {
      this.mistakesOnly = false;
      const mistakesEl = document.getElementById('toggleMistakesOnly');
      if (mistakesEl) mistakesEl.checked = false;
    }
    this.updateFilterCounts();
  },

  toggleMistakesOnly() {
    this.mistakesOnly = document.getElementById('toggleMistakesOnly').checked;
    if (this.mistakesOnly && this.unattemptedOnly) {
      this.unattemptedOnly = false;
      const unattemptedEl = document.getElementById('toggleUnattemptedOnly');
      if (unattemptedEl) unattemptedEl.checked = false;
    }
    const minContainer = document.getElementById('minMistakesContainer');
    if (minContainer) {
      if (this.mistakesOnly) {
        minContainer.classList.remove('hidden');
      } else {
        minContainer.classList.add('hidden');
      }
    }
    this.updateHeaderStats();
    this.updateFilterCounts();
  },

  setMinMistakes(n) {
    n = Math.max(1, parseInt(n, 10) || 1);
    this.minMistakes = n;

    [1, 2, 3, 5].forEach(val => {
      const btn = document.getElementById('btnMistakeThreshold' + val);
      if (btn) {
        if (val === n) {
          btn.className = 'flex-1 min-w-[42px] py-1 rounded-lg text-[11px] font-mono font-bold border border-rose-500 bg-rose-500/20 text-rose-300 shadow-glow-rose transition';
        } else {
          btn.className = 'flex-1 min-w-[42px] py-1 rounded-lg text-[11px] font-mono font-semibold border border-cockpit-border bg-cockpit-800 text-slate-400 hover:text-white transition';
        }
      }
    });

    const input = document.getElementById('inputMinMistakes');
    if (input && parseInt(input.value, 10) !== n) {
      input.value = n;
    }

    const label = document.getElementById('minMistakesLabel');
    if (label) {
      label.textContent = '≥ ' + n + ' ครั้ง';
    }

    this.updateHeaderStats();
    this.updateFilterCounts();
  },

  toggleBookmarksOnly() {
    this.bookmarksOnly = document.getElementById('toggleBookmarksOnly').checked;
    this.updateFilterCounts();
  },

  getFilteredCandidateQuestions() {
    let list = this.questions.filter(q => this.selectedTopics.has(q.topic));
    if (this.unattemptedOnly) {
      list = list.filter(q => !this.attempted.has(q.id));
    }
    if (this.mistakesOnly) {
      const minN = Math.max(1, parseInt(this.minMistakes, 10) || 1);
      list = list.filter(q => {
        const cnt = QuizStorage.getMistakeCount(this.currentSubjectId, q.id);
        const effectiveCount = Math.max(cnt, this.mistakes.has(q.id) ? 1 : 0);
        return effectiveCount >= minN;
      });
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
    if (btn) {
      if (max === 0) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5"></i> <span>No Matching Questions</span>';
      } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> <span>START ' + this.mode.toUpperCase() + ' (' + this.questionCount + ' Qs)</span>';
      }
    }
    lucide.createIcons();
  },

  updateQuestionCount(val) {
    this.questionCount = parseInt(val, 10);
    document.getElementById('questionCountDisplay').textContent = this.questionCount + ' ข้อ';
    document.getElementById('matchingCountNotice').textContent = this.questionCount + ' Questions Selected';
    document.getElementById('estimatedTimeNotice').textContent = 'Estimated time: ~' + Math.max(1, Math.round(this.questionCount * 1)) + ' mins';
    const btn = document.getElementById('btnStartExam');
    if (btn) {
      btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> <span>START ' + this.mode.toUpperCase() + ' (' + this.questionCount + ' Qs)</span>';
    }
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

  /* ============================================================ */
  /* QUIZ EXECUTION ENGINE                                        */
  /* ============================================================ */
  startPracticeSession(customQuestionList = null, isRetry = false) {
    sound.click();
    this.isRetrySession = Boolean(isRetry || this.mistakesOnly || (customQuestionList && customQuestionList === this.sessionMistakesList));
    let candidatePool = customQuestionList || this.getFilteredCandidateQuestions();
    if (candidatePool.length === 0) {
      alert('ไม่พบข้อสอบที่ตรงกับเงื่อนไขที่เลือก กรุณาปรับตัวกรองใหม่');
      return;
    }

    let chosen = candidatePool.slice();
    const shuffleEl = document.getElementById('toggleShuffleQuestions');
    const doShuffle = shuffleEl ? shuffleEl.checked : true;
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
        explanation_quick: q.explanation_quick,
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
    this.autoSaveSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeElapsedSeconds++;
      const mins = Math.floor(this.timeElapsedSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timeElapsedSeconds % 60).toString().padStart(2, '0');
      const timerEl = document.getElementById('liveTimerText');
      if (timerEl) timerEl.textContent = mins + ':' + secs;

      // Periodically auto-save every 10 seconds
      if (this.timeElapsedSeconds % 10 === 0) {
        this.autoSaveSession();
      }
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
    if (!q) return;

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

    // Mistake History Count Badge
    const mistakeCount = QuizStorage.getMistakeCount(this.currentSubjectId, q.id);
    const badgeMistake = document.getElementById('badgeMistakeCount');
    const badgeMistakeText = document.getElementById('badgeMistakeCountText');
    if (badgeMistake && badgeMistakeText) {
      if (mistakeCount > 0) {
        badgeMistake.classList.remove('hidden');
        badgeMistakeText.textContent = 'เคยตอบผิด ' + mistakeCount + ' ครั้ง';
      } else {
        badgeMistake.classList.add('hidden');
      }
    }

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

      return '<div role="radio" ' +
        'aria-checked="' + (isSelected ? 'true' : 'false') + '" ' +
        'aria-label="ตัวเลือก ' + letter + ': ' + opt.replace(/"/g, '&quot;') + (isRevealed ? (isCorrect ? ' — ถูกต้อง' : (isSelected ? ' — ผิด' : '')) : '') + '" ' +
        'tabindex="' + (isSelected || idx === 0 ? '0' : '-1') + '" ' +
        'onclick="app.selectOptionByIndex(' + idx + ')" ' +
        'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();app.selectOptionByIndex(' + idx + ');}" ' +
        'class="' + cardClass + '">' +
        '<div class="' + badgeClass + '">' + letter + '</div>' +
        '<div class="flex-grow pt-0.5 leading-relaxed">' + opt + '</div>' +
        (isRevealed ? (
          isCorrect ? '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true"></i>' :
          (isSelected ? '<i data-lucide="x-circle" class="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true"></i>' : '')
        ) : '') +
      '</div>';
    }).join('');

    const expBox = document.getElementById('explanationBox');
    const statusPill = document.getElementById('studyAnswerStatusPill');

    const nextBtnBottom = document.getElementById('btnNextQBottom');
    const nextBtnBottomLabel = document.getElementById('btnNextQBottomLabel');

    if (isRevealed) {
      expBox.classList.remove('hidden');
      if (nextBtnBottom) nextBtnBottom.classList.remove('hidden');

      const quickBox = document.getElementById('explanationQuickBox');
      const quickText = document.getElementById('explanationQuickText');
      if (quickBox && quickText) {
        if (q.explanation_quick) {
          this.renderExplanationMath(quickText, q.explanation_quick);
          quickBox.classList.remove('hidden');
        } else {
          quickBox.classList.add('hidden');
        }
      }

      this.renderExplanationMath(document.getElementById('explanationText'), q.explanation);
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
      if (nextBtnBottom) nextBtnBottom.classList.add('hidden');
    }

    document.getElementById('btnPrevQ').disabled = (this.currentIndex === 0);
    document.getElementById('btnPrevQ').classList.toggle('opacity-40', this.currentIndex === 0);

    const isLast = (this.currentIndex === total - 1);
    const nextBtn = document.getElementById('btnNextQ');
    if (isLast) {
      nextBtn.innerHTML = '<span>Review / Submit</span> <i data-lucide="check" class="w-4 h-4"></i>';
      if (nextBtnBottomLabel) nextBtnBottomLabel.textContent = 'Review / Submit';
      if (nextBtnBottom) {
        nextBtnBottom.innerHTML = '<span id="btnNextQBottomLabel">Review / Submit</span> <i data-lucide="check" class="w-4 h-4"></i>';
      }
    } else {
      nextBtn.innerHTML = '<span>Next</span> <i data-lucide="chevron-right" class="w-4 h-4"></i>';
      if (nextBtnBottomLabel) nextBtnBottomLabel.textContent = 'Next';
      if (nextBtnBottom) {
        nextBtnBottom.innerHTML = '<span id="btnNextQBottomLabel">Next</span> <i data-lucide="chevron-right" class="w-4 h-4"></i>';
      }
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
    if (currentQ && currentQ.id !== undefined) {
      this.attempted.add(currentQ.id);
    }

    if (this.mode === 'study') {
      const isFirstAttemptOnThisQuestion = !this.revealedInStudy[this.currentIndex];
      this.revealedInStudy[this.currentIndex] = true;
      if (optionText === currentQ.correct) {
        sound.correct();
        if (isFirstAttemptOnThisQuestion && !this.isRetrySession) {
          QuizStorage.recordQuestionAttempt(this.currentSubjectId, currentQ.id, true);
        }
        if (this.mistakes.has(currentQ.id)) {
          this.mistakes.delete(currentQ.id);
          this.saveUserData();
        } else {
          this.saveUserData();
        }
      } else {
        sound.incorrect();
        if (isFirstAttemptOnThisQuestion && !this.isRetrySession) {
          QuizStorage.recordQuestionAttempt(this.currentSubjectId, currentQ.id, false);
        }
        this.mistakes.add(currentQ.id);
        this.saveUserData();
      }
    } else {
      this.saveUserData();
    }

    this.renderCurrentQuestion();
    this.autoSaveSession();
  },

  checkCurrentStudyAnswer() {
    if (!this.userAnswers[this.currentIndex]) {
      alert('กรุณาเลือกคำตอบก่อนตรวจ');
      return;
    }
    const q = this.sessionQuestions[this.currentIndex];
    const isFirstAttemptOnThisQuestion = !this.revealedInStudy[this.currentIndex];
    this.revealedInStudy[this.currentIndex] = true;
    if (this.userAnswers[this.currentIndex] === q.correct) {
      sound.correct();
      if (isFirstAttemptOnThisQuestion && !this.isRetrySession) {
        QuizStorage.recordQuestionAttempt(this.currentSubjectId, q.id, true);
      }
      if (this.mistakes.has(q.id)) {
        this.mistakes.delete(q.id);
        this.saveUserData();
      }
    } else {
      sound.incorrect();
      if (isFirstAttemptOnThisQuestion && !this.isRetrySession) {
        QuizStorage.recordQuestionAttempt(this.currentSubjectId, q.id, false);
      }
      this.mistakes.add(q.id);
      this.saveUserData();
    }
    this.renderCurrentQuestion();
    this.autoSaveSession();
  },

  nextQuestion() {
    sound.click();
    if (this.currentIndex < this.sessionQuestions.length - 1) {
      this.currentIndex++;
      this.renderCurrentQuestion();
      this.autoSaveSession();
    } else {
      this.confirmFinishExam();
    }
  },

  prevQuestion() {
    sound.click();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentQuestion();
      this.autoSaveSession();
    }
  },

  jumpToQuestion(index) {
    sound.click();
    this.currentIndex = index;
    this.toggleGridDrawer(false);
    this.renderCurrentQuestion();
    this.autoSaveSession();
  },

  toggleBookmarkCurrent() {
    const q = this.sessionQuestions[this.currentIndex];
    if (this.bookmarks.has(q.id)) {
      this.bookmarks.delete(q.id);
    } else {
      this.bookmarks.add(q.id);
    }
    sound.click();
    this.saveUserData();
    this.renderCurrentQuestion();
    this.autoSaveSession();
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
      message: 'ความคืบหน้าของคุณจะถูกบันทึกไว้ในเบราว์เซอร์อัตโนมัติ คุณสามารถกลับมาทำต่อได้ตลอดเวลา',
      okText: 'Exit to Menu',
      onOk: () => {
        this.stopTimer();
        this.autoSaveSession();
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

  /* ============================================================ */
  /* SUMMARY & ANALYTICS                                          */
  /* ============================================================ */
  calculateAndShowSummary() {
    this.stopTimer();
    sound.complete();

    // Clear active in-progress session upon final submission
    if (this.currentSubject) {
      QuizStorage.clearSession(this.currentSubject.id);
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const topicStats = {};
    this.topicMetadata.forEach(t => {
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
        if (this.mode === 'exam' && !this.isRetrySession) {
          QuizStorage.recordQuestionAttempt(this.currentSubjectId, q.id, false);
        }
      } else {
        this.attempted.add(q.id);
        if (userAns === q.correct) {
          correctCount++;
          t.correct++;
          if (this.mistakes.has(q.id)) this.mistakes.delete(q.id);
          if (this.mode === 'exam' && !this.isRetrySession) {
            QuizStorage.recordQuestionAttempt(this.currentSubjectId, q.id, true);
          }
        } else {
          incorrectCount++;
          t.incorrect++;
          this.mistakes.add(q.id);
          sessionMistakesList.push(q);
          if (this.mode === 'exam' && !this.isRetrySession) {
            QuizStorage.recordQuestionAttempt(this.currentSubjectId, q.id, false);
          }
        }
      }
    });

    this.sessionMistakesList = sessionMistakesList;
    this.saveUserData();

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
    this.saveUserData();

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
      const qMistakeCount = QuizStorage.getMistakeCount(this.currentSubjectId, q.id);
      return '<div class="glass-card p-5 rounded-xl border space-y-4 ' + (isCorrect ? 'review-card-correct' : 'review-card-incorrect') + '">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div class="flex items-center space-x-2">' +
            '<span class="font-mono font-bold text-xs review-id-badge ' + (isCorrect ? 'text-emerald-400' : 'text-rose-400') + '">' +
              '#' + (idx + 1) + ' (Bank ID ' + q.id + ')' +
            '</span>' +
            '<span class="search-badge-topic text-[10px] font-mono px-2 py-0.5 rounded">' + q.topic + '</span>' +
            '<span class="search-badge-lo text-[10px] font-mono px-2 py-0.5 rounded">LO: ' + q.LO + '</span>' +
            (qMistakeCount > 0 ? '<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40" title="เคยตอบข้อนี้ผิดทั้งหมด ' + qMistakeCount + ' ครั้ง">🔴 ผิดสะสม ' + qMistakeCount + 'x</span>' : '') +
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

        '<div class="p-3 rounded-lg review-exp-box text-xs space-y-2">' +
          (q.explanation_quick ? (
            '<div class="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 flex items-start space-x-2">' +
              '<i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 fill-current"></i>' +
              '<div><strong class="text-cyan-300 font-mono text-[10px]">QUICK TAKE:</strong> <span class="text-slate-200">' + q.explanation_quick + '</span></div>' +
            '</div>'
          ) : '') +
          '<div class="text-[11px] font-mono font-semibold exp-header flex items-center space-x-1">' +
            '<i data-lucide="book-open" class="w-3.5 h-3.5 text-cyan-400"></i>' +
            '<span>DETAILED EXPLANATION:</span>' +
          '</div>' +
          '<div class="leading-relaxed whitespace-pre-line text-slate-300 text-xs font-sans">' + this.formatExplanationHtml(q.explanation) + '</div>' +
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

  /* ============================================================ */
  /* COFFEE & DONATION MODAL                                      */
  /* ============================================================ */
  openDonationModal() {
    sound.click();
    const modal = document.getElementById('modalDonate');
    if (modal) {
      modal.classList.remove('hidden');
      lucide.createIcons();
    }
  },

  closeDonationModal() {
    sound.click();
    const modal = document.getElementById('modalDonate');
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  copyPromptPay(number) {
    sound.click();
    const copyAction = () => {
      const targets = [
        { btn: document.getElementById('btnCopyPromptPay'), text: document.getElementById('btnCopyPromptPayText'), isModal: false },
        { btn: document.getElementById('btnCopyPromptPayModal'), text: document.getElementById('btnCopyPromptPayModalText'), isModal: true }
      ];

      targets.forEach(({ btn, text, isModal }) => {
        if (btn) {
          const originalHTML = btn.innerHTML;
          if (isModal) {
            btn.classList.remove('from-amber-500', 'to-orange-500');
            btn.classList.add('from-emerald-500', 'to-teal-500');
          } else {
            btn.classList.remove('bg-cyan-600', 'hover:bg-cyan-500');
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
          }
          btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>คัดลอกสำเร็จ!</span>';
          lucide.createIcons();
          setTimeout(() => {
            if (isModal) {
              btn.classList.remove('from-emerald-500', 'to-teal-500');
              btn.classList.add('from-amber-500', 'to-orange-500');
            } else {
              btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
              btn.classList.add('bg-cyan-600', 'hover:bg-cyan-500');
            }
            btn.innerHTML = originalHTML;
            lucide.createIcons();
          }, 2200);
        }
      });
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
    this.startPracticeSession(this.sessionMistakesList, true);
  },

  retakeCurrentConfig() {
    this.startPracticeSession(null, this.isRetrySession);
  },

  goHome() {
    sound.click();
    this.stopTimer();
    this.isRetrySession = false;
    document.getElementById('viewExam').classList.add('hidden');
    document.getElementById('viewSummary').classList.add('hidden');
    document.getElementById('viewSetup').classList.remove('hidden');
    this.updateHeaderStats();
    this.renderTopicGrid();
    this.updateFilterCounts();
    this.checkResumeSession();
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
    this.startPracticeSession(null, true);
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
      message: 'This will reset your recorded mistakes, bookmarks, and test history for this subject. This action cannot be undone.',
      okText: 'Reset Everything',
      onOk: () => {
        if (this.currentSubject) {
          QuizStorage.clearSubjectData(this.currentSubject.id);
          this.attempted.clear();
          this.mistakes.clear();
          this.bookmarks.clear();
          this.examHistory = [];
          this.unattemptedOnly = false;
          const unattemptedEl = document.getElementById('toggleUnattemptedOnly');
          if (unattemptedEl) unattemptedEl.checked = false;
          this.updateHeaderStats();
          this.updateFilterCounts();
          this.checkResumeSession();
          alert('ล้างข้อมูลความคืบหน้าทั้งหมดเรียบร้อยแล้ว');
        }
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

  /* ============================================================ */
  /* SEARCH ENGINE & MODAL                                        */
  /* ============================================================ */
  populateSearchTopicFilter() {
    const topicSelect = document.getElementById('searchFilterTopic');
    if (!topicSelect) return;
    topicSelect.innerHTML = '<option value="all">All Topics</option>' + 
      this.topicMetadata.map(t => `<option value="${t.code}">${t.code} ${t.name}</option>`).join('');
  },

  openSearchModal(initialQuery = '') {
    sound.click();
    const modal = document.getElementById('modalSearch');
    modal.classList.remove('hidden');

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

  cleanMathFormula(formula) {
    if (!formula) return '';
    return formula
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\mathrm\{([^}]+)\}/g, '$1')
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
      .replace(/\\times/g, ' × ')
      .replace(/\\cdot/g, ' · ')
      .replace(/\\approx/g, ' ≈ ')
      .replace(/\\pm/g, ' ± ')
      .replace(/\\neq/g, ' ≠ ')
      .replace(/\\le/g, ' ≤ ')
      .replace(/\\ge/g, ' ≥ ')
      .replace(/\\propto/g, ' ∝ ')
      .replace(/\\implies/g, ' ⟹ ')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 ÷ $2)')
      .replace(/\\rho_0/g, 'ρ₀')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\alpha_0/g, 'α₀')
      .replace(/\\alpha_{crit}/g, 'α_crit')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\Lambda/g, 'Λ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\omega/g, 'ω')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\\pi/g, 'π')
      .replace(/\\perp/g, '⊥')
      .replace(/\\parallel/g, '∥')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/_0/g, '₀')
      .replace(/_1/g, '₁')
      .replace(/_2/g, '₂')
      .replace(/\\circ/g, '°')
      .replace(/\\/g, '')
      .trim();
  },

  formatExplanationHtml(text, query = '') {
    if (!text) return '';
    let escaped = query ? this.highlightText(text, query) : this.escapeHtml(text);

    // Convert display math $$...$$
    escaped = escaped.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      let clean = this.cleanMathFormula(formula);
      return `<div class="my-2.5 px-4 py-2.5 rounded-xl bg-cockpit-900/90 border border-cyan-500/40 font-mono text-cyan-300 font-bold text-center text-sm shadow-sm tracking-wide select-all">${clean}</div>`;
    });

    // Convert inline math $...$
    escaped = escaped.replace(/\$([^\$]+?)\$/g, (match, inlineFormula) => {
      let clean = this.cleanMathFormula(inlineFormula);
      return `<span class="px-1.5 py-0.5 rounded bg-cockpit-900 border border-cyan-500/30 font-mono text-cyan-300 text-xs font-semibold">${clean}</span>`;
    });

    return escaped;
  },

  renderExplanationMath(el, text) {
    if (!el) return;
    if (!text) {
      el.innerHTML = '';
      return;
    }

    const hasMath = /\$\$[\s\S]*?\$\$|\$[^\$]+?\$/.test(text);
    if (hasMath && window.renderMathInElement) {
      el.textContent = text;
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
        return;
      } catch (err) {
        console.warn('KaTeX render error, falling back:', err);
      }
    }

    el.innerHTML = this.formatExplanationHtml(text);
  },

  executeSearch() {
    const topicVal = document.getElementById('searchFilterTopic') ? document.getElementById('searchFilterTopic').value : 'all';
    const diffVal = document.getElementById('searchFilterDifficulty') ? document.getElementById('searchFilterDifficulty').value : 'all';
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
        countText.innerHTML = `<span class="text-slate-400">พิมพ์คำค้นหาเพื่อเริ่มค้นหาในคลังข้อสอบ ${this.questions.length} ข้อ (ขั้นต่ำ 3 ตัวอักษร)</span>`;
      } else {
        countText.innerHTML = '<span class="text-amber-400 font-semibold">⚠️ กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร (พิมพ์แล้ว ' + qLower.length + '/3 ตัวอักษร)</span>';
      }

      // Render suggestions
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
              return '<button type="button" onclick="app.setSuggestedSearch(\'' + k + '\')" class="px-2.5 py-1 rounded-lg bg-cockpit-850 hover:bg-cyan-950/60 border border-cockpit-border hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-cyan-300 transition">' +
                k +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';

      lucide.createIcons();
      return;
    }

    // Filter questions
    const results = this.questions.filter(q => {
      if (this.searchTopic !== 'all' && q.topic !== this.searchTopic) return false;
      if (this.searchDifficulty !== 'all' && q.difficulty !== this.searchDifficulty) return false;

      const qText = (q.question || '').toLowerCase();
      const correctText = (q.correct || '').toLowerCase();
      const expText = ((q.explanation_quick || '') + ' ' + (q.explanation || '')).toLowerCase();
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
        '<button onclick="app.setSearchScope(\'all\')" class="px-4 py-1.5 rounded-lg bg-cockpit-850 hover:bg-cockpit-800 border border-cockpit-border text-xs text-cyan-300 font-mono">' +
          'Reset Scope to All Fields' +
        '</button>' +
      '</div>';
    } else {
      countText.innerHTML = '<span class="text-cyan-400 font-bold font-mono">พบ ' + results.length + ' ข้อ</span> <span class="text-slate-400">จาก ' + this.questions.length + ' ข้อ ในคลังข้อสอบ</span>';
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

    container.innerHTML = pagedResults.map((q) => {
      const isFlagged = this.bookmarks.has(q.id);
      const isMistake = this.mistakes.has(q.id);
      const searchMistakeCount = QuizStorage.getMistakeCount(this.currentSubjectId, q.id);

      return '<div class="p-4 sm:p-5 rounded-2xl glass-card border border-cockpit-border hover:border-cyan-500/40 transition space-y-3.5 search-result-card">' +
        '<div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cockpit-border/60">' +
          '<div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">' +
            '<span class="search-badge-id font-bold px-2.5 py-0.5 rounded-md">ID: #' + q.id + '</span>' +
            '<span class="search-badge-topic px-2 py-0.5 rounded-md">' + q.topic + ' ' + (q.topicName || '') + '</span>' +
            '<span class="search-badge-lo px-2 py-0.5 rounded-md">' + q.LO + '</span>' +
            '<span class="search-badge-diff px-2 py-0.5 rounded-md">' + q.difficulty + '</span>' +
            (isMistake ? '<span class="search-badge-mistake px-2 py-0.5 rounded-md">Mistake Bank</span>' : '') +
            (searchMistakeCount > 0 ? '<span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold" title="เคยตอบข้อนี้ผิด ' + searchMistakeCount + ' ครั้ง">🔴 ผิด ' + searchMistakeCount + 'x</span>' : '') +
          '</div>' +
          '<button type="button" onclick="app.toggleBookmarkFromSearch(' + q.id + ', event)" class="p-1.5 rounded-lg border transition flex items-center space-x-1 text-xs font-mono ' +
            (isFlagged ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-cockpit-850 text-slate-400 hover:text-amber-300 border-cockpit-border') + '" title="' + (isFlagged ? 'Remove Bookmark' : 'Bookmark Question') + '">' +
            '<i data-lucide="bookmark" class="w-3.5 h-3.5 ' + (isFlagged ? 'fill-current' : '') + '"></i>' +
            '<span class="text-[11px]">' + (isFlagged ? 'Flagged' : 'Flag') + '</span>' +
          '</button>' +
        '</div>' +

        '<h4 class="text-sm sm:text-base font-semibold text-white leading-relaxed">' +
          this.highlightText(q.question, rawQ) +
        '</h4>' +

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

        '<div class="p-3 rounded-xl search-exp-box border text-xs space-y-2">' +
          (q.explanation_quick ? (
            '<div class="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 flex items-start space-x-2">' +
              '<i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 fill-current"></i>' +
              '<div><strong class="text-cyan-300 font-mono text-[10px]">QUICK TAKE:</strong> <span class="text-slate-200">' + this.highlightText(q.explanation_quick, rawQ) + '</span></div>' +
            '</div>'
          ) : '') +
          '<div class="text-[11px] font-mono font-semibold exp-header flex items-center space-x-1">' +
            '<i data-lucide="book-open" class="w-3.5 h-3.5 text-cyan-400"></i>' +
            '<span>DETAILED EXPLANATION:</span>' +
          '</div>' +
          '<div class="leading-relaxed whitespace-pre-line text-slate-300 text-xs font-sans">' + this.formatExplanationHtml(q.explanation, rawQ) + '</div>' +
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
    this.saveUserData();
    this.renderSearchResults(this.searchCurrentPage, false);
    sound.click();
  },

  startPracticeFromSearch(mode = 'study') {
    if (!this.lastSearchResults || this.lastSearchResults.length === 0) return;
    this.setMode(mode);
    this.closeSearchModal();
    this.startPracticeSession(this.lastSearchResults);
  },

  /* ============================================================ */
  /* KEYBOARD SHORTCUTS                                           */
  /* ============================================================ */
  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+K / Cmd+K Search modal
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        const searchModal = document.getElementById('modalSearch');
        if (searchModal && searchModal.classList.contains('hidden')) {
          this.openSearchModal();
        } else if (searchModal) {
          this.closeSearchModal();
        }
        return;
      }

      const searchModal = document.getElementById('modalSearch');
      const isSearchOpen = searchModal && !searchModal.classList.contains('hidden');
      const gridModal = document.getElementById('modalQuestionGrid');
      const isGridOpen = gridModal && !gridModal.classList.contains('hidden');
      const confirmModal = document.getElementById('modalConfirm');
      const isConfirmOpen = confirmModal && !confirmModal.classList.contains('hidden');
      const donateModal = document.getElementById('modalDonate');
      const isDonateOpen = donateModal && !donateModal.classList.contains('hidden');

      if (e.key === 'Escape') {
        if (isSearchOpen) { this.closeSearchModal(); return; }
        if (isGridOpen) { gridModal.classList.add('hidden'); return; }
        if (isConfirmOpen) { confirmModal.classList.add('hidden'); return; }
        if (isDonateOpen) { this.closeDonationModal(); return; }
      }

      if (isSearchOpen || isGridOpen || isConfirmOpen || isDonateOpen) return;

      const examScreen = document.getElementById('viewExam');
      const isExamScreen = examScreen && !examScreen.classList.contains('hidden');
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
