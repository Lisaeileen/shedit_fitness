// Onboarding storage + calculation utilities

const KEY = 'shedit_onboarding_v2';

export function getOnboardingData() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function saveOnboardingData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
export function isOnboardingComplete() {
  const d = getOnboardingData();
  return !!(d && d.complete);
}
export function markOnboardingComplete(data) {
  saveOnboardingData({ ...data, complete: true, completedAt: Date.now() });
}

/**
 * Calculate BMR using Mifflin-St Jeor, then apply TDEE multiplier.
 * Returns { tdee, caloricDeficit, dailyCalories, protein, carbs, fat, timelineMonths }
 */
export function calculatePlan(data) {
  const {
    sex, dob, weight_kg, height_cm, workout_freq,
    goal_type, desired_weight_kg, goal_speed,
    add_burned_calories, rollover_calories,
  } = data;

  // Age
  const birthYear = dob ? new Date(dob).getFullYear() : 1990;
  const age = new Date().getFullYear() - birthYear;

  const w = parseFloat(weight_kg) || 75;
  const h = parseFloat(height_cm) || 170;
  const a = Math.max(15, Math.min(80, age));

  // BMR (Mifflin-St Jeor)
  let bmr;
  if (sex === 'female') {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  }

  // TDEE multiplier from workout frequency
  const freqMap = { '0-2': 1.375, '3-5': 1.55, '6+': 1.725 };
  const tdee = Math.round(bmr * (freqMap[workout_freq] || 1.55));

  // Goal delta
  const desiredW = parseFloat(desired_weight_kg) || w;
  const weightDiff = w - desiredW; // positive = lose weight

  let deficit = 0;
  if (goal_type === 'lose_weight') {
    deficit = goal_speed === 'slow' ? 250 : goal_speed === 'fast' ? 600 : 400;
  } else if (goal_type === 'gain_weight') {
    deficit = goal_speed === 'slow' ? -150 : goal_speed === 'fast' ? -400 : -250;
  }

  // Clamp: never below 1200 for female, 1500 for male
  const minCal = sex === 'female' ? 1200 : 1500;
  const dailyCalories = Math.max(minCal, tdee - deficit);

  // Macros (standard split: 30P / 40C / 30F for lose, 25P / 50C / 25F for maintain/gain)
  const protein = Math.round((dailyCalories * 0.30) / 4);
  const carbs   = Math.round((dailyCalories * 0.40) / 4);
  const fat     = Math.round((dailyCalories * 0.30) / 9);

  // Timeline
  const absWeightDiff = Math.abs(weightDiff);
  let timelineMonths = 0;
  if (absWeightDiff > 0 && deficit !== 0) {
    const weeklyChange = (Math.abs(deficit) * 7) / 7700; // kg per week
    const weeks = absWeightDiff / weeklyChange;
    timelineMonths = Math.round(weeks / 4.3);
  }

  // Goal date
  const goalDate = new Date();
  goalDate.setMonth(goalDate.getMonth() + (timelineMonths || 10));

  return {
    tdee,
    dailyCalories,
    deficit,
    protein,
    carbs,
    fat,
    timelineMonths,
    goalDate: goalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };
}

export function cmToFtIn(cm) {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft, inches };
}
export function ftInToCm(ft, inches) {
  return Math.round((parseInt(ft) * 12 + parseInt(inches)) * 2.54);
}
export function lbsToKg(lbs) { return Math.round(lbs * 0.453592 * 10) / 10; }
export function kgToLbs(kg)   { return Math.round(kg * 2.20462); }