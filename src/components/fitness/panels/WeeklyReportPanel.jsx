import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { TrendingDown, Footprints, Flame, Scale } from 'lucide-react';
import { DailyLogs } from '../../storage';
import { subDays, format } from 'date-fns';

export default function WeeklyReportPanel() {
  const logs = useMemo(() => DailyLogs.list(), []);

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      const log = logs.find(l => l.date === d) || {};
      return {
        day: format(subDays(new Date(), 6 - i), 'EEE'),
        date: d,
        cals: log.calories_consumed || 0,
        steps: log.steps || 0,
        weight: log.weight || null,
        exercise: log.exercise_minutes || 0,
      };
    });
  }, [logs]);

  const avgCals   = Math.round(last7.reduce((s, d) => s + d.cals, 0) / 7);
  const avgSteps  = Math.round(last7.reduce((s, d) => s + d.steps, 0) / 7);
  const totalExer = last7.reduce((s, d) => s + d.exercise, 0);
  const weightLogs = last7.filter(d => d.weight);
  const weightChange = weightLogs.length >= 2 ? (weightLogs.at(-1).weight - weightLogs[0].weight).toFixed(1) : null;

  const stats = [
    { icon: Flame,      label: 'Avg Calories',   value: `${avgCals.toLocaleString()} kcal`, color: '#a855f7' },
    { icon: Footprints, label: 'Avg Steps',       value: `${avgSteps.toLocaleString()}`,     color: '#3b82f6' },
    { icon: Flame,      label: 'Active Minutes',  value: `${totalExer} min`,                 color: '#ec4899' },
    { icon: Scale,      label: 'Weight Change',   value: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : '—', color: parseFloat(weightChange) < 0 ? '#10b981' : '#f59e0b' },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500">Your last 7 days at a glance.</p>

      <div className="grid grid-cols-2 gap-2">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <p className="text-base font-black text-white">{s.value}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Calories This Week</p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#a855f7' }} itemStyle={{ color: '#fff' }} formatter={v => [`${v} kcal`, 'Calories']} />
              <Bar dataKey="cals" fill="rgba(168,85,247,0.6)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Steps This Week</p>
        <div style={{ height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#3b82f6' }} itemStyle={{ color: '#fff' }} formatter={v => [`${v.toLocaleString()}`, 'Steps']} />
              <Bar dataKey="steps" fill="rgba(59,130,246,0.6)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {weightLogs.length >= 2 && (
        <div>
          <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Weight Trend</p>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs}>
                <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#4b5563', fontSize: 10 }} width={28} />
                <Tooltip contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#a855f7' }} itemStyle={{ color: '#fff' }} formatter={v => [`${v} kg`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
        <p className="text-xs text-purple-300/80 font-semibold mb-1">💡 Insight</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          {avgCals < 1200
            ? 'Your average calorie intake is very low. Make sure you\'re eating enough to support your health.'
            : avgCals > 2800
              ? 'Your average calorie intake is above target. Try to aim for smaller portions at meals.'
              : avgSteps < 5000
                ? 'Try to walk more — even 10-minute walks make a big difference for weight loss.'
                : 'You\'re doing great! Keep maintaining your consistency this week.'}
        </p>
      </div>
    </div>
  );
}