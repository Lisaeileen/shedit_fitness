import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Check } from 'lucide-react';

const STEPS = [
  {
    title: "What's your #1 goal?",
    subtitle: "We'll build your plan around this",
    field: 'primary_goal',
    multi: false,
    options: [
      { value: 'lose_weight',  label: 'Lose weight',        emoji: '🔥' },
      { value: 'gain_weight',  label: 'Gain weight',        emoji: '💪' },
      { value: 'maintain',     label: 'Maintain weight',    emoji: '⚖️' },
      { value: 'hit_macros',   label: 'Hit my macros',      emoji: '📊' },
      { value: 'eat_healthy',  label: 'Eat healthier',      emoji: '🥗' },
      { value: 'meal_prep',    label: 'Meal prep weekly',   emoji: '🍱' },
      { value: 'save_time',    label: 'Save time cooking',  emoji: '⏰' },
      { value: 'spend_less',   label: 'Spend less eating out', emoji: '💰' },
    ]
  },
  {
    title: "How motivated are you?",
    subtitle: "Be honest — we'll match the intensity",
    field: 'motivation_level',
    multi: false,
    options: [
      { value: 'ready_to_tackle', label: 'Ready to tackle anything', emoji: '🚀' },
      { value: 'willing_to_try',  label: 'Willing to give it a go',  emoji: '👍' },
      { value: 'small_changes',   label: 'Small changes are best',   emoji: '🌱' },
      { value: 'not_ready',       label: 'Not quite ready yet',      emoji: '🤔' },
    ]
  },
  {
    title: "Diet preference?",
    subtitle: "We'll tailor your meals accordingly",
    field: 'diet',
    multi: false,
    options: [
      { value: 'no_restrictions', label: 'No restrictions',  emoji: '🍽️' },
      { value: 'vegetarian',      label: 'Vegetarian',        emoji: '🥦' },
      { value: 'vegan',           label: 'Vegan',             emoji: '🌿' },
      { value: 'pescatarian',     label: 'Pescatarian',       emoji: '🐟' },
      { value: 'keto',            label: 'Keto',              emoji: '🥑' },
      { value: 'low_carb',        label: 'Low Carb',          emoji: '🥩' },
      { value: 'high_protein',    label: 'High Protein',      emoji: '💊' },
    ]
  },
  {
    title: "Any allergies?",
    subtitle: "Select all that apply",
    field: 'allergies',
    multi: true,
    options: [
      { value: 'dairy',     label: 'Dairy',     emoji: '🥛' },
      { value: 'gluten',    label: 'Gluten',    emoji: '🌾' },
      { value: 'nuts',      label: 'Nuts',      emoji: '🥜' },
      { value: 'soy',       label: 'Soy',       emoji: '🫘' },
      { value: 'shellfish', label: 'Shellfish', emoji: '🦐' },
      { value: 'eggs',      label: 'Eggs',      emoji: '🥚' },
    ]
  },
  {
    title: "Biggest challenge?",
    subtitle: "We'll help you overcome it",
    field: 'biggest_challenge',
    multi: false,
    options: [
      { value: 'time',           label: 'Not enough time',     emoji: '⏳' },
      { value: 'budget',         label: 'Tight budget',        emoji: '💸' },
      { value: 'cravings',       label: 'Food cravings',       emoji: '🍫' },
      { value: 'cooking_skills', label: 'Cooking confidence',  emoji: '👨‍🍳' },
      { value: 'consistency',    label: 'Staying consistent',  emoji: '📅' },
    ]
  }
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});

  const current = STEPS[step];
  const isMulti = current.multi;
  const selected = answers[current.field] || (isMulti ? [] : null);

  const toggle = (value) => {
    if (!isMulti) {
      const next = { ...answers, [current.field]: value };
      setAnswers(next);
      setTimeout(() => {
        if (step < STEPS.length - 1) setStep(s => s + 1);
        else onComplete({ ...next, onboarding_complete: true });
      }, 200);
      return;
    }
    const arr = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    setAnswers({ ...answers, [current.field]: arr });
  };

  const handleNext = () => {
    const next = { ...answers };
    if (isMulti && !Array.isArray(next[current.field])) next[current.field] = [];
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onComplete({ ...next, onboarding_complete: true });
    setAnswers(next);
  };

  const isSelected = (value) =>
    isMulti ? (Array.isArray(selected) && selected.includes(value)) : selected === value;

  return (
    <div className="px-5 pt-4 min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #12062A 0%, #2A0A4A 100%)' }}>
      {/* Logo */}
      <div className="mb-7">
        <h1 className="text-3xl font-black gradient-text">Shedit</h1>
        <p className="text-xs text-purple-400/60 mt-0.5">Walk it off. Climb it up. Shed it.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
              initial={{ width: 0 }}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      {step > 0 && (
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setStep(s => s - 1)}
          className="flex items-center gap-1 text-sm text-purple-400/70 mb-5 w-fit">
          <ChevronLeft className="w-4 h-4" /> Back
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }} className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">{current.title}</h2>
            <p className="text-sm text-purple-300/60 mt-1">{current.subtitle}</p>
          </div>

          <div className="space-y-2.5">
            {current.options.map((opt) => {
              const sel = isSelected(opt.value);
              return (
                <motion.button key={opt.value} whileTap={{ scale: 0.97 }} onClick={() => toggle(opt.value)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                  style={{
                    background: sel ? 'rgba(124, 58, 237, 0.18)' : 'rgba(255,255,255,0.03)',
                    border: sel ? '1px solid rgba(168, 85, 247, 0.45)' : '1px solid rgba(255,255,255,0.07)',
                  }}>
                  <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                  <span className="text-sm font-semibold text-white flex-1">{opt.label}</span>
                  {isMulti
                    ? <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: sel ? '#a855f7' : 'rgba(255,255,255,0.08)', border: sel ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                        {sel && <Check className="w-3 h-3 text-white" />}
                      </div>
                    : <ArrowRight className={`w-4 h-4 transition-colors flex-shrink-0 ${sel ? 'text-purple-400' : 'text-gray-700'}`} />
                  }
                </motion.button>
              );
            })}
          </div>

          {isMulti && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleNext}
              className="btn-primary mt-6">
              {step < STEPS.length - 1 ? 'Continue' : 'Build My Plan'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-[10px] text-purple-400/30 py-5">Step {step + 1} of {STEPS.length}</p>
    </div>
  );
}