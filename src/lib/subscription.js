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
    productId: 'com.shedit.monthly', // App Store / Play Store product ID
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
  },
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

/** True if the user has full access (trial or active) */
export function hasAccess() {
  const s = getSubscriptionStatus();
  return s === 'trial' || s === 'active' || s === 'canceled';
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
 * Here we just re-check the stored state and return it.
 */
export function restorePurchases() {
  const sub = load();
  if (!sub) return null;
  return sub;
}