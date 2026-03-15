import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Check, Flame, Plus, Dumbbell, Timer } from 'lucide-react';
import { DailyLogs } from '../../storage';
import { format } from 'date-fns';

const ROUTINES = [
  {
    id: 'weight_loss',
    label: 'Weight Loss Circuit',
    desc: 'Burn fat with full body circuits',
    duration: 30,
    cals: 300,
    color: '#f59e0b',
    exercises: [
      { name: 'Jumping Jacks',     sets: 3, reps: '30 reps', rest: '20s' },
      { name: 'Burpees',           sets: 3, reps: '10 reps', rest: '30s' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 reps', rest: '20s' },
      { name: 'Squat Jumps',       sets: 3, reps: '15 reps', rest: '30s' },
      { name: 'High Knees',        sets: 3, reps: '30 reps', rest: '20s' },
      { name: 'Push-ups',          sets: 3, reps: '12 reps', rest: '30s' },
      { name: 'Plank',             sets: 3, reps: '45 sec',  rest: '20s' },
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
      { name: 'Push-ups',           sets: 3, reps: '12 reps', rest: '30s' },
      { name: 'Bodyweight Squats',  sets: 3, reps: '20 reps', rest: '30s' },
      { name: 'Glute Bridges',      sets: 3, reps: '15 reps', rest: '20s' },
      { name: 'Tricep Dips (chair)',sets: 3, reps: '12 reps', rest: '30s' },
      { name: 'Lunges',             sets: 3, reps: '12 each', rest: '30s' },
      { name: 'Superman Hold',      sets: 3, reps: '10 reps', rest: '20s' },
      { name: 'Plank',              sets: 3, reps: '45 sec',  rest: '20s' },
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
      { name: 'Dumbbell Squats',   sets: 4, reps: '10 reps', rest: '60s' },
      { name: 'Dumbbell Press',    sets: 4, reps: '10 reps', rest: '60s' },
      { name: 'Bent-over Rows',    sets: 4, reps: '10 reps', rest: '60s' },
      { name: 'Dumbbell Lunges',   sets: 3, reps: '12 each', rest: '45s' },
      { name: 'Shoulder Press',    sets: 3, reps: '12 reps', rest: '45s' },
      { name: 'Bicep Curls',       sets: 3, reps: '12 reps', rest: '30s' },
      { name: 'Tricep Extensions', sets: 3, reps: '12 reps', rest: '30s' },
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
      { name: 'Warm-up Walk',     sets: 1, reps: '5 min',               rest: '—' },
      { name: 'Jog (moderate)',   sets: 1, reps: '10 min',              rest: '—' },
      { name: 'Sprint Intervals', sets: 6, reps: '30s on / 1 min off',  rest: '—' },
      { name: 'Jump Rope',        sets: 3, reps: '2 min',               rest: '30s' },
      { name: 'Stair Climbs',     sets: 3, reps: '1 min',               rest: '30s' },
      { name: 'Cool-down Walk',   sets: 1, reps: '5 min',               rest: '—' },
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

export default function WorkoutPanel() {
  const [selected, setSelected]   = useState(null);
  const [tab, setTab]             = useState('plans'); // plans | custom | history
  const [loggedToday, setLogged]  = useState(false);
  const [customType, setCustomType] = useState(CUSTOM_TYPES[0]);
  const [customMins, setCustomMins] = useState('30');
  const [customNote, setCustomNote] = useState('');
  const [saved, setSaved]         = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const history = useMemo(() => {
    return DailyLogs.list()
      .filter(l => l.exercise_minutes > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [loggedToday]);

  const logRoutine = (routine) => {
    const todayLog = DailyLogs.getByDate(todayStr) || {};
    DailyLogs.upsert(todayStr, {
      exercise_minutes: (todayLog.exercise_minutes || 0) + routine.duration,
    });
    setLogged(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logCustom = () => {
    const mins = parseInt(customMins) || 0;
    if (mins <= 0) return;
    const todayLog = DailyLogs.getByDate(todayStr) || {};
    DailyLogs.upsert(todayStr, {
      exercise_minutes: (todayLog.exercise_minutes || 0) + mins,
    });
    setLogged(true);
    setSaved(true);
    setCustomMins('30');
    setCustomNote('');
    setTimeout(() => setSaved(false), 2500);
  };

  if (selected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex-1">
            <h4 className="text-base font-bold text-white">{selected.emoji} {selected.label}</h4>
            <p className="text-xs text-gray-500">{selected.duration} min · ~{selected.cals} kcal</p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {selected.exercises.map((ex, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${selected.color}25`, color: selected.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{ex.name}</p>
                <p className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} · Rest: {ex.rest}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-3 mb-3 flex items-center gap-2"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Check className="w-4 h-4 text-green-400" />
              <p className="text-xs font-semibold text-green-400">Workout logged! +{selected.duration} min, ~{selected.cals} kcal burned</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => logRoutine(selected)} disabled={saved}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
          style={{ background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          {saved ? <><Check className="w-4 h-4" /> Logged!</> : <><Dumbbell className="w-4 h-4" /> Log this Workout</>}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex p-1 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[['plans','Plans'],['custom','Custom'],['history','History']].map(([k, l]) => (
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
              <p className="text-xs text-gray-500 mb-2">Tap a plan to see exercises, then log it to your daily totals.</p>
              {ROUTINES.map(r => (
                <motion.button key={r.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(r)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${r.color}18` }}>{r.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[10px] text-purple-400"><Timer className="w-2.5 h-2.5 inline mr-0.5" />{r.duration} min</span>
                      <span className="text-[10px] text-orange-400"><Flame className="w-2.5 h-2.5 inline mr-0.5" />~{r.cals} kcal</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </motion.button>
              ))}
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
                      <span className="text-xl">{t.emoji}</span>
                      <span className="text-[10px] font-semibold" style={{ color: customType.id === t.id ? '#c084fc' : '#6b7280' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-2">Duration (minutes)</p>
                <input
                  type="number"
                  inputMode="numeric"
                  style={inputStyle}
                  value={customMins}
                  onChange={e => setCustomMins(e.target.value)}
                  placeholder="30"
                />
              </div>

              <div className="rounded-xl p-3" style={{ background: 'rgba(168,85,247,0.08)' }}>
                <p className="text-xs text-purple-300/60">Estimated burn: <span className="text-white font-bold">~{Math.round((parseInt(customMins) || 0) * customType.calsPerMin)} kcal</span></p>
              </div>

              <AnimatePresence>
                {saved && (
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
                  <p className="text-sm text-gray-500">No workouts logged yet. Get moving! 💪</p>
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