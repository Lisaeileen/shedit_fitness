import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';

const steps = [
  {
    title: "What's your #1 goal?",
    subtitle: "We'll personalize your plan around this",
    field: 'primary_goal',
    options: [
      { value: 'lose_weight',  label: 'Lose weight',         emoji: '🔥' },
      { value: 'hit_macros',   label: 'Hit my macros',       emoji: '📊' },
      { value: 'eat_healthy',  label: 'Eat healthy',         emoji: '🥗' },
      { value: 'gain_weight',  label: 'Gain weight',         emoji: '💪' },
      { value: 'save_time',    label: 'Save time',           emoji: '⏰' },
      { value: 'meal_prep',    label: 'Meal prep weekly',    emoji: '🍱' },
      { value: 'spend_less',   label: 'Spend less money',    emoji: '💰' },
      { value: 'eat_out_less', label: 'Eat out less',        emoji: '🏠' },
    ]
  },
  {
    title: "How motivated are you?",
    subtitle: "Be honest — we'll match the intensity",
    field: 'motivation_level',
    options: [
      { value: 'ready_to_tackle', label: 'Ready to tackle anything', emoji: '🚀' },
      { value: 'willing_to_try',  label: 'Willing to give it a go',  emoji: '👍' },
      { value: 'small_changes',   label: 'Small changes are best',   emoji: '🌱' },
      { value: 'not_ready',       label: 'Not quite ready yet',      emoji: '🤔' },
    ]
  },
  {
    title: "Biggest challenge?",
    subtitle: "We'll help you overcome it",
    field: 'biggest_challenge',
    options: [
      { value: 'time',           label: 'Not enough time',      emoji: '⏳' },
      { value: 'budget',         label: 'Tight budget',         emoji: '💸' },
      { value: 'cravings',       label: 'Food cravings',        emoji: '🍫' },
      { value: 'cooking_skills', label: 'Cooking confidence',   emoji: '👨‍🍳' },
      { value: 'consistency',    label: 'Staying consistent',   emoji: '📅' },
    ]
  }
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = steps[step];

  const handleSelect = (value) => {
    const next = { ...answers, [current.field]: value };
    setAnswers(next);

    if (step < steps.length - 1) {
      setTimeout(() => setStep(s => s + 1), 200);
    } else {
      onComplete({ ...next, onboarding_complete: true });
    }
  };

  return (
    <div className="px-5 pt-4 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text">Shedit</h1>
        <p className="text-xs text-gray-500 mt-0.5">Walk it off. Climb it up. Shed it.</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4ade80, #a855f7)' }}
              initial={{ width: 0 }}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      {step > 0 && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setStep(s => s - 1)}
          className="flex items-center gap-1 text-sm text-gray-500 mb-5 w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28 }}
          className="flex-1"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-black text-white">{current.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{current.subtitle}</p>
          </div>

          <div className="space-y-2.5">
            {current.options.map((opt) => {
              const selected = answers[current.field] === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                  style={{
                    background: selected ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: selected ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                  <span className="text-sm font-semibold text-white flex-1">{opt.label}</span>
                  <ArrowRight className={`w-4 h-4 transition-colors ${selected ? 'text-green-400' : 'text-gray-700'}`} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-[10px] text-gray-700 py-6">
        Step {step + 1} of {steps.length}
      </p>
    </div>
  );
}