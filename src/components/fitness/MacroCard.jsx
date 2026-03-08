import React from 'react';
import { motion } from 'framer-motion';

export default function MacroCard({ label, value = 0, goal = 100, color = '#a855f7', unit = 'g' }) {
  const pct = Math.min((value / Math.max(goal, 1)) * 100, 100);

  return (
    <div className="flex-1 rounded-2xl p-3.5"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20` }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
      <p className="text-2xl font-black text-white leading-none">
        {Math.round(value)}
        <span className="text-xs text-gray-500 font-normal ml-0.5">{unit}</span>
      </p>
      <p className="text-[10px] text-gray-600 mt-0.5 mb-2">of {goal}{unit}</p>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${color}12` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
    </div>
  );
}