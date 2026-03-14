import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

function TaskRow({ emoji, label, done, detail, onTap }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className="w-full flex items-center gap-3 py-3 px-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: done ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)', border: done ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)' }}>
        {done
          ? <Check className="w-4 h-4 text-green-400" />
          : <span className="text-base">{emoji}</span>}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold" style={{ color: done ? '#6b7280' : '#ffffff', textDecoration: done ? 'line-through' : 'none' }}>{label}</p>
        {detail && <p className="text-[10px] mt-0.5" style={{ color: done ? '#4b5563' : '#9ca3af' }}>{detail}</p>}
      </div>
      {!done && <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />}
    </motion.button>
  );
}

export default function TodaysPlan({ dayLog, meals, steps, stepsGoal, onNavigate }) {
  const totalMeals = meals?.length || 0;
  const calories   = dayLog?.calories_consumed || 0;
  const calsGoal   = dayLog?.calories_goal || 2000;
  const water      = dayLog?.water_glasses || 0;
  const waterGoal  = dayLog?.water_goal || 8;
  const protein    = dayLog?.protein || 0;
  const proteinGoal = dayLog?.protein_goal || 120;
  const exercise   = dayLog?.exercise_minutes || 0;
  const exerciseGoal = dayLog?.exercise_goal || 30;

  const tasks = [
    {
      emoji: '🍽️',
      label: 'Log your meals',
      detail: totalMeals > 0 ? `${totalMeals} item${totalMeals > 1 ? 's' : ''} logged` : 'Nothing logged yet',
      done: totalMeals >= 3,
    },
    {
      emoji: '👟',
      label: 'Reach step goal',
      detail: `${steps.toLocaleString()} / ${stepsGoal.toLocaleString()} steps`,
      done: steps >= stepsGoal,
    },
    {
      emoji: '💧',
      label: 'Drink water',
      detail: `${water} / ${waterGoal} glasses`,
      done: water >= waterGoal,
    },
    {
      emoji: '🥩',
      label: 'Hit protein target',
      detail: `${protein}g / ${proteinGoal}g`,
      done: protein >= proteinGoal,
    },
    {
      emoji: '🏃',
      label: 'Exercise',
      detail: `${exercise} / ${exerciseGoal} min`,
      done: exercise >= exerciseGoal,
    },
  ];

  const doneCount = tasks.filter(t => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl p-5 mb-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Today's Plan</p>
          <p className="text-sm font-black text-white mt-0.5">{doneCount}/{tasks.length} completed</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: pct === 100 ? '#10b981' : '#a855f7' }}>{pct}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct === 100 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#7c3aed,#c084fc)', boxShadow: '0 0 8px rgba(168,85,247,0.5)' }}
        />
      </div>

      <div>
        {tasks.map((t, i) => (
          <TaskRow key={t.label} {...t} onTap={() => onNavigate?.(t.label)} />
        ))}
      </div>

      {pct === 100 && (
        <div className="mt-3 rounded-2xl p-3 text-center"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p className="text-sm font-black text-green-400">🎉 Perfect day! All goals completed!</p>
        </div>
      )}
    </motion.div>
  );
}