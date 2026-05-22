import React, { useState } from 'react';
import { isOnboardingComplete } from './onboardingUtils';
import NewOnboardingFlow from './NewOnboardingFlow';
import PaywallScreen from '../PaywallScreen';
import { DailyLogs, UserGoals } from '../../storage';
import { calculatePlan } from './onboardingUtils';
import { hasAccess, startTrial } from '@/lib/subscription';

/**
 * Gate order:
 *   1. Onboarding (collect user data)
 *   2. Paywall (subscription / trial)
 *   3. App
 */
export default function OnboardingGate({ children }) {
  const [onboardingDone, setOnboardingDone] = useState(() => isOnboardingComplete());
  const [subscribed, setSubscribed] = useState(() => hasAccess());

  const handleOnboardingComplete = (finalData) => {
    const plan = calculatePlan(finalData);
    const today = new Date().toISOString().split('T')[0];
    DailyLogs.upsert(today, {
      calories_goal: plan.dailyCalories,
      protein_goal: plan.protein,
      carbs_goal:   plan.carbs,
      fat_goal:     plan.fat,
    });

    // Bridge: also save key data into UserGoals so the Plan page
    // can generate a personalized meal plan without requiring the
    // secondary OnboardingFlow inside Plan.
    const existingGoals = UserGoals.get() || {};
    UserGoals.save({
      ...existingGoals,
      // Map NewOnboardingFlow fields to what generateAIPlan expects
      primary_goal: finalData.goal_type || existingGoals.primary_goal || 'eat_healthy',
      daily_calorie_target: plan.dailyCalories,
      protein_goal: plan.protein,
      carbs_goal: plan.carbs,
      fat_goal: plan.fat,
      current_weight: finalData.weight_kg,
      target_weight: finalData.desired_weight_kg,
      // Carry over diet/cuisine prefs if already set, otherwise defaults
      diet_styles: existingGoals.diet_styles || [finalData.diet_type || 'balanced'],
      disliked_foods: existingGoals.disliked_foods || [],
      cuisine_prefs: existingGoals.cuisine_prefs || {},
      user_name: existingGoals.user_name || '',
      goal_speed: finalData.goal_speed,
      sex: finalData.sex,
      workout_freq: finalData.workout_freq,
      onboarding_complete: true,
    });

    setOnboardingDone(true);
  };

  const handleSubscribed = () => {
    setSubscribed(true);
  };

  if (!onboardingDone) {
    return <NewOnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (!subscribed) {
    return <PaywallScreen onSubscribed={handleSubscribed} />;
  }

  return children;
}