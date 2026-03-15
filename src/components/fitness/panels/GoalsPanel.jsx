import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Save, Check, Info, TrendingDown, Scale, Dumbbell } from 'lucide-react';
import { UserGoals, DailyLogs } from '../../storage';

const GOALS = [
  { id: 'lose_weight',  label: 'Lose Weight',    desc: 'Burn fat, look and feel better',  calMult: 0.80, proteinMult: 2.2, carbMult: 0.40, fatMult: 0.30 },
  { id: 'maintain',     label: 'Maintain Weight',desc: 'Stay at your current weight',      calMult: 1.00, proteinMult: 1.8, carbMult: 0.50, fatMult: 0.35 },
  { id: 'gain_muscle',  label: 'Gain Muscle',    desc: 'Build strength and size',          calMult: 1.15, proteinMult: 2.5, carbMult: 0.55, fatMult: 0.35 },
];

const ACTIVITY = [
  { id: 'sedentary',   label: 'Sedentary',        desc: 'Little or no exercise',     bmrMult: 1.2  },
  { id: 'light',       label: 'Light',            desc: '1–3 days/week',             bmrMult: 1.375 },
  { id: 'moderate',    label: 'Moderate',         desc: '3–5 days/week',             bmrMult: 1.55 },
  { id: 'active',      label: 'Active',           desc: '6–7 days/week',             bmrMult: 1.725 },
];

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: 12,
  padding: '11px 14px',
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
  caretColor: '#a855f7',
  outline: 'none',
  fontSize: 18,
  fontWeight: 700,
  width: '100%',
  textAlign: 'center',
  WebkitAppearance: 'none',
  appearance: 'none',
};

function calcTargets(currentW, heightCm, age = 30, gender = 'male', activityId, goalId) {
  const w = parseFloat(currentW) || 75;
  const h = parseFloat(heightCm) || 175;
  const g = GOALS.find(g => g.id === goalId) || GOALS[0];
  const a = ACTIVITY.find(a => a.id === activityId) || ACTIVITY[1];

  // Mifflin-St Jeor BMR
  const bmr = gender === 'female'
    ? 10 * w + 6.25 * h - 5 * age - 161
    : 10 * w + 6.25 * h - 5 * age + 5;
  const tdee = Math.round(bmr * a.bmrMult);
  const calories = Math.round(tdee * g.calMult);
  const protein  = Math.round(w * g.proteinMult);
  const fat      = Math.round((calories * g.fatMult) / 9);
  const carbs    = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { calories, protein, carbs, fat };
}

