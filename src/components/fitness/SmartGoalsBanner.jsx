import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

/**
 * SmartGoalsBanner
 * If user has walked more than their step goal, show a dynamic calorie bonus.
 * Rule: every 1,000 extra steps ≈ 40 extra calories allowed (conservative estimate).
 */
export default function SmartGoalsBanner({ steps, stepsGoal, calorieGoal }) {
  const extraSteps = Math.max(steps - stepsGoal, 0);
  const bonusCalories = Math.floor((extraSteps / 1000) * 40);

  if (bonusCalories < 40) return null; // Only show if meaningful

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-2xl p-4 mb-4 flex items-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))',
        border: '1px solid rgba(16,185,129,0.25)',
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(16,185,129,0.18)' }}>
        <Zap className="w-5 h-5 text-green-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          Smart Calorie Bonus
        </p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
          You walked <span className="text-green-400 font-semibold">{extraSteps.toLocaleString()} extra steps</span> beyond your goal.
          You can consume <span className="text-green-400 font-semibold">+{bonusCalories} kcal</span> today — new target: <span className="text-white font-bold">{(calorieGoal + bonusCalories).toLocaleString()} kcal</span>.
        </p>
      </div>
    </motion.div>
  );
}