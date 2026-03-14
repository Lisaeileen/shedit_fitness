import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Flame, Footprints, ArrowUp, Moon, Dumbbell, Scale, TrendingDown } from 'lucide-react';
import { DailyLogs } from '../components/storage';
import ActivityRing from '../components/fitness/ActivityRing';

const METRICS = [
  { key: 'calories_consumed', label: 'Calories', icon: Flame,      color: '#a855f7', unit: 'kcal', chartType: 'bar'  },
  { key: 'steps',             label: 'Steps',    icon: Footprints,  color: '#c084fc', unit: '',     chartType: 'bar'  },
  { key: 'stairs_climbed',    label: 'Stairs',   icon: ArrowUp,     color: '#ec4899', unit: 'fl',   chartType: 'bar'  },
  { key: 'weight',            label: 'Weight',   icon: Scale,       color: '#10b981', unit: 'kg',   chartType: 'line' },
  { key: 'exercise_minutes',  label: 'Exercise', icon: Dumbbell,    color: '#f59e0b', unit: 'min',  chartType: 'bar'  },
  { key: 'sleep_hours',       label: 'Sleep',    icon: Moon,        color: '#6366f1', unit: 'hrs',  chartType: 'area' },
];

const VIEWS = [
  { key: 'W',  label: 'Week',  days: 7  },
  { key: 'M',  label: 'Month', days: 30 },
  { key: '3M', label: '3M',    days: 90 },
];

const CustomTooltip = ({ active, payload, label, color, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl"
      style={{ background: '#2A0A4A', border: '1px solid rgba(168,85,247,0.2)' }}>
      <p className="text-[10px] text-purple-300/60 mb-0.5">{label}</p>
      <p className="text-sm font-bold" style={{ color }}>
        {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}
        <span className="text-xs text-gray-500 ml-1 font-normal">{unit}</span>
      </p>
    </div>
  );
};

