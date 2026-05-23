import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Zap, Check } from 'lucide-react';
import { PLANS, startTrial, restorePurchases, getSubscriptionStatus, PREMIUM_FEATURE_LABELS } from '@/lib/subscription';

/**
 * Lightweight upgrade prompt shown when a free user taps a premium feature.
 * Props:
 *   featureId   — the premium feature being gated (e.g. 'ai_food_scan')
 *   onClose     — dismiss without subscribing
 *   onSubscribed — called after successful trial start
 */
export default function UpgradeModal({ featureId, onClose, onSubscribed }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('yearly');
  const [restoreMsg, setRestoreMsg] = useState(null);

  const featureLabel = PREMIUM_FEATURE_LABELS[featureId] || 'this premium feature';

  const handleStartTrial = () => {
    setLoading(true);
    setTimeout(() => {
      startTrial(selected);
      setLoading(false);
      onSubscribed?.();
    }, 800);
  };

  const handleRestore = () => {
    const sub = restorePurchases();
    const status = getSubscriptionStatus();
    if (sub && (status === 'active' || status === 'trial' || status === 'canceled')) {
      setRestoreMsg('Purchase restored!');
      setTimeout(() => onSubscribed?.(), 1000);
    } else {
      setRestoreMsg('No active subscription found.');
      setTimeout(() => setRestoreMsg(null), 3000);
    }
  };

  const HIGHLIGHTS = [
    'AI food logging & scanning',
    'Personalized meal plans',
    'AI coaching & insights',
    'Smart nutrition analytics',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md rounded-t-3xl p-6 pb-10"
          style={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.25)', borderBottom: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 6px 20px rgba(124,58,237,0.4)' }}>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-purple-300/60 font-semibold uppercase tracking-wider">Premium Feature</p>
                <h2 className="text-base font-black text-white leading-tight">{featureLabel}</h2>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-4">Unlock your full fitness potential with a 7-day free trial.</p>

          {/* Highlights */}
          <div className="rounded-2xl p-3.5 mb-4 space-y-2"
            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
            {HIGHLIGHTS.map(h => (
              <div key={h} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">{h}</span>
              </div>
            ))}
          </div>

          {/* Plan selector (compact) */}
          <div className="flex gap-2 mb-4">
            {[PLANS.yearly, PLANS.monthly].map(plan => (
              <button key={plan.id}
                onClick={() => setSelected(plan.id)}
                className="flex-1 rounded-2xl p-3 text-left relative"
                style={{
                  background: selected === plan.id
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))'
                    : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${selected === plan.id ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {plan.bestValue && (
                  <span className="absolute -top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white' }}>
                    BEST VALUE
                  </span>
                )}
                <p className="text-xs font-bold text-white mt-1">{plan.label}</p>
                {plan.id === 'yearly'
                  ? <p className="text-[10px] text-gray-500 mt-0.5">${plan.pricePerMonth}/mo · ${plan.price}/yr</p>
                  : <p className="text-[10px] text-gray-500 mt-0.5">${plan.price}/month</p>
                }
              </button>
            ))}
          </div>

          {/* Restore message */}
          {restoreMsg && (
            <p className="text-center text-xs mb-2"
              style={{ color: restoreMsg.includes('restored') ? '#10b981' : '#f87171' }}>
              {restoreMsg}
            </p>
          )}

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={handleStartTrial}
            className="w-full py-4 rounded-2xl text-base font-black text-white mb-3 flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
            }}>
            <Zap className="w-4 h-4" />
            {loading ? 'Starting...' : 'Start 7-Day Free Trial'}
          </motion.button>

          <p className="text-center text-[10px] text-gray-600 mb-3 leading-relaxed">
            7-day free trial, then ${selected === 'yearly' ? `${PLANS.yearly.price}/year` : `${PLANS.monthly.price}/month`} billed automatically unless canceled.
            Cancel anytime in your App Store or Google Play settings.
          </p>

          <div className="flex items-center justify-between">
            <button onClick={onClose} className="text-xs text-gray-600 py-1 px-2">
              Continue free version
            </button>
            <button onClick={handleRestore} className="text-xs text-gray-600 py-1 px-2 active:opacity-70">
              Restore Purchases
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}