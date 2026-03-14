import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

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

  // Meal reminders
  if (hour >= 8 && hour < 11 && totalMeals === 0) {
    reminders.push({ id: 'breakfast', emoji: '🌅', text: "Don't forget to log breakfast!", color: '#f59e0b' });
  }
  if (hour >= 12 && hour < 15 && !meals?.some(m => m.meal_type === 'lunch')) {
    reminders.push({ id: 'lunch', emoji: '🥗', text: 'Log your lunch to stay on track.', color: '#10b981' });
  }
  if (hour >= 18 && hour < 21 && !meals?.some(m => m.meal_type === 'dinner')) {
    reminders.push({ id: 'dinner', emoji: '🍽️', text: "Evening check-in — log dinner!", color: '#a855f7' });
  }

  // Steps reminder
  if (hour >= 17 && steps < stepsGoal * 0.6) {
    const remaining = (stepsGoal - steps).toLocaleString();
    reminders.push({ id: 'steps', emoji: '👟', text: `${remaining} steps left — you got this!`, color: '#c084fc' });
  }

  // Water reminder
  if (hour >= 14 && water < waterGoal * 0.5) {
    reminders.push({ id: 'water', emoji: '💧', text: 'You\'re behind on hydration. Drink up!', color: '#22d3ee' });
  }

  // Protein reminder
  if (hour >= 20 && protein < proteinGoal * 0.7) {
    reminders.push({ id: 'protein', emoji: '🥩', text: `Only ${protein}g protein so far. Try a high-protein snack.`, color: '#ec4899' });
  }

  // Exercise reminder
  if (hour >= 19 && exercise < exerciseGoal) {
    reminders.push({ id: 'exercise', emoji: '🏃', text: 'No exercise logged yet. Even a short walk counts!', color: '#f43f5e' });
  }

  return reminders.slice(0, 2); // Show max 2
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
            <span className="text-xl flex-shrink-0">{r.emoji}</span>
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