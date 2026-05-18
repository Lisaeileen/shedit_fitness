import React, { useState } from 'react';
import { isOnboardingComplete, markOnboardingComplete } from './onboardingUtils';
import NewOnboardingFlow from './NewOnboardingFlow';
import { DailyLogs } from '../../storage';
import { calculatePlan } from './onboardingUtils';

/**
 * Wraps children with the new onboarding flow.
 * Once complete, persists the plan to DailyLogs goals and renders children.
 */
export default function OnboardingGate({ children }) {
  const [done, setDone] = useState(() => isOnboardingComplete());

  const handleComplete = (finalData) => {
    // Persist calorie + macro goals into today's DailyLog so the Today screen picks them up immediately
    const plan = calculatePlan(finalData);
    const today = new Date().toISOString().split('T')[0];
    DailyLogs.upsert(today, {
      calories_goal: plan.dailyCalories,
      protein_goal: plan.protein,
      carbs_goal:   plan.carbs,
      fat_goal:     plan.fat,
    });
    setDone(true);
  };

  if (!done) {
    return <NewOnboardingFlow onComplete={handleComplete} />;
  }

  return children;
}