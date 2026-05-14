import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Flame, Dumbbell, Timer, Home, Activity, X, CheckSquare, Square, MinusCircle, PlusCircle, Heart, Wind } from 'lucide-react';
import { DailyLogs } from '../../storage';
import { format } from 'date-fns';

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: 12,
  padding: '10px 14px',
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
  caretColor: '#a855f7',
  outline: 'none',
  fontSize: 15,
  width: '100%',
};

// ── Workout categories ────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'abs',
    label: 'Abs Workouts',
    icon: Activity,
    color: '#f59e0b',
    desc: 'Core strength & definition',
    exercises: [
      { name: 'Crunches',         sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 6,  desc: 'Classic ab exercise targeting upper abs' },
      { name: 'Plank',            sets: 3, reps: '45 sec',  rest: '20s', calsPerSet: 5,  desc: 'Full core stability hold' },
      { name: 'Leg Raises',       sets: 3, reps: '15 reps', rest: '30s', calsPerSet: 8,  desc: 'Lower ab focus, lying flat' },
      { name: 'Russian Twists',   sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 7,  desc: 'Obliques & rotational core' },
      { name: 'Mountain Climbers',sets: 3, reps: '30 reps', rest: '20s', calsPerSet: 10, desc: 'Dynamic core + cardio' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 7,  desc: 'Targets rectus & obliques together' },
      { name: 'Dead Bug',         sets: 3, reps: '10 reps', rest: '30s', calsPerSet: 5,  desc: 'Deep core stabilization' },
    ],
    duration: 25,
    cals: 180,
  },
  {
    id: 'glutes',
    label: 'Glute Workouts',
    icon: Heart,
    color: '#ec4899',
    desc: 'Build and tone your glutes',
    exercises: [
      { name: 'Glute Bridges',      sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 7,  desc: 'Lying hip thrusts, beginner friendly' },
      { name: 'Hip Thrusts',        sets: 4, reps: '15 reps', rest: '45s', calsPerSet: 12, desc: 'Primary glute builder with barbell or bodyweight' },
      { name: 'Sumo Squats',        sets: 3, reps: '15 reps', rest: '30s', calsPerSet: 10, desc: 'Wide stance squat for inner glutes' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '12 reps', rest: '45s', calsPerSet: 14, desc: 'Hamstrings and glute stretch' },
      { name: 'Donkey Kicks',       sets: 3, reps: '15 reps', rest: '20s', calsPerSet: 6,  desc: 'Single-leg glute isolation on all fours' },
      { name: 'Side-Lying Clams',   sets: 3, reps: '20 reps', rest: '20s', calsPerSet: 5,  desc: 'Hip abductor and outer glute activation' },
      { name: 'Curtsy Lunges',      sets: 3, reps: '12 each', rest: '30s', calsPerSet: 9,  desc: 'Cross-behind lunge for glute medius' },
    ],
    duration: 30,
    cals: 220,
  },
  {
    id: 'cardio',
    label: 'Cardio',
    icon: Wind,
    color: '#22d3ee',
    desc: 'Improve endurance & support your fitness goals',
    exercises: [
      { name: 'Warm-up Walk',      sets: 1, reps: '5 min',             rest: '—', calsPerSet: 20, desc: 'Light walk to prepare your body' },
      { name: 'Jumping Jacks',     sets: 3, reps: '30 reps',           rest: '20s', calsPerSet: 8,  desc: 'Full body cardio warm-up' },
      { name: 'High Knees',        sets: 3, reps: '30 reps',           rest: '20s', calsPerSet: 9,  desc: 'Run in place, knees to chest' },
      { name: 'Sprint Intervals',  sets: 6, reps: '30s on / 1 min off',rest: '—', calsPerSet: 18, desc: 'Max effort sprints for endurance and calorie burn' },
      { name: 'Jump Rope',         sets: 3, reps: '2 min',             rest: '30s', calsPerSet: 25, desc: 'Classic cardio conditioning' },
      { name: 'Burpees',           sets: 3, reps: '10 reps',           rest: '30s', calsPerSet: 15, desc: 'Full body explosive movement' },
      { name: 'Cool-down Walk',    sets: 1, reps: '5 min',             rest: '—', calsPerSet: 15, desc: 'Light walk to recover' },
    ],
    duration: 35,
    cals: 350,
  },
  {
    id: 'strength',
    label: 'Strength Training',
    icon: Dumbbell,
    color: '#a855f7',
    desc: 'Build muscle & get stronger',
    exercises: [
      { name: 'Dumbbell Squats',   sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 12, desc: 'Lower body compound movement' },
      { name: 'Dumbbell Press',    sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 10, desc: 'Chest and tricep press' },
      { name: 'Bent-over Rows',    sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 10, desc: 'Back width and thickness' },
      { name: 'Dumbbell Lunges',   sets: 3, reps: '12 each', rest: '45s', calsPerSet: 11, desc: 'Unilateral leg strength' },
      { name: 'Shoulder Press',    sets: 3, reps: '12 reps', rest: '45s', calsPerSet: 8,  desc: 'Overhead press for delts' },
      { name: 'Bicep Curls',       sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 5,  desc: 'Isolation for bicep peak' },
      { name: 'Tricep Extensions', sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 5,  desc: 'Overhead tricep isolation' },
    ],
    duration: 40,
    cals: 250,
  },
  {
    id: 'jumprope',
    label: 'Jump Rope',
    icon: Wind,
    color: '#22d3ee',
    desc: 'Cardio conditioning & coordination',
    exercises: [
      { name: 'Warm-up (light jog in place)', sets: 1, reps: '3 min',              rest: '—',   calsPerSet: 12, desc: 'Loosen up your joints and raise your heart rate gently' },
      { name: 'Basic Bounce – Beginner',      sets: 3, reps: '2 min on / 1 min off',rest: '60s', calsPerSet: 28, desc: 'Two-foot basic jump at a comfortable pace' },
      { name: 'Alternate Foot Step',          sets: 3, reps: '90s on / 60s off',   rest: '45s', calsPerSet: 24, desc: 'Shift weight side to side like a running motion' },
      { name: 'High Knees Jump Rope',         sets: 3, reps: '45s on / 45s off',   rest: '45s', calsPerSet: 30, desc: 'Drive knees high with each revolution for intensity' },
      { name: 'Double Unders (or fast singles)', sets: 3, reps: '30s on / 60s off', rest: '60s', calsPerSet: 32, desc: 'Rope passes twice per jump — or increase cadence' },
      { name: 'Cool-down Stretch',            sets: 1, reps: '3 min',              rest: '—',   calsPerSet: 5,  desc: 'Calf stretch, hip flexor, and light breathing' },
    ],
    duration: 20,
    cals: 220,
  },
  {
    id: 'home',
    label: 'Home Workout',
    icon: Home,
    color: '#3b82f6',
    desc: 'No equipment needed',
    exercises: [
      { name: 'Push-ups',            sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 7,  desc: 'Upper body pushing, chest focus' },
      { name: 'Bodyweight Squats',   sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 10, desc: 'Lower body compound, no equipment' },
      { name: 'Glute Bridges',       sets: 3, reps: '15 reps', rest: '20s', calsPerSet: 6,  desc: 'Glute activation lying down' },
      { name: 'Tricep Dips (chair)', sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 6,  desc: 'Tricep dip using chair edge' },
      { name: 'Lunges',              sets: 3, reps: '12 each', rest: '30s', calsPerSet: 9,  desc: 'Alternating forward lunges' },
      { name: 'Superman Hold',       sets: 3, reps: '10 reps', rest: '20s', calsPerSet: 4,  desc: 'Back extension lying prone' },
      { name: 'Plank',               sets: 3, reps: '45 sec',  rest: '20s', calsPerSet: 5,  desc: 'Core stability isometric hold' },
    ],
    duration: 25,
    cals: 215,
  },
];

