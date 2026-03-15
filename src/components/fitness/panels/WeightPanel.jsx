import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Scale, Check, Ruler } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyLogs, UserGoals } from '../../storage';

const INPUT = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(168,85,247,0.3)',
  borderRadius: 14,
  padding: '13px 16px',
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
  caretColor: '#a855f7',
  outline: 'none',
  fontSize: 16,
  fontWeight: '600',
  width: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
};

const MEASUREMENTS = [
  { key: 'chest_cm',   label: 'Chest',   unit: 'cm' },
  { key: 'waist_cm',   label: 'Waist',   unit: 'cm' },
  { key: 'hips_cm',    label: 'Hips',    unit: 'cm' },
  { key: 'thigh_cm',   label: 'Thigh',   unit: 'cm' },
  { key: 'arm_cm',     label: 'Arm',     unit: 'cm' },
];

function NumberInput({ value, onChange, placeholder, unit }) {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <input
        type="text"
        inputMode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        value={value}
        onChange={e => {
          const raw = e.target.value;
          if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw);
        }}
        placeholder={placeholder}
        style={INPUT}
      />
      {unit && (
        <span style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'rgba(168,85,247,0.7)', fontSize: 13, fontWeight: 700, pointerEvents: 'none',
        }}>
          {unit}
        </span>
      )}
    </div>
  );
}

