import React from 'react';
import { motion } from 'framer-motion';
import ActivityRing from './ActivityRing';
import { Droplets, Dumbbell, Footprints } from 'lucide-react';

const HABITS = {
  water:    { icon: Droplets,   color: '#22d3ee', label: 'Water',    unit: 'gl' },
  exercise: { icon: Dumbbell,   color: '#f43f5e', label: 'Exercise', unit: 'min' },
  steps:    { icon: Footprints, color: '#a855f7', label: 'Steps',    unit: '' },
};

export default function HabitCard({ type, value = 0, goal = 100, onTap }) {
  const cfg = HABITS[type] || HABITS.steps;
  const Icon = cfg.icon;

  const display = type === 'steps' && value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : value;

  return (
    <motion.button whileTap={{ scale: 0.93 }} onClick={onTap}
      className="flex-1 rounded-2xl p-3.5 flex flex-col items-center gap-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <ActivityRing value={value} max={goal} size={64} strokeWidth={5.5} color={cfg.color}>
        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
      </ActivityRing>
      <div className="text-center">
        <p className="text-sm font-black text-white">{display}<span className="text-[10px] text-gray-500 font-normal ml-0.5">{cfg.unit}</span></p>
        <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-0.5">{cfg.label}</p>
      </div>
    </motion.button>
  );
}