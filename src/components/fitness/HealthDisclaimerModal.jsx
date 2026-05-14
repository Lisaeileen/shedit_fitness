import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'shedit_disclaimer_accepted';

export default function HealthDisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-6"
          >
            <div className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.25)' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
                  <ShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h2 className="text-lg font-black text-white text-center mb-3">Health Notice</h2>
              <p className="text-sm text-gray-400 leading-relaxed text-center mb-6">
                Shedit is designed for fitness and wellness education purposes only and is{' '}
                <span className="text-white font-semibold">not medical advice</span>. Please consult a
                healthcare professional before starting any new exercise or weight-loss program.
              </p>
              <button onClick={accept} className="btn-primary">
                I Understand
              </button>
              <p className="text-[10px] text-gray-600 text-center mt-3">
                This notice will not be shown again.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}