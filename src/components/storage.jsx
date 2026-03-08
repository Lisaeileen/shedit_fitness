// Local storage data layer
const KEYS = {
  DAILY_LOGS:   'shedit_daily_logs',
  MEALS:        'shedit_meals',
  MEAL_PLANS:   'shedit_meal_plans',
  USER_GOALS:   'shedit_user_goals',
  USER_PROFILE: 'shedit_user_profile',
  COACH_MSGS:   'shedit_coach_messages',
  STREAK:       'shedit_streak',
  BADGES:       'shedit_badges',
  CHALLENGES:   'shedit_challenges',
};

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function load(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ── Daily Logs ──────────────────────────────────────────────────────────────
export const DailyLogs = {
  list() { return load(KEYS.DAILY_LOGS); },
  getByDate(dateStr) { return load(KEYS.DAILY_LOGS).find(l => l.date === dateStr) || null; },
  upsert(dateStr, fields) {
    const all = load(KEYS.DAILY_LOGS);
    const idx = all.findIndex(l => l.date === dateStr);
    if (idx >= 0) all[idx] = { ...all[idx], ...fields, date: dateStr };
    else all.push({ id: uid(), date: dateStr, ...fields });
    save(KEYS.DAILY_LOGS, all);
    return load(KEYS.DAILY_LOGS).find(l => l.date === dateStr);
  },
  deleteAll() { save(KEYS.DAILY_LOGS, []); },
};

// ── Meal Entries ────────────────────────────────────────────────────────────
export const Meals = {
  list() { return load(KEYS.MEALS); },
  getByDate(dateStr) { return load(KEYS.MEALS).filter(m => m.date === dateStr); },
  add(entry) { const all = load(KEYS.MEALS); const item = { id: uid(), ...entry }; all.push(item); save(KEYS.MEALS, all); return item; },
  delete(id) { save(KEYS.MEALS, load(KEYS.MEALS).filter(m => m.id !== id)); },
  deleteAll() { save(KEYS.MEALS, []); },
};

// ── Meal Plans ──────────────────────────────────────────────────────────────
export const MealPlans = {
  list() { return load(KEYS.MEAL_PLANS); },
  replaceAll(plans) { const w = plans.map(p => ({ id: uid(), ...p })); save(KEYS.MEAL_PLANS, w); return w; },
  updateDay(id, fields) {
    const all = load(KEYS.MEAL_PLANS);
    const idx = all.findIndex(p => p.id === id);
    if (idx >= 0) { all[idx] = { ...all[idx], ...fields }; save(KEYS.MEAL_PLANS, all); }
  },
  deleteAll() { save(KEYS.MEAL_PLANS, []); },
};

// ── User Goals ──────────────────────────────────────────────────────────────
export const UserGoals = {
  get() { try { return JSON.parse(localStorage.getItem(KEYS.USER_GOALS) || 'null'); } catch { return null; } },
  save(data) { localStorage.setItem(KEYS.USER_GOALS, JSON.stringify(data)); },
  clear() { localStorage.removeItem(KEYS.USER_GOALS); },
};

// ── User Profile ────────────────────────────────────────────────────────────
export const UserProfile = {
  get() { try { return JSON.parse(localStorage.getItem(KEYS.USER_PROFILE) || 'null'); } catch { return null; } },
  save(data) { localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(data)); },
};

// ── Coach Messages ──────────────────────────────────────────────────────────
export const CoachMessages = {
  list() { return load(KEYS.COACH_MSGS); },
  add(msg) {
    const all = load(KEYS.COACH_MSGS);
    const item = { id: uid(), ts: Date.now(), ...msg };
    all.push(item);
    if (all.length > 100) all.splice(0, all.length - 100);
    save(KEYS.COACH_MSGS, all);
    return item;
  },
  clear() { save(KEYS.COACH_MSGS, []); },
};

// ── Streak ──────────────────────────────────────────────────────────────────
export const Streak = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEYS.STREAK) || 'null') || { count: 0, lastDate: null, freezeUsed: false, lastFreezeMonth: null }; }
    catch { return { count: 0, lastDate: null, freezeUsed: false, lastFreezeMonth: null }; }
  },
  save(data) { localStorage.setItem(KEYS.STREAK, JSON.stringify(data)); },
  // Call this daily when user logs data
  update(dateStr) {
    const s = this.get();
    if (s.lastDate === dateStr) return s; // already counted today
    const yesterday = new Date(dateStr);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (s.lastDate === yStr) {
      s.count += 1;
    } else if (s.lastDate) {
      // Missed a day — check freeze
      const month = dateStr.slice(0, 7);
      if (!s.freezeUsed || s.lastFreezeMonth !== month) {
        s.count = Math.max(s.count, 1);
        s.freezeUsed = false; // reset monthly
      } else {
        s.count = 1;
      }
    } else {
      s.count = 1;
    }
    s.lastDate = dateStr;
    this.save(s);
    return s;
  },
  useFreeze(dateStr) {
    const s = this.get();
    const month = dateStr.slice(0, 7);
    if (s.freezeUsed && s.lastFreezeMonth === month) return false;
    s.freezeUsed = true;
    s.lastFreezeMonth = month;
    this.save(s);
    return true;
  },
};

// ── Badges ──────────────────────────────────────────────────────────────────
export const Badges = {
  list() { return load(KEYS.BADGES); },
  award(id, label, emoji) {
    const all = load(KEYS.BADGES);
    if (all.find(b => b.id === id)) return null;
    const badge = { id, label, emoji, ts: Date.now() };
    all.push(badge);
    save(KEYS.BADGES, all);
    return badge;
  },
};

// ── Challenges ──────────────────────────────────────────────────────────────
export const Challenges = {
  list() { return load(KEYS.CHALLENGES); },
  join(challenge) {
    const all = load(KEYS.CHALLENGES);
    if (all.find(c => c.id === challenge.id)) return;
    all.push({ ...challenge, joined: Date.now(), progress: 0 });
    save(KEYS.CHALLENGES, all);
  },
  updateProgress(id, progress) {
    const all = load(KEYS.CHALLENGES);
    const idx = all.findIndex(c => c.id === id);
    if (idx >= 0) { all[idx].progress = progress; save(KEYS.CHALLENGES, all); }
  },
};

// ── Delete everything ───────────────────────────────────────────────────────
export function deleteAllData() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); }