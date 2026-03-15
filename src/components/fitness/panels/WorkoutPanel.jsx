import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Flame, Dumbbell, Timer, Home, Activity, X, CheckSquare, Square, MinusCircle, PlusCircle } from 'lucide-react';
import { DailyLogs } from '../../storage';
import { format } from 'date-fns';

const ROUTINE_ICONS = { weight_loss: Flame, home: Home, strength: Dumbbell, cardio: Activity };

const ROUTINES = [
  {
    id: 'weight_loss',
    label: 'Weight Loss Circuit',
    desc: 'Burn fat with full body circuits',
    duration: 30,
    cals: 300,
    color: '#f59e0b',
    exercises: [
      { name: 'Jumping Jacks',     sets: 3, reps: '30 reps', rest: '20s', calsPerSet: 8 },
      { name: 'Burpees',           sets: 3, reps: '10 reps', rest: '30s', calsPerSet: 15 },
      { name: 'Mountain Climbers', sets: 3, reps: '20 reps', rest: '20s', calsPerSet: 10 },
      { name: 'Squat Jumps',       sets: 3, reps: '15 reps', rest: '30s', calsPerSet: 12 },
      { name: 'High Knees',        sets: 3, reps: '30 reps', rest: '20s', calsPerSet: 9 },
      { name: 'Push-ups',          sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 7 },
      { name: 'Plank',             sets: 3, reps: '45 sec',  rest: '20s', calsPerSet: 5 },
    ]
  },
  {
    id: 'home',
    label: 'Home Workout',
    desc: 'No equipment needed',
    duration: 25,
    cals: 215,
    color: '#3b82f6',
    exercises: [
      { name: 'Push-ups',           sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 7 },
      { name: 'Bodyweight Squats',  sets: 3, reps: '20 reps', rest: '30s', calsPerSet: 10 },
      { name: 'Glute Bridges',      sets: 3, reps: '15 reps', rest: '20s', calsPerSet: 6 },
      { name: 'Tricep Dips (chair)',sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 6 },
      { name: 'Lunges',             sets: 3, reps: '12 each', rest: '30s', calsPerSet: 9 },
      { name: 'Superman Hold',      sets: 3, reps: '10 reps', rest: '20s', calsPerSet: 4 },
      { name: 'Plank',              sets: 3, reps: '45 sec',  rest: '20s', calsPerSet: 5 },
    ]
  },
  {
    id: 'strength',
    label: 'Strength Training',
    desc: 'Build muscle and get stronger',
    duration: 40,
    cals: 250,
    color: '#a855f7',
    exercises: [
      { name: 'Dumbbell Squats',   sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 12 },
      { name: 'Dumbbell Press',    sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 10 },
      { name: 'Bent-over Rows',    sets: 4, reps: '10 reps', rest: '60s', calsPerSet: 10 },
      { name: 'Dumbbell Lunges',   sets: 3, reps: '12 each', rest: '45s', calsPerSet: 11 },
      { name: 'Shoulder Press',    sets: 3, reps: '12 reps', rest: '45s', calsPerSet: 8 },
      { name: 'Bicep Curls',       sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 5 },
      { name: 'Tricep Extensions', sets: 3, reps: '12 reps', rest: '30s', calsPerSet: 5 },
    ]
  },
  {
    id: 'cardio',
    label: 'Cardio Routine',
    desc: 'Improve endurance and heart health',
    duration: 35,
    cals: 350,
    color: '#ec4899',
    exercises: [
      { name: 'Warm-up Walk',     sets: 1, reps: '5 min',               rest: '—', calsPerSet: 20 },
      { name: 'Jog (moderate)',   sets: 1, reps: '10 min',              rest: '—', calsPerSet: 80 },
      { name: 'Sprint Intervals', sets: 6, reps: '30s on / 1 min off',  rest: '—', calsPerSet: 18 },
      { name: 'Jump Rope',        sets: 3, reps: '2 min',               rest: '30s', calsPerSet: 25 },
      { name: 'Stair Climbs',     sets: 3, reps: '1 min',               rest: '30s', calsPerSet: 15 },
      { name: 'Cool-down Walk',   sets: 1, reps: '5 min',               rest: '—', calsPerSet: 15 },
    ]
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

// ── Exercise selector view (Step 2 & 3) ─────────────────────────────────────

function RoutineDetail({ routine, onBack, onLogged }) {
  // checked[i] = true/false
  const [checked, setChecked] = useState(() => routine.exercises.map(() => false));
  // overrides: { sets, reps } per exercise index
  const [overrides, setOverrides] = useState(() => routine.exercises.map(ex => ({ sets: ex.sets, reps: ex.reps })));
  const [saved, setSaved] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const selectedCount = checked.filter(Boolean).length;

  const estimatedCals = routine.exercises.reduce((sum, ex, i) => {
    if (!checked[i]) return sum;
    return sum + (ex.calsPerSet * (overrides[i].sets || ex.sets));
  }, 0);

  // Estimated minutes proportional to selection
  const estimatedMins = selectedCount === 0 ? 0
    : Math.round((selectedCount / routine.exercises.length) * routine.duration);

  const toggleAll = () => {
    const allOn = checked.every(Boolean);
    setChecked(routine.exercises.map(() => !allOn));
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
          <X className="w-4 h-4 text-gray-400" />
        </button>
        <div className="flex-1">
          <h4 className="text-base font-bold text-white">{routine.label}</h4>
          <p className="text-xs text-gray-500">{routine.duration} min · ~{routine.cals} kcal total</p>
        </div>
        <button onClick={toggleAll}
          className="text-[10px] font-bold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
          {checked.every(Boolean) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3">Check the exercises you completed. Adjust sets/reps if needed.</p>

      {/* Exercise list */}
      <div className="space-y-2 mb-4">
        {routine.exercises.map((ex, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: checked[i] ? `${routine.color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked[i] ? `${routine.color}40` : 'rgba(255,255,255,0.06)'}`,
              transition: 'background 0.2s, border-color 0.2s',
            }}>
            {/* Row: checkbox + name + default info */}
            <button onClick={() => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))}
              className="w-full flex items-center gap-3 p-3.5 text-left">
              <div className="flex-shrink-0">
                {checked[i]
                  ? <CheckSquare className="w-5 h-5" style={{ color: routine.color }} />
                  : <Square className="w-5 h-5 text-gray-600" />}
              </div>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${routine.color}22`, color: routine.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{ex.name}</p>
                <p className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} · Rest: {ex.rest}</p>
              </div>
              {checked[i] && (
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color: routine.color }}>
                  ~{ex.calsPerSet * (overrides[i].sets || ex.sets)} kcal
                </span>
              )}
            </button>

            {/* Expanded override controls when checked */}
            <AnimatePresence>
              {checked[i] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div className="flex gap-3 px-4 pb-3">
                    {/* Sets */}
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Sets</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOverride(i, 'sets', Math.max(1, (overrides[i].sets || ex.sets) - 1))}>
                          <MinusCircle className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{overrides[i].sets || ex.sets}</span>
                        <button onClick={() => setOverride(i, 'sets', (overrides[i].sets || ex.sets) + 1)}>
                          <PlusCircle className="w-5 h-5" style={{ color: routine.color }} />
                        </button>
                      </div>
                    </div>
                    {/* Reps / duration */}
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Reps / Duration</p>
                      <input
                        type="text"
                        value={overrides[i].reps}
                        onChange={e => setOverride(i, 'reps', e.target.value)}
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

      {/* Summary bar */}
      {selectedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-3 mb-3 flex items-center justify-between"
          style={{ background: `${routine.color}12`, border: `1px solid ${routine.color}30` }}>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: routine.color }} />
            <p className="text-xs font-semibold text-white">{selectedCount} exercise{selectedCount !== 1 ? 's' : ''} selected</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span style={{ color: routine.color }}><Timer className="w-3 h-3 inline mr-0.5" />{estimatedMins} min</span>
            <span className="text-orange-400"><Flame className="w-3 h-3 inline mr-0.5" />~{estimatedCals} kcal</span>
          </div>
        </motion.div>
      )}

      {/* Success banner */}
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

      {/* Log button */}
      <button
        onClick={logSelected}
        disabled={selectedCount === 0 || saved}
        className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
        style={{
          background: saved ? 'rgba(16,185,129,0.2)' : selectedCount === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
          opacity: selectedCount === 0 && !saved ? 0.5 : 1,
        }}>
        {saved
          ? <><Check className="w-4 h-4" /> Logged!</>
          : <><Dumbbell className="w-4 h-4" /> Log Selected Workouts ({selectedCount})</>}
      </button>
    </div>
  );
}

// ── Main WorkoutPanel ─────────────────────────────────────────────────────────

export default function WorkoutPanel() {
  const [selected, setSelected]     = useState(null);
  const [tab, setTab]               = useState('plans');
  const [logTick, setLogTick]       = useState(0);
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

  // Show routine detail (step 2/3)
  if (selected) {
    return (
      <RoutineDetail
        routine={selected}
        onBack={() => setSelected(null)}
        onLogged={() => { setLogTick(t => t + 1); setSelected(null); setTab('history'); }}
      />
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex p-1 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[['plans', 'Plans'], ['custom', 'Custom'], ['history', 'History']].map(([k, l]) => (
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

          {tab === 'plans' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">Choose a routine, then select the exercises you completed.</p>
              {ROUTINES.map(r => {
                const Icon = ROUTINE_ICONS[r.id] || Activity;
                return (
                  <motion.button key={r.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(r)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${r.color}18` }}>
                      <Icon className="w-5 h-5" style={{ color: r.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{r.label}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-[10px] text-purple-400"><Timer className="w-2.5 h-2.5 inline mr-0.5" />{r.duration} min</span>
                        <span className="text-[10px] text-orange-400"><Flame className="w-2.5 h-2.5 inline mr-0.5" />~{r.cals} kcal</span>
                        <span className="text-[10px] text-gray-600">{r.exercises.length} exercises</span>
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
                <input type="number" inputMode="numeric" style={inputStyle}
                  value={customMins} onChange={e => setCustomMins(e.target.value)} placeholder="30" />
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