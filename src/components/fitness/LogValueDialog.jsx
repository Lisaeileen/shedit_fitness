import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogValueDialog({ isOpen, onClose, title, unit, value = 0, step = 1, min = 0, max = 999, onSave }) {
  const [val, setVal] = useState(value);

  const increment = () => setVal(v => Math.min(v + step, max));
  const decrement = () => setVal(v => Math.max(v - step, min));

  const handleSave = () => {
    onSave(val);
    onClose();
  };

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
            <div className="bg-[#1a1a1a] rounded-3xl p-6 max-w-sm mx-auto border border-white/[0.06] text-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-full bg-white/[0.06]">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 my-8">
                <button onClick={decrement} className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1]">
                  <Minus className="w-5 h-5 text-gray-300" />
                </button>
                <div>
                  <span className="text-5xl font-bold text-white">{val}</span>
                  <span className="text-lg text-gray-500 ml-2">{unit}</span>
                </div>
                <button onClick={increment} className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1]">
                  <Plus className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <Button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl h-12"
              >
                Save
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}