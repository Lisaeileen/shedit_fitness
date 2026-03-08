import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Dumbbell, Flame } from 'lucide-react';

const ROUTINES = [
  {
    id: 'weight_loss',
    emoji: '🔥',
    label: 'Weight Loss',
    desc: 'Burn fat with full body circuits',
    duration: '30 min',
    cals: '250-350',
    color: '#f59e0b',
    exercises: [
      { name: 'Jumping Jacks',      sets: 3, reps: '30 reps',  rest: '20s' },
      { name: 'Burpees',            sets: 3, reps: '10 reps',  rest: '30s' },
      { name: 'Mountain Climbers',  sets: 3, reps: '20 reps',  rest: '20s' },
      { name: 'Squat Jumps',        sets: 3, reps: '15 reps',  rest: '30s' },
      { name: 'High Knees',         sets: 3, reps: '30 reps',  rest: '20s' },
      { name: 'Push-ups',           sets: 3, reps: '12 reps',  rest: '30s' },
      { name: 'Plank',              sets: 3, reps: '45 sec',   rest: '20s' },
    ]
  },
  {
    id: 'home',
    emoji: '🏠',
    label: 'Home Workout',
    desc: 'No equipment needed',
    duration: '25 min',
    cals: '180-250',
    color: '#3b82f6',
    exercises: [
      { name: 'Push-ups',           sets: 3, reps: '12 reps',  rest: '30s' },
      { name: 'Bodyweight Squats',  sets: 3, reps: '20 reps',  rest: '30s' },
      { name: 'Glute Bridges',      sets: 3, reps: '15 reps',  rest: '20s' },
      { name: 'Tricep Dips (chair)',sets: 3, reps: '12 reps',  rest: '30s' },
      { name: 'Lunges',             sets: 3, reps: '12 each',  rest: '30s' },
      { name: 'Superman Hold',      sets: 3, reps: '10 reps',  rest: '20s' },
      { name: 'Plank',              sets: 3, reps: '45 sec',   rest: '20s' },
    ]
  },
  {
    id: 'strength',
    emoji: '💪',
    label: 'Strength Training',
    desc: 'Build muscle and get stronger',
    duration: '40 min',
    cals: '200-300',
    color: '#a855f7',
    exercises: [
      { name: 'Dumbbell Squats',    sets: 4, reps: '10 reps',  rest: '60s' },
      { name: 'Dumbbell Press',     sets: 4, reps: '10 reps',  rest: '60s' },
      { name: 'Bent-over Rows',     sets: 4, reps: '10 reps',  rest: '60s' },
      { name: 'Dumbbell Lunges',    sets: 3, reps: '12 each',  rest: '45s' },
      { name: 'Shoulder Press',     sets: 3, reps: '12 reps',  rest: '45s' },
      { name: 'Bicep Curls',        sets: 3, reps: '12 reps',  rest: '30s' },
      { name: 'Tricep Extensions',  sets: 3, reps: '12 reps',  rest: '30s' },
    ]
  },
  {
    id: 'cardio',
    emoji: '🏃',
    label: 'Cardio Routine',
    desc: 'Improve endurance and heart health',
    duration: '35 min',
    cals: '300-400',
    color: '#ec4899',
    exercises: [
      { name: 'Warm-up Walk',       sets: 1, reps: '5 min',    rest: '—' },
      { name: 'Jog (moderate)',     sets: 1, reps: '10 min',   rest: '—' },
      { name: 'Sprint Intervals',   sets: 6, reps: '30 sec on / 1 min off', rest: '—' },
      { name: 'Jump Rope',          sets: 3, reps: '2 min',    rest: '30s' },
      { name: 'Stair Climbs',       sets: 3, reps: '1 min',    rest: '30s' },
      { name: 'Cool-down Walk',     sets: 1, reps: '5 min',    rest: '—' },
    ]
  },
];

export default function WorkoutPanel() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div>
            <h4 className="text-base font-bold text-white">{selected.emoji} {selected.label}</h4>
            <p className="text-xs text-gray-500">{selected.duration} · {selected.cals} kcal burned</p>
          </div>
        </div>

        <div className="space-y-2">
          {selected.exercises.map((ex, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: `${selected.color}25`, color: selected.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{ex.name}</p>
                <p className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} · Rest: {ex.rest}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <p className="text-xs text-gray-400 leading-relaxed">💡 Rest 1–2 days between sessions for recovery. Always warm up for 5 minutes before starting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-4">Beginner-friendly workout plans you can do at home or the gym.</p>
      {ROUTINES.map(r => (
        <motion.button key={r.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(r)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${r.color}18` }}>
            {r.emoji}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{r.label}</p>
            <p className="text-xs text-gray-500">{r.desc}</p>
            <div className="flex gap-3 mt-1.5">
              <span className="text-[10px] text-purple-400">{r.duration}</span>
              <span className="text-[10px] text-orange-400">~{r.cals} kcal</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </motion.button>
      ))}
    </div>
  );
}