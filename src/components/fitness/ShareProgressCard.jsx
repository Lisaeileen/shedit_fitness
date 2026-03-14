import React, { useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import { DailyLogs } from '../storage';
import { format } from 'date-fns';

function calcStreak(logs) {
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let s = 0;
  for (const l of sorted) { if ((l.calories_consumed || 0) > 0) s++; else break; }
  return s;
}

export default function ShareProgressCard({ onClose }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const logs = useMemo(() => DailyLogs.list(), []);

  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const kgLost = weightLogs.length >= 2 ? Math.max(weightLogs[0].weight - weightLogs.at(-1).weight, 0) : 0;
  const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
  const avgSteps = logs.length ? Math.round(totalSteps / logs.length) : 0;
  const streak = calcStreak(logs);
  const totalMealsLogged = logs.filter(l => (l.calories_consumed || 0) > 0).length;
  const avgCals = logs.length
    ? Math.round(logs.filter(l => l.calories_consumed > 0).reduce((s, l) => s + l.calories_consumed, 0) / Math.max(totalMealsLogged, 1))
    : 0;

  const handleDownload = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
    const link = document.createElement('a');
    link.download = `shedit-progress-${format(new Date(), 'yyyy-MM-dd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const text = `🔥 My Shedit Progress Update!\n\n⚖️ ${kgLost.toFixed(1)}kg lost\n👟 ${avgSteps.toLocaleString()} avg steps/day\n🔥 ${streak} day streak\n📅 ${totalMealsLogged} days logged\n\nTracking my health journey with Shedit 💪`;
    if (navigator.share) {
      navigator.share({ title: 'My Shedit Progress', text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = [
    { emoji: '⚖️', label: 'KG Lost',     value: `${kgLost.toFixed(1)} kg` },
    { emoji: '👟', label: 'Avg Steps',   value: avgSteps.toLocaleString() },
    { emoji: '🔥', label: 'Day Streak',  value: `${streak} days` },
    { emoji: '📅', label: 'Days Logged', value: totalMealsLogged },
    { emoji: '🍽️', label: 'Avg Calories',value: `${avgCals} kcal` },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl pt-5 pb-10 border-t"
        style={{ background: '#1A0835', borderColor: 'rgba(168,85,247,0.2)' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
        <div className="px-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-white">Share Progress</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* The card to export */}
          <div ref={cardRef} className="rounded-3xl p-6 mb-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #1e0a40, #2d0a5a, #1a0835)' }}>
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #a855f7, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', transform: 'translate(-30%, 30%)' }} />

            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <span className="text-white text-sm font-black">S</span>
              </div>
              <div>
                <p className="text-white font-black text-sm">Shedit</p>
                <p className="text-purple-300/50 text-[10px]">Progress Update · {format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl p-3.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
                  <p className="text-lg mb-0.5">{s.emoji}</p>
                  <p className="text-white font-black text-lg leading-none">{s.value}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
              <div className="rounded-2xl p-3.5 col-span-1"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
                <p className="text-lg mb-0.5">💪</p>
                <p className="text-purple-300 font-black text-sm leading-tight">Keep going!</p>
                <p className="text-gray-500 text-[10px] mt-0.5">sheditapp.com</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white"
              style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <Download className="w-4 h-4" /> Save Image
            </button>
            <button onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}