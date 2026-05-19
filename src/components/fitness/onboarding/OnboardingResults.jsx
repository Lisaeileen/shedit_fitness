import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, Star } from 'lucide-react';
import { calculatePlan, kgToLbs } from './onboardingUtils';
import { PrimaryButton } from './StepButton';

// ── Step 24: Generating Plan ──────────────────────────────────────────────────
export function StepGenerating({ onDone }) {
  const messages = [
    'Analysing your profile...',
    'Calculating your calorie targets...',
    'Building your macro breakdown...',
    'Personalising your plan...',
    'Almost there...',
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) setMsgIdx(i);
      else { clearInterval(interval); setTimeout(onDone, 400); }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-12 text-center flex flex-col items-center">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f9ef7)', boxShadow: '0 12px 40px rgba(79,158,247,0.35)' }}>
        <motion.div
          animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <TrendingUp className="w-10 h-10 text-white" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-black text-white mb-2">Setting you up...</h2>
      <AnimatePresence mode="wait">
        <motion.p key={msgIdx}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="text-sm text-gray-400">{messages[msgIdx]}</motion.p>
      </AnimatePresence>
      <div className="flex gap-1.5 mt-8">
        {messages.map((_, i) => (
          <motion.div key={i}
            animate={{ background: i <= msgIdx ? '#4f9ef7' : 'rgba(255,255,255,0.1)' }}
            className="w-2 h-2 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// ── Step 25: Results Summary ──────────────────────────────────────────────────
export function StepResults({ data }) {
  const plan = calculatePlan(data);
  const isImperial = data.unit === 'imperial';
  const displayGoalWeight = isImperial ? kgToLbs(data.desired_weight_kg || 75) : (data.desired_weight_kg || 75);
  const unit = isImperial ? 'lbs' : 'kg';
  const diff = Math.abs((data.weight_kg || 75) - (data.desired_weight_kg || 75));

  const goalLabel = data.goal_type === 'lose_weight'
    ? `Lose ${isImperial ? kgToLbs(diff) : diff.toFixed(1)}${unit}`
    : data.goal_type === 'gain_weight'
    ? `Gain ${isImperial ? kgToLbs(diff) : diff.toFixed(1)}${unit}`
    : 'Maintain Weight';

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Your personalised plan</h2>
      <p className="text-gray-400 text-sm mb-6">Ready to go — here's what we built for you</p>

      {/* Goal banner */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(79,158,247,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(79,158,247,0.3)' }}>
        <p className="text-[10px] text-blue-400/70 uppercase tracking-widest font-bold mb-1">Your Goal</p>
        <p className="text-xl font-black text-white">{goalLabel} by {plan.goalDate}</p>
      </div>

      {/* Daily calories */}
      <div className="rounded-2xl p-4 mb-4 text-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Daily Calorie Goal</p>
        <p className="text-5xl font-black text-white">{plan.dailyCalories.toLocaleString()}</p>
        <p className="text-sm text-gray-400 mt-1">kcal / day</p>
        <p className="text-[11px] text-gray-500 mt-2 px-2">Based on your profile, this calorie target supports safe and effective progress.</p>
        {data.goal_speed === 'fast' && (
          <p className="text-[11px] mt-2 px-2" style={{ color: '#f59e0b' }}>
            ⚡ This is a faster pace. Staying consistent and eating balanced meals is important.
          </p>
        )}
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { label: 'Protein', val: plan.protein, color: '#ec4899', unit: 'g' },
          { label: 'Carbs',   val: plan.carbs,   color: '#3b82f6', unit: 'g' },
          { label: 'Fat',     val: plan.fat,     color: '#f59e0b', unit: 'g' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl p-3.5 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xl font-black" style={{ color: m.color }}>{m.val}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{m.label}</p>
            <p className="text-[9px] text-gray-600">{m.unit}/day</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 26: User Summary ─────────────────────────────────────────────────────
export function StepUserSummary({ data }) {
  const plan = calculatePlan(data);
  const isImperial = data.unit === 'imperial';
  const unit = isImperial ? 'lbs' : 'kg';
  const freqLabels = { '0-2': 'Light (0–2/wk)', '3-5': 'Moderate (3–5/wk)', '6+': 'Active (6+/wk)' };

  const rows = [
    { label: 'Starting weight', value: `${isImperial ? kgToLbs(data.weight_kg||75) : (data.weight_kg||75)} ${unit}` },
    { label: 'Goal weight',     value: `${isImperial ? kgToLbs(data.desired_weight_kg||75) : (data.desired_weight_kg||75)} ${unit}` },
    { label: 'Activity level',  value: freqLabels[data.workout_freq] || 'Moderate' },
    { label: 'Timeline',        value: plan.timelineMonths > 0 ? `~${plan.timelineMonths} months` : 'Ongoing' },
  ];

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Your profile summary</h2>
      <p className="text-gray-400 text-sm mb-6">Here's everything we know about you</p>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {rows.map((r, i) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-3.5"
            style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <span className="text-sm text-gray-400">{r.label}</span>
            <span className="text-sm font-bold text-white">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 27: Progress Graph ───────────────────────────────────────────────────
export function StepProgressGraph({ data }) {
  const plan = calculatePlan(data);
  const isImperial = data.unit === 'imperial';
  const unit = isImperial ? 'lbs' : 'kg';
  const startW = parseFloat(data.weight_kg) || 75;
  const goalW  = parseFloat(data.desired_weight_kg) || startW;
  const losing = data.goal_type === 'lose_weight';

  // Generate 6 data points
  const months = plan.timelineMonths || 6;
  const points = Array.from({ length: 6 }, (_, i) => {
    const progress = i / 5;
    const w = startW + (goalW - startW) * progress;
    return isImperial ? kgToLbs(w) : Math.round(w * 10) / 10;
  });

  const minVal = Math.min(...points) - 2;
  const maxVal = Math.max(...points) + 2;
  const range = maxVal - minVal;

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Estimated progress</h2>
      <p className="text-gray-400 text-sm mb-6">Your projected journey based on your goals</p>
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-end gap-2 h-32 mb-2">
          {points.map((v, i) => {
            const heightPct = range > 0 ? ((v - minVal) / range) * 100 : 50;
            const barH = losing ? 100 - heightPct : heightPct;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-600">{Math.round(v)}</span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${Math.max(10, barH)}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="w-full rounded-t-lg"
                  style={{ background: i === 5 ? 'linear-gradient(to top, #7c3aed, #4f9ef7)' : `rgba(79,158,247,${0.25 + i * 0.12})` }} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-gray-600">Now</span>
          <span className="text-[10px] text-gray-600">{plan.goalDate}</span>
        </div>
      </div>
      <p className="text-[11px] text-gray-600 text-center mt-3">Results based on consistent daily tracking</p>
    </div>
  );
}

// ── Step 28: How to Succeed ───────────────────────────────────────────────────
export function StepHowToSucceed() {
  const tips = [
    { emoji: '🍽️', title: 'Track your food', desc: 'Log every meal — even small snacks. Awareness is step 1.' },
    { emoji: '🎯', title: 'Follow your calorie goal', desc: 'Stay within your daily target most days.' },
    { emoji: '🏃', title: 'Stay active', desc: 'Hit your step goal and log workouts regularly.' },
    { emoji: '⚖️', title: 'Balance your macros', desc: 'Protein, carbs, and fat all matter.' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">How to succeed with Shedit</h2>
      <p className="text-gray-400 text-sm mb-6">Follow these 4 habits and you'll see results</p>
      <div className="space-y-3">
        {tips.map((t, i) => (
          <motion.div key={t.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-2xl mt-0.5">{t.emoji}</span>
            <div>
              <p className="text-sm font-bold text-white">{t.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Step 29: Why Shedit ───────────────────────────────────────────────────────
export function StepWhyShedit() {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-6">Why Shedit is different</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: 'Without Shedit',
            bad: true,
            items: ['Guess-work nutrition', 'No accountability', 'Slow manual logging', 'No progress tracking'],
          },
          {
            label: 'With Shedit',
            bad: false,
            items: ['AI-powered logging', 'Daily insights', 'Barcode & voice scan', 'Auto step tracking'],
          },
        ].map(col => (
          <div key={col.label} className="rounded-2xl p-4"
            style={{ background: col.bad ? 'rgba(244,63,94,0.06)' : 'rgba(79,158,247,0.08)', border: `1px solid ${col.bad ? 'rgba(244,63,94,0.2)' : 'rgba(79,158,247,0.2)'}` }}>
            <p className="text-[11px] font-bold mb-3" style={{ color: col.bad ? '#f87171' : '#4f9ef7' }}>{col.label}</p>
            {col.items.map(i => (
              <div key={i} className="flex items-center gap-1.5 mb-2">
                <span className="text-xs flex-shrink-0" style={{ color: col.bad ? '#f87171' : '#4f9ef7' }}>{col.bad ? '✕' : '✓'}</span>
                <span className="text-xs text-gray-400 leading-tight">{i}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 30: Trust Screen ─────────────────────────────────────────────────────
export function StepTrust() {
  return (
    <div className="pt-4 text-center">
      <div className="text-5xl mb-4">🏅</div>
      <h2 className="text-2xl font-black text-white mb-2">Trusted by our community</h2>
      <div className="flex items-center justify-center gap-2 my-5">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="w-6 h-6" fill={i <= 5 ? '#f59e0b' : 'none'}
            style={{ color: '#f59e0b' }} />
        ))}
        <span className="text-xl font-black text-white ml-2">4.6</span>
      </div>
      <p className="text-sm text-gray-500 mb-8">Trusted by over 13,000 users</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { val: '13K+', label: 'Users' },
          { val: '4.6★', label: 'Rating' },
          { val: '98%', label: 'Satisfaction' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-lg font-black text-white">{s.val}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 31: Final CTA (paywall handled by OnboardingGate) ────────────────────
export function StepPaywall({ onComplete }) {
  return (
    <div className="pt-12 text-center flex flex-col items-center">
      <div className="text-5xl mb-5">🎉</div>
      <h2 className="text-2xl font-black text-white mb-2">You're all set!</h2>
      <p className="text-gray-400 text-sm mb-8">Your personalised plan is ready.</p>
      <PrimaryButton onClick={onComplete}>Go to My Plan</PrimaryButton>
    </div>
  );
}