const CUSTOM_TYPES = [
  { id: 'run',      label: 'Run / Walk', calsPerMin: 8 },
  { id: 'cycling',  label: 'Cycling',   calsPerMin: 7 },
  { id: 'yoga',     label: 'Yoga',      calsPerMin: 4 },
  { id: 'swimming', label: 'Swimming',  calsPerMin: 9 },
  { id: 'hiking',   label: 'Hiking',    calsPerMin: 6 },
  { id: 'other',    label: 'Other',     calsPerMin: 5 },
];

// ── Category detail (exercise list) ──────────────────────────────────────────

function CategoryDetail({ category, onBack, onLogged }) {
  const [checked, setChecked] = useState(() => category.exercises.map(() => false));
  const [overrides, setOverrides] = useState(() => category.exercises.map(ex => ({ sets: ex.sets, reps: ex.reps })));
  const [saved, setSaved] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const selectedCount = checked.filter(Boolean).length;

  const estimatedCals = category.exercises.reduce((sum, ex, i) => {
    if (!checked[i]) return sum;
    return sum + (ex.calsPerSet * (overrides[i].sets || ex.sets));
  }, 0);

  const estimatedMins = selectedCount === 0 ? 0
    : Math.round((selectedCount / category.exercises.length) * category.duration);

  const toggleAll = () => {
    const allOn = checked.every(Boolean);
    setChecked(category.exercises.map(() => !allOn));
  };

  const setOverride = (i, field, val) => {
    setOverrides(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
  };

  const logSelected = () => {
    if (selectedCount === 0) return;
    const todayLog = DailyLogs.getByDate(todayStr) || {};
    DailyLogs.upsert(todayStr, {
      exercise_minutes: (todayLog.exercise_minutes || 0) + estimatedMins,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onLogged && onLogged(); }, 2200);
  };

  const Icon = category.icon;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
          <X className="w-4 h-4 text-gray-400" />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${category.color}20` }}>
          <Icon className="w-5 h-5" style={{ color: category.color }} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-white">{category.label}</h4>
          <p className="text-xs text-gray-500">{category.duration} min · ~{category.cals} kcal</p>
        </div>
        <button onClick={toggleAll}
          className="text-[10px] font-bold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
          {checked.every(Boolean) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3">Tap exercises you completed. Adjust sets/reps if needed.</p>

      <div className="space-y-2 mb-4">
        {category.exercises.map((ex, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: checked[i] ? `${category.color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked[i] ? `${category.color}40` : 'rgba(255,255,255,0.06)'}`,
              transition: 'background 0.2s, border-color 0.2s',
            }}>
            <button onClick={() => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))}
              className="w-full flex items-center gap-3 p-3.5 text-left">
              <div className="flex-shrink-0">
                {checked[i]
                  ? <CheckSquare className="w-5 h-5" style={{ color: category.color }} />
                  : <Square className="w-5 h-5 text-gray-600" />}
              </div>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${category.color}22`, color: category.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{ex.name}</p>
                <p className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} · Rest: {ex.rest}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{ex.desc}</p>
              </div>
              {checked[i] && (
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color: category.color }}>
                  ~{ex.calsPerSet * (overrides[i].sets || ex.sets)} kcal
                </span>
              )}
            </button>

            <AnimatePresence>
              {checked[i] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div className="flex gap-3 px-4 pb-3">
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Sets</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOverride(i, 'sets', Math.max(1, (overrides[i].sets || ex.sets) - 1))}>
                          <MinusCircle className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{overrides[i].sets || ex.sets}</span>
                        <button onClick={() => setOverride(i, 'sets', (overrides[i].sets || ex.sets) + 1)}>
                          <PlusCircle className="w-5 h-5" style={{ color: category.color }} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Reps / Duration</p>
                      <input
                        type="text"
                        value={overrides[i].reps}
                        onChange={e => setOverride(i, 'reps', e.target.value)}
                        autoComplete="off" autoCorrect="off" spellCheck="false"
                        style={{ ...inputStyle, padding: '6px 10px', fontSize: 13, borderRadius: 10 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {selectedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-3 mb-3 flex items-center justify-between"
          style={{ background: `${category.color}12`, border: `1px solid ${category.color}30` }}>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: category.color }} />
            <p className="text-xs font-semibold text-white">{selectedCount} exercise{selectedCount !== 1 ? 's' : ''} selected</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span style={{ color: category.color }}><Timer className="w-3 h-3 inline mr-0.5" />{estimatedMins} min</span>
            <span className="text-orange-400"><Flame className="w-3 h-3 inline mr-0.5" />~{estimatedCals} kcal</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-3 mb-3 flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Check className="w-4 h-4 text-green-400" />
            <p className="text-xs font-semibold text-green-400">
              Workout logged! +{estimatedMins} min, ~{estimatedCals} kcal burned
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={logSelected} disabled={selectedCount === 0 || saved}
        className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
        style={{
          background: saved ? 'rgba(16,185,129,0.2)' : selectedCount === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
          opacity: selectedCount === 0 && !saved ? 0.5 : 1,
        }}>
        {saved ? <><Check className="w-4 h-4" /> Logged!</> : <><Dumbbell className="w-4 h-4" /> Log Selected ({selectedCount})</>}
      </button>
    </div>
  );
}

