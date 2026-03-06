import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Dumbbell, Footprints } from 'lucide-react';
import ActivityRing from './ActivityRing';

const habitConfig = {
  water:    { icon: Droplets,   color: '#22d3ee', label: 'Water',    unit: 'glasses' },
  exercise: { icon: Dumbbell,   color: '#ec4899', label: 'Exercise', unit: 'min' },
  steps:    { icon: Footprints, color: '#4ade80', label: 'Steps',    unit: 'steps' },
};

export default function HabitCard({ type, value = 0, goal = 100, onTap }) {
  const config = habitConfig[type] || habitConfig.steps;
  const Icon = config.icon;

  const displayValue = type === 'steps'
    ? value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
    : String(value);

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onTap}
      className="flex-1 glass-card rounded-2xl p-3 flex flex-col items-center gap-2.5 min-w-0"
    >
      <ActivityRing
        value={value}
        max={goal}
        size={68}
        strokeWidth={5}
        color={config.color}
      >
        <Icon className="w-4 h-4" style={{ color: config.color }} />
      </ActivityRing>
      <div className="text-center w-full">
        <p className="text-xs font-bold text-white">{displayValue}</p>
        <p className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider">{config.label}</p>
      </div>
    </motion.button>
  );
}