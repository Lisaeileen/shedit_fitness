import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DailyLogs } from '../storage';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'shedit_coach_msg';

function getStreakCount(logs) {
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let s = 0;
  for (const l of sorted) { if ((l.calories_consumed || 0) > 0) s++; else break; }
  return s;
}

const FALLBACK_MESSAGES = [
  "Every step forward counts. Focus on today's movement, hydration, and one nourishing meal.",
  "Consistency beats perfection. Log your meals, hit your water goal, and keep building your streak.",
  "Small habits create big results. Stay on track with your calories and movement today.",
  "You're doing great — keep logging, keep moving, and trust the process.",
  "Today is a new opportunity. Fuel well, move often, and rest when needed.",
];

export default function DailyCoachMessage({ dayLog, steps, stepsGoal }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const cached = (() => { try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return d.date === todayStr ? d.msg : null; } catch { return null; } })();
    if (cached) { setMessage(cached); return; }

    const logs = DailyLogs.list();
    const streak = getStreakCount(logs);
    const water = dayLog?.water_glasses || 0;
    const waterGoal = dayLog?.water_goal || 8;
    const cals = dayLog?.calories_consumed || 0;
    const calsGoal = dayLog?.calories_goal || 2000;

    setLoading(true);
    base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly, encouraging fitness coach. Write a single short motivational message (max 2 sentences, ~25 words) for a fitness app user.
Context: streak=${streak} days, steps=${steps}/${stepsGoal}, water=${water}/${waterGoal} glasses, calories=${cals}/${calsGoal}.
Tone: warm, positive, personal. Focus on today's small wins. Do NOT use the user's name. Do NOT use exclamation marks excessively.`,
    }).then(msg => {
      const m = typeof msg === 'string' ? msg.trim() : FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      setMessage(m);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayStr, msg: m }));
    }).catch(() => {
      const m = FALLBACK_MESSAGES[new Date().getDay() % FALLBACK_MESSAGES.length];
      setMessage(m);
    }).finally(() => setLoading(false));
  }, []);

  if (!message && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 mb-4 flex gap-3 items-start"
      style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)' }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(168,85,247,0.18)' }}>
        <Sparkles className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-purple-400/70 font-bold uppercase tracking-wider mb-1">Daily Coach</p>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-2.5 rounded-full bg-white/[0.06] w-full animate-pulse" />
            <div className="h-2.5 rounded-full bg-white/[0.06] w-3/4 animate-pulse" />
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
        )}
      </div>
    </motion.div>
  );
}