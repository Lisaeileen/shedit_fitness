import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Dumbbell, Footprints } from 'lucide-react';
import ActivityRing from './ActivityRing';

const habitConfig = {
  water: { icon: Droplets, color: '#3b82f6', label: 'Water', unit: 'glasses' },
  exercise: { icon: Dumbbell, color: '#ec4899', label: 'Exercise', unit: 'min' },
  steps: { icon: Footprints, color: '#a855f7', label: 'Steps', unit: 'steps' },
};

export default function HabitCard({ type, value = 0, goal = 100 }) {
  const config = habitConfig[type];
  const Icon = config.icon;
  const progress = Math.min(value / goal, 1);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 glass-card rounded-2xl p-4 flex flex-col items-center gap-2"
    >
      <ActivityRing
        value={value}
        max={goal}
        size={64}
        strokeWidth={5}
        color={config.color}
      >
        <Icon className="w-4 h-4" style={{ color: config.color }} />
      </ActivityRing>
      <div className="text-center">
        <p className="text-xs font-semibold text-white">{config.label}</p>
        <p className="text-[10px] text-gray-500">{value}/{goal} {config.unit}</p>
      </div>
    </motion.div>
  );
}