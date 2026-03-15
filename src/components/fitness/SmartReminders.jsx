import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sunrise, UtensilsCrossed, Utensils, Footprints, Droplets, Dumbbell, Activity } from 'lucide-react';

function buildReminders(dayLog, meals, steps, stepsGoal) {
  const now = new Date();
  const hour = now.getHours();
  const reminders = [];

  const totalMeals = meals?.length || 0;
  const water = dayLog?.water_glasses || 0;
  const waterGoal = dayLog?.water_goal || 8;
  const protein = dayLog?.protein || 0;
  const proteinGoal = dayLog?.protein_goal || 120;
  const exercise = dayLog?.exercise_minutes || 0;
  const exerciseGoal = dayLog?.exercise_goal || 30;

  if (hour >= 8 && hour < 11 && totalMeals === 0) {
    reminders.push({ id: 'breakfast', Icon: Sunrise, text: "Don't forget to log breakfast!", color: '#f59e0b' });
  }
  if (hour >= 12 && hour < 15 && !meals?.some(m => m.meal_type === 'lunch')) {
    reminders.push({ id: 'lunch', Icon: Utensils, text: 'Log your lunch to stay on track.', color: '#10b981' });
  }
  if (hour >= 18 && hour < 21 && !meals?.some(m => m.meal_type === 'dinner')) {
    reminders.push({ id: 'dinner', Icon: UtensilsCrossed, text: 'Evening check-in — log dinner!', color: '#a855f7' });
  }
  if (hour >= 17 && steps < stepsGoal * 0.6) {
    const remaining = (stepsGoal - steps).toLocaleString();
    reminders.push({ id: 'steps', Icon: Footprints, text: `${remaining} steps left — keep moving!`, color: '#c084fc' });
  }
  if (hour >= 14 && water < waterGoal * 0.5) {
    reminders.push({ id: 'water', Icon: Droplets, text: "You're behind on hydration. Drink up!", color: '#22d3ee' });
  }
  if (hour >= 20 && protein < proteinGoal * 0.7) {
    reminders.push({ id: 'protein', Icon: Activity, text: `Only ${protein}g protein so far. Try a high-protein snack.`, color: '#ec4899' });
  }
  if (hour >= 19 && exercise < exerciseGoal) {
    reminders.push({ id: 'exercise', Icon: Dumbbell, text: 'No exercise logged yet. Even a short walk counts!', color: '#f43f5e' });
  }

  return reminders.slice(0, 2);
}

export default function SmartReminders({ dayLog, meals, steps, stepsGoal }) {
  const [dismissed, setDismissed] = useState([]);
  const reminders = buildReminders(dayLog, meals, steps, stepsGoal).filter(r => !dismissed.includes(r.id));

  if (reminders.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      <AnimatePresence>
        {reminders.map(r => (
          <motion.div key={r.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 40, height: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: `${r.color}14`, border: `1px solid ${r.color}30` }}>
            <r.Icon className="w-4 h-4 flex-shrink-0" style={{ color: r.color }} />
            <p className="text-xs font-semibold flex-1" style={{ color: r.color }}>{r.text}</p>
            <button onClick={() => setDismissed(d => [...d, r.id])} className="flex-shrink-0 ml-1">
              <X className="w-3.5 h-3.5" style={{ color: r.color }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}