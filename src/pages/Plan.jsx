import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import OnboardingFlow from '../components/fitness/OnboardingFlow';
import MealPlanView from '../components/fitness/MealPlanView';

export default function Plan() {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['userGoals'],
    queryFn: () => base44.entities.UserGoals.list(),
  });

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => base44.entities.MealPlan.list('-week_start_date', 7),
  });

  const createGoals = useMutation({
    mutationFn: (data) => base44.entities.UserGoals.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userGoals'] }),
  });

  if (goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-green-400/30 border-t-green-400 animate-spin" />
      </div>
    );
  }

  const userGoals = goals[0];

  if (!userGoals?.onboarding_complete) {
    return (
      <OnboardingFlow
        onComplete={(data) => createGoals.mutate(data)}
      />
    );
  }

  return (
    <MealPlanView
      goals={userGoals}
      mealPlans={mealPlans}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ['mealPlans'] })}
    />
  );
}