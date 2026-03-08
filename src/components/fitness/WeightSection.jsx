import React from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="rounded-xl px-3 py-2" style={{ background: '#2A0A4A', border: '1px solid rgba(168,85,247,0.2)' }}>
      <p className="text-xs text-purple-300/60">{label}</p>
      <p className="text-sm font-bold text-white">{payload[0].value} kg</p>
    </div>
  );
  return null;
};

export default function WeightSection({ logs = [], onLogWeight }) {
  const weightLogs = [...logs]
    .filter(l => l.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14);

  const currentWeight = weightLogs.at(-1)?.weight;
  const prevWeight    = weightLogs.at(-2)?.weight;
  const diff          = currentWeight && prevWeight ? +(currentWeight - prevWeight).toFixed(1) : 0;

  const TrendIcon  = diff < 0 ? TrendingDown : diff > 0 ? TrendingUp : Minus;
  const trendColor = diff < 0 ? '#4ade80' : diff > 0 ? '#f43f5e' : '#6b7280';
  const trendLabel = diff < 0 ? `−${Math.abs(diff)} kg` : diff > 0 ? `+${diff} kg` : '—';

  const chartData = weightLogs.map(l => ({ date: format(new Date(l.date), 'MMM d'), weight: l.weight }));

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.15)' }}>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Weight</h3>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={onLogWeight}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc' }}>
          + Log
        </motion.button>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-4xl font-black text-white">
            {currentWeight ? currentWeight.toFixed(1) : '—'}
            <span className="text-lg text-gray-500 font-medium ml-1">kg</span>
          </p>
        </div>
        {diff !== 0 && (
          <div className="flex items-center gap-1 mb-1.5 ml-auto">
            <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
            <span className="text-sm font-bold" style={{ color: trendColor }}>{trendLabel}</span>
          </div>
        )}
      </div>

      {chartData.length > 1 ? (
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
              <XAxis dataKey="date" hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={2.5}
                dot={{ fill: '#a855f7', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#a855f7', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs text-gray-600 text-center py-4">Log weight on multiple days to see your trend</p>
      )}
    </div>
  );
}