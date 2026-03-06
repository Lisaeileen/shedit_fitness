import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Target, Zap, Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: "What is your goal?",
    subtitle: "Choose what matters most to you",
    icon: Target,
    field: 'primary_goal',
    options: [
      { value: 'lose_weight', label: 'Lose weight', emoji: '🔥' },
      { value: 'hit_macros', label: 'Hit my macros', emoji: '📊' },
      { value: 'eat_healthy', label: 'Eat healthy', emoji: '🥗' },
      { value: 'gain_weight', label: 'Gain weight', emoji: '💪' },
      { value: 'save_time', label: 'Save time', emoji: '⏰' },
      { value: 'meal_prep', label: 'Meal prep weekly', emoji: '🍱' },
      { value: 'spend_less', label: 'Spend less money', emoji: '💰' },
      { value: 'eat_out_less', label: 'Eat out less', emoji: '🏠' },
    ]
  },
  {
    title: "How motivated are you?",
    subtitle: "Be honest — there's no wrong answer",
    icon: Zap,
    field: 'motivation_level',
    options: [
      { value: 'ready_to_tackle', label: 'Ready to tackle anything', emoji: '🚀' },
      { value: 'willing_to_try', label: 'Willing to give it a go', emoji: '👍' },
      { value: 'small_changes', label: 'Small changes are best', emoji: '🌱' },
      { value: 'not_ready', label: 'Not ready yet', emoji: '🤔' },
    ]
  },
  {
    title: "Your biggest challenge?",
    subtitle: "What stops you from eating healthy?",
    icon: Shield,
    field: 'biggest_challenge',
    options: [
      { value: 'time', label: 'Not enough time', emoji: '⏳' },
      { value: 'budget', label: 'Tight budget', emoji: '💸' },
      { value: 'cravings', label: 'Cravings', emoji: '🍫' },
      { value: 'cooking_skills', label: 'Cooking skills', emoji: '👨‍🍳' },
      { value: 'consistency', label: 'Staying consistent', emoji: '📅' },
    ]
  }
];

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = steps[currentStep];

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [step.field]: value };
    setAnswers(newAnswers);
    
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(c => c + 1), 300);
    } else {
      onComplete({ ...newAnswers, onboarding_complete: true });
    }
  };

  return (
    <div className="px-4 pt-8 min-h-screen flex flex-col">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: i <= currentStep ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        ))}
      </div>

      {currentStep > 0 && (
        <button onClick={() => setCurrentStep(c => c - 1)} className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <step.icon className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
          </div>

          <div className="space-y-3">
            {step.options.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all
                  ${answers[step.field] === option.value 
                    ? 'bg-purple-500/20 border border-purple-500/40' 
                    : 'glass-card hover:bg-white/[0.06]'
                  }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-sm font-medium text-white">{option.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}