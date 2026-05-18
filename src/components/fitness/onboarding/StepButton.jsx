import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Generic selectable option button
export function OptionButton({ label, sublabel, selected, onClick, emoji, autoAdvance }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
      style={{
        background: selected ? 'rgba(79,158,247,0.12)' : 'rgba(255,255,255,0.04)',
        border: selected ? '1px solid rgba(79,158,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{
          background: selected ? '#4f9ef7' : 'transparent',
          border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
        }}>
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </motion.button>
  );
}

// Primary CTA button
export function PrimaryButton({ children, onClick, disabled }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl font-bold text-base transition-all"
      style={{
        background: disabled ? 'rgba(79,158,247,0.2)' : '#4f9ef7',
        color: 'white',
        boxShadow: disabled ? 'none' : '0 6px 24px rgba(79,158,247,0.35)',
      }}
    >
      {children}
    </motion.button>
  );
}