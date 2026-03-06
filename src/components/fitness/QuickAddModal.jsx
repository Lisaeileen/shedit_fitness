import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, ScanLine, Mic, Camera, Droplets, Weight, Dumbbell } from 'lucide-react';

const quickActions = [
  { id: 'food', label: 'Log Food', icon: UtensilsCrossed, color: '#a855f7' },
  { id: 'barcode', label: 'Barcode', icon: ScanLine, color: '#ec4899' },
  { id: 'voice', label: 'Voice Log', icon: Mic, color: '#3b82f6' },
  { id: 'scan', label: 'Meal Scan', icon: Camera, color: '#f59e0b' },
  { id: 'water', label: 'Log Water', icon: Droplets, color: '#06b6d4' },
  { id: 'weight', label: 'Log Weight', icon: Weight, color: '#10b981' },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, color: '#f43f5e' },
];

export default function QuickAddModal({ isOpen, onClose, onAction }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
          >
            <div className="bg-[#1a1a1a] rounded-3xl p-6 max-w-lg mx-auto border border-white/[0.06]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Quick Add</h3>
                <button onClick={onClose} className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1]">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { onAction?.(action.id); onClose(); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${action.color}20` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}