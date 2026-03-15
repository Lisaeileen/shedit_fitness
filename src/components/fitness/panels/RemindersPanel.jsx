import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Droplets, Utensils, Dumbbell, Moon, Check } from 'lucide-react';

const STORE_KEY = 'shedit_reminders';

const DEFAULT_REMINDERS = [
  { id: 'breakfast', icon: Utensils, label: 'Log Breakfast', color: '#f59e0b', time: '08:00', enabled: false },
  { id: 'water',     icon: Droplets, label: 'Drink Water',   color: '#22d3ee', time: '10:00', enabled: false },
  { id: 'lunch',     icon: Utensils, label: 'Log Lunch',     color: '#a855f7', time: '12:30', enabled: false },
  { id: 'steps',     icon: Bell,     label: 'Check Steps',   color: '#c084fc', time: '17:00', enabled: false },
  { id: 'dinner',    icon: Utensils, label: 'Log Dinner',    color: '#ec4899', time: '18:30', enabled: false },
  { id: 'exercise',  icon: Dumbbell, label: 'Exercise Time', color: '#f59e0b', time: '07:00', enabled: false },
  { id: 'weighin',   icon: Bell,     label: 'Weigh In',      color: '#10b981', time: '07:30', enabled: false },
  { id: 'sleep',     icon: Moon,     label: 'Sleep Time',    color: '#6366f1', time: '22:00', enabled: false },
];

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || DEFAULT_REMINDERS; }
  catch { return DEFAULT_REMINDERS; }
}

export default function RemindersPanel() {
  const [reminders, setReminders] = useState(load);
  const [permGranted, setPermGranted] = useState(false);
  const [permChecked, setPermChecked] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermGranted(Notification.permission === 'granted');
      setPermChecked(true);
    }
  }, []);

  const saveAll = (updated) => {
    setReminders(updated);
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  };

  const toggle = (id) => {
    saveAll(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const setTime = (id, time) => {
    saveAll(reminders.map(r => r.id === id ? { ...r, time } : r));
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermGranted(result === 'granted');
    }
  };

  const testNotification = (r) => {
    if (permGranted) {
      new Notification(`Shedit Reminder`, { body: `Time to: ${r.label}`, icon: '/favicon.ico' });
    }
  };

  return (
    <div className="space-y-5">
      {permChecked && !permGranted && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="text-xs text-purple-300 font-semibold mb-2 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Enable Notifications
          </p>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">Allow notifications so Shedit can remind you to log meals, drink water, and exercise.</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={requestPermission}
            className="w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            Allow Notifications
          </motion.button>
        </div>
      )}

      {permGranted && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Check className="w-4 h-4 text-emerald-400" />
          <p className="text-xs text-emerald-400">Notifications enabled</p>
        </div>
      )}

      <p className="text-xs text-gray-500">Toggle reminders on/off and set your preferred times.</p>

      <div className="space-y-2">
        {reminders.map(r => (
          <motion.div key={r.id} whileTap={{ scale: 0.99 }}
            className="p-4 rounded-2xl transition-all"
            style={{ background: r.enabled ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${r.enabled ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${r.color}18` }}>
                <r.icon className="w-4 h-4" style={{ color: r.color }} />
              </div>
              <span className="text-sm font-semibold text-white flex-1">{r.label}</span>
              <button onClick={() => toggle(r.id)}
                className="w-12 h-6 rounded-full relative transition-all flex-shrink-0"
                style={{ background: r.enabled ? '#a855f7' : 'rgba(255,255,255,0.1)' }}>
                <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                  animate={{ left: r.enabled ? 26 : 2 }} transition={{ type: 'spring', damping: 18, stiffness: 300 }} />
              </button>
            </div>
            {r.enabled && (
              <div className="flex items-center gap-3">
                <input type="time" value={r.time} onChange={e => setTime(r.id, e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 12, padding: '9px 12px', color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: '#a855f7', outline: 'none', fontSize: 14, flex: 1, colorScheme: 'dark' }} />
                {permGranted && (
                  <button onClick={() => testNotification(r)}
                    className="px-3 py-2 rounded-xl text-xs text-purple-400 font-semibold flex-shrink-0"
                    style={{ background: 'rgba(168,85,247,0.12)' }}>
                    Test
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs text-gray-500 leading-relaxed">ℹ️ Notifications are handled by your browser or phone. Make sure Shedit notifications are allowed in your device settings for reminders to appear at the set times.</p>
      </div>
    </div>
  );
}