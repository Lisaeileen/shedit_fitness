import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

function generateInsights(dayLog) {
  const insights = [];
  const cals     = dayLog.calories_consumed || 0;
  const calsGoal = dayLog.calories_goal || 2000;
  const protein  = dayLog.protein || 0;
  const proteinGoal = dayLog.protein_goal || 120;
  const carbs    = dayLog.carbs || 0;
  const carbsGoal = dayLog.carbs_goal || 250;
  const fat      = dayLog.fat || 0;
  const water    = dayLog.water_glasses || 0;
  const waterGoal = dayLog.water_goal || 8;
  const steps    = dayLog.steps || 0;
  const stepsGoal = dayLog.steps_goal || 10000;

  if (cals === 0) {
    insights.push({ type: 'info', emoji: '🍽️', text: "You haven't logged any food yet today. Tap + to start tracking!" });
  } else if (cals > calsGoal) {
    insights.push({ type: 'warn', emoji: '⚠️', text: `You're ${cals - calsGoal} kcal over your goal. Consider a lighter dinner or evening snack.` });
  } else if (cals >= calsGoal * 0.85) {
    insights.push({ type: 'success', emoji: '✅', text: `Great job! You're at ${cals} kcal — very close to your ${calsGoal} kcal goal.` });
  }

  if (protein < proteinGoal * 0.5 && cals > 0) {
    insights.push({ type: 'warn', emoji: '💪', text: `Low on protein — only ${protein}g of your ${proteinGoal}g goal. Try eggs, chicken, or Greek yogurt.` });
  } else if (protein >= proteinGoal) {
    insights.push({ type: 'success', emoji: '🥩', text: `Protein goal crushed! ${protein}g / ${proteinGoal}g — great for muscle and satiety!` });
  } else if (protein > 0) {
    const needed = proteinGoal - protein;
    insights.push({ type: 'info', emoji: '🥚', text: `You still need ${needed}g protein today. Add a protein-rich snack to hit your goal.` });
  }

  if (water < 4 && cals > 0) {
    insights.push({ type: 'warn', emoji: '💧', text: `Only ${water} glasses of water today. Staying hydrated reduces cravings and boosts energy!` });
  } else if (water >= waterGoal) {
    insights.push({ type: 'success', emoji: '💧', text: `Excellent hydration! ${water} glasses — well done!` });
  }

  if (steps >= stepsGoal) {
    insights.push({ type: 'success', emoji: '👟', text: `Step goal complete! ${steps.toLocaleString()} steps — you're on fire today! 🔥` });
  } else if (steps > 0 && stepsGoal - steps < 2000) {
    insights.push({ type: 'info', emoji: '🚶', text: `Just ${(stepsGoal - steps).toLocaleString()} more steps to hit your goal — a quick 15-min walk will do it!` });
  }

  if (carbs > carbsGoal * 1.2 && cals > 0) {
    insights.push({ type: 'warn', emoji: '🍞', text: `Your carb intake is higher than usual. Consider swapping refined carbs for veggies or legumes.` });
  }

  return insights.slice(0, 3);
}

const typeStyle = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7' },
  warn:    { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d' },
  info:    { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
};

export default function DailyNutritionInsight({ dayLog }) {
  const [expanded, setExpanded] = useState(false);
  const insights = useMemo(() => generateInsights(dayLog), [dayLog]);

  if (insights.length === 0) return null;

  const shown = expanded ? insights : insights.slice(0, 1);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <p className="text-[10px] text-purple-300/50 uppercase tracking-widest font-bold">AI Nutrition Insights</p>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {shown.map((ins, i) => {
            const s = typeStyle[ins.type];
            return (
              <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl px-4 py-3 flex items-start gap-3"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <span className="text-base flex-shrink-0 mt-0.5">{ins.emoji}</span>
                <p className="text-xs leading-relaxed" style={{ color: s.text }}>{ins.text}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {insights.length > 1 && (
        <button onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 mt-2 text-[11px] text-purple-400 font-semibold">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> {insights.length - 1} more insight{insights.length > 2 ? 's' : ''}</>}
        </button>
      )}
    </motion.div>
  );
}