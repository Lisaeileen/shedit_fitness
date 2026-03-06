import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, Footprints, ArrowUpDown, Moon, Dumbbell, Scale } from 'lucide-react';
import MultiRing from '../components/fitness/MultiRing';

const METRICS = [
  { key: 'calories_consumed', label: 'Calories', icon: Flame, color: '#a855f7', unit: 'kcal' },
  { key: 'steps', label: 'Steps', icon: Footprints, color: '#3b82f6', unit: '' },
  { key: 'stairs_climbed', label: 'Stairs', icon: ArrowUpDown, color: '#ec4899', unit: 'flights' },
  { key: 'weight', label: 'Weight', icon: Scale, color: '#10b981', unit: 'kg' },
  { key: 'exercise_minutes', label: 'Exercise', icon: Dumbbell, color: '#f59e0b', unit: 'min' },
  { key: 'sleep_hours', label: 'Sleep', icon: Moon, color: '#6366f1', unit: 'hrs' },
];

const VIEWS = ['daily', 'weekly', 'monthly'];

export default function Progress() {
  const [selectedMetric, setSelectedMetric] = useState('calories_consumed');
  const [view, setView] = useState('weekly');

  const { data: logs = [] } = useQuery({
    queryKey: ['progressLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 90),
  });

  const metric = METRICS.find(m => m.key === selectedMetric);

  const chartData = useMemo(() => {
    const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (view === 'daily') {
      return sorted.slice(-7).map(l => ({
        label: format(new Date(l.date), 'EEE'),
        value: l[selectedMetric] || 0,
      }));
    }
    
    if (view === 'weekly') {
      return sorted.slice(-14).map(l => ({
        label: format(new Date(l.date), 'MMM d'),
        value: l[selectedMetric] || 0,
      }));
    }

    return sorted.slice(-30).map(l => ({
      label: format(new Date(l.date), 'd'),
      value: l[selectedMetric] || 0,
    }));
  }, [logs, selectedMetric, view]);

  const todayLog = logs.find(l => l.date === format(new Date(), 'yyyy-MM-dd')) || {};

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track your fitness journey</p>
      </motion.div>

      {/* Activity Rings */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-6 flex items-center justify-center gap-6 mb-6"
      >
        <MultiRing
          size={150}
          strokeWidth={10}
          rings={[
            { value: todayLog.steps || 0, max: todayLog.steps_goal || 10000, color: '#3b82f6' },
            { value: todayLog.exercise_minutes || 0, max: todayLog.exercise_goal || 30, color: '#ec4899' },
            { value: todayLog.stairs_climbed || 0, max: todayLog.stairs_goal || 20, color: '#a855f7' },
          ]}
        >
          <Footprints className="w-5 h-5 text-blue-400" />
        </MultiRing>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <div>
              <p className="text-xs text-gray-400">Steps</p>
              <p className="text-sm font-bold text-white">{(todayLog.steps || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <div>
              <p className="text-xs text-gray-400">Exercise</p>
              <p className="text-sm font-bold text-white">{todayLog.exercise_minutes || 0} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <div>
              <p className="text-xs text-gray-400">Stairs</p>
              <p className="text-sm font-bold text-white">{todayLog.stairs_climbed || 0} flights</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelectedMetric(m.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${selectedMetric === m.key 
                ? 'text-white' 
                : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'
              }`}
            style={selectedMetric === m.key ? { background: `${m.color}30`, color: m.color } : {}}
          >
            <m.icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-4 w-fit">
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
              ${view === v ? 'bg-white/[0.1] text-white' : 'text-gray-500'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div 
        key={`${selectedMetric}-${view}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
            {metric.label}
          </h3>
          <span className="text-xs text-gray-500">{metric.unit}</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'weight' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="value" fill={metric.color} radius={[6, 6, 0, 0]} opacity={0.8} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}