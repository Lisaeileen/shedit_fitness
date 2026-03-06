import React, { useState, useCallback } from 'react';
import { UserGoals, MealPlans } from '../components/storage';
import OnboardingFlow from '../components/fitness/OnboardingFlow';
import MealPlanView from '../components/fitness/MealPlanView';

export default function Plan() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const userGoals  = UserGoals.get();
  const mealPlans  = MealPlans.list();

  const handleOnboardingComplete = (data) => {
    UserGoals.save(data);
    refresh();
  };

  if (!userGoals?.onboarding_complete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <MealPlanView
      goals={userGoals}
      mealPlans={mealPlans}
      onRefresh={refresh}
    />
  );
}