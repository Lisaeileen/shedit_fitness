import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const mealConfig = {
  breakfast: { emoji: '🌅', color: '#f59e0b', time: '7–10 AM' },
  lunch:     { emoji: '☀️', color: '#a855f7', time: '12–2 PM' },
  dinner:    { emoji: '🌙', color: '#6366f1', time: '6–9 PM' },
  snack:     { emoji: '🍎', color: '#ec4899', time: 'Anytime' },
};

export default function MealCard({ type, entries = [], totalCalories = 0, onAddFood, onDeleteEntry }) {
  const [expanded, setExpanded] = React.useState(entries.length > 0);
  const config = mealConfig[type] || mealConfig.snack;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const hasItems = entries.length > 0;

  // Aggregate macros
  const totalProtein = entries.reduce((s, e) => s + (e.protein || 0), 0);
  const totalCarbs   = entries.reduce((s, e) => s + (e.carbs   || 0), 0);
  const totalFat     = entries.reduce((s, e) => s + (e.fat     || 0), 0);

  React.useEffect(() => { if (hasItems) setExpanded(true); }, [entries.length]);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${config.color}18` }}>
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{displayType}</h4>
            {hasItems && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: `${config.color}20`, color: config.color }}>
                {entries.length}
              </span>
            )}
          </div>
          {hasItems ? (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-bold" style={{ color: config.color }}>{totalCalories} kcal</span>
              <span className="text-[10px] text-gray-600">·</span>
              <span className="text-[10px] text-gray-500">P:{Math.round(totalProtein)}g C:{Math.round(totalCarbs)}g F:{Math.round(totalFat)}g</span>
            </div>
          ) : (
            <p className="text-[11px] text-gray-600 mt-0.5">{config.time}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => onAddFood?.('scan')}
            className="p-2 rounded-xl bg-white/[0.04]">
            <Camera className="w-3.5 h-3.5 text-gray-500" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => onAddFood?.('manual')}
            className="p-2 rounded-xl" style={{ background: `${config.color}20` }}>
            <Plus className="w-3.5 h-3.5" style={{ color: config.color }} />
          </motion.button>
          {hasItems && (
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-xl bg-white/[0.04]">
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Entries */}
      <AnimatePresence>
        {expanded && hasItems && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="border-t divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)', /* divider */ }}>
              {entries.map((entry, i) => (
                <div key={entry.id || i} className="flex items-start justify-between px-4 py-3"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm text-white font-semibold truncate">{entry.food_name}</p>
                    {entry.serving_size && (
                      <p className="text-[11px] text-gray-600 mt-0.5">{entry.serving_size}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {[
                        { label: 'P', val: entry.protein, color: '#ec4899' },
                        { label: 'C', val: entry.carbs,   color: '#3b82f6' },
                        { label: 'F', val: entry.fat,     color: '#f59e0b' },
                      ].map(m => (
                        <span key={m.label} className="text-[10px] font-semibold"
                          style={{ color: m.color }}>{m.label}: {Math.round(m.val || 0)}g</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{entry.calories}</p>
                      <p className="text-[10px] text-gray-600">kcal</p>
                    </div>
                    {onDeleteEntry && (
                      <button onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 rounded-xl ml-1" style={{ background: 'rgba(244,63,94,0.1)' }}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
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