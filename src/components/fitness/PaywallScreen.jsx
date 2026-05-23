import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Zap, Crown, RotateCcw } from 'lucide-react';
import { PLANS, startTrial, restorePurchases, getSubscriptionStatus } from '@/lib/subscription';

export default function PaywallScreen({ onClose, onSubscribed }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('yearly');
  const [restoreMsg, setRestoreMsg] = useState(null);

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

  const FEATURES = [
    { free: true,  label: 'Manual food logging' },
    { free: true,  label: 'Step & water tracking' },
    { free: true,  label: 'Weight logging' },
    { free: true,  label: 'Basic workout tracking' },
    { free: false, label: 'AI food scan & recognition' },
    { free: false, label: 'Personalized meal plans' },
    { free: false, label: 'AI coaching & insights' },
    { free: false, label: 'Barcode scanner' },
    { free: false, label: 'Voice food logging' },
    { free: false, label: 'Advanced nutrition analytics' },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex flex-col overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #12062A 0%, #1E0A40 50%, #2A0A4A 100%)' }}>
      
      {/* Close */}
      <div className="flex justify-end p-4 pt-safe">
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-5">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 8px 28px rgba(124,58,237,0.5)' }}>
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Unlock Shedit Premium</h1>
          <p className="text-sm text-gray-400">Start your 7-day free trial. Cancel anytime.</p>
        </div>

        {/* Feature list */}
        <div className="rounded-2xl p-4 space-y-2.5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: f.free ? 'rgba(16,185,129,0.15)' : 'rgba(168,85,247,0.15)' }}>
                <Check className="w-3 h-3" style={{ color: f.free ? '#10b981' : '#a855f7' }} />
              </div>
              <span className="text-sm text-gray-300">{f.label}</span>
              {!f.free && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>PRO</span>
              )}
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div className="flex gap-3">
          {[PLANS.yearly, PLANS.monthly].map(plan => (
            <button key={plan.id} onClick={() => setSelected(plan.id)}
              className="flex-1 rounded-2xl p-3.5 text-left relative"
              style={{
                background: selected === plan.id
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))'
                  : 'rgba(255,255,255,0.04)',
                border: `2px solid ${selected === plan.id ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {plan.bestValue && (
                <span className="absolute -top-2.5 left-3 text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white' }}>
                  BEST VALUE
                </span>
              )}
              <p className="text-sm font-bold text-white mt-1">{plan.label}</p>
              {plan.id === 'yearly'
                ? <p className="text-xs text-gray-500 mt-0.5">${plan.pricePerMonth}/mo · ${plan.price}/yr</p>
                : <p className="text-xs text-gray-500 mt-0.5">${plan.price}/month</p>
              }
            </button>
          ))}
        </div>

        {/* Restore message */}
        {restoreMsg && (
          <p className="text-center text-sm font-semibold"
            style={{ color: restoreMsg.includes('restored') ? '#10b981' : '#f87171' }}>
            {restoreMsg}
          </p>
        )}

        {/* CTA */}
        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} onClick={handleStartTrial}
          className="w-full py-4 rounded-2xl text-base font-black text-white flex items-center justify-center gap-2"
          style={{
            background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          }}>
          <Zap className="w-4 h-4" />
          {loading ? 'Starting...' : 'Start 7-Day Free Trial'}
        </motion.button>

        <p className="text-center text-[10px] text-gray-600 leading-relaxed">
          7-day free trial, then ${selected === 'yearly' ? `${PLANS.yearly.price}/year` : `${PLANS.monthly.price}/month`} billed automatically unless canceled.
          Cancel anytime in your App Store or Google Play settings.
        </p>

        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-xs text-gray-500 py-1 px-2 active:opacity-70">
            Continue with free version
          </button>
          <button onClick={handleRestore} className="text-xs text-gray-500 py-1 px-2 active:opacity-70 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Restore Purchases
          </button>
        </div>
      </div>
    </div>
  );
}