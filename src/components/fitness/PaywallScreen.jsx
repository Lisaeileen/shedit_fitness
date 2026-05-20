import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Star } from 'lucide-react';
import { PLANS, startTrial, restorePurchases, getSubscriptionStatus } from '@/lib/subscription';

const FEATURES = [
  'Personalized fitness plans',
  'Calorie tracking',
  'Progress tracking',
  'AI daily coach',
  'Workout guidance (including jump rope)',
];

export default function PaywallScreen({ onClose, onSubscribed }) {
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState(null);

  const handleStartTrial = () => {
    setLoading(true);
    // Simulate slight async (in prod: native IAP purchase flow)
    setTimeout(() => {
      startTrial(selected);
      setLoading(false);
      onSubscribed?.();
    }, 900);
  };

  const handleRestore = () => {
    const sub = restorePurchases();
    const status = getSubscriptionStatus();
    if (sub && (status === 'active' || status === 'trial' || status === 'canceled')) {
      setRestoreMsg('Purchase restored! Enjoy Shedit Premium.');
      setTimeout(() => onSubscribed?.(), 1200);
    } else {
      setRestoreMsg('No active subscription found.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0618' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-44"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}>

        {/* Close button (only when shown from Settings) */}
        {onClose && (
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f9ef7)', boxShadow: '0 8px 28px rgba(124,58,237,0.5)' }}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">Start your fitness journey<br />with Shedit</h1>
          <p className="text-sm text-gray-400 mt-2">Try free for 7 days. Cancel anytime.</p>
        </motion.div>

        {/* Social proof */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4" fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
          <span className="text-xs text-gray-400 ml-2">4.6 ★ (13,000 ratings) · Trusted by over 1.5 million users</span>
        </motion.div>

        {/* Plan selector */}
        <div className="space-y-3 mb-6">
          {[PLANS.yearly, PLANS.monthly].map(plan => (
            <motion.button key={plan.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(plan.id)}
              className="w-full rounded-2xl p-4 text-left relative"
              style={{
                background: selected === plan.id
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,158,247,0.15))'
                  : 'rgba(255,255,255,0.04)',
                border: `2px solid ${selected === plan.id ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
              }}>

              {plan.bestValue && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-black px-2.5 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f9ef7)', color: 'white' }}>
                  BEST VALUE
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{plan.label}</p>
                  {plan.id === 'yearly' ? (
                    <p className="text-[11px] text-gray-400 mt-0.5">${plan.pricePerMonth}/month · billed ${plan.price}/year</p>
                  ) : (
                    <p className="text-[11px] text-gray-400 mt-0.5">${plan.price}/month</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {plan.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      {plan.badge}
                    </span>
                  )}
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: selected === plan.id ? '#7c3aed' : 'rgba(255,255,255,0.2)', background: selected === plan.id ? '#7c3aed' : 'transparent' }}>
                    {selected === plan.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Features */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-3 py-2">
              <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-sm text-gray-200">{f}</span>
            </div>
          ))}
        </div>

        {/* Restore msg */}
        {restoreMsg && (
          <p className="text-center text-xs py-2 mb-2"
            style={{ color: restoreMsg.includes('restored') ? '#10b981' : '#f87171' }}>
            {restoreMsg}
          </p>
        )}
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-5 max-w-md mx-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', paddingTop: '12px', background: 'linear-gradient(to top, #0d0618 60%, transparent)' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleStartTrial}
          className="w-full py-4 rounded-2xl text-base font-black text-white mb-3"
          style={{ background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f9ef7)', boxShadow: '0 8px 24px rgba(124,58,237,0.45)' }}>
          {loading ? 'Starting...' : 'Start Free Trial'}
        </motion.button>
        <p className="text-center text-[10px] text-gray-600 mb-2">
          7-day free trial, then billed automatically unless canceled. Subscription renews automatically unless canceled at least 24 hours before the end of the current period. Cancel anytime in your App Store or Google Play settings.
        </p>
        <button onClick={handleRestore} className="w-full text-center text-xs text-gray-500 py-1 active:opacity-70">
          Restore Purchase
        </button>
      </div>
    </div>
  );
}