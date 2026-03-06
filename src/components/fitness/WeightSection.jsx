import React from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

export default function WeightSection({ logs = [], onLogWeight }) {
  const weightLogs = logs
    .filter(l => l.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14);

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;
  const prevWeight = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2].weight : null;
  const diff = currentWeight && prevWeight ? currentWeight - prevWeight : 0;

  const TrendIcon = diff < 0 ? TrendingDown : diff > 0 ? TrendingUp : Minus;
  const trendColor = diff < 0 ? '#10b981' : diff > 0 ? '#f43f5e' : '#6b7280';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Weight</h3>
        </div>
        <button 
          onClick={onLogWeight}
          className="text-xs text-purple-400 font-medium hover:text-purple-300"
        >
          + Log Weight
        </button>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl font-bold text-white">
          {currentWeight ? `${currentWeight}` : '--'}
        </span>
        <span className="text-sm text-gray-500 mb-1">kg</span>
        {diff !== 0 && (
          <div className="flex items-center gap-1 mb-1 ml-auto">
            <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
            <span className="text-xs font-medium" style={{ color: trendColor }}>
              {Math.abs(diff).toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      {weightLogs.length > 1 && (
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightLogs.map(l => ({ weight: l.weight, date: l.date }))}>
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}