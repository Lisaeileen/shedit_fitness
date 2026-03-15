import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';

export default function LogValueDialog({
  isOpen, onClose, title, unit, value = 0,
  step = 1, min = 0, max = 999, color = '#a855f7', onSave
}) {
  const [val, setVal] = useState(value);

  useEffect(() => { if (isOpen) setVal(value); }, [isOpen, value]);

  const change = (delta) => setVal(v => {
    const next = Math.round((v + delta) * 100) / 100;
    return Math.min(Math.max(next, min), max);
  });

  const handleSave = () => { onSave(val); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-md z-[80]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[80] px-6">
            <div className="w-full max-w-xs rounded-3xl p-6 border shadow-2xl"
              style={{ background: '#1A0835', borderColor: 'rgba(168,85,247,0.2)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white">{title}</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 mb-8">
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => change(-step)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Minus className="w-5 h-5" style={{ color }} />
                </motion.button>
                <div className="text-center flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={step < 1 ? val.toFixed(1) : val}
                    onChange={e => {
                      const v = e.target.value;
                      if (v === '' || /^\d*\.?\d*$/.test(v)) {
                        const n = parseFloat(v);
                        if (!isNaN(n)) setVal(Math.min(Math.max(n, min), max));
                        else if (v === '') setVal(min);
                      }
                    }}
                    className="text-5xl font-black text-white leading-none bg-transparent border-none outline-none text-center w-full"
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: color }}
                  />
                  <div className="text-sm text-gray-400 mt-1">{unit}</div>
                </div>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => change(step)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Plus className="w-5 h-5" style={{ color }} />
                </motion.button>
              </div>

              {unit === 'glasses' && (
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[1, 2, 4, 8].map(n => (
                    <button key={n} onClick={() => setVal(n)}
                      className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={val === n
                        ? { background: `${color}25`, color }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }}>
                      {n}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={handleSave} className="btn-primary"
                style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}>
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}