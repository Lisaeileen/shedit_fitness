import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Activity, TrendingUp, TrendingDown, Minus, Zap, BatteryLow, Moon, Sun, Target, Dumbbell, Wind, ThumbsUp } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'mood',
    question: 'How do you feel today?',
    Icon: Activity,
    options: [
      { value: 'great',   label: 'Great',   Icon: TrendingUp },
      { value: 'good',    label: 'Good',    Icon: ThumbsUp },
      { value: 'okay',    label: 'Okay',    Icon: Minus },
      { value: 'low',     label: 'Low',     Icon: TrendingDown },
    ]
  },
  {
    id: 'energy',
    question: 'Energy level?',
    Icon: Zap,
    options: [
      { value: 'high',   label: 'High',   Icon: Zap },
      { value: 'medium', label: 'Medium', Icon: Minus },
      { value: 'low',    label: 'Low',    Icon: BatteryLow },
    ]
  },
  {
    id: 'sleep',
    question: 'Sleep quality last night?',
    Icon: Moon,
    options: [
      { value: 'great', label: 'Great',   Icon: Sun },
      { value: 'okay',  label: 'Okay',    Icon: Moon },
      { value: 'poor',  label: 'Poor',    Icon: Wind },
    ]
  },
  {
    id: 'motivation',
    question: 'Motivation to reach your goals?',
    Icon: Target,
    options: [
      { value: 'pumped',     label: 'Pumped',     Icon: Dumbbell },
      { value: 'focused',    label: 'Focused',    Icon: Target },
      { value: 'meh',        label: 'Meh',        Icon: Minus },
      { value: 'struggling', label: 'Struggling', Icon: TrendingDown },
    ]
  },
];

const STORAGE_KEY = 'shedit_daily_checkin';

function loadCheckin(dateStr) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
function saveCheckin(dateStr, answers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: dateStr, answers }));
}

export default function DailyCheckIn({ onComplete }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const saved = loadCheckin(today);

  const [open, setOpen]     = useState(!saved || saved.date !== today);
  const [step, setStep]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]     = useState(saved?.date === today);

  if (done || !open) return null;

  const q = QUESTIONS[step];

  const handleSelect = (value) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 280);
    } else {
      saveCheckin(today, next);
      setDone(true);
      setOpen(false);
      onComplete?.(next);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        className="rounded-3xl p-5 mb-4 relative"
        style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.2) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(168,85,247,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <p className="text-[10px] text-purple-300/60 uppercase tracking-widest font-bold">Daily Check-In</p>
          </div>
          <button onClick={() => setOpen(false)}>
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#a855f7' : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}>
            <p className="text-base font-black text-white mb-4">
              {q.question}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map(opt => {
                const OptIcon = opt.Icon;
                return (
                <motion.button key={opt.value} whileTap={{ scale: 0.93 }} onClick={() => handleSelect(opt.value)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <OptIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-white">{opt.label}</span>
                </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-[10px] text-gray-600 mt-3 text-center">{step + 1} of {QUESTIONS.length}</p>
      </motion.div>
    </AnimatePresence>
  );
}

export function getCheckinForToday() {
  const today = format(new Date(), 'yyyy-MM-dd');
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved?.date === today ? saved.answers : null;
  } catch { return null; }
}