// ── Main WorkoutPanel ─────────────────────────────────────────────────────────

export default function WorkoutPanel() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('categories');
  const [logTick, setLogTick] = useState(0);
  const [customType, setCustomType] = useState(CUSTOM_TYPES[0]);
  const [customMins, setCustomMins] = useState('30');
  const [customSaved, setCustomSaved] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const history = useMemo(() => {
    return DailyLogs.list()
      .filter(l => l.exercise_minutes > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [logTick]);

  const logCustom = () => {
    const mins = parseInt(customMins) || 0;
    if (mins <= 0) return;
    const todayLog = DailyLogs.getByDate(todayStr) || {};
    DailyLogs.upsert(todayStr, {
      exercise_minutes: (todayLog.exercise_minutes || 0) + mins,
    });
    setCustomSaved(true);
    setCustomMins('30');
    setTimeout(() => setCustomSaved(false), 2500);
  };

  if (selected) {
    return (
      <CategoryDetail
        category={selected}
        onBack={() => setSelected(null)}
        onLogged={() => { setLogTick(t => t + 1); setSelected(null); setTab('history'); }}
      />
    );
  }

  return (
    <div>
      <div className="flex p-1 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[['categories', 'Workouts'], ['custom', 'Custom'], ['history', 'History']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === k
              ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white' }
              : { color: '#4b5563' }}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>

          {tab === 'categories' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">Choose a category and select the exercises you completed.</p>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <motion.button key={cat.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(cat)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}18` }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{cat.label}</p>
                      <p className="text-xs text-gray-500">{cat.desc}</p>
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-[10px] text-purple-400"><Timer className="w-2.5 h-2.5 inline mr-0.5" />{cat.duration} min</span>
                        <span className="text-[10px] text-orange-400"><Flame className="w-2.5 h-2.5 inline mr-0.5" />~{cat.cals} kcal</span>
                        <span className="text-[10px] text-gray-600">{cat.exercises.length} exercises</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </motion.button>
                );
              })}
            </div>
          )}

          {tab === 'custom' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">Log any activity and track its calorie burn.</p>
              <div>
                <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Activity Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {CUSTOM_TYPES.map(t => (
                    <button key={t.id} onClick={() => setCustomType(t)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all"
                      style={{
                        background: customType.id === t.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${customType.id === t.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      <Dumbbell className="w-4 h-4" style={{ color: customType.id === t.id ? '#c084fc' : '#6b7280' }} />
                      <span className="text-[10px] font-semibold" style={{ color: customType.id === t.id ? '#c084fc' : '#6b7280' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Duration (minutes)</p>
                <input type="text" inputMode="numeric" style={inputStyle}
                  value={customMins}
                  onChange={e => { const v = e.target.value; if (v === '' || /^\d+$/.test(v)) setCustomMins(v); }}
                  autoComplete="off" autoCorrect="off" spellCheck="false"
                  placeholder="30" />
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(168,85,247,0.08)' }}>
                <p className="text-xs text-purple-300/60">Estimated burn: <span className="text-white font-bold">~{Math.round((parseInt(customMins) || 0) * customType.calsPerMin)} kcal</span></p>
              </div>
              <AnimatePresence>
                {customSaved && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl p-3 flex items-center gap-2"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Check className="w-4 h-4 text-green-400" />
                    <p className="text-xs font-semibold text-green-400">Activity logged!</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={logCustom}
                className="w-full py-4 rounded-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                Log Activity
              </button>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="w-8 h-8 text-purple-300/20 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No workouts logged yet. Get moving!</p>
                </div>
              ) : history.map(l => (
                <div key={l.date} className="flex items-center justify-between p-3.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-sm font-semibold text-white">{format(new Date(l.date), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-gray-500">{l.exercise_minutes} minutes active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-purple-400">{l.exercise_minutes} min</p>
                    <p className="text-[10px] text-gray-600">~{l.exercise_minutes * 7} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}