import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera, ScanLine } from 'lucide-react';

const mealIcons = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎'
};

export default function MealCard({ type, entries = [], onAddFood, totalCalories = 0 }) {
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const icon = mealIcons[type] || '🍽️';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <div>
            <h4 className="text-sm font-semibold text-white">{displayType}</h4>
            <p className="text-[11px] text-gray-500">{totalCalories} kcal</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onAddFood?.('scan')}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button 
            onClick={() => onAddFood?.('barcode')}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button 
            onClick={() => onAddFood?.('manual')}
            className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>
      
      {entries.length > 0 && (
        <div className="space-y-2 mt-2">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-t border-white/[0.04]">
              <span className="text-xs text-gray-300">{entry.food_name}</span>
              <span className="text-xs text-gray-500">{entry.calories} kcal</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}