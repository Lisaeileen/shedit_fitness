import React from 'react';
import { motion } from 'framer-motion';

export default function MacroCard({ label, value, goal, color, unit = 'g' }) {
  const progress = Math.min((value || 0) / (goal || 1), 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 glass-card rounded-2xl p-4 min-w-0"
    >
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-white mt-1">
        {value || 0}<span className="text-xs text-gray-500 ml-0.5">{unit}</span>
      </p>
      <p className="text-[10px] text-gray-500 mt-0.5">of {goal}{unit}</p>
      <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
    </motion.div>
  );
}