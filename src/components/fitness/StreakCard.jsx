import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Award } from 'lucide-react';
import { Streak, Badges, DailyLogs } from '../storage';
import { format } from 'date-fns';

const MILESTONES = [
  { days: 3,  label: '3-Day Spark',    emoji: '✨', color: '#f59e0b' },
  { days: 7,  label: '7-Day Warrior',  emoji: '⚡', color: '#f59e0b' },
  { days: 14, label: '2-Week Champ',   emoji: '🏅', color: '#c0c0c0' },
  { days: 30, label: '30-Day Legend',  emoji: '🏆', color: '#ffd700' },
  { days: 90, label: '90-Day Elite',   emoji: '💎', color: '#a855f7' },
];

function getMilestone(count) {
  return [...MILESTONES].reverse().find(m => count >= m.days) || null;
}
function getNextMilestone(count) {
  return MILESTONES.find(m => m.days > count) || null;
}

export default function StreakCard() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const streak   = useMemo(() => {
    // Auto-update streak if user has logged today
    const todayLog = DailyLogs.getByDate(todayStr);
    if (todayLog && (todayLog.calories_consumed > 0 || todayLog.steps > 0)) {
      return Streak.update(todayStr);
    }
    return Streak.get();
  }, [todayStr]);

  const [showBadge, setShowBadge] = useState(false);
  const [freezeMsg, setFreezeMsg] = useState('');

  const count     = streak.count || 0;
  const milestone = getMilestone(count);
  const next      = getNextMilestone(count);
  const progress  = next ? (count / next.days) * 100 : 100;

  const flameSize = Math.min(32 + count * 1.2, 52);

  const handleFreeze = () => {
    const result = Streak.useFreeze(todayStr);
    setFreezeMsg(result ? '❄️ Streak freeze used! You\'re protected for today.' : '❄️ You\'ve already used your freeze this month.');
    setTimeout(() => setFreezeMsg(''), 3000);
  };

  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Daily Streak</p>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleFreeze}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
          <Shield className="w-3 h-3" /> Freeze
        </motion.button>
      </div>

      <div className="flex items-center gap-4">
        {/* Flame meter */}
        <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 72, height: 72 }}>
          <svg width={72} height={72} className="-rotate-90">
            <circle cx={36} cy={36} r={28} fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth={6} />
            <motion.circle cx={36} cy={36} r={28} fill="none"
              stroke={milestone?.color || '#f59e0b'}
              strokeWidth={6} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
              transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${milestone?.color || '#f59e0b'}80)` }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: count > 0 ? [1, 1.1, 1] : 1 }} transition={{ duration: 2, repeat: Infinity }}>
              <Flame className="text-orange-400" style={{ width: flameSize * 0.55, height: flameSize * 0.55 }} />
            </motion.div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-end gap-1 mb-0.5">
            <span className="text-3xl font-black text-white">{count}</span>
            <span className="text-sm text-gray-500 mb-1">day{count !== 1 ? 's' : ''}</span>
          </div>
          {milestone ? (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base">{milestone.emoji}</span>
              <span className="text-xs font-bold" style={{ color: milestone.color }}>{milestone.label}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-600 mb-1">Start your streak today!</p>
          )}
          {next && (
            <div>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-gray-600">Next: {next.emoji} {next.label}</span>
                <span className="text-[10px] text-orange-400">{count}/{next.days}</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2 }}
                  style={{ background: `linear-gradient(90deg, #f59e0b, ${milestone?.color || '#f43f5e'})`, boxShadow: '0 0 6px rgba(245,158,11,0.4)' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {freezeMsg && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-indigo-400 mt-3 text-center">{freezeMsg}</motion.p>
        )}
      </AnimatePresence>

      {/* Milestone badges row */}
      <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar">
        {MILESTONES.map(m => {
          const unlocked = count >= m.days;
          return (
            <div key={m.days} className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all"
                style={{
                  background: unlocked ? `${m.color}20` : 'rgba(255,255,255,0.03)',
                  border: unlocked ? `1px solid ${m.color}40` : '1px solid rgba(255,255,255,0.06)',
                  filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)',
                }}>
                {m.emoji}
              </div>
              <span className="text-[8px] text-gray-600">{m.days}d</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}