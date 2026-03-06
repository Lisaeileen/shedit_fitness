import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

import WeekSelector from '../components/fitness/WeekSelector';
import ActivityRing from '../components/fitness/ActivityRing';
import MacroCard from '../components/fitness/MacroCard';
import MealCard from '../components/fitness/MealCard';
import HabitCard from '../components/fitness/HabitCard';
import WeightSection from '../components/fitness/WeightSection';
import AddFoodDialog from '../components/fitness/AddFoodDialog';
import LogValueDialog from '../components/fitness/LogValueDialog';

export default function Today() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: logs = [] } = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 30),
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['meals', dateStr],
    queryFn: () => base44.entities.MealEntry.filter({ date: dateStr }),
  });

  const todayLog = useMemo(() => logs.find(l => l.date === dateStr) || {}, [logs, dateStr]);

  const upsertLog = useMutation({
    mutationFn: async (data) => {
      if (todayLog.id) {
        return base44.entities.DailyLog.update(todayLog.id, data);
      } else {
        return base44.entities.DailyLog.create({ date: dateStr, ...data });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dailyLogs'] }),
  });

  const addMeal = useMutation({
    mutationFn: (data) => base44.entities.MealEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', dateStr] });
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
    },
  });

  const handleAddFood = (mealType, mode) => {
    setActiveMealType(mealType);
    setFoodDialogOpen(true);
  };

  const handleSaveFood = async (data) => {
    await addMeal.mutateAsync(data);
    const newCals = (todayLog.calories_consumed || 0) + data.calories;
    const newCarbs = (todayLog.carbs || 0) + data.carbs;
    const newProtein = (todayLog.protein || 0) + data.protein;
    const newFat = (todayLog.fat || 0) + data.fat;
    upsertLog.mutate({ 
      calories_consumed: newCals, carbs: newCarbs, protein: newProtein, fat: newFat 
    });
  };

  const handleLogWeight = (val) => {
    upsertLog.mutate({ weight: val });
  };

  const caloriesConsumed = todayLog.calories_consumed || 0;
  const caloriesGoal = todayLog.calories_goal || 2000;
  const remaining = Math.max(caloriesGoal - caloriesConsumed, 0);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold gradient-text">Shedit</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Walk it off. Climb it up. Shed it.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
          S
        </div>
      </motion.div>

      {/* Week Selector */}
      <div className="mb-6">
        <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      {/* Calories Ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-6 flex items-center gap-6 mb-4"
      >
        <ActivityRing 
          value={caloriesConsumed} 
          max={caloriesGoal} 
          size={130} 
          strokeWidth={12}
          color="#a855f7"
        >
          <Flame className="w-5 h-5 text-purple-400 mb-0.5" />
          <span className="text-xl font-bold text-white">{remaining}</span>
          <span className="text-[9px] text-gray-500">remaining</span>
        </ActivityRing>
        <div className="flex-1">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium">Calories</h3>
          <p className="text-3xl font-bold text-white mt-1">{caloriesConsumed.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">of {caloriesGoal.toLocaleString()} kcal</p>
          <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((caloriesConsumed / caloriesGoal) * 100, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div className="flex gap-3 mb-4">
        <MacroCard label="Carbs" value={todayLog.carbs || 0} goal={todayLog.carbs_goal || 250} color="#3b82f6" />
        <MacroCard label="Protein" value={todayLog.protein || 0} goal={todayLog.protein_goal || 120} color="#ec4899" />
        <MacroCard label="Fat" value={todayLog.fat || 0} goal={todayLog.fat_goal || 65} color="#f59e0b" />
      </div>

      {/* Food Diary */}
      <div className="mb-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 px-1">Food Diary</h3>
        <div className="space-y-3">
          {mealTypes.map(type => {
            const mealEntries = meals.filter(m => m.meal_type === type);
            const totalCals = mealEntries.reduce((s, m) => s + (m.calories || 0), 0);
            return (
              <MealCard
                key={type}
                type={type}
                entries={mealEntries}
                totalCalories={totalCals}
                onAddFood={(mode) => handleAddFood(type, mode)}
              />
            );
          })}
        </div>
      </div>

      {/* Healthy Habits */}
      <div className="mb-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 px-1">Healthy Habits</h3>
        <div className="flex gap-3">
          <HabitCard type="water" value={todayLog.water_glasses || 0} goal={todayLog.water_goal || 8} />
          <HabitCard type="exercise" value={todayLog.exercise_minutes || 0} goal={todayLog.exercise_goal || 30} />
          <HabitCard type="steps" value={todayLog.steps || 0} goal={todayLog.steps_goal || 10000} />
        </div>
      </div>

      {/* Weight */}
      <div className="mb-6">
        <WeightSection logs={logs} onLogWeight={() => setWeightDialogOpen(true)} />
      </div>

      {/* Dialogs */}
      <AddFoodDialog
        isOpen={foodDialogOpen}
        onClose={() => setFoodDialogOpen(false)}
        onSave={handleSaveFood}
        mealType={activeMealType}
        date={dateStr}
      />
      <LogValueDialog
        isOpen={weightDialogOpen}
        onClose={() => setWeightDialogOpen(false)}
        title="Log Weight"
        unit="kg"
        value={todayLog.weight || 70}
        step={0.1}
        min={30}
        max={300}
        onSave={handleLogWeight}
      />
    </div>
  );
}