export default function Progress() {
  const [activeMetric, setActiveMetric] = useState(METRICS[0]);
  const [viewKey, setViewKey]           = useState('W');
  const [tick]                          = useState(0);

  const logs     = useMemo(() => DailyLogs.list(), [tick]);
  const todayLog = logs.find(l => l.date === format(new Date(), 'yyyy-MM-dd')) || {};
  const view     = VIEWS.find(v => v.key === viewKey);

  const chartData = useMemo(() => {
    const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.slice(-view.days).map(l => ({
      label: view.days <= 7 ? format(new Date(l.date), 'EEE') : format(new Date(l.date), 'MMM d'),
      value: l[activeMetric.key] || 0,
    }));
  }, [logs, activeMetric.key, view.days]);

  const values  = chartData.map(d => d.value).filter(v => v > 0);
  const avg     = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const peak    = values.length ? Math.max(...values) : 0;

  const streak = useMemo(() => {
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let s = 0;
    for (const l of sorted) { if ((l.calories_consumed || 0) > 0) s++; else break; }
    return s;
  }, [logs]);

  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const lostKg = weightLogs.length >= 2
    ? Math.max(weightLogs[0].weight - weightLogs.at(-1).weight, 0) : 0;

  return (
    <div className="px-4 pt-2">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 pt-2">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Analytics</p>
        <h1 className="text-2xl font-black text-white">Progress</h1>
      </motion.div>

      {/* Steps Ring Hero */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }} className="rounded-3xl p-5 mb-5 flex flex-col items-center"
        style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.08) 100%)', border: '1px solid rgba(168,85,247,0.25)' }}>
        <p className="text-[10px] text-purple-300/50 uppercase tracking-widest font-bold mb-4">Today's Steps</p>
        <ActivityRing
          value={todayLog.steps || 0}
          max={todayLog.steps_goal || 10000}
          size={160} strokeWidth={14}
          color="#a855f7" trackColor="rgba(168,85,247,0.08)"
          glowIntensity={2}
        >
          <span className="text-[10px] text-gray-500 mb-0.5">steps</span>
          <span className="text-[30px] font-black text-white leading-none">
            {(todayLog.steps || 0) >= 1000
              ? `${((todayLog.steps || 0) / 1000).toFixed(1)}k`
              : (todayLog.steps || 0)}
          </span>
          <span className="text-[9px] text-gray-600 mt-1">
            of {((todayLog.steps_goal || 10000) / 1000).toFixed(0)}k goal
          </span>
        </ActivityRing>
        <div className="flex gap-6 mt-5">
          <div className="text-center">
            <p className="text-xl font-black text-white">{(todayLog.steps || 0).toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Current</p>
          </div>
          <div className="w-px bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-xl font-black" style={{ color: '#a855f7' }}>{(todayLog.steps_goal || 10000).toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Goal</p>
          </div>
          <div className="w-px bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-xl font-black text-white">{Math.round(Math.min(((todayLog.steps || 0) / (todayLog.steps_goal || 10000)) * 100, 100))}%</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Done</p>
          </div>
        </div>
      </motion.div>

      {/* Progress banner */}
      {lostKg > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(168,85,247,0.12)' }}>🔥</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Great progress!</p>
            <p className="text-xs text-gray-500 mt-0.5">Lost <span className="text-purple-400 font-bold">{lostKg.toFixed(1)} kg</span> since you started</p>
          </div>
          {streak > 0 && <div className="text-center">
            <p className="text-xl font-black text-orange-400">{streak}</p>
            <p className="text-[10px] text-gray-500">day streak</p>
          </div>}
        </motion.div>
      )}

      {/* Metric selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-4 px-4">
        {METRICS.map((m) => (
          <motion.button key={m.key} whileTap={{ scale: 0.92 }} onClick={() => setActiveMetric(m)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={activeMetric.key === m.key
              ? { background: `${m.color}22`, color: m.color, border: `1px solid ${m.color}35` }
              : { background: 'rgba(255,255,255,0.04)', color: '#4b5563', border: '1px solid transparent' }}>
            <m.icon className="w-3.5 h-3.5" />{m.label}
          </motion.button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1.5 p-1 rounded-xl mb-4 w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {VIEWS.map(v => (
          <button key={v.key} onClick={() => setViewKey(v.key)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={viewKey === v.key ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc' } : { color: '#4b5563' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        <motion.div key={`${activeMetric.key}-${viewKey}`}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }} className="rounded-2xl p-5 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-black text-white">{activeMetric.label}</h3>
              <p className="text-[10px] text-gray-500">{view.label} overview</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: activeMetric.color }}>{avg.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">avg {activeMetric.unit}</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric.chartType === 'line' || activeMetric.chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ left: -20, right: 5 }}>
                  <defs>
                    <linearGradient id={`grad-${activeMetric.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeMetric.color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={activeMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fill: '#374151', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#374151', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip content={<CustomTooltip color={activeMetric.color} unit={activeMetric.unit} />} />
                  <Area type="monotone" dataKey="value" stroke={activeMetric.color} strokeWidth={3}
                    fill={`url(#grad-${activeMetric.key})`}
                    dot={false}
                    activeDot={{ r: 5, fill: activeMetric.color, strokeWidth: 0 }}
                    style={{ filter: `drop-shadow(0 0 6px ${activeMetric.color}80)` }} />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ left: -20, right: 5 }} barCategoryGap="35%">
                  <XAxis dataKey="label" tick={{ fill: '#374151', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#374151', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip color={activeMetric.color} unit={activeMetric.unit} />} />
                  <Bar dataKey="value" radius={[6, 6, 2, 2]}
                    fill={activeMetric.color} fillOpacity={0.9}
                    style={{ filter: `drop-shadow(0 0 6px ${activeMetric.color}60)` }} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Transformation Timeline */}
      {weightLogs.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }} className="rounded-2xl p-5 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <p className="text-sm font-black text-white">Transformation Timeline</p>
          </div>
          <div className="space-y-3">
            {weightLogs.slice(-5).map((l, i, arr) => {
              const prev = arr[i - 1];
              const diff = prev ? +(prev.weight - l.weight).toFixed(1) : 0;
              return (
                <div key={l.date} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: diff > 0 ? '#10b981' : diff < 0 ? '#f43f5e' : '#a855f7' }} />
                    {i < arr.length - 1 && <div className="w-px flex-1 mt-1" style={{ height: 28, background: 'rgba(255,255,255,0.08)' }} />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{format(new Date(l.date), 'MMM d, yyyy')}</p>
                      <div className="flex items-center gap-2">
                        {diff > 0 && <span className="text-[10px] font-bold text-green-400">-{diff} kg 🔥</span>}
                        {diff < 0 && <span className="text-[10px] font-bold text-red-400">+{Math.abs(diff)} kg</span>}
                        <p className="text-sm font-black text-white">{l.weight} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {lostKg > 0 && (
            <div className="rounded-xl p-3 mt-2"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-xs font-bold text-green-400">🏆 Total lost: {lostKg.toFixed(1)} kg since you started!</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[
          { label: 'Average', value: avg.toLocaleString(),  unit: activeMetric.unit, color: activeMetric.color },
          { label: 'Peak',    value: peak.toLocaleString(), unit: activeMetric.unit, color: '#f59e0b' },
          { label: 'Entries', value: values.length,         unit: 'days',            color: '#22d3ee' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-3.5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-600">{s.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}