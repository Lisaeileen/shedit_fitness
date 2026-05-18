import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, CheckCircle, Zap, Check, ChevronRight } from 'lucide-react';
import { OptionButton, PrimaryButton } from './StepButton';
import { cmToFtIn, ftInToCm, lbsToKg, kgToLbs } from './onboardingUtils';

// ── Step 1: Get Started ──────────────────────────────────────────────────────
export function StepGetStarted({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center px-2 pt-8">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f9ef7)', boxShadow: '0 12px 40px rgba(79,158,247,0.35)' }}>
        <TrendingUp className="w-12 h-12 text-white" />
      </motion.div>
      <h1 className="text-3xl font-black text-white mb-3 leading-tight">Calorie tracking<br />made easy</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs">Track your nutrition, hit your goals, and build lasting healthy habits — all in one place.</p>
      <div className="w-full">
        <PrimaryButton onClick={onNext}>Get Started</PrimaryButton>
      </div>
      <p className="text-[11px] text-gray-600 mt-4">Takes about 2 minutes</p>
    </div>
  );
}

// ── Step 2: Sex ──────────────────────────────────────────────────────────────
export function StepSex({ value, onChange, onNext }) {
  const opts = [
    { value: 'male',   label: 'Male',   emoji: '♂️' },
    { value: 'female', label: 'Female', emoji: '♀️' },
    { value: 'other',  label: 'Prefer not to say', emoji: '⚧️' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">What's your sex?</h2>
      <p className="text-sm text-gray-500 mb-6">Used to calculate your calorie needs</p>
      <div className="space-y-2.5">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} emoji={o.emoji}
            selected={value === o.value}
            onClick={() => { onChange(o.value); setTimeout(onNext, 180); }} />
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Workout Frequency ────────────────────────────────────────────────
export function StepWorkoutFreq({ value, onChange, onNext }) {
  const opts = [
    { value: '0-2', label: '0–2 per week', sublabel: 'Light activity' },
    { value: '3-5', label: '3–5 per week', sublabel: 'Moderate activity' },
    { value: '6+',  label: '6+ per week',  sublabel: 'Very active' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">How many workouts do you do per week?</h2>
      <p className="text-sm text-gray-500 mb-6">This helps us calibrate your custom plan</p>
      <div className="space-y-2.5">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} sublabel={o.sublabel}
            selected={value === o.value}
            onClick={() => { onChange(o.value); setTimeout(onNext, 180); }} />
        ))}
      </div>
    </div>
  );
}

// ── Step 4: Date of Birth ────────────────────────────────────────────────────
export function StepDOB({ value, onChange }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">When were you born?</h2>
      <p className="text-sm text-gray-500 mb-6">Helps personalise your calorie targets</p>
      <input
        type="date"
        className="input-dark w-full text-base font-semibold"
        value={value || ''}
        max={new Date().toISOString().split('T')[0]}
        onChange={e => onChange(e.target.value)}
        style={{ colorScheme: 'dark' }}
      />
    </div>
  );
}

// ── Step 5: Discovery ────────────────────────────────────────────────────────
export function StepDiscovery({ value, onChange, onNext }) {
  const opts = [
    { value: 'youtube', label: 'YouTube', emoji: '▶️' },
    { value: 'tv', label: 'TV', emoji: '📺' },
    { value: 'facebook', label: 'Facebook', emoji: '📘' },
    { value: 'friends', label: 'Friends & Family', emoji: '👥' },
    { value: 'google', label: 'Google', emoji: '🔍' },
    { value: 'instagram', label: 'Instagram', emoji: '📸' },
    { value: 'appstore', label: 'App Store', emoji: '📱' },
    { value: 'twitter', label: 'X (Twitter)', emoji: '𝕏' },
    { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
    { value: 'other', label: 'Other', emoji: '💬' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Where did you hear about us?</h2>
      <p className="text-sm text-gray-500 mb-5">Takes 1 second — helps us improve</p>
      <div className="space-y-2">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} emoji={o.emoji}
            selected={value === o.value}
            onClick={() => { onChange(o.value); setTimeout(onNext, 180); }} />
        ))}
      </div>
    </div>
  );
}

