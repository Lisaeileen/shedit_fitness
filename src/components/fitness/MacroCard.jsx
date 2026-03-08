import React from 'react';
import { motion } from 'framer-motion';

export default function MacroCard({ label, value = 0, goal = 100, color = '#a855f7', unit = 'g' }) {
  const pct = Math.min((value / Math.max(goal, 1)) * 100, 100);

  return (
    <div className="flex-1 rounded-2xl p-3.5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>{label}</p>
      <p className="text-xl font-black text-white leading-none">
        {Math.round(value)}
        <span className="text-xs text-gray-500 font-normal ml-0.5">{unit}</span>
      </p>
      <p className="text-[10px] text-gray-600 mt-0.5">of {goal}{unit}</p>
      <div className="h-1 rounded-full mt-2 overflow-hidden bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  );
}