// Local storage data layer — replaces all base44 SDK calls.
// All data is persisted to localStorage under namespaced keys.

const KEYS = {
  DAILY_LOGS:   'shedit_daily_logs',
  MEALS:        'shedit_meals',
  MEAL_PLANS:   'shedit_meal_plans',
  USER_GOALS:   'shedit_user_goals',
  USER_PROFILE: 'shedit_user_profile',
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Daily Logs ─────────────────────────────────────────────────────────────

export const DailyLogs = {
  list() {
    return load(KEYS.DAILY_LOGS);
  },
  getByDate(dateStr) {
    return load(KEYS.DAILY_LOGS).find(l => l.date === dateStr) || null;
  },
  upsert(dateStr, fields) {
    const all = load(KEYS.DAILY_LOGS);
    const idx = all.findIndex(l => l.date === dateStr);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...fields, date: dateStr };
    } else {
      all.push({ id: uid(), date: dateStr, ...fields });
    }
    save(KEYS.DAILY_LOGS, all);
    return load(KEYS.DAILY_LOGS).find(l => l.date === dateStr);
  },
  deleteAll() {
    save(KEYS.DAILY_LOGS, []);
  },
};

// ── Meal Entries ────────────────────────────────────────────────────────────

export const Meals = {
  list() {
    return load(KEYS.MEALS);
  },
  getByDate(dateStr) {
    return load(KEYS.MEALS).filter(m => m.date === dateStr);
  },
  add(entry) {
    const all = load(KEYS.MEALS);
    const item = { id: uid(), ...entry };
    all.push(item);
    save(KEYS.MEALS, all);
    return item;
  },
  delete(id) {
    save(KEYS.MEALS, load(KEYS.MEALS).filter(m => m.id !== id));
  },
  deleteAll() {
    save(KEYS.MEALS, []);
  },
};

// ── Meal Plans ──────────────────────────────────────────────────────────────

export const MealPlans = {
  list() {
    return load(KEYS.MEAL_PLANS);
  },
  replaceAll(plans) {
    const withIds = plans.map(p => ({ id: uid(), ...p }));
    save(KEYS.MEAL_PLANS, withIds);
    return withIds;
  },
  updateDay(id, fields) {
    const all = load(KEYS.MEAL_PLANS);
    const idx = all.findIndex(p => p.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...fields };
      save(KEYS.MEAL_PLANS, all);
    }
  },
  deleteAll() {
    save(KEYS.MEAL_PLANS, []);
  },
};

// ── User Goals / Onboarding ─────────────────────────────────────────────────

export const UserGoals = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USER_GOALS) || 'null');
    } catch {
      return null;
    }
  },
  save(data) {
    localStorage.setItem(KEYS.USER_GOALS, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(KEYS.USER_GOALS);
  },
};

// ── User Profile (name, etc.) ───────────────────────────────────────────────

export const UserProfile = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USER_PROFILE) || 'null');
    } catch {
      return null;
    }
  },
  save(data) {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(data));
  },
};

// ── Delete everything ───────────────────────────────────────────────────────

export function deleteAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}