export default function GoalsPanel() {
  const saved = UserGoals.get() || {};
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = DailyLogs.getByDate(todayStr) || {};

  const [goal,       setGoal]     = useState(saved.primary_goal || 'lose_weight');
  const [targetW,    setTargetW]  = useState(String(saved.target_weight || '70'));
  const [currentW,   setCurrentW] = useState(String(saved.current_weight || ''));
  const [heightCm,   setHeightCm] = useState(String(saved.height_cm || '175'));
  const [weekly,     setWeekly]   = useState(String(saved.weekly_target || '0.5'));
  const [activity,   setActivity] = useState(saved.activity_level || 'moderate');
  const [gender,     setGender]   = useState(saved.gender || 'male');
  const [age,        setAge]      = useState(String(saved.age || '30'));
  const [wasSaved,   setWasSaved] = useState(false);

  const targets = calcTargets(currentW, heightCm, parseInt(age) || 30, gender, activity, goal);

  const save = () => {
    UserGoals.save({
      ...saved,
      primary_goal: goal,
      target_weight: parseFloat(targetW),
      current_weight: parseFloat(currentW) || parseFloat(targetW),
      height_cm: parseFloat(heightCm),
      weekly_target: parseFloat(weekly),
      activity_level: activity,
      gender,
      age: parseInt(age) || 30,
      daily_calorie_target: targets.calories,
    });
    // Update today's log with calculated goals
    DailyLogs.upsert(todayStr, {
      calories_goal: targets.calories,
      protein_goal: targets.protein,
      carbs_goal: targets.carbs,
      fat_goal: targets.fat,
    });
    setWasSaved(true);
    setTimeout(() => setWasSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500">Set your details and Shedit will calculate your optimal calorie and macro targets.</p>

      {/* Goal */}
      <div>
        <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Primary Goal</p>
        {(() => {
          const GoalIcons = { lose_weight: TrendingDown, maintain: Scale, gain_muscle: Dumbbell };
          return (
        <div className="space-y-2">
          {GOALS.map(g => {
            const GIcon = GoalIcons[g.id];
            return (
            <motion.button key={g.id} whileTap={{ scale: 0.98 }} onClick={() => setGoal(g.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all"
              style={{ background: goal === g.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${goal === g.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: goal === g.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)' }}>
                <GIcon className="w-4 h-4" style={{ color: goal === g.id ? '#c084fc' : '#6b7280' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{g.label}</p>
                <p className="text-xs text-gray-500">{g.desc}</p>
              </div>
            </motion.button>
            );
          })}
        </div>
          );
        })()}
      </div>

      {/* Body Stats */}
      <div>
        <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Your Stats</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: 'Current Weight (kg)', val: currentW, set: setCurrentW, placeholder: '75' },
            { label: 'Target Weight (kg)',  val: targetW,  set: setTargetW,  placeholder: '70' },
            { label: 'Height (cm)',         val: heightCm, set: setHeightCm, placeholder: '175' },
            { label: 'Age',                 val: age,      set: setAge,      placeholder: '30' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] text-gray-500 mb-1.5">{f.label}</p>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                style={inputStyle}
                value={f.val}
                onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) f.set(v); }}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Gender */}
        <div className="flex gap-2 mb-3">
          {['male','female'].map(g => (
            <button key={g} onClick={() => setGender(g)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all"
              style={{ background: gender === g ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${gender === g ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.07)'}`, color: gender === g ? '#c084fc' : '#6b7280' }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Activity Level</p>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY.map(a => (
            <button key={a.id} onClick={() => setActivity(a.id)}
              className="p-3 rounded-2xl text-left transition-all"
              style={{ background: activity === a.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activity === a.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
              <p className="text-sm font-semibold" style={{ color: activity === a.id ? '#e9d5ff' : '#d1d5db' }}>{a.label}</p>
              <p className="text-[10px] text-gray-500">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly rate */}
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Weekly Weight Target (kg/week)</p>
        <div className="flex gap-2">
          {['0.25','0.5','0.75','1.0'].map(v => (
            <button key={v} onClick={() => setWeekly(v)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: weekly === v ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${weekly === v ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.07)'}`, color: weekly === v ? '#c084fc' : '#6b7280' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Targets preview */}
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(168,85,247,0.08))', border: '1px solid rgba(168,85,247,0.25)' }}>
        <div className="flex items-center gap-1.5 mb-3">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <p className="text-xs font-bold text-purple-300">Your Calculated Daily Targets</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: 'Calories', v: targets.calories, c: '#a855f7', u: 'kcal' },
            { l: 'Protein',  v: targets.protein,  c: '#ec4899', u: 'g' },
            { l: 'Carbs',    v: targets.carbs,    c: '#3b82f6', u: 'g' },
            { l: 'Fat',      v: targets.fat,      c: '#f59e0b', u: 'g' },
          ].map(m => (
            <div key={m.l} className="text-center">
              <p className="text-base font-black" style={{ color: m.c }}>{m.v}</p>
              <p className="text-[9px] text-gray-500">{m.l}<br />{m.u}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {wasSaved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-3 flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Check className="w-4 h-4 text-green-400" />
            <p className="text-xs font-semibold text-green-400">Goals saved! Targets updated for today.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileTap={{ scale: 0.97 }} onClick={save}
        className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
        <Save className="w-4 h-4" /> Save & Apply Targets
      </motion.button>
    </div>
  );
}