export default function WeightPanel({ onClose }) {
  const [tab, setTab]       = useState('weight'); // 'weight' | 'body'
  const [newW, setNewW]     = useState('');
  const [unit, setUnit]     = useState('kg');
  const [saved, setSaved]   = useState(false);
  const [tick, setTick]     = useState(0);

  // Body measurements state
  const [measurements, setMeasurements] = useState({});
  const [measSaved, setMeasSaved]       = useState(false);

  const logs  = useMemo(() => DailyLogs.list(), [tick]);
  const goals = UserGoals.get() || {};

  const weightLogs = useMemo(() =>
    [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30)
  , [logs]);

  const chartData = weightLogs.map(l => ({ date: l.date.slice(5), w: l.weight }));
  const current   = weightLogs.at(-1)?.weight;
  const prev      = weightLogs.at(-2)?.weight;
  const diff      = current && prev ? (current - prev).toFixed(1) : null;
  const target    = goals.target_weight;
  const remaining = current && target ? Math.abs(current - target).toFixed(1) : null;

  const toKg = (v) => unit === 'lb' ? v * 0.453592 : v;

  const logWeight = () => {
    const v = parseFloat(newW);
    if (!v || v < 1) return;
    const kg = parseFloat(toKg(v).toFixed(2));
    if (kg < 20 || kg > 400) return;
    const todayStr = new Date().toISOString().split('T')[0];
    DailyLogs.upsert(todayStr, { weight: kg });
    setSaved(true);
    setNewW('');
    setTick(t => t + 1);
    setTimeout(() => setSaved(false), 2200);
  };

  const logMeasurements = () => {
    const data = {};
    MEASUREMENTS.forEach(m => {
      const v = parseFloat(measurements[m.key]);
      if (v > 0) data[m.key] = v;
    });
    if (Object.keys(data).length === 0) return;
    const todayStr = new Date().toISOString().split('T')[0];
    DailyLogs.upsert(todayStr, data);
    setMeasSaved(true);
    setMeasurements({});
    setTick(t => t + 1);
    setTimeout(() => setMeasSaved(false), 2200);
  };

  const displayWeight = (kg) => {
    if (unit === 'lb') return `${(kg * 2.20462).toFixed(1)} lb`;
    return `${kg} kg`;
  };

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[['weight', Scale, 'Weight'], ['body', Ruler, 'Measurements']].map(([k, Icon, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={tab === k
              ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white' }
              : { color: '#4b5563' }}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Weight Tab ─────────────────────────────────────── */}
        {tab === 'weight' && (
          <motion.div key="weight" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Current', value: current ? displayWeight(current) : '—', color: '#a855f7' },
                { label: 'Target',  value: target  ? displayWeight(target)  : '—', color: '#10b981' },
                { label: 'To Go',   value: remaining ? `${remaining} kg`     : '—', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Trend badge */}
            {diff && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{
                  background: parseFloat(diff) <= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                  border: `1px solid ${parseFloat(diff) <= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                }}>
                {parseFloat(diff) <= 0
                  ? <TrendingDown className="w-4 h-4 text-emerald-400" />
                  : <TrendingUp className="w-4 h-4 text-rose-400" />}
                <p className="text-xs text-gray-300">
                  {parseFloat(diff) <= 0 ? `Down ${Math.abs(diff)} kg` : `Up ${diff} kg`} since last entry
                </p>
              </div>
            )}

            {/* Chart */}
            {chartData.length >= 2 ? (
              <div>
                <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Weight Trend</p>
                <div style={{ height: 140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#4b5563', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip
                        contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12, fontSize: 11 }}
                        labelStyle={{ color: '#a855f7' }} itemStyle={{ color: '#fff' }} />
                      <Line type="monotone" dataKey="w" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                      {target && <Line type="monotone" dataKey={() => target} stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" dot={false} />}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {target && <p className="text-[10px] text-emerald-400/60 text-right">— Target: {target} kg</p>}
              </div>
            ) : (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Scale className="w-8 h-8 text-purple-300/30 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Log at least 2 weights to see your trend.</p>
              </div>
            )}

            {/* Log input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold">Log Today's Weight</p>
                {/* Unit toggle */}
                <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(168,85,247,0.2)' }}>
                  {['kg', 'lb'].map(u => (
                    <button key={u} onClick={() => setUnit(u)}
                      className="px-3 py-1 text-xs font-bold transition-all"
                      style={unit === u
                        ? { background: 'rgba(168,85,247,0.3)', color: '#c084fc' }
                        : { background: 'transparent', color: '#4b5563' }}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <NumberInput
                  value={newW}
                  onChange={setNewW}
                  placeholder={unit === 'kg' ? 'e.g. 74.5' : 'e.g. 164'}
                  unit={unit}
                />
                <motion.button whileTap={{ scale: 0.95 }} onClick={logWeight}
                  className="px-5 rounded-2xl font-bold text-white flex-shrink-0 flex items-center gap-1.5"
                  style={{
                    background: saved ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                    border: saved ? '1px solid rgba(16,185,129,0.4)' : 'none',
                    minWidth: 64,
                  }}>
                  {saved ? <Check className="w-4 h-4 text-green-400" /> : 'Log'}
                </motion.button>
              </div>

              <AnimatePresence>
                {saved && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-green-400 mt-2 font-semibold">
                    ✓ Weight saved successfully!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* History */}
            {weightLogs.length > 0 && (
              <div>
                <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-2">History</p>
                <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar">
                  {[...weightLogs].reverse().map(l => (
                    <div key={l.date} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <span className="text-xs text-gray-400">{l.date}</span>
                      <span className="text-sm font-bold text-white">{displayWeight(l.weight)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Body Measurements Tab ──────────────────────────── */}
        {tab === 'body' && (
          <motion.div key="body" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <p className="text-xs text-gray-500">Enter any measurements you want to track today. Leave blank to skip.</p>

            {MEASUREMENTS.map(m => {
              // Get last logged value for this measurement
              const lastLog = [...logs]
                .filter(l => l[m.key])
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-white">{m.label}</p>
                    {lastLog && (
                      <p className="text-[10px] text-gray-600">Last: {lastLog[m.key]} {m.unit}</p>
                    )}
                  </div>
                  <NumberInput
                    value={measurements[m.key] || ''}
                    onChange={val => setMeasurements(prev => ({ ...prev, [m.key]: val }))}
                    placeholder={`e.g. 85`}
                    unit={m.unit}
                  />
                </div>
              );
            })}

            <AnimatePresence>
              {measSaved && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl p-3 flex items-center gap-2"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <Check className="w-4 h-4 text-green-400" />
                  <p className="text-xs font-semibold text-green-400">Measurements saved!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileTap={{ scale: 0.97 }} onClick={logMeasurements}
              className="w-full py-4 rounded-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              Save Measurements
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}