import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, ScanLine, Mic, Camera, Droplets, Weight, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { DailyLogs, Meals } from '../storage';
import AddFoodDialog from './AddFoodDialog';
import LogValueDialog from './LogValueDialog';

export default function QuickAddModal({ isOpen, onClose }) {
  const [foodDialogOpen,    setFoodDialogOpen]    = useState(false);
  const [foodDialogMode,    setFoodDialogMode]    = useState('manual');
  const [waterDialogOpen,   setWaterDialogOpen]   = useState(false);
  const [weightDialogOpen,  setWeightDialogOpen]  = useState(false);
  const [exerciseDialogOpen,setExerciseDialogOpen]= useState(false);
  const [tick, setTick] = useState(0);

  const today    = format(new Date(), 'yyyy-MM-dd');
  const todayLog = useMemo(() => DailyLogs.getByDate(today) || {}, [today, tick]);

  const upsertLog = (fields) => {
    DailyLogs.upsert(today, fields);
    setTick(t => t + 1);
  };

  const handleAction = (id) => {
    onClose();
    if (id === 'food')     { setFoodDialogMode('manual'); setTimeout(() => setFoodDialogOpen(true), 300); }
    if (id === 'scan')     { setFoodDialogMode('scan');   setTimeout(() => setFoodDialogOpen(true), 300); }
    if (id === 'voice')    { setFoodDialogMode('voice');  setTimeout(() => setFoodDialogOpen(true), 300); }
    if (id === 'barcode')  { setFoodDialogMode('manual'); setTimeout(() => setFoodDialogOpen(true), 300); }
    if (id === 'water')    { setTimeout(() => setWaterDialogOpen(true), 300); }
    if (id === 'weight')   { setTimeout(() => setWeightDialogOpen(true), 300); }
    if (id === 'exercise') { setTimeout(() => setExerciseDialogOpen(true), 300); }
  };

  const quickActions = [
    { id: 'food',     label: 'Log Food',  icon: UtensilsCrossed, color: '#a855f7' },
    { id: 'scan',     label: 'AI Scan',   icon: Camera,          color: '#7c3aed' },
    { id: 'voice',    label: 'Voice Log', icon: Mic,             color: '#c084fc' },
    { id: 'barcode',  label: 'Barcode',   icon: ScanLine,        color: '#6366f1' },
    { id: 'water',    label: 'Water',     icon: Droplets,        color: '#22d3ee' },
    { id: 'weight',   label: 'Weight',    icon: Weight,          color: '#10b981' },
    { id: 'exercise', label: 'Exercise',  icon: Dumbbell,        color: '#f43f5e' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60]" />
            <motion.div
              initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[60] max-w-md mx-auto">
              <div className="rounded-t-3xl p-6 pb-10 border-t"
                style={{ background: '#1A0835', borderColor: 'rgba(168,85,247,0.2)' }}>
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-white">Quick Log</h3>
                  <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.button key={action.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.88 }}
                      onClick={() => handleAction(action.id)}
                      className="flex flex-col items-center gap-2 p-2">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `${action.color}18`, border: `1px solid ${action.color}28` }}>
                        <action.icon className="w-6 h-6" style={{ color: action.color }} />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddFoodDialog
        isOpen={foodDialogOpen}
        onClose={() => setFoodDialogOpen(false)}
        onSave={(data) => {
          Meals.add({ ...data, date: today, meal_type: data.meal_type || 'snack' });
          upsertLog({
            calories_consumed: (todayLog.calories_consumed || 0) + (data.calories || 0),
            carbs:   (todayLog.carbs   || 0) + (data.carbs   || 0),
            protein: (todayLog.protein || 0) + (data.protein || 0),
            fat:     (todayLog.fat     || 0) + (data.fat     || 0),
          });
        }}
        initialMode={foodDialogMode}
        mealType="snack"
        date={today}
      />
      <LogValueDialog isOpen={waterDialogOpen}    onClose={() => setWaterDialogOpen(false)}    title="Log Water"    unit="glasses" value={todayLog.water_glasses    || 0}  step={1}   min={0}  max={20}  color="#22d3ee" onSave={(v) => upsertLog({ water_glasses: v })} />
      <LogValueDialog isOpen={weightDialogOpen}   onClose={() => setWeightDialogOpen(false)}   title="Log Weight"   unit="kg"      value={todayLog.weight           || 70} step={0.1} min={30} max={300} color="#a855f7" onSave={(v) => upsertLog({ weight: v })} />
      <LogValueDialog isOpen={exerciseDialogOpen} onClose={() => setExerciseDialogOpen(false)} title="Log Exercise" unit="min"     value={todayLog.exercise_minutes || 0}  step={5}   min={0}  max={300} color="#f43f5e" onSave={(v) => upsertLog({ exercise_minutes: v })} />
    </>
  );
}