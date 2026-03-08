import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Save } from 'lucide-react';
import { UserGoals, DailyLogs } from '../../storage';

export default function GoalsPanel({ onClose }) {
  const saved = UserGoals.get() || {};
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = DailyLogs.getByDate(todayStr) || {};

  const [goal, setGoal]         = useState(saved.primary_goal || 'lose_weight');
  const [targetW, setTargetW]   = useState(saved.target_weight || '70');
  const [currentW, setCurrentW] = useState(saved.current_weight || '');
  const [weeklyLoss, setWeekly] = useState(saved.weekly_target || '0.5');
  const [calTarget, setCal]     = useState(todayLog.calories_goal || saved.daily_calorie_target || '2000');
  const [saved_, setSaved_]     = useState(false);

  const GOALS = [
    { id: 'lose_weight', label: '🏃 Lose Weight', desc: 'Burn fat, look and feel better' },
    { id: 'maintain', label: '⚖️ Maintain Weight', desc: 'Stay at your current weight' },
    { id: 'gain_muscle', label: '💪 Gain Muscle', desc: 'Build strength and size' },
  ];

  const save = () => {
    UserGoals.save({ ...saved, primary_goal: goal, target_weight: parseFloat(targetW), current_weight: parseFloat(currentW) || parseFloat(targetW), weekly_target: parseFloat(weeklyLoss), daily_calorie_target: parseInt(calTarget) });
    DailyLogs.upsert(todayStr, { calories_goal: parseInt(calTarget) });
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 mb-4">Set your fitness goals to get personalized recommendations.</p>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Primary Goal</p>
        <div className="space-y-2">
          {GOALS.map(g => (
            <motion.button key={g.id} whileTap={{ scale: 0.98 }} onClick={() => setGoal(g.id)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
              style={{ background: goal === g.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${goal === g.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
              <span className="text-xl">{g.label.split(' ')[0]}</span>
              <div>
                <p className="text-sm font-semibold text-white">{g.label.slice(g.label.indexOf(' ') + 1)}</p>
                <p className="text-xs text-gray-500">{g.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-3">Weight Targets</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Current Weight (kg)', val: currentW, set: setCurrentW, placeholder: '80' },
            { label: 'Target Weight (kg)', val: targetW, set: setTargetW, placeholder: '70' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-500 mb-1.5">{f.label}</p>
              <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                className="input-dark w-full text-center text-lg font-bold" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Weekly Goal (kg/week)</p>
        <div className="flex gap-2">
          {['0.25', '0.5', '0.75', '1.0'].map(v => (
            <button key={v} onClick={() => setWeekly(v)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: weeklyLoss === v ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${weeklyLoss === v ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.07)'}`, color: weeklyLoss === v ? '#c084fc' : '#6b7280' }}>
              {v} kg
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Daily Calorie Target (kcal)</p>
        <input type="number" value={calTarget} onChange={e => setCal(e.target.value)}
          className="input-dark w-full text-center text-lg font-bold" />
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={save}
        className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all"
        style={{ background: saved_ ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg,#7c3aed,#a855f7)', border: saved_ ? '1px solid rgba(16,185,129,0.5)' : 'none' }}>
        <Save className="w-4 h-4" />
        {saved_ ? '✓ Saved!' : 'Save Goals'}
      </motion.button>
    </div>
  );
}