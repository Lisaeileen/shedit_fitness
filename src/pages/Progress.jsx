import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Flame, Footprints, ArrowUp, Moon, Dumbbell, Scale, Award } from 'lucide-react';
import { DailyLogs } from '../components/storage';
import MultiRing from '../components/fitness/MultiRing';

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

      {/* Activity Rings */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }} className="glass-card-purple rounded-3xl p-5 flex items-center gap-5 mb-5">
        <MultiRing size={140} strokeWidth={9} gap={5} rings={[
          { value: todayLog.steps || 0,            max: todayLog.steps_goal    || 10000, color: '#a855f7' },
          { value: todayLog.exercise_minutes || 0, max: todayLog.exercise_goal || 30,    color: '#ec4899' },
          { value: todayLog.stairs_climbed || 0,   max: todayLog.stairs_goal   || 20,    color: '#c084fc' },
        ]}>
          <Award className="w-5 h-5 text-yellow-400" />
        </MultiRing>
        <div className="flex-1 space-y-2.5">
          {[
            { label: 'Steps',    val: `${(todayLog.steps || 0).toLocaleString()}`,   color: '#a855f7', goal: todayLog.steps_goal    || 10000, curr: todayLog.steps || 0 },
            { label: 'Exercise', val: `${todayLog.exercise_minutes || 0} min`,        color: '#ec4899', goal: todayLog.exercise_goal || 30,    curr: todayLog.exercise_minutes || 0 },
            { label: 'Stairs',   val: `${todayLog.stairs_climbed || 0} flights`,      color: '#c084fc', goal: todayLog.stairs_goal   || 20,    curr: todayLog.stairs_climbed || 0 },
          ].map(r => (
            <div key={r.label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-gray-500">{r.label}</span>
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.val}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden bg-white/[0.06]">
                <motion.div initial={{ width: 0 }}
                  animate={{ width: `${Math.min((r.curr / r.goal) * 100, 100)}%` }}
                  transition={{ duration: 1.2 }} className="h-full rounded-full"
                  style={{ background: r.color, boxShadow: `0 0 6px ${r.color}50` }} />
              </div>
            </div>
          ))}
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
          transition={{ duration: 0.25 }} className="glass-card rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${activeMetric.color}18` }}>
                <activeMetric.icon className="w-4 h-4" style={{ color: activeMetric.color }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{activeMetric.label}</h3>
                <p className="text-[10px] text-gray-500">{view.label} view</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">avg</p>
              <p className="text-sm font-bold" style={{ color: activeMetric.color }}>
                {avg.toLocaleString()} <span className="text-gray-500 text-xs font-normal">{activeMetric.unit}</span>
              </p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric.chartType === 'line' ? (
                <LineChart data={chartData} margin={{ left: -10, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip content={<CustomTooltip color={activeMetric.color} unit={activeMetric.unit} />} />
                  <Line type="monotone" dataKey="value" stroke={activeMetric.color} strokeWidth={2.5}
                    dot={{ fill: activeMetric.color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: activeMetric.color, strokeWidth: 2, stroke: 'rgba(255,255,255,0.2)' }} />
                </LineChart>
              ) : activeMetric.chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ left: -10, right: 5 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip color={activeMetric.color} unit={activeMetric.unit} />} />
                  <Area type="monotone" dataKey="value" stroke={activeMetric.color} strokeWidth={2} fill="url(#ag)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ left: -10, right: 5 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip color={activeMetric.color} unit={activeMetric.unit} />} />
                  <Bar dataKey="value" radius={[6, 6, 2, 2]} fill={activeMetric.color} fillOpacity={0.85}
                    style={{ filter: `drop-shadow(0 0 4px ${activeMetric.color}40)` }} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </AnimatePresence>

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