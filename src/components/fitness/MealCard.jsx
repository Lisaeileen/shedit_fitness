import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, ScanLine, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const mealConfig = {
  breakfast: { emoji: '🌅', color: '#f59e0b', time: '7–10 AM' },
  lunch:     { emoji: '☀️', color: '#10b981', time: '12–2 PM' },
  dinner:    { emoji: '🌙', color: '#6366f1', time: '6–9 PM' },
  snack:     { emoji: '🍎', color: '#ec4899', time: 'Anytime' },
};

export default function MealCard({ type, entries = [], totalCalories = 0, onAddFood, onDeleteEntry }) {
  const [expanded, setExpanded] = React.useState(false);
  const config = mealConfig[type] || mealConfig.snack;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const hasItems = entries.length > 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${config.color}18` }}>
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{displayType}</h4>
            {hasItems && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${config.color}20`, color: config.color }}>
                {entries.length} item{entries.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {hasItems ? `${totalCalories} kcal` : config.time}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => onAddFood?.('scan')}
            className="p-2 rounded-xl bg-white/[0.04] active:bg-white/[0.08]"
          >
            <Camera className="w-3.5 h-3.5 text-gray-500" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => onAddFood?.('manual')}
            className="p-2 rounded-xl"
            style={{ background: `${config.color}20` }}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: config.color }} />
          </motion.button>
          {hasItems && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-xl bg-white/[0.04]"
            >
              {expanded
                ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              }
            </motion.button>
          )}
        </div>
      </div>

      {/* Expanded entries */}
      <AnimatePresence>
        {expanded && hasItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
              {entries.map((entry, i) => (
                <div key={entry.id || i} className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{entry.food_name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {entry.serving_size && `${entry.serving_size} · `}
                      P: {entry.protein || 0}g · C: {entry.carbs || 0}g · F: {entry.fat || 0}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs font-semibold text-white">{entry.calories} kcal</span>
                    {onDeleteEntry && (
                      <button onClick={() => onDeleteEntry(entry.id)} className="p-1 rounded-lg bg-red-500/10">
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}