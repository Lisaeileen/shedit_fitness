import React, { useState } from 'react';
import { isOnboardingComplete } from './onboardingUtils';
import NewOnboardingFlow from './NewOnboardingFlow';
import PaywallScreen from '../PaywallScreen';
import { DailyLogs } from '../../storage';
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