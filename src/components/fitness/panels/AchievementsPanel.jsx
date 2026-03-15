import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Flame, Crown, Zap, Scale, Trophy, Medal, Rocket, Footprints, Activity, Target, Droplets, Dumbbell, Award, Star, Check, Lock } from 'lucide-react';
import { DailyLogs, Meals } from '../../storage';

const ACHIEVEMENTS = [
  { id: 'first_meal',      Icon: Utensils,  title: 'First Bite',       desc: 'Logged your first meal',              check: (logs, meals) => meals.length >= 1 },
  { id: 'log_3_days',      Icon: Flame,     title: '3-Day Habit',      desc: 'Logged food 3 days in a row',          check: (logs) => calcStreak(logs) >= 3 },
  { id: 'log_7_days',      Icon: Star,      title: '7-Day Streak',     desc: 'Logged food 7 days in a row',          check: (logs) => calcStreak(logs) >= 7 },
  { id: 'log_30_days',     Icon: Crown,     title: '30-Day Legend',    desc: 'Logged food 30 days in a row',         check: (logs) => calcStreak(logs) >= 30 },
  { id: 'weight_first',    Icon: Scale,     title: 'Weigh-In',         desc: 'Logged your weight for the first time', check: (logs) => logs.filter(l => l.weight).length >= 1 },
  { id: 'lost_1kg',        Icon: Trophy,    title: 'First Kilo Lost',  desc: 'Lost your first kilogram',             check: (logs) => calcWeightLost(logs) >= 1 },
  { id: 'lost_5kg',        Icon: Medal,     title: '5kg Champion',     desc: 'Lost 5 kilograms',                     check: (logs) => calcWeightLost(logs) >= 5 },
  { id: 'lost_10kg',       Icon: Rocket,    title: '10kg Milestone',   desc: 'Lost 10 kilograms',                    check: (logs) => calcWeightLost(logs) >= 10 },
  { id: 'steps_10k',       Icon: Footprints,title: '10K Steps',        desc: 'Hit 10,000 steps in a single day',     check: (logs) => logs.some(l => (l.steps || 0) >= 10000) },
  { id: 'steps_50k_total', Icon: Activity,  title: 'Road Warrior',     desc: 'Walked 50,000 total steps',            check: (logs) => logs.reduce((s, l) => s + (l.steps || 0), 0) >= 50000 },
  { id: 'steps_7_days',    Icon: Footprints,title: 'Step Master',      desc: 'Hit step goal 7 different days',       check: (logs) => logs.filter(l => (l.steps || 0) >= (l.steps_goal || 10000)).length >= 7 },
  { id: 'protein_goal',    Icon: Dumbbell,  title: 'Protein Pro',      desc: 'Hit protein goal on any day',          check: (logs) => logs.some(l => (l.protein || 0) >= (l.protein_goal || 120)) },
  { id: 'calorie_goal_3',  Icon: Target,    title: 'On Target',        desc: 'Hit calorie goal 3 days in a row',     check: (logs) => checkCalGoalStreak(logs, 3) },
  { id: 'water_8',         Icon: Droplets,  title: 'Hydration Hero',   desc: 'Drank 8 glasses of water in a day',    check: (logs) => logs.some(l => (l.water_glasses || 0) >= 8) },
  { id: 'exercise_first',  Icon: Zap,       title: 'First Workout',    desc: 'Logged your first exercise session',   check: (logs) => logs.some(l => (l.exercise_minutes || 0) > 0) },
  { id: 'exercise_30',     Icon: Activity,  title: 'Active Day',       desc: 'Exercised 30+ minutes in a day',       check: (logs) => logs.some(l => (l.exercise_minutes || 0) >= 30) },
  { id: 'exercise_7_days', Icon: Award,     title: 'Workout Warrior',  desc: 'Exercised 7 different days',           check: (logs) => logs.filter(l => (l.exercise_minutes || 0) > 0).length >= 7 },
];

function calcStreak(logs) {
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let s = 0;
  for (const l of sorted) { if ((l.calories_consumed || 0) > 0) s++; else break; }
  return s;
}

function calcWeightLost(logs) {
  const wl = logs.filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  if (wl.length < 2) return 0;
  return Math.max(wl[0].weight - wl.at(-1).weight, 0);
}

function checkCalGoalStreak(logs, n) {
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let s = 0;
  for (const l of sorted) {
    const cals = l.calories_consumed || 0;
    const goal = l.calories_goal || 2000;
    if (cals > 0 && cals <= goal) { s++; if (s >= n) return true; }
    else s = 0;
  }
  return false;
}

export default function AchievementsPanel() {
  const logs  = useMemo(() => DailyLogs.list(), []);
  const meals = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('shedit_meals') || '[]'); } catch { return []; }
  }, []);

  const unlocked = useMemo(() =>
    ACHIEVEMENTS.filter(a => { try { return a.check(logs, meals); } catch { return false; } }),
    [logs, meals]
  );
  const locked = ACHIEVEMENTS.filter(a => !unlocked.includes(a));

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-3 rounded-2xl p-4 mb-5"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.08))', border: '1px solid rgba(168,85,247,0.25)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.2)' }}>
          <Trophy className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-lg font-black text-white">{unlocked.length} / {ACHIEVEMENTS.length}</p>
          <p className="text-xs text-gray-400">Achievements unlocked</p>
          <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', width: 120 }}>
            <motion.div className="h-full rounded-full" style={{ background: '#a855f7' }}
              initial={{ width: 0 }} animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] text-purple-300/50 uppercase tracking-widest font-bold mb-2">Unlocked</p>
          <div className="grid grid-cols-1 gap-2">
            {unlocked.map((a, i) => {
              const AIcon = a.Icon;
              return (
              <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-2xl p-3.5"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.06))', border: '1px solid rgba(168,85,247,0.3)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(168,85,247,0.2)' }}>
                  <AIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </div>
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-2">Locked</p>
          <div className="grid grid-cols-1 gap-2">
            {locked.map((a) => {
              const AIcon = a.Icon;
              return (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl p-3.5 opacity-35"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-400">{a.title}</p>
                  <p className="text-xs text-gray-600">{a.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}