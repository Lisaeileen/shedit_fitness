import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Timer } from 'lucide-react';

const PROTOCOLS = [
  { id: '16_8', label: '16:8', fasting: 16, eating: 8, desc: 'Most popular — fast 16h, eat in 8h window' },
  { id: '18_6', label: '18:6', fasting: 18, eating: 6, desc: 'Intermediate — fast 18h, eat in 6h window' },
  { id: '20_4', label: '20:4', fasting: 20, eating: 4, desc: 'Advanced — fast 20h, eat in 4h window' },
  { id: 'custom', label: 'Custom', fasting: 0, eating: 0, desc: 'Set your own fasting window' },
];

const STORE_KEY = 'shedit_fasting';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch { return null; }
}
function saveState(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

function fmt(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function FastingPanel() {
  const [protocol, setProtocol] = useState('16_8');
  const [customH, setCustomH]   = useState('14');
  const [state, setState]       = useState(() => loadState() || { active: false, startTs: null, protocol: '16_8', customH: 14 });
  const [now, setNow]           = useState(Date.now());

  useEffect(() => {
    if (!state.active) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [state.active]);

  const proto = PROTOCOLS.find(p => p.id === (state.protocol || protocol));
  const fastHours = state.protocol === 'custom' ? (state.customH || 14) : (proto?.fasting || 16);
  const fastSecs = fastHours * 3600;
  const elapsed = state.active ? Math.floor((now - state.startTs) / 1000) : 0;
  const remaining = Math.max(fastSecs - elapsed, 0);
  const pct = state.active ? Math.min(elapsed / fastSecs, 1) : 0;
  const done = elapsed >= fastSecs;

  const start = () => {
    const s = { active: true, startTs: Date.now(), protocol, customH: parseInt(customH) };
    setState(s);
    saveState(s);
  };

  const stop = () => {
    const s = { active: false, startTs: null, protocol, customH: parseInt(customH) };
    setState(s);
    saveState(s);
  };

  const history = useMemo(() => {
    try {
      const h = JSON.parse(localStorage.getItem('shedit_fasting_history') || '[]');
      return h.slice(-7);
    } catch { return []; }
  }, [state.active]);

  useEffect(() => {
    if (done && state.active) {
      const h = JSON.parse(localStorage.getItem('shedit_fasting_history') || '[]');
      h.push({ date: new Date().toISOString().split('T')[0], hours: fastHours, protocol: state.protocol });
      localStorage.setItem('shedit_fasting_history', JSON.stringify(h));
      stop();
    }
  }, [done]);

  const circum = 2 * Math.PI * 52;

  return (
    <div className="space-y-5">
      {!state.active ? (
        <>
          <p className="text-xs text-gray-500">Choose your fasting protocol and start your fast.</p>
          <div className="space-y-2">
            {PROTOCOLS.map(p => (
              <motion.button key={p.id} whileTap={{ scale: 0.98 }} onClick={() => setProtocol(p.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left"
                style={{ background: protocol === p.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${protocol === p.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ background: protocol === p.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', color: '#c084fc' }}>
                  {p.label}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{p.label} Protocol</p>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {protocol === 'custom' && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Fasting hours</p>
              <input type="number" value={customH} onChange={e => setCustomH(e.target.value)}
                min="8" max="23" className="input-dark w-full text-center text-2xl font-black" />
            </div>
          )}

          <motion.button whileTap={{ scale: 0.96 }} onClick={start}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            <Play className="w-4 h-4 fill-white" /> Start Fast
          </motion.button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90">
              <circle cx="72" cy="72" r="52" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="10" />
              <motion.circle cx="72" cy="72" r="52" fill="none"
                stroke={done ? '#10b981' : '#a855f7'} strokeWidth="10"
                strokeDasharray={circum} strokeDashoffset={circum * (1 - pct)}
                strokeLinecap="round" transition={{ duration: 1 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-white">{done ? '🎉' : fmt(remaining)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{done ? 'Fast complete!' : 'remaining'}</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-base font-black text-purple-400">{fmt(elapsed)}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Elapsed</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-base font-black text-emerald-400">{fastHours}h</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Goal</p>
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.96 }} onClick={stop}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171' }}>
            <Square className="w-4 h-4" /> End Fast
          </motion.button>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-2">Recent Fasts</p>
          <div className="space-y-1.5">
            {[...history].reverse().map((h, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-xs text-gray-400">{h.date}</span>
                <span className="text-sm font-bold text-emerald-400">{h.hours}h ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}