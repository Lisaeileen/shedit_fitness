import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, ArrowUp, Bell, Smartphone } from 'lucide-react';
import { DailyLogs, Meals } from '../components/storage';
import { SheditWordmark, SheditIcon } from '../components/fitness/SheditLogo';
import { useHealthSteps } from '../components/fitness/useHealthSteps';
import HealthPermissionPrompt from '../components/fitness/HealthPermissionPrompt';

import WeekSelector from '../components/fitness/WeekSelector';
import StreakCard from '../components/fitness/StreakCard';
import ActivityRing from '../components/fitness/ActivityRing';
import MacroCard from '../components/fitness/MacroCard';
import MealCard from '../components/fitness/MealCard';
import HabitCard from '../components/fitness/HabitCard';
import WeightSection from '../components/fitness/WeightSection';
import AddFoodDialog from '../components/fitness/AddFoodDialog';
import LogValueDialog from '../components/fitness/LogValueDialog';

export default function Today() {
  const [selectedDate, setSelectedDate]   = useState(new Date());
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [foodDialogMode, setFoodDialogMode] = useState('manual');
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [weightDialog, setWeightDialog]   = useState(false);
  const [waterDialog, setWaterDialog]     = useState(false);
  const [stepsDialog, setStepsDialog]     = useState(false);
  const [exerciseDialog, setExerciseDialog] = useState(false);
  const [tick, setTick] = useState(0);

  const dateStr  = format(selectedDate, 'yyyy-MM-dd');
  const refresh  = useCallback(() => setTick(t => t + 1), []);

  const allLogs  = useMemo(() => DailyLogs.list(), [tick]);
  const dayLog   = useMemo(() => allLogs.find(l => l.date === dateStr) || {}, [allLogs, dateStr]);
  const meals    = useMemo(() => Meals.getByDate(dateStr), [tick, dateStr]);

  const upsertLog = useCallback((fields) => {
    DailyLogs.upsert(dateStr, fields);
    refresh();
  }, [dateStr, refresh]);

  const handleAddFood = (mealType, mode = 'manual') => {
    setActiveMealType(mealType);
    setFoodDialogMode(mode);
    setFoodDialogOpen(true);
  };

  const handleSaveFood = (data) => {
    Meals.add(data);
    upsertLog({
      calories_consumed: (dayLog.calories_consumed || 0) + (data.calories || 0),
      carbs:   (dayLog.carbs   || 0) + (data.carbs   || 0),
      protein: (dayLog.protein || 0) + (data.protein || 0),
      fat:     (dayLog.fat     || 0) + (data.fat     || 0),
    });
  };

  const handleDeleteMeal = (id) => {
    const deleted = meals.find(m => m.id === id);
    Meals.delete(id);
    if (deleted) {
      upsertLog({
        calories_consumed: Math.max((dayLog.calories_consumed || 0) - (deleted.calories || 0), 0),
        carbs:   Math.max((dayLog.carbs   || 0) - (deleted.carbs   || 0), 0),
        protein: Math.max((dayLog.protein || 0) - (deleted.protein || 0), 0),
        fat:     Math.max((dayLog.fat     || 0) - (deleted.fat     || 0), 0),
      });
    } else { refresh(); }
  };

  const cals      = dayLog.calories_consumed || 0;
  const calsGoal  = dayLog.calories_goal || 2000;
  const remaining = Math.max(calsGoal - cals, 0);
  const steps     = dayLog.steps || 0;
  const stepsGoal = dayLog.steps_goal || 10000;
  const stairs    = dayLog.stairs_climbed || 0;
  const stairsGoal = dayLog.stairs_goal || 20;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 pt-2">
        <div>
          <p className="text-xs text-purple-300/50 font-medium">{greeting}</p>
          <SheditWordmark size={30} />
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Bell className="w-4 h-4 text-purple-300/50" />
          </motion.button>
          <SheditIcon size={36} rounded="full" />
        </div>
      </motion.div>

      {/* Week Selector */}
      <div className="mb-5">
        <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      {/* Calorie Hero */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }} className="rounded-3xl p-5 mb-4"
        style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.08) 100%)', border: '1px solid rgba(168,85,247,0.25)', backdropFilter: 'blur(24px)' }}>
        <p className="text-[10px] text-purple-300/50 uppercase tracking-widest font-bold mb-4">Today's Calories</p>
        <div className="flex items-center gap-6">
          <ActivityRing value={cals} max={calsGoal} size={130} strokeWidth={13}
            color="#a855f7" trackColor="rgba(168,85,247,0.08)" glowIntensity={1.5}>
            <span className="text-[10px] text-gray-500 mb-0.5">kcal</span>
            <span className="text-[26px] font-black text-white leading-none">{cals > 999 ? `${(cals/1000).toFixed(1)}k` : cals}</span>
            <span className="text-[9px] text-gray-600 mt-0.5">{remaining} left</span>
          </ActivityRing>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Goal</span>
                <span className="text-sm font-black text-white">{calsGoal.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <motion.div initial={{ width: 0 }}
                  animate={{ width: `${Math.min((cals / calsGoal) * 100, 100)}%` }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: cals > calsGoal ? 'linear-gradient(90deg,#f43f5e,#fb7185)' : 'linear-gradient(90deg,#7c3aed,#c084fc)', boxShadow: '0 0 8px rgba(168,85,247,0.6)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[9px] text-gray-600 uppercase tracking-wider">Consumed</p>
                <p className="text-base font-black text-white mt-0.5">{cals.toLocaleString()}</p>
              </div>
              <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[9px] text-gray-600 uppercase tracking-wider">Burned</p>
                <p className="text-base font-black" style={{ color: '#ec4899', marginTop: 2 }}>{(dayLog.exercise_minutes || 0) * 6}</p>
              </div>
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

      {/* Steps & Stairs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4 flex items-center gap-4 mb-4">
        <ActivityRing value={steps} max={stepsGoal} size={80} strokeWidth={7} color="#a855f7"
          label={steps >= 1000 ? `${(steps/1000).toFixed(1)}k` : steps} sublabel="steps" />
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-purple-400" /> Steps
              </span>
              <span className="text-xs font-bold text-white">{steps.toLocaleString()} / {stepsGoal.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${Math.min((steps / stepsGoal) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="h-full rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 8px rgba(168,85,247,0.5)' }} />
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
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${Math.min((stairs / stairsGoal) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full" style={{ background: '#ec4899', boxShadow: '0 0 8px rgba(236,72,153,0.4)' }} />
            </div>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setStepsDialog(true)}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-purple-400 self-start"
          style={{ background: 'rgba(168,85,247,0.12)' }}>
          + Log
        </motion.button>
      </motion.div>

      {/* Streak */}
      <StreakCard />

      {/* Daily Habits */}
      <div className="mb-4">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-3 px-0.5">Daily Habits</p>
        <div className="flex gap-2.5">
          <HabitCard type="water"    value={dayLog.water_glasses    || 0} goal={dayLog.water_goal    || 8}  onTap={() => setWaterDialog(true)} />
          <HabitCard type="exercise" value={dayLog.exercise_minutes || 0} goal={dayLog.exercise_goal || 30} onTap={() => setExerciseDialog(true)} />
          <HabitCard type="steps"    value={steps}                        goal={stepsGoal}                  onTap={() => setStepsDialog(true)} />
        </div>
      </div>

      {/* Food Diary */}
      <div className="mb-4">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-3 px-0.5">Food Diary</p>
        <div className="space-y-2.5">
          {MEAL_TYPES.map(type => {
            const entries = meals.filter(m => m.meal_type === type);
            const totalCals = entries.reduce((s, m) => s + (m.calories || 0), 0);
            return (
              <MealCard key={type} type={type} entries={entries} totalCalories={totalCals}
                onAddFood={(mode) => handleAddFood(type, mode)}
                onDeleteEntry={handleDeleteMeal} />
            );
          })}
        </div>
      </div>

      {/* Weight */}
      <div className="mb-6">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-3 px-0.5">Weight</p>
        <WeightSection logs={allLogs} onLogWeight={() => setWeightDialog(true)} />
      </div>

      {/* Dialogs */}
      <AddFoodDialog
        isOpen={foodDialogOpen}
        onClose={() => { setFoodDialogOpen(false); }}
        onSave={handleSaveFood}
        mealType={activeMealType}
        date={dateStr}
        initialMode={foodDialogMode}
      />
      <LogValueDialog isOpen={weightDialog}   onClose={() => setWeightDialog(false)}   title="Log Weight"   unit="kg"      value={dayLog.weight          || 70}  step={0.1} min={30}  max={300}   color="#a855f7" onSave={(v) => upsertLog({ weight: v })} />
      <LogValueDialog isOpen={waterDialog}    onClose={() => setWaterDialog(false)}    title="Log Water"    unit="glasses" value={dayLog.water_glasses    || 0}   step={1}   min={0}   max={20}    color="#22d3ee" onSave={(v) => upsertLog({ water_glasses: v })} />
      <LogValueDialog isOpen={stepsDialog}    onClose={() => setStepsDialog(false)}    title="Log Steps"    unit="steps"   value={dayLog.steps            || 0}   step={100} min={0}   max={50000} color="#a855f7" onSave={(v) => upsertLog({ steps: v })} />
      <LogValueDialog isOpen={exerciseDialog} onClose={() => setExerciseDialog(false)} title="Log Exercise" unit="min"     value={dayLog.exercise_minutes || 0}   step={5}   min={0}   max={300}   color="#f43f5e" onSave={(v) => upsertLog({ exercise_minutes: v })} />
    </div>
  );
}