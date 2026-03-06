import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, ScanLine, Mic, Camera, Droplets, Weight, Dumbbell, Loader2, Sparkles } from 'lucide-react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import AddFoodDialog from './AddFoodDialog';
import LogValueDialog from './LogValueDialog';

export default function QuickAddModal({ isOpen, onClose }) {
  const [activeAction, setActiveAction] = useState(null);
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: logs = [] } = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 30),
    enabled: isOpen,
  });

  const todayLog = logs.find(l => l.date === today) || {};

  const upsertLog = useMutation({
    mutationFn: async (data) => {
      if (todayLog.id) {
        return base44.entities.DailyLog.update(todayLog.id, data);
      }
      return base44.entities.DailyLog.create({ date: today, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
  });

  const addMeal = useMutation({
    mutationFn: (data) => base44.entities.MealEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
    },
  });

  const handleAction = (id) => {
    if (id === 'food' || id === 'barcode' || id === 'scan' || id === 'voice') {
      setFoodDialogOpen(true);
    } else if (id === 'water') {
      setWaterDialogOpen(true);
    } else if (id === 'weight') {
      setWeightDialogOpen(true);
    } else if (id === 'exercise') {
      setExerciseDialogOpen(true);
    }
    onClose();
  };

  const quickActions = [
    { id: 'food',     label: 'Log Food',    icon: UtensilsCrossed, color: '#4ade80' },
    { id: 'scan',     label: 'AI Scan',     icon: Camera,          color: '#a855f7' },
    { id: 'barcode',  label: 'Barcode',     icon: ScanLine,        color: '#22d3ee' },
    { id: 'voice',    label: 'Voice Log',   icon: Mic,             color: '#f59e0b' },
    { id: 'water',    label: 'Water',       icon: Droplets,        color: '#3b82f6' },
    { id: 'weight',   label: 'Weight',      icon: Weight,          color: '#10b981' },
    { id: 'exercise', label: 'Exercise',    icon: Dumbbell,        color: '#f43f5e' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[60] max-w-md mx-auto"
            >
              <div className="bg-[#111C16] rounded-t-3xl p-6 pb-10 border-t border-white/[0.07]">
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Quick Log</h3>
                  <button onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handleAction(action.id)}
                      className="flex flex-col items-center gap-2 p-2"
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `${action.color}18`, border: `1px solid ${action.color}25` }}>
                        <action.icon className="w-6 h-6" style={{ color: action.color }} />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sub-dialogs (rendered outside modal so they persist after modal closes) */}
      <AddFoodDialog
        isOpen={foodDialogOpen}
        onClose={() => setFoodDialogOpen(false)}
        onSave={async (data) => {
          await addMeal.mutateAsync({ ...data, date: today, meal_type: data.meal_type || 'snack' });
          const newCals = (todayLog.calories_consumed || 0) + data.calories;
          upsertLog.mutate({
            calories_consumed: newCals,
            carbs:   (todayLog.carbs   || 0) + (data.carbs   || 0),
            protein: (todayLog.protein || 0) + (data.protein || 0),
            fat:     (todayLog.fat     || 0) + (data.fat     || 0),
          });
        }}
        mealType="snack"
        date={today}
      />
      <LogValueDialog
        isOpen={waterDialogOpen}
        onClose={() => setWaterDialogOpen(false)}
        title="Log Water"
        unit="glasses"
        value={todayLog.water_glasses || 0}
        step={1} min={0} max={20}
        color="#22d3ee"
        onSave={(v) => upsertLog.mutate({ water_glasses: v })}
      />
      <LogValueDialog
        isOpen={weightDialogOpen}
        onClose={() => setWeightDialogOpen(false)}
        title="Log Weight"
        unit="kg"
        value={todayLog.weight || 70}
        step={0.1} min={30} max={300}
        color="#10b981"
        onSave={(v) => upsertLog.mutate({ weight: v })}
      />
      <LogValueDialog
        isOpen={exerciseDialogOpen}
        onClose={() => setExerciseDialogOpen(false)}
        title="Log Exercise"
        unit="min"
        value={todayLog.exercise_minutes || 0}
        step={5} min={0} max={300}
        color="#f43f5e"
        onSave={(v) => upsertLog.mutate({ exercise_minutes: v })}
      />
    </>
  );
}