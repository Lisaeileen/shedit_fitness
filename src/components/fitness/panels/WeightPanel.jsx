import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyLogs, UserGoals } from '../../storage';

export default function WeightPanel({ onClose }) {
  const [newW, setNewW] = useState('');
  const [saved, setSaved] = useState(false);
  const [tick, setTick] = useState(0);

  const logs = useMemo(() => DailyLogs.list(), [tick]);
  const goals = UserGoals.get() || {};

  const weightLogs = useMemo(() =>
    [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30)
  , [logs]);

  const chartData = weightLogs.map(l => ({ date: l.date.slice(5), w: l.weight }));
  const current = weightLogs.at(-1)?.weight;
  const prev = weightLogs.at(-2)?.weight;
  const diff = current && prev ? (current - prev).toFixed(1) : null;
  const target = goals.target_weight;

  const logWeight = () => {
    const v = parseFloat(newW);
    if (!v || v < 20 || v > 400) return;
    const todayStr = new Date().toISOString().split('T')[0];
    DailyLogs.upsert(todayStr, { weight: v });
    setSaved(true);
    setNewW('');
    setTick(t => t + 1);
    setTimeout(() => setSaved(false), 2000);
  };

  const remaining = current && target ? Math.abs(current - target).toFixed(1) : null;
  const isLosing = current && target ? current > target : true;

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Current', value: current ? `${current} kg` : '—', color: '#a855f7' },
          { label: 'Target', value: target ? `${target} kg` : '—', color: '#10b981' },
          { label: 'To Go', value: remaining ? `${remaining} kg` : '—', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {diff && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: parseFloat(diff) <= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${parseFloat(diff) <= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}` }}>
          {parseFloat(diff) <= 0
            ? <TrendingDown className="w-4 h-4 text-emerald-400" />
            : <TrendingUp className="w-4 h-4 text-rose-400" />}
          <p className="text-xs text-gray-300">{parseFloat(diff) <= 0 ? `Down ${Math.abs(diff)} kg` : `Up ${diff} kg`} since last entry</p>
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
                <Tooltip contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12, fontSize: 11 }} labelStyle={{ color: '#a855f7' }} itemStyle={{ color: '#fff' }} />
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

      {/* Log new */}
      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-2">Log Today's Weight</p>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={newW}
            onChange={e => setNewW(e.target.value)}
            placeholder="e.g. 74.5"
            className="input-dark flex-1"
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: '#a855f7' }}
          />
          <motion.button whileTap={{ scale: 0.95 }} onClick={logWeight}
            className="px-5 rounded-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            {saved ? '✓' : 'Log'}
          </motion.button>
        </div>
      </div>

      {/* History */}
      {weightLogs.length > 0 && (
        <div>
          <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-2">History</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {[...weightLogs].reverse().map(l => (
              <div key={l.date} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-xs text-gray-400">{l.date}</span>
                <span className="text-sm font-bold text-white">{l.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}