import React from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1a2e24] border border-white/10 rounded-xl px-3 py-2">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

export default function WeightSection({ logs = [], onLogWeight }) {
  const weightLogs = [...logs]
    .filter(l => l.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14);

  const currentWeight = weightLogs.at(-1)?.weight;
  const prevWeight = weightLogs.at(-2)?.weight;
  const diff = currentWeight && prevWeight ? currentWeight - prevWeight : 0;

  const TrendIcon = diff < 0 ? TrendingDown : diff > 0 ? TrendingUp : Minus;
  const trendColor = diff < 0 ? '#4ade80' : diff > 0 ? '#f43f5e' : '#6b7280';
  const trendLabel = diff < 0 ? `−${Math.abs(diff).toFixed(1)} kg` : diff > 0 ? `+${diff.toFixed(1)} kg` : '—';

  const chartData = weightLogs.map(l => ({
    date: format(new Date(l.date), 'MMM d'),
    weight: l.weight
  }));

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Scale className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Weight</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onLogWeight}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}
        >
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
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#4ade80"
                strokeWidth={2.5}
                dot={{ fill: '#4ade80', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#4ade80', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs text-gray-600 text-center py-4">
          Log weight on multiple days to see your trend
        </p>
      )}
    </div>
  );
}