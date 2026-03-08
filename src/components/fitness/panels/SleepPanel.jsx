import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const STORE_KEY = 'shedit_sleep_logs';
function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; } }
function save(d) { localStorage.setItem(STORE_KEY, JSON.stringify(d)); }

function calcDuration(bed, wake) {
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return (mins / 60).toFixed(1);
}

export default function SleepPanel() {
  const [bedtime, setBedtime]   = useState('22:30');
  const [waketime, setWaketime] = useState('06:30');
  const [tick, setTick]         = useState(0);
  const [saved, setSaved]       = useState(false);

  const logs = useMemo(() => load(), [tick]);
  const last7 = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      const entry = logs.find(l => l.date === ds);
      return { day: ds.slice(5), hours: entry ? parseFloat(entry.hours) : 0 };
    });
  }, [logs]);

  const avg = logs.length ? (logs.reduce((s, l) => s + parseFloat(l.hours), 0) / logs.length).toFixed(1) : 0;
  const dur = calcDuration(bedtime, waketime);

  const logSleep = () => {
    const today = new Date().toISOString().split('T')[0];
    const all = load().filter(l => l.date !== today);
    all.push({ date: today, bedtime, waketime, hours: dur });
    if (all.length > 90) all.splice(0, all.length - 90);
    save(all);
    setSaved(true);
    setTick(t => t + 1);
    setTimeout(() => setSaved(false), 2000);
  };

  const quality = parseFloat(dur) >= 8 ? { label: 'Excellent', color: '#10b981' }
    : parseFloat(dur) >= 7 ? { label: 'Good', color: '#a855f7' }
    : parseFloat(dur) >= 6 ? { label: 'Fair', color: '#f59e0b' }
    : { label: 'Poor', color: '#f43f5e' };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-2xl font-black text-white">{dur}h</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tonight</p>
          <p className="text-xs font-semibold mt-1" style={{ color: quality.color }}>{quality.label}</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-2xl font-black text-purple-400">{avg}h</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Sleep</p>
          <p className="text-xs text-gray-500 mt-1">Last {logs.length} days</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Log Tonight's Sleep</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1"><Moon className="w-3 h-3" /> Bedtime</p>
            <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="input-dark w-full" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1"><Sun className="w-3 h-3" /> Wake Time</p>
            <input type="time" value={waketime} onChange={e => setWaketime(e.target.value)} className="input-dark w-full" />
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={logSleep}
          className="w-full py-4 rounded-2xl font-bold text-white mt-3 transition-all"
          style={{ background: saved ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg,#6366f1,#a855f7)', border: saved ? '1px solid rgba(16,185,129,0.5)' : 'none' }}>
          {saved ? '✓ Logged!' : 'Log Sleep'}
        </motion.button>
      </div>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Last 7 Nights</p>
        <div style={{ height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barSize={22}>
              <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 12]} hide />
              <Tooltip contentStyle={{ background: '#1A0835', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#a855f7' }} itemStyle={{ color: '#fff' }} formatter={v => [`${v}h`, 'Sleep']} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}
                fill="rgba(99,102,241,0.6)"
                background={{ fill: 'rgba(255,255,255,0.02)', radius: [6, 6, 0, 0] }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block"/>≥8h ideal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-400 inline-block"/>6-7h ok</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-400 inline-block"/>&lt;6h poor</span>
        </div>
      </div>

      {logs.length > 0 && (
        <div>
          <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-2">Recent</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {[...logs].reverse().slice(0, 10).map(l => (
              <div key={l.date} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-xs text-gray-400">{l.date}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{l.hours}h</span>
                  <span className="text-[10px] text-gray-600 ml-2">{l.bedtime} → {l.waketime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}