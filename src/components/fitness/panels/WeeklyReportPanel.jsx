import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { TrendingDown, Footprints, Flame, Scale, Zap, Droplets, Dumbbell, Minus } from 'lucide-react';
import { DailyLogs, UserGoals } from '../../storage';
import { subDays, format } from 'date-fns';

const TooltipStyle = {
  contentStyle: { background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, fontSize: 11 },
  labelStyle: { color: '#a855f7' },
  itemStyle: { color: '#fff' },
};

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 rounded-full overflow-hidden w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function WeeklyReportPanel() {
  const logs   = useMemo(() => DailyLogs.list(), []);
  const goals  = useMemo(() => UserGoals.get() || {}, []);

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d   = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      const log = logs.find(l => l.date === d) || {};
      return {
        day:       format(subDays(new Date(), 6 - i), 'EEE'),
        date:      d,
        cals:      log.calories_consumed || 0,
        calsGoal:  log.calories_goal || 2000,
        steps:     log.steps || 0,
        protein:   log.protein || 0,
        proteinGoal: log.protein_goal || 120,
        water:     log.water_glasses || 0,
        exercise:  log.exercise_minutes || 0,
        weight:    log.weight || null,
      };
    });
  }, [logs]);

  const avgCals     = Math.round(last7.reduce((s, d) => s + d.cals, 0) / 7);
  const avgSteps    = Math.round(last7.reduce((s, d) => s + d.steps, 0) / 7);
  const avgProtein  = Math.round(last7.reduce((s, d) => s + d.protein, 0) / 7);
  const avgWater    = (last7.reduce((s, d) => s + d.water, 0) / 7).toFixed(1);
  const totalExer   = last7.reduce((s, d) => s + d.exercise, 0);
  const daysLogged  = last7.filter(d => d.cals > 0).length;

  // Protein consistency: days where protein hit >= 80% of goal
  const proteinGoal = goals.daily_protein_target || last7.find(d => d.proteinGoal)?.proteinGoal || 120;
  const proteinConsistency = last7.filter(d => d.protein >= proteinGoal * 0.8).length;

  const weightLogs    = last7.filter(d => d.weight);
  const weightChange  = weightLogs.length >= 2
    ? (weightLogs.at(-1).weight - weightLogs[0].weight).toFixed(1) : null;

  const stats = [
    { icon: Flame,      label: 'Avg Calories',   value: `${avgCals.toLocaleString()}`, unit: 'kcal/day', color: '#a855f7' },
    { icon: Footprints, label: 'Avg Steps',       value: avgSteps.toLocaleString(),    unit: 'steps/day', color: '#3b82f6' },
    { icon: Zap,        label: 'Protein/day',     value: `${avgProtein}g`,             unit: `${proteinConsistency}/7 days on target`, color: '#ec4899' },
    { icon: Dumbbell,   label: 'Active Min',      value: `${totalExer}`,               unit: 'this week', color: '#f59e0b' },
    { icon: Droplets,   label: 'Avg Water',       value: `${avgWater}`,                unit: 'glasses/day', color: '#22d3ee' },
    { icon: Scale,      label: 'Weight Change',   value: weightChange ? `${parseFloat(weightChange) > 0 ? '+' : ''}${weightChange} kg` : '—', unit: 'this week', color: parseFloat(weightChange) < 0 ? '#10b981' : '#f59e0b' },
  ];

  const insight = (() => {
    if (daysLogged < 3) return "You only logged data for " + daysLogged + " days. Consistency is key — try logging every day!";
    if (avgCals < 1200) return "Your average calorie intake is very low. Make sure you're eating enough to support your health.";
    if (avgCals > 2800) return "Your average calorie intake is above target. Try to aim for smaller portions at meals.";
    if (proteinConsistency < 3) return `You hit your protein goal only ${proteinConsistency}/7 days. Try adding a protein shake or Greek yogurt.`;
    if (avgSteps < 5000) return "Try to walk more — even 10-minute walks make a big difference.";
    return "You're doing great! Maintain this consistency for long-term results. 🎉";
  })();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Your last 7 days at a glance.</p>
        <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>
          {daysLogged}/7 days logged
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <s.icon className="w-4 h-4 mb-1.5" style={{ color: s.color }} />
            <p className="text-base font-black text-white">{s.value}</p>
            <p className="text-[9px] text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-[9px] mt-0.5" style={{ color: s.color }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Protein consistency bar */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-pink-400">Protein Consistency</p>
          <span className="text-xs font-black text-white">{proteinConsistency}/7 days</span>
        </div>
        <div className="flex gap-1">
          {last7.map((d, i) => {
            const hit = d.protein >= proteinGoal * 0.8;
            const partial = d.protein > 0 && !hit;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: hit ? 'rgba(236,72,153,0.3)' : partial ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.04)' }}>
                  {hit ? <Zap className="w-3.5 h-3.5 text-pink-400" /> : partial ? <Minus className="w-3.5 h-3.5 text-pink-300/40" /> : <span className="text-[9px] text-gray-700">—</span>}
                </div>
                <p className="text-[9px] text-gray-600">{d.day}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calories chart */}
      <div>
        <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-3">Calories This Week</p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...TooltipStyle} formatter={v => [`${v} kcal`, 'Calories']} />
              <Bar dataKey="cals" fill="rgba(168,85,247,0.6)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="calsGoal" fill="rgba(168,85,247,0.1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Steps chart */}
      <div>
        <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-3">Steps This Week</p>
        <div style={{ height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...TooltipStyle} formatter={v => [v.toLocaleString(), 'Steps']} />
              <Bar dataKey="steps" fill="rgba(59,130,246,0.6)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight trend */}
      {weightLogs.length >= 2 && (
        <div>
          <p className="text-[10px] text-purple-300/60 uppercase tracking-wider font-bold mb-3">Weight Trend</p>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs}>
                <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#4b5563', fontSize: 10 }} width={28} />
                <Tooltip {...TooltipStyle} formatter={v => [`${v} kg`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insight */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
        <p className="text-xs text-purple-300/80 font-semibold mb-1">Weekly Insight</p>
        <p className="text-xs text-gray-400 leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}