import React from 'react';
import { motion } from 'framer-motion';

export default function MacroCard({ label, value = 0, goal = 1, color, unit = 'g' }) {
  const pct = Math.min((value / Math.max(goal, 1)) * 100, 100);

  return (
    <div className="flex-1 glass-card rounded-2xl p-3.5 min-w-0">
      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-0.5">
        <span className="text-[22px] font-bold text-white leading-none">{Math.round(value)}</span>
        <span className="text-[11px] text-gray-500 leading-none">{unit}</span>
      </div>
      <p className="text-[10px] text-gray-600 mt-0.5">/ {goal}{unit}</p>
      <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: `${color}18` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}50`
          }}
        />
      </div>
    </div>
  );
}