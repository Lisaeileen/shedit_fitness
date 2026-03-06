import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import OnboardingFlow from '../components/fitness/OnboardingFlow';
import MealPlanView from '../components/fitness/MealPlanView';

export default function Plan() {
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['userGoals'],
    queryFn: () => base44.entities.UserGoals.list(),
  });

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => base44.entities.MealPlan.list(),
  });

  const createGoals = useMutation({
    mutationFn: (data) => base44.entities.UserGoals.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userGoals'] }),
  });

  const userGoals = goals[0];

  if (!userGoals?.onboarding_complete) {
    return <OnboardingFlow onComplete={(data) => createGoals.mutate(data)} />;
  }

  return (
    <MealPlanView 
      goals={userGoals} 
      mealPlans={mealPlans}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ['mealPlans'] })}
    />
  );
}