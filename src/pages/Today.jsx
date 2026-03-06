import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame, Footprints, ArrowUp, Bell } from 'lucide-react';

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
  const [weightDialog, setWeightDialog] = useState(false);
  const [waterDialog, setWaterDialog] = useState(false);
  const [stepsDialog, setStepsDialog] = useState(false);
  const [exerciseDialog, setExerciseDialog] = useState(false);
  const queryClient = useQueryClient();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isToday = dateStr === todayStr;

  // Data fetching
  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 60),
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['meals', dateStr],
    queryFn: () => base44.entities.MealEntry.filter({ date: dateStr }),
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const dayLog = useMemo(() => logs.find(l => l.date === dateStr) || {}, [logs, dateStr]);

  // Mutations
  const upsertLog = useMutation({
    mutationFn: async (data) => {
      if (dayLog.id) return base44.entities.DailyLog.update(dayLog.id, data);
      return base44.entities.DailyLog.create({ date: dateStr, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
  });

  const addMeal = useMutation({
    mutationFn: (data) => base44.entities.MealEntry.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals', dateStr] }),
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealEntry.delete(id),
    onSuccess: (_, id) => {
      // Recalculate totals after delete
      const deleted = meals.find(m => m.id === id);
      if (deleted) {
        upsertLog.mutate({
          calories_consumed: Math.max((dayLog.calories_consumed || 0) - (deleted.calories || 0), 0),
          carbs:   Math.max((dayLog.carbs   || 0) - (deleted.carbs   || 0), 0),
          protein: Math.max((dayLog.protein || 0) - (deleted.protein || 0), 0),
          fat:     Math.max((dayLog.fat     || 0) - (deleted.fat     || 0), 0),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['meals', dateStr] });
    },
  });

  const handleAddFood = (mealType) => {
    setActiveMealType(mealType);
    setFoodDialogOpen(true);
  };

  const handleSaveFood = async (data) => {
    await addMeal.mutateAsync(data);
    upsertLog.mutate({
      calories_consumed: (dayLog.calories_consumed || 0) + (data.calories || 0),
      carbs:   (dayLog.carbs   || 0) + (data.carbs   || 0),
      protein: (dayLog.protein || 0) + (data.protein || 0),
      fat:     (dayLog.fat     || 0) + (data.fat     || 0),
    });
  };

  // Derived values
  const cals       = dayLog.calories_consumed || 0;
  const calsGoal   = dayLog.calories_goal || 2000;
  const remaining  = Math.max(calsGoal - cals, 0);
  const steps      = dayLog.steps || 0;
  const stepsGoal  = dayLog.steps_goal || 10000;
  const stairs     = dayLog.stairs_climbed || 0;
  const stairsGoal = dayLog.stairs_goal || 20;

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 pt-2"
      >
        <div>
          <p className="text-xs text-gray-500 font-medium">{greeting},</p>
          <h1 className="text-2xl font-black gradient-text leading-tight">Shedit</h1>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Bell className="w-4.5 h-4.5 text-gray-400" />
          </motion.button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-black"
            style={{ background: 'linear-gradient(135deg, #4ade80, #a855f7)' }}>
            {(user?.full_name || 'S')[0].toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Week Selector */}
      <div className="mb-5">
        <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      {/* Calorie Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="glass-card-green rounded-3xl p-5 mb-4"
      >
        <div className="flex items-center gap-5">
          {/* Ring */}
          <ActivityRing
            value={cals}
            max={calsGoal}
            size={118}
            strokeWidth={11}
            color="#4ade80"
            trackColor="rgba(74,222,128,0.1)"
          >
            <Flame className="w-4 h-4 text-green-400 -mt-0.5" />
            <span className="text-[22px] font-black text-white leading-none">{remaining}</span>
            <span className="text-[9px] text-gray-500">left</span>
          </ActivityRing>

          {/* Stats */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Daily Calories</p>
            <p className="text-4xl font-black text-white mt-0.5 leading-none">{cals.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">of {calsGoal.toLocaleString()} kcal</p>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((cals / calsGoal) * 100, 100)}%` }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: cals > calsGoal
                  ? 'linear-gradient(90deg, #f43f5e, #f43f5e80)'
                  : 'linear-gradient(90deg, #4ade80, #a855f7)'
                }}
              />
            </div>
            <div className="flex gap-3 mt-2">
              <span className="text-[10px] text-gray-600">Burned: <span className="text-green-400">{(dayLog.exercise_minutes || 0) * 6} kcal</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div className="flex gap-2.5 mb-4">
        <MacroCard label="Carbs"   value={dayLog.carbs   || 0} goal={dayLog.carbs_goal   || 250} color="#3b82f6" />
        <MacroCard label="Protein" value={dayLog.protein || 0} goal={dayLog.protein_goal || 120} color="#ec4899" />
        <MacroCard label="Fat"     value={dayLog.fat     || 0} goal={dayLog.fat_goal     || 65}  color="#f59e0b" />
      </div>

      {/* Activity Rings Row — Steps & Stairs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 flex items-center gap-4 mb-4"
      >
        <ActivityRing value={steps} max={stepsGoal} size={80} strokeWidth={7} color="#4ade80"
          label={steps >= 1000 ? `${(steps/1000).toFixed(1)}k` : steps} sublabel="steps" />
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-green-400" /> Steps
              </span>
              <span className="text-xs font-bold text-white">{steps.toLocaleString()} / {stepsGoal.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((steps / stepsGoal) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="h-full rounded-full bg-green-400"
                style={{ boxShadow: '0 0 8px rgba(74,222,128,0.4)' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5 text-pink-400" /> Stairs
              </span>
              <span className="text-xs font-bold text-white">{stairs} / {stairsGoal} flights</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stairs / stairsGoal) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-pink-400"
                style={{ boxShadow: '0 0 8px rgba(236,72,153,0.4)' }}
              />
            </div>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setStepsDialog(true)}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-green-400 self-start"
          style={{ background: 'rgba(74,222,128,0.1)' }}
        >
          + Log
        </motion.button>
      </motion.div>

      {/* Healthy Habits */}
      <div className="mb-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3 px-0.5">Daily Habits</p>
        <div className="flex gap-2.5">
          <HabitCard type="water"    value={dayLog.water_glasses    || 0} goal={dayLog.water_goal    || 8}     onTap={() => setWaterDialog(true)} />
          <HabitCard type="exercise" value={dayLog.exercise_minutes || 0} goal={dayLog.exercise_goal || 30}    onTap={() => setExerciseDialog(true)} />
          <HabitCard type="steps"    value={steps}                        goal={stepsGoal}                     onTap={() => setStepsDialog(true)} />
        </div>
      </div>

      {/* Food Diary */}
      <div className="mb-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3 px-0.5">Food Diary</p>
        <div className="space-y-2.5">
          {MEAL_TYPES.map(type => {
            const entries = meals.filter(m => m.meal_type === type);
            const totalCals = entries.reduce((s, m) => s + (m.calories || 0), 0);
            return (
              <MealCard
                key={type}
                type={type}
                entries={entries}
                totalCalories={totalCals}
                onAddFood={() => handleAddFood(type)}
                onDeleteEntry={(id) => deleteMeal.mutate(id)}
              />
            );
          })}
        </div>
      </div>

      {/* Weight */}
      <div className="mb-6">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3 px-0.5">Weight</p>
        <WeightSection logs={logs} onLogWeight={() => setWeightDialog(true)} />
      </div>

      {/* Dialogs */}
      <AddFoodDialog
        isOpen={foodDialogOpen}
        onClose={() => setFoodDialogOpen(false)}
        onSave={handleSaveFood}
        mealType={activeMealType}
        date={dateStr}
      />
      <LogValueDialog isOpen={weightDialog}   onClose={() => setWeightDialog(false)}   title="Log Weight"   unit="kg"      value={dayLog.weight            || 70} step={0.1} min={30}  max={300} color="#10b981" onSave={(v) => upsertLog.mutate({ weight: v })} />
      <LogValueDialog isOpen={waterDialog}    onClose={() => setWaterDialog(false)}    title="Log Water"    unit="glasses" value={dayLog.water_glasses      || 0}  step={1}   min={0}   max={20}  color="#22d3ee" onSave={(v) => upsertLog.mutate({ water_glasses: v })} />
      <LogValueDialog isOpen={stepsDialog}    onClose={() => setStepsDialog(false)}    title="Log Steps"    unit="steps"   value={dayLog.steps              || 0}  step={100} min={0}   max={50000} color="#4ade80" onSave={(v) => upsertLog.mutate({ steps: v })} />
      <LogValueDialog isOpen={exerciseDialog} onClose={() => setExerciseDialog(false)} title="Log Exercise" unit="min"     value={dayLog.exercise_minutes   || 0}  step={5}   min={0}   max={300} color="#f43f5e" onSave={(v) => upsertLog.mutate({ exercise_minutes: v })} />
    </div>
  );
}