// ── Step 6: Prior Experience ─────────────────────────────────────────────────
export function StepExperience({ value, onChange, onNext }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Have you tried other calorie tracking apps?</h2>
      <p className="text-sm text-gray-500 mb-6">We'll make sure Shedit is better</p>
      <div className="space-y-2.5">
        <OptionButton label="Yes" emoji="✅" selected={value === 'yes'}
          onClick={() => { onChange('yes'); setTimeout(onNext, 180); }} />
        <OptionButton label="No" emoji="❌" selected={value === 'no'}
          onClick={() => { onChange('no'); setTimeout(onNext, 180); }} />
      </div>
    </div>
  );
}

// ── Step 7: Value Graph Screen ───────────────────────────────────────────────
export function StepValueGraph() {
  const weeks = [10, 18, 25, 35, 48, 60, 72, 80];
  const max = 80;
  return (
    <div className="pt-4 text-center">
      <h2 className="text-2xl font-black text-white mb-2">Designed to help you stay on track</h2>
      <p className="text-gray-400 text-sm mb-8">People who log daily are 3× more likely to hit their goals</p>
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs text-gray-500 mb-4 text-left">Avg. progress with consistent tracking</p>
        <div className="flex items-end gap-1.5 h-28">
          {weeks.map((v, i) => (
            <motion.div key={i}
              initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
              className="flex-1 rounded-t-lg"
              style={{ background: i === weeks.length - 1
                ? 'linear-gradient(to top, #7c3aed, #4f9ef7)'
                : `rgba(79,158,247,${0.2 + (i / weeks.length) * 0.5})` }} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-600">Week 1</span>
          <span className="text-[10px] text-gray-600">Week 8</span>
        </div>
      </div>
      <div className="flex gap-3">
        {[
          { label: 'Avg. weight lost', value: '4.2kg', color: '#4f9ef7' },
          { label: 'Consistency rate', value: '87%', color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="flex-1 rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 8: Height & Weight ──────────────────────────────────────────────────
export function StepHeightWeight({ data, onChange }) {
  const [unit, setUnit] = useState(data.unit || 'metric');
  const [ft, setFt] = useState(() => cmToFtIn(data.height_cm || 170).ft);
  const [inches, setInches] = useState(() => cmToFtIn(data.height_cm || 170).inches);
  const [lbs, setLbs] = useState(() => kgToLbs(data.weight_kg || 75));

  const handleUnitToggle = (u) => {
    setUnit(u);
    onChange({ ...data, unit: u });
  };

  const handleMetricHeight = (v) => {
    const val = parseInt(v) || 0;
    onChange({ ...data, height_cm: val, unit });
  };
  const handleImperialHeight = (newFt, newIn) => {
    const f = parseInt(newFt) || 0;
    const i = parseInt(newIn) || 0;
    setFt(f); setInches(i);
    onChange({ ...data, height_cm: ftInToCm(f, i), unit });
  };
  const handleMetricWeight = (v) => {
    const val = parseFloat(v) || 0;
    onChange({ ...data, weight_kg: val, unit });
  };
  const handleImperialWeight = (v) => {
    const val = parseInt(v) || 0;
    setLbs(val);
    onChange({ ...data, weight_kg: lbsToKg(val), unit });
  };

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Height & Weight</h2>
      <p className="text-sm text-gray-500 mb-5">Used to calculate your calorie targets</p>

      {/* Unit toggle */}
      <div className="flex rounded-xl p-1 mb-6 gap-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {['metric', 'imperial'].map(u => (
          <button key={u} onClick={() => handleUnitToggle(u)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
            style={{
              background: unit === u ? '#4f9ef7' : 'transparent',
              color: unit === u ? '#fff' : '#6b7280',
            }}>
            {u === 'metric' ? 'Metric (cm/kg)' : 'Imperial (ft/lbs)'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Height */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Height</p>
          {unit === 'metric' ? (
            <div className="flex items-center gap-2">
              <input type="number" className="input-dark flex-1 text-lg font-bold"
                value={data.height_cm || ''}
                onChange={e => handleMetricHeight(e.target.value)}
                placeholder="170" min={100} max={250} />
              <span className="text-sm text-gray-500 w-8">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input type="number" className="input-dark flex-1 text-lg font-bold"
                value={ft} onChange={e => handleImperialHeight(e.target.value, inches)}
                placeholder="5" min={3} max={8} />
              <span className="text-sm text-gray-500">ft</span>
              <input type="number" className="input-dark flex-1 text-lg font-bold"
                value={inches} onChange={e => handleImperialHeight(ft, e.target.value)}
                placeholder="9" min={0} max={11} />
              <span className="text-sm text-gray-500">in</span>
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Weight</p>
          {unit === 'metric' ? (
            <div className="flex items-center gap-2">
              <input type="number" className="input-dark flex-1 text-lg font-bold"
                value={data.weight_kg || ''}
                onChange={e => handleMetricWeight(e.target.value)}
                placeholder="70" min={30} max={300} />
              <span className="text-sm text-gray-500 w-8">kg</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input type="number" className="input-dark flex-1 text-lg font-bold"
                value={lbs} onChange={e => handleImperialWeight(e.target.value)}
                placeholder="154" min={66} max={660} />
              <span className="text-sm text-gray-500 w-8">lbs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 9: Professional Support ─────────────────────────────────────────────
export function StepProfessional({ value, onChange, onNext }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Do you currently work with a personal trainer or dietitian?</h2>
      <p className="text-sm text-gray-500 mb-6">We'll tailor your experience accordingly</p>
      <div className="space-y-2.5">
        <OptionButton label="Yes" sublabel="I have professional guidance" emoji="🏋️" selected={value === 'yes'}
          onClick={() => { onChange('yes'); setTimeout(onNext, 180); }} />
        <OptionButton label="No" sublabel="I'm on my own journey" emoji="💪" selected={value === 'no'}
          onClick={() => { onChange('no'); setTimeout(onNext, 180); }} />
      </div>
    </div>
  );
}

// ── Step 10: Goal Type ───────────────────────────────────────────────────────
export function StepGoalType({ value, onChange, onNext }) {
  const opts = [
    { value: 'lose_weight',     label: 'Lose weight',     emoji: '📉', sublabel: 'Reduce body weight' },
    { value: 'maintain_weight', label: 'Maintain weight', emoji: '⚖️', sublabel: 'Stay at current weight' },
    { value: 'gain_weight',     label: 'Gain weight',     emoji: '📈', sublabel: 'Build muscle & mass' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">What is your goal?</h2>
      <p className="text-sm text-gray-500 mb-6">We'll build your plan around this</p>
      <div className="space-y-2.5">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} sublabel={o.sublabel} emoji={o.emoji}
            selected={value === o.value}
            onClick={() => { onChange(o.value); setTimeout(onNext, 180); }} />
        ))}
      </div>
    </div>
  );
}

// ── Step 11: Desired Weight ──────────────────────────────────────────────────
export function StepDesiredWeight({ data, onChange }) {
  const isImperial = data.unit === 'imperial';
  const currentKg = parseFloat(data.weight_kg) || 75;
  const desiredKg = parseFloat(data.desired_weight_kg) || currentKg;
  const goal = data.goal_type;

  const minKg = goal === 'gain_weight' ? currentKg : Math.max(40, currentKg - 60);
  const maxKg = goal === 'lose_weight' ? currentKg : currentKg + 60;

  const displayVal = isImperial ? kgToLbs(desiredKg) : desiredKg;
  const minVal = isImperial ? kgToLbs(minKg) : minKg;
  const maxVal = isImperial ? kgToLbs(maxKg) : maxKg;
  const unit = isImperial ? 'lbs' : 'kg';
  const diff = Math.abs(desiredKg - currentKg).toFixed(1);
  const diffLbs = Math.abs(kgToLbs(desiredKg) - kgToLbs(currentKg));

  const handleChange = (v) => {
    const kg = isImperial ? lbsToKg(parseFloat(v)) : parseFloat(v);
    onChange({ ...data, desired_weight_kg: kg });
  };

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">What's your desired weight?</h2>
      <p className="text-sm text-gray-500 mb-8">Move the slider to your goal weight</p>

      <div className="text-center mb-8">
        <motion.span
          key={displayVal}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-black text-white">{Math.round(displayVal)}</motion.span>
        <span className="text-2xl text-gray-400 ml-2">{unit}</span>
        {diff > 0 && (
          <p className="text-sm mt-2" style={{ color: goal === 'lose_weight' ? '#4f9ef7' : '#a855f7' }}>
            {goal === 'lose_weight' ? '−' : '+'}{isImperial ? `${diffLbs} lbs` : `${diff} kg`} from current
          </p>
        )}
      </div>

      <input type="range" className="w-full cursor-pointer"
        min={minVal} max={maxVal} step={isImperial ? 1 : 0.5}
        value={displayVal}
        onChange={e => handleChange(e.target.value)}
        style={{ accentColor: '#4f9ef7' }} />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-600">{Math.round(minVal)} {unit}</span>
        <span className="text-xs text-gray-600">{Math.round(maxVal)} {unit}</span>
      </div>
    </div>
  );
}

// ── Step 12: Goal Speed ──────────────────────────────────────────────────────
export function StepGoalSpeed({ value, onChange, data }) {
  const w = parseFloat(data.weight_kg) || 75;
  const desired = parseFloat(data.desired_weight_kg) || w;
  const diff = Math.abs(w - desired);

  const speeds = [
    {
      key: 'slow',
      label: 'Slow',
      emoji: '🐢',
      deficitKcal: 250,
      sublabel: 'Gentle & sustainable',
    },
    {
      key: 'recommended',
      label: 'Recommended',
      emoji: '⭐',
      deficitKcal: 400,
      sublabel: 'Balanced & effective',
      highlight: true,
    },
    {
      key: 'fast',
      label: 'Fast',
      emoji: '🚀',
      deficitKcal: 600,
      sublabel: 'Aggressive — needs discipline',
    },
  ];

  const getTimeline = (deficit) => {
    if (diff <= 0 || data.goal_type === 'maintain_weight') return 'Stay on track';
    const weeklyChange = (deficit * 7) / 7700;
    const months = Math.round((diff / weeklyChange) / 4.3);
    return `~${months} month${months !== 1 ? 's' : ''}`;
  };

  const getDailyCal = (deficit) => {
    const freqMap = { '0-2': 1.375, '3-5': 1.55, '6+': 1.725 };
    const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : 30;
    const h = parseFloat(data.height_cm) || 170;
    const bmr = data.sex === 'female'
      ? 10 * w + 6.25 * h - 5 * age - 161
      : 10 * w + 6.25 * h - 5 * age + 5;
    const tdee = Math.round(bmr * (freqMap[data.workout_freq] || 1.55));
    const goal = data.goal_type === 'gain_weight' ? tdee + deficit : tdee - deficit;
    return Math.max(data.sex === 'female' ? 1200 : 1500, goal);
  };

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">How fast do you want to reach your goal?</h2>
      <p className="text-sm text-gray-500 mb-6">Choose a pace that works for your lifestyle</p>
      <div className="space-y-3">
        {speeds.map(s => {
          const sel = value === s.key;
          return (
            <motion.button key={s.key} whileTap={{ scale: 0.97 }} onClick={() => onChange(s.key)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all relative overflow-hidden"
              style={{
                background: sel ? (s.highlight ? 'rgba(168,85,247,0.15)' : 'rgba(79,158,247,0.12)') : 'rgba(255,255,255,0.04)',
                border: sel ? (s.highlight ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(79,158,247,0.4)') : '1px solid rgba(255,255,255,0.08)',
              }}>
              {s.highlight && (
                <div className="absolute top-2 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#a855f7', color: '#fff' }}>BEST</div>
              )}
              <span className="text-xl">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{s.label}</p>
                <p className="text-xs text-gray-500">{getTimeline(s.deficitKcal)} · {getDailyCal(s.deficitKcal)} kcal/day</p>
              </div>
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: sel ? (s.highlight ? '#a855f7' : '#4f9ef7') : 'transparent',
                  border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                }}>
                {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 13: Value Proposition ───────────────────────────────────────────────
export function StepValueProp() {
  const features = [
    { emoji: '🍽️', label: 'Food logging', desc: 'Log meals in seconds with barcode scan & AI' },
    { emoji: '👟', label: 'Step tracking', desc: 'Auto-detect steps right from your phone' },
    { emoji: '📊', label: 'Progress visibility', desc: 'See your trends, streaks & milestones' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-2">A simple way to stay on track</h2>
      <p className="text-gray-400 text-sm mb-6">Everything you need, nothing you don't</p>
      <div className="space-y-3 mb-6">
        {features.map(f => (
          <div key={f.label} className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-2xl">{f.emoji}</span>
            <div>
              <p className="text-sm font-bold text-white">{f.label}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Without Shedit', items: ['Manual guesswork', 'No reminders', 'No insights'], bad: true },
          { label: 'With Shedit', items: ['AI-powered logging', 'Smart reminders', 'Daily insights'], bad: false },
        ].map(col => (
          <div key={col.label} className="rounded-2xl p-4"
            style={{ background: col.bad ? 'rgba(244,63,94,0.06)' : 'rgba(79,158,247,0.08)', border: `1px solid ${col.bad ? 'rgba(244,63,94,0.2)' : 'rgba(79,158,247,0.2)'}` }}>
            <p className="text-[11px] font-bold mb-3" style={{ color: col.bad ? '#f87171' : '#4f9ef7' }}>{col.label}</p>
            {col.items.map(i => (
              <div key={i} className="flex items-center gap-1.5 mb-2">
                <span style={{ color: col.bad ? '#f87171' : '#4f9ef7' }} className="text-xs">{col.bad ? '✕' : '✓'}</span>
                <span className="text-xs text-gray-400">{i}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 14: Barriers ────────────────────────────────────────────────────────
export function StepBarriers({ value, onChange }) {
  const opts = [
    { value: 'consistency', label: 'Lack of consistency', emoji: '🔄' },
    { value: 'eating',      label: 'Unhealthy eating',    emoji: '🍕' },
    { value: 'busy',        label: 'Busy schedule',       emoji: '⏰' },
    { value: 'support',     label: 'Lack of support',     emoji: '🤝' },
    { value: 'meal_ideas',  label: 'No meal ideas',       emoji: '💡' },
    { value: 'other',       label: 'Other',               emoji: '💭' },
  ];
  const selected = value || [];
  const toggle = (v) => {
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  };
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">What's stopping you from reaching your goals?</h2>
      <p className="text-sm text-gray-500 mb-5">Select all that apply</p>
      <div className="space-y-2.5">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} emoji={o.emoji}
            selected={selected.includes(o.value)}
            onClick={() => toggle(o.value)} />
        ))}
      </div>
    </div>
  );
}

// ── Step 15: Diet Type ───────────────────────────────────────────────────────
export function StepDietType({ value, onChange, onNext }) {
  const opts = [
    { value: 'classic',       label: 'Classic',       sublabel: 'No restrictions', emoji: '🍖' },
    { value: 'pescatarian',   label: 'Pescatarian',   sublabel: 'No meat, but fish ok', emoji: '🐟' },
    { value: 'vegetarian',    label: 'Vegetarian',    sublabel: 'No meat or fish', emoji: '🥦' },
    { value: 'vegan',         label: 'Vegan',         sublabel: 'No animal products', emoji: '🌱' },
  ];
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Do you follow a specific diet?</h2>
      <p className="text-sm text-gray-500 mb-6">We'll adjust your meal suggestions</p>
      <div className="space-y-2.5">
        {opts.map(o => (
          <OptionButton key={o.value} label={o.label} sublabel={o.sublabel} emoji={o.emoji}
            selected={value === o.value}
            onClick={() => { onChange(o.value); setTimeout(onNext, 180); }} />
        ))}
      </div>
    </div>
  );
}

// ── Step 16: Motivation ──────────────────────────────────────────────────────
export function StepMotivation({ data }) {
  const goal = data.goal_type === 'lose_weight' ? 'lose weight' : data.goal_type === 'gain_weight' ? 'gain weight' : 'maintain weight';
  const diff = Math.abs((data.weight_kg || 75) - (data.desired_weight_kg || 75)).toFixed(1);
  const isImperial = data.unit === 'imperial';
  const displayDiff = isImperial ? kgToLbs(parseFloat(diff)) : diff;
  const unit = isImperial ? 'lbs' : 'kg';

  return (
    <div className="pt-4 text-center">
      <div className="text-5xl mb-4">🎯</div>
      <h2 className="text-2xl font-black text-white mb-2">You have great potential to crush your goal</h2>
      <p className="text-gray-400 text-sm mb-8">Based on your profile, you can realistically {goal}</p>
      {diff > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(79,158,247,0.08)', border: '1px solid rgba(79,158,247,0.2)' }}>
          <p className="text-4xl font-black text-white">{displayDiff} <span className="text-xl text-gray-400">{unit}</span></p>
          <p className="text-sm text-gray-400 mt-1">Your target {data.goal_type === 'lose_weight' ? 'loss' : 'gain'}</p>
        </div>
      )}
      <div className="flex gap-3">
        {[
          { label: 'Starting', value: `${isImperial ? kgToLbs(data.weight_kg||75) : (data.weight_kg||75)} ${unit}` },
          { label: 'Goal',     value: `${isImperial ? kgToLbs(data.desired_weight_kg||75) : (data.desired_weight_kg||75)} ${unit}` },
        ].map(s => (
          <div key={s.label} className="flex-1 rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-lg font-black text-white mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 17: Personalization Message ────────────────────────────────────────
export function StepPersonalization() {
  return (
    <div className="pt-8 text-center">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-2xl font-black text-white mb-3">Thank you for trusting us</h2>
      <p className="text-gray-400 text-base leading-relaxed mb-8">Now let's personalise Shedit just for you. Your plan will be tailored to your exact goals and lifestyle.</p>
      <div className="space-y-3 text-left">
        {['Your calorie targets', 'Your macro breakdown', 'Your meal suggestions', 'Your progress milestones'].map((item, i) => (
          <motion.div key={item} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(79,158,247,0.07)', border: '1px solid rgba(79,158,247,0.15)' }}>
            <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-white">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Step 18: Health Integration ──────────────────────────────────────────────
export function StepHealthIntegration({ value, onChange }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-2">Connect to Apple Health</h2>
      <p className="text-gray-400 text-sm mb-6">Get more accurate data by syncing your health stats</p>
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { emoji: '👟', text: 'Sync steps automatically' },
          { emoji: '🏃', text: 'Import workouts' },
          { emoji: '🔥', text: 'Track calories burned' },
        ].map(i => (
          <div key={i.text} className="flex items-center gap-3 mb-3 last:mb-0">
            <span className="text-xl">{i.emoji}</span>
            <span className="text-sm text-gray-300">{i.text}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2.5">
        <OptionButton label="Connect Apple Health" emoji="❤️" sublabel="Recommended for best experience" selected={value === 'yes'}
          onClick={() => onChange('yes')} />
        <OptionButton label="Skip for now" emoji="→" selected={value === 'no'}
          onClick={() => onChange('no')} />
      </div>
    </div>
  );
}

// ── Step 19: Sync Explanation ────────────────────────────────────────────────
export function StepSyncExplanation() {
  return (
    <div className="pt-4 text-center">
      <div className="text-6xl mb-5">🔄</div>
      <h2 className="text-2xl font-black text-white mb-2">Sync your daily activity</h2>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">We use your motion data to count steps and detect stair climbing — fully on-device, never shared.</p>
      <div className="space-y-3 text-left">
        {[
          { emoji: '📍', label: 'On-device only', desc: 'No data leaves your phone' },
          { emoji: '⚡', label: 'Real-time', desc: 'Steps update as you walk' },
          { emoji: '🔒', label: 'Private', desc: 'You control your data' },
        ].map(i => (
          <div key={i.label} className="flex items-center gap-4 p-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xl">{i.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-white">{i.label}</p>
              <p className="text-xs text-gray-500">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 20: Calorie Settings ─────────────────────────────────────────────────
export function StepCalorieSettings({ value, onChange, onNext }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Add calories burned back to your daily goal?</h2>
      <p className="text-gray-400 text-sm mb-6">When you exercise, we can add those calories back to your target</p>
      <div className="space-y-2.5">
        <OptionButton label="Yes" sublabel="I'll eat back exercise calories" emoji="✅" selected={value === 'yes'}
          onClick={() => { onChange('yes'); setTimeout(onNext, 180); }} />
        <OptionButton label="No" sublabel="Keep my goal fixed" emoji="🚫" selected={value === 'no'}
          onClick={() => { onChange('no'); setTimeout(onNext, 180); }} />
      </div>
    </div>
  );
}

// ── Step 21: Calorie Rollover ─────────────────────────────────────────────────
export function StepCalorieRollover({ value, onChange, onNext }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-black text-white mb-1">Roll over unused calories to the next day?</h2>
      <p className="text-gray-400 text-sm mb-6">Up to 200 calories can carry forward</p>
      <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-gray-500 mb-2">Example</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Yesterday</span>
            <span className="text-white">350 / 500 → <span style={{ color: '#4f9ef7' }}>+150 cal</span></span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Today</span>
            <span className="text-white">350 / <span style={{ color: '#4f9ef7' }}>650 cal</span></span>
          </div>
        </div>
      </div>
      <div className="space-y-2.5">
        <OptionButton label="Yes, roll over up to 200 calories" emoji="➕" selected={value === 'yes'}
          onClick={() => { onChange('yes'); setTimeout(onNext, 180); }} />
        <OptionButton label="No, keep each day separate" emoji="📅" selected={value === 'no'}
          onClick={() => { onChange('no'); setTimeout(onNext, 180); }} />
      </div>
    </div>
  );
}

// ── Step 22: Social Proof ─────────────────────────────────────────────────────
export function StepSocialProof() {
  return (
    <div className="pt-4 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h2 className="text-2xl font-black text-white mb-2">Join over 2 million people like you</h2>
      <p className="text-gray-400 text-sm mb-8">People around the world are already hitting their goals with Shedit</p>
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="w-7 h-7" fill={i <= 4 ? '#f59e0b' : 'none'}
            style={{ color: i <= 5 ? '#f59e0b' : '#374151' }} />
        ))}
        <span className="text-2xl font-black text-white ml-2">4.6</span>
      </div>
      <p className="text-sm text-gray-500 mb-8">Based on 180,000+ ratings</p>
      <div className="space-y-3 text-left">
        {[
          { text: '"Lost 8kg in 3 months — the easiest app I\'ve used!"', name: 'Sarah K.' },
          { text: '"Finally understand my nutrition. Game changer."', name: 'James T.' },
          { text: '"AI meal suggestions are incredible. 10/10"', name: 'Amara L.' },
        ].map(r => (
          <div key={r.name} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm text-gray-300 italic">{r.text}</p>
            <p className="text-xs text-gray-600 mt-2">— {r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 23: Notifications ────────────────────────────────────────────────────
export function StepNotifications({ value, onChange, onNext }) {
  return (
    <div className="pt-4 text-center">
      <div className="text-6xl mb-5">🔔</div>
      <h2 className="text-2xl font-black text-white mb-2">Stay on track with reminders</h2>
      <p className="text-gray-400 text-sm mb-8">We'll remind you to log meals and hit your daily goals</p>
      <div className="space-y-2.5 text-left">
        <OptionButton label="Allow Notifications" emoji="✅" sublabel="Get reminders for meals & goals" selected={value === 'yes'}
          onClick={() => { onChange('yes'); setTimeout(onNext, 180); }} />
        <OptionButton label="Don't Allow" emoji="🚫" sublabel="You can enable this later in settings" selected={value === 'no'}
          onClick={() => { onChange('no'); setTimeout(onNext, 180); }} />
      </div>
    </div>
  );
}