import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅', calKey: 'breakfast_calories', color: '#f59e0b' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️', calKey: 'lunch_calories',     color: '#10b981' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙', calKey: 'dinner_calories',     color: '#6366f1' },
  { key: 'snacks',    label: 'Snacks',    emoji: '🍎', calKey: 'snacks_calories',     color: '#ec4899' },
];

function EditableField({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div className="flex gap-2 items-start mt-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-xl p-2.5 text-sm text-white outline-none resize-none"
          rows={2}
          autoFocus
        />
        <div className="flex flex-col gap-1.5">
          <button onClick={save} className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-green-400" />
          </button>
          <button onClick={cancel} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 mt-1">
      <p className="text-sm text-white flex-1 leading-relaxed">
        {value || <span className="text-gray-600 italic">Not planned</span>}
      </p>
      <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/[0.06] flex-shrink-0">
        <Edit2 className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}

export default function MealPlanView({ goals, mealPlans = [], onRefresh }) {
  const [selectedDay, setSelectedDay] = useState(
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const dayPlan = mealPlans.find(p => p.day_of_week === selectedDay);

  const generatePlan = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a realistic, delicious, and varied 7-day meal plan. 
        User goal: ${goals?.primary_goal || 'eat healthy'}.
        Daily calorie target: ~${goals?.daily_calorie_target || 2000} kcal.
        Include breakfast, lunch, dinner, and snacks for each day.
        Make the meals practical, healthy, and easy to prepare.
        For each meal include a brief description (1–2 sentences).`,
      response_json_schema: {
        type: 'object',
        properties: {
          days: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day_of_week:          { type: 'string' },
                breakfast:            { type: 'string' },
                breakfast_calories:   { type: 'number' },
                lunch:                { type: 'string' },
                lunch_calories:       { type: 'number' },
                dinner:               { type: 'string' },
                dinner_calories:      { type: 'number' },
                snacks:               { type: 'string' },
                snacks_calories:      { type: 'number' },
              }
            }
          }
        }
      }
    });

    if (result?.days) {
      // Delete existing plans first
      for (const plan of mealPlans) {
        await base44.entities.MealPlan.delete(plan.id);
      }
      // Create new plans
      for (const day of result.days) {
        await base44.entities.MealPlan.create(day);
      }
    }
    setGenerating(false);
    onRefresh?.();
  };

  const updateMealField = async (field, value) => {
    if (!dayPlan) return;
    await base44.entities.MealPlan.update(dayPlan.id, { [field]: value });
    onRefresh?.();
  };

  const totalCals = MEAL_CONFIG.reduce((sum, m) => sum + (dayPlan?.[m.calKey] || 0), 0);

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pt-2">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Nutrition</p>
          <h1 className="text-2xl font-black text-white">Weekly Plan</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={generatePlan}
          disabled={generating}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold mt-1"
          style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(74,222,128,0.25)' }}
        >
          {generating
            ? <Loader2 className="w-3.5 h-3.5 text-green-400 animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5 text-green-400" />
          }
          <span className="text-green-400">{mealPlans.length > 0 ? 'Regenerate' : 'Generate'}</span>
        </motion.button>
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4">
        {DAYS.map((day, i) => {
          const isActive = selectedDay === day;
          const hasPlan = mealPlans.some(p => p.day_of_week === day);
          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedDay(day)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0 transition-all duration-200"
              style={isActive
                ? { background: 'linear-gradient(135deg, #4ade80, #a855f7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }
              }
            >
              <span className="text-xs font-bold">{DAY_SHORT[i]}</span>
              {hasPlan && !isActive && (
                <div className="w-1 h-1 rounded-full bg-green-400/50" />
              )}
            </motion.button>
          );
        })}
      </div>

      {generating ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-white">Generating your plan...</p>
          <p className="text-xs text-gray-500 mt-1">AI is crafting a personalized meal plan</p>
        </div>
      ) : dayPlan ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Total calories */}
            <div className="glass-card-green rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total for {selectedDay}</p>
                <p className="text-2xl font-black text-white mt-0.5">{totalCals.toLocaleString()} kcal</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>

            <div className="space-y-3">
              {MEAL_CONFIG.map((meal, i) => (
                <motion.div
                  key={meal.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{meal.emoji}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meal.label}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: meal.color }}>
                      {dayPlan[meal.calKey] || 0} kcal
                    </span>
                  </div>
                  <EditableField
                    value={dayPlan[meal.key]}
                    onChange={(v) => updateMealField(meal.key, v)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-14"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-bold text-white mb-2">No plan for {selectedDay}</h3>
          <p className="text-sm text-gray-500 mb-6">Generate your AI-powered meal plan</p>
          <button onClick={generatePlan} className="btn-primary max-w-xs mx-auto">
            Generate Weekly Plan
          </button>
        </motion.div>
      )}
    </div>
  );
}