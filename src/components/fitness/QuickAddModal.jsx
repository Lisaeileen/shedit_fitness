import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Droplets, Footprints, Dumbbell, Moon, Scale } from 'lucide-react';
import { DailyLogs } from '@/components/storage';
import AddFoodDialog from './AddFoodDialog';

const ACTIONS = [
  { id: 'food',     label: 'Log Food',    icon: Utensils,  color: '#a855f7' },
  { id: 'water',    label: 'Water',        icon: Droplets,  color: '#22d3ee' },
  { id: 'steps',    label: 'Steps',        icon: Footprints,color: '#10b981' },
  { id: 'exercise', label: 'Exercise',     icon: Dumbbell,  color: '#f59e0b' },
  { id: 'weight',   label: 'Weight',       icon: Scale,     color: '#ec4899' },
  { id: 'sleep',    label: 'Sleep',        icon: Moon,      color: '#6366f1' },
];

export default function QuickAddModal({ isOpen, onClose }) {
  const [showFood, setShowFood] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAction = (id) => {
    if (id === 'food') {
      setShowFood(true);
      return;
    }

    const log = DailyLogs.get(todayStr) || {};

    if (id === 'water') {
      DailyLogs.upsert(todayStr, { water_glasses: (log.water_glasses || 0) + 1 });
    } else if (id === 'steps') {
      const steps = parseInt(prompt('Steps to add:') || '0', 10);
      if (steps > 0) DailyLogs.upsert(todayStr, { steps: (log.steps || 0) + steps });
    } else if (id === 'exercise') {
      const mins = parseInt(prompt('Exercise minutes:') || '0', 10);
      if (mins > 0) DailyLogs.upsert(todayStr, { exercise_minutes: (log.exercise_minutes || 0) + mins });
    } else if (id === 'weight') {
      const kg = parseFloat(prompt('Current weight (kg):') || '0');
      if (kg > 0) DailyLogs.upsert(todayStr, { weight: kg });
    } else if (id === 'sleep') {
      const hrs = parseFloat(prompt('Hours slept:') || '0');
      if (hrs > 0) DailyLogs.upsert(todayStr, { sleep_hours: hrs });
    }

    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showFood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md rounded-t-3xl p-6 pb-10"
              style={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.2)', borderBottom: 'none' }}
              onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-white">Quick Add</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ACTIONS.map(action => (
                  <motion.button key={action.id} whileTap={{ scale: 0.93 }}
                    onClick={() => handleAction(action.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                    style={{ background: `${action.color}12`, border: `1px solid ${action.color}25` }}>
                    <action.icon className="w-6 h-6" style={{ color: action.color }} />
                    <span className="text-xs font-semibold text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFood && (
        <AddFoodDialog
          isOpen={showFood}
          onClose={() => { setShowFood(false); onClose(); }}
          defaultMealType="snack"
          date={todayStr}
        />
      )}
    </>
  );
}