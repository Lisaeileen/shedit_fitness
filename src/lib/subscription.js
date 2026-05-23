/**
 * Subscription management utility.
 * Stores subscription state in localStorage.
 * Designed to be replaced with real App Store / Play Store SDK calls.
 */

const KEY = 'shedit_subscription';

export const PLANS = {
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    price: 9.99,
    period: 'month',
    pricePerMonth: 9.99,
    trialDays: 7,
    productId: 'com.shedit.monthly',
  },
  yearly: {
    id: 'yearly',
    label: 'Yearly',
    price: 31.08,
    period: 'year',
    pricePerMonth: 2.59,
    trialDays: 7,
    productId: 'com.shedit.yearly',
    badge: 'Save 74%',
    bestValue: true,
    mostPopular: true,
  },
};

/**
 * FREE features — always accessible, no subscription needed.
 */
export const FREE_FEATURES = [
  'step_tracking',
  'weight_logging',
  'basic_progress',
  'basic_workout',
  'water_tracking',
  'exercise_logging',
  'food_manual_log',   // basic manual food entry is free
];

/**
 * PREMIUM features — require trial or paid subscription.
 */
export const PREMIUM_FEATURES = [
  'ai_food_scan',
  'ai_voice_log',
  'ai_barcode',
  'meal_plans',
  'advanced_insights',
  'ai_coaching',
  'advanced_calories',
  'smart_recommendations',
  'custom_nutrition',
  'premium_workouts',
  'detailed_analytics',
  'body_scan',
];

export const PREMIUM_FEATURE_LABELS = {
  ai_food_scan:          'AI Food Scan',
  ai_voice_log:          'AI Voice Log',
  ai_barcode:            'Barcode Scanner',
  meal_plans:            'Personalized Meal Plans',
  advanced_insights:     'Advanced Nutrition Insights',
  ai_coaching:           'AI Coaching',
  advanced_calories:     'Smart Calorie Tracking',
  smart_recommendations: 'Smart Recommendations',
  custom_nutrition:      'Custom Nutrition Plans',
  premium_workouts:      'Premium Workout Plans',
  detailed_analytics:    'Detailed Analytics',
  body_scan:             'AI Body Scan',
};

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/** Returns the raw subscription record or null */
export function getSubscription() {
  return load();
}

/**
 * Returns subscription status:
 * 'trial'    — within the 7-day trial window
 * 'active'   — paid and active
 * 'expired'  — trial ended with no payment
 * 'canceled' — canceled but still in paid period
 * 'none'     — never subscribed
 */
export function getSubscriptionStatus() {
  const sub = load();
  if (!sub) return 'none';

  const now = Date.now();

  if (sub.status === 'active' || sub.status === 'canceled') {
    if (sub.currentPeriodEnd && now < sub.currentPeriodEnd) {
      return sub.status;
    }
    return 'expired';
  }

  if (sub.status === 'trial') {
    if (sub.trialEnd && now < sub.trialEnd) return 'trial';
    return 'expired';
  }

  return sub.status || 'none';
}

/** True if the user has full premium access (trial or active/canceled within period) */
export function hasAccess() {
  const s = getSubscriptionStatus();
  return s === 'trial' || s === 'active' || s === 'canceled';
}

/** True if a specific feature is available to the current user */
export function canAccessFeature(featureId) {
  if (FREE_FEATURES.includes(featureId)) return true;
  if (PREMIUM_FEATURES.includes(featureId)) return hasAccess();
  return true; // unknown feature — allow by default
}

/**
 * Start a subscription with a 7-day free trial.
 * In production, this would call the native IAP SDK first.
 */
export function startTrial(planId) {
  const plan = PLANS[planId];
  if (!plan) return;

  const now = Date.now();
  const trialEnd = now + plan.trialDays * 24 * 60 * 60 * 1000;
  const periodMs = planId === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

  save({
    planId,
    status: 'trial',
    startedAt: now,
    trialEnd,
    currentPeriodEnd: trialEnd + periodMs,
  });
}

/** Activate a paid subscription (called after successful payment confirmation) */
export function activateSubscription(planId) {
  const plan = PLANS[planId];
  if (!plan) return;

  const now = Date.now();
  const periodMs = planId === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

  const existing = load();
  save({
    planId,
    status: 'active',
    startedAt: existing?.startedAt || now,
    trialEnd: existing?.trialEnd,
    currentPeriodEnd: now + periodMs,
  });
}

/** Mark subscription as canceled (access continues until currentPeriodEnd) */
export function cancelSubscription() {
  const sub = load();
  if (!sub) return;
  save({ ...sub, status: 'canceled' });
}

/**
 * Restore purchases — in production calls the native restore flow.
 * Re-checks stored state and returns it.
 */
export function restorePurchases() {
  const sub = load();
  if (!sub) return null;
  return sub;
}

/**
 * Returns days remaining in trial, or null if not in trial.
 */
export function getTrialDaysRemaining() {
  const sub = load();
  if (!sub || sub.status !== 'trial') return null;
  const remaining = sub.trialEnd - Date.now();
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}