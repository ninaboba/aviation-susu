/**
 * Quiz Web Application - Storage Layer
 * Handles localStorage persistence for active sessions, user history,
 * bookmarks, mistakes, and application settings.
 */

const QuizStorage = {
  // Prefix keys to avoid collisions
  SESSION_PREFIX: 'quiz_session_',
  MISTAKES_PREFIX: 'quiz_mistakes_',
  BOOKMARKS_PREFIX: 'quiz_bookmarks_',
  ATTEMPTED_PREFIX: 'quiz_attempted_',
  HISTORY_PREFIX: 'quiz_history_',
  QUESTION_STATS_PREFIX: 'quiz_qstats_',
  THEME_KEY: 'quiz_theme',
  FONT_SIZE_KEY: 'quiz_font_size',
  SOUND_KEY: 'quiz_sound_enabled',

  // Legacy fallback keys (maintains backward compatibility with pof_ keys)
  LEGACY_THEME_KEY: 'pof_theme',
  LEGACY_FONT_SIZE_KEY: 'pof_font_size',
  LEGACY_SOUND_KEY: 'pof_sound_enabled',

  /**
   * Save the current active quiz session for a given subject
   * @param {string} subjectId - The subject unique ID (e.g. 'pof')
   * @param {Object} sessionData - Session state (mode, currentIndex, answers, time, sessionQuestions)
   */
  saveSession(subjectId, sessionData) {
    if (!subjectId || !sessionData) return;
    try {
      const payload = {
        ...sessionData,
        savedAt: Date.now()
      };
      localStorage.setItem(this.SESSION_PREFIX + subjectId, JSON.stringify(payload));
    } catch (e) {
      console.warn('QuizStorage.saveSession failed:', e);
    }
  },

  /**
   * Get active session data for a given subject if it exists
   * @param {string} subjectId - The subject unique ID
   * @returns {Object|null} The session state or null
   */
  getSession(subjectId) {
    if (!subjectId) return null;
    try {
      const data = localStorage.getItem(this.SESSION_PREFIX + subjectId);
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Validate session payload integrity
      if (parsed && Array.isArray(parsed.sessionQuestions) && parsed.sessionQuestions.length > 0) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.warn('QuizStorage.getSession failed:', e);
      return null;
    }
  },

  /**
   * Clear active session for a subject (called on finish / reset)
   * @param {string} subjectId - The subject unique ID
   */
  clearSession(subjectId) {
    if (!subjectId) return;
    try {
      localStorage.removeItem(this.SESSION_PREFIX + subjectId);
    } catch (e) {
      console.warn('QuizStorage.clearSession failed:', e);
    }
  },

  /**
   * Check if an active session exists for a subject
   * @param {string} subjectId - The subject unique ID
   * @returns {boolean}
   */
  hasActiveSession(subjectId) {
    return this.getSession(subjectId) !== null;
  },

  /**
   * Get mistake question IDs for a subject
   * @param {string} subjectId
   * @returns {Set<number|string>}
   */
  getMistakes(subjectId) {
    try {
      const key = this.MISTAKES_PREFIX + subjectId;
      let raw = localStorage.getItem(key);
      if (!raw && subjectId === 'pof') {
        raw = localStorage.getItem('pof_mistakes');
      }
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (e) {
      console.warn('QuizStorage.getMistakes failed:', e);
    }
    return new Set();
  },

  /**
   * Save mistake question IDs for a subject
   * @param {string} subjectId
   * @param {Set|Array} mistakes
   */
  saveMistakes(subjectId, mistakes) {
    try {
      const arr = Array.from(mistakes || []);
      localStorage.setItem(this.MISTAKES_PREFIX + subjectId, JSON.stringify(arr));
      if (subjectId === 'pof') {
        localStorage.setItem('pof_mistakes', JSON.stringify(arr));
      }
    } catch (e) {
      console.warn('QuizStorage.saveMistakes failed:', e);
    }
  },

  /**
   * Get bookmarked question IDs for a subject
   * @param {string} subjectId
   * @returns {Set<number|string>}
   */
  getBookmarks(subjectId) {
    try {
      const key = this.BOOKMARKS_PREFIX + subjectId;
      let raw = localStorage.getItem(key);
      if (!raw && subjectId === 'pof') {
        raw = localStorage.getItem('pof_bookmarks');
      }
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (e) {
      console.warn('QuizStorage.getBookmarks failed:', e);
    }
    return new Set();
  },

  /**
   * Save bookmarked question IDs for a subject
   * @param {string} subjectId
   * @param {Set|Array} bookmarks
   */
  saveBookmarks(subjectId, bookmarks) {
    try {
      const arr = Array.from(bookmarks || []);
      localStorage.setItem(this.BOOKMARKS_PREFIX + subjectId, JSON.stringify(arr));
      if (subjectId === 'pof') {
        localStorage.setItem('pof_bookmarks', JSON.stringify(arr));
      }
    } catch (e) {
      console.warn('QuizStorage.saveBookmarks failed:', e);
    }
  },

  /**
   * Get attempted/answered question IDs for a subject
   * @param {string} subjectId
   * @returns {Set<number|string>}
   */
  getAttempted(subjectId) {
    try {
      const key = this.ATTEMPTED_PREFIX + subjectId;
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (e) {
      console.warn('QuizStorage.getAttempted failed:', e);
    }
    return new Set();
  },

  /**
   * Save attempted/answered question IDs for a subject
   * @param {string} subjectId
   * @param {Set|Array} attempted
   */
  saveAttempted(subjectId, attempted) {
    try {
      const arr = Array.from(attempted || []);
      localStorage.setItem(this.ATTEMPTED_PREFIX + subjectId, JSON.stringify(arr));
    } catch (e) {
      console.warn('QuizStorage.saveAttempted failed:', e);
    }
  },

  /**
   * Get exam history records for a subject
   * @param {string} subjectId
   * @returns {Array}
   */
  getHistory(subjectId) {
    try {
      const key = this.HISTORY_PREFIX + subjectId;
      let raw = localStorage.getItem(key);
      if (!raw && subjectId === 'pof') {
        raw = localStorage.getItem('pof_history');
      }
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {
      console.warn('QuizStorage.getHistory failed:', e);
    }
    return [];
  },

  /**
   * Save exam history records for a subject
   * @param {string} subjectId
   * @param {Array} history
   */
  saveHistory(subjectId, history) {
    try {
      const arr = Array.isArray(history) ? history : [];
      localStorage.setItem(this.HISTORY_PREFIX + subjectId, JSON.stringify(arr));
      if (subjectId === 'pof') {
        localStorage.setItem('pof_history', JSON.stringify(arr));
      }
    } catch (e) {
      console.warn('QuizStorage.saveHistory failed:', e);
    }
  },

  /**
   * Get question attempt statistics map for a subject
   * @param {string} subjectId
   * @returns {Object<string, { wrong: number, correct: number, total: number, lastAttempt: number }>}
   */
  getQuestionStats(subjectId) {
    if (!subjectId) return {};
    try {
      const key = this.QUESTION_STATS_PREFIX + subjectId;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('QuizStorage.getQuestionStats failed:', e);
    }
    return {};
  },

  /**
   * Record a question answer attempt (incrementing wrong/correct count)
   * @param {string} subjectId
   * @param {number|string} questionId
   * @param {boolean} isCorrect
   * @returns {{ wrong: number, correct: number, total: number }}
   */
  recordQuestionAttempt(subjectId, questionId, isCorrect) {
    if (!subjectId || questionId === undefined) return { wrong: 0, correct: 0, total: 0 };
    try {
      const stats = this.getQuestionStats(subjectId);
      const qKey = String(questionId);
      const cur = stats[qKey] || { wrong: 0, correct: 0, total: 0 };
      cur.total = (cur.total || 0) + 1;
      if (isCorrect) {
        cur.correct = (cur.correct || 0) + 1;
      } else {
        cur.wrong = (cur.wrong || 0) + 1;
      }
      cur.lastAttempt = Date.now();
      stats[qKey] = cur;
      localStorage.setItem(this.QUESTION_STATS_PREFIX + subjectId, JSON.stringify(stats));
      return cur;
    } catch (e) {
      console.warn('QuizStorage.recordQuestionAttempt failed:', e);
      return { wrong: 0, correct: 0, total: 0 };
    }
  },

  /**
   * Get mistake count for a single question
   * @param {string} subjectId
   * @param {number|string} questionId
   * @returns {number}
   */
  getMistakeCount(subjectId, questionId) {
    const stats = this.getQuestionStats(subjectId);
    const qKey = String(questionId);
    return stats[qKey] ? (stats[qKey].wrong || 0) : 0;
  },

  /**
   * Get total attempt count for a single question
   * @param {string} subjectId
   * @param {number|string} questionId
   * @returns {number}
   */
  getAttemptCount(subjectId, questionId) {
    const stats = this.getQuestionStats(subjectId);
    const qKey = String(questionId);
    return stats[qKey] ? (stats[qKey].total || 0) : 0;
  },

  /**
   * Reset user analytics data for a subject (bookmarks, mistakes, history, question stats)
   * @param {string} subjectId
   */
  clearSubjectData(subjectId) {
    try {
      localStorage.removeItem(this.SESSION_PREFIX + subjectId);
      localStorage.removeItem(this.MISTAKES_PREFIX + subjectId);
      localStorage.removeItem(this.BOOKMARKS_PREFIX + subjectId);
      localStorage.removeItem(this.ATTEMPTED_PREFIX + subjectId);
      localStorage.removeItem(this.HISTORY_PREFIX + subjectId);
      localStorage.removeItem(this.QUESTION_STATS_PREFIX + subjectId);
      if (subjectId === 'pof') {
        localStorage.removeItem('pof_mistakes');
        localStorage.removeItem('pof_bookmarks');
        localStorage.removeItem('pof_history');
      }
    } catch (e) {
      console.warn('QuizStorage.clearSubjectData failed:', e);
    }
  },

  /**
   * Get theme preference ('dark' | 'light')
   */
  getTheme() {
    try {
      return localStorage.getItem(this.THEME_KEY) ||
             localStorage.getItem(this.LEGACY_THEME_KEY) ||
             (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (e) {
      return 'dark';
    }
  },

  /**
   * Save theme preference
   * @param {string} theme
   */
  setTheme(theme) {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
      localStorage.setItem(this.LEGACY_THEME_KEY, theme);
    } catch (e) {}
  },

  /**
   * Get font size preference ('sm' | 'normal' | 'lg' | 'xl')
   */
  getFontSize() {
    try {
      return localStorage.getItem(this.FONT_SIZE_KEY) ||
             localStorage.getItem(this.LEGACY_FONT_SIZE_KEY) ||
             'normal';
    } catch (e) {
      return 'normal';
    }
  },

  /**
   * Save font size preference
   * @param {string} size
   */
  setFontSize(size) {
    try {
      localStorage.setItem(this.FONT_SIZE_KEY, size);
      localStorage.setItem(this.LEGACY_FONT_SIZE_KEY, size);
    } catch (e) {}
  },

  /**
   * Get sound effects enabled preference
   */
  getSoundEnabled() {
    try {
      const v = localStorage.getItem(this.SOUND_KEY) ?? localStorage.getItem(this.LEGACY_SOUND_KEY);
      return v !== 'false';
    } catch (e) {
      return true;
    }
  },

  /**
   * Save sound effects enabled preference
   * @param {boolean} enabled
   */
  setSoundEnabled(enabled) {
    try {
      const str = enabled ? 'true' : 'false';
      localStorage.setItem(this.SOUND_KEY, str);
      localStorage.setItem(this.LEGACY_SOUND_KEY, str);
    } catch (e) {}
  }
};
