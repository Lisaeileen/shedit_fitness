import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  User, Scale, Timer, Moon, Dumbbell, Target, Ruler,
  FileText, Bell, Footprints, Shield, HelpCircle,
  RefreshCw, Settings, ChevronRight, LogOut, TrendingDown,
  Zap, X, Check, ExternalLink, Trash2
} from 'lucide-react';
import LogValueDialog from '../components/fitness/LogValueDialog';

export default function More() {
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState(null);
  const [stepsGoalDialog, setStepsGoalDialog] = useState(false);
  const [calsGoalDialog, setCalsGoalDialog] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['allLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 90),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['userGoals'],
    queryFn: () => base44.entities.UserGoals.list(),
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const { data: todayLogs = [] } = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 30),
  });

  const todayLog = todayLogs.find(l => l.date === todayStr) || {};

  const upsertLog = useMutation({
    mutationFn: async (data) => {
      if (todayLog.id) return base44.entities.DailyLog.update(todayLog.id, data);
      return base44.entities.DailyLog.create({ date: todayStr, ...data });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dailyLogs'] }),
  });

  // Computed stats
  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstW  = weightLogs[0]?.weight;
  const lastW   = weightLogs.at(-1)?.weight;
  const kgLost  = firstW && lastW ? Math.max(firstW - lastW, 0).toFixed(1) : '0.0';
  const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
  const streak = (() => {
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let s = 0;
    for (const l of sorted) {
      if ((l.calories_consumed || 0) > 0) s++;
      else break;
    }
    return s;
  })();

  const userGoal = goals[0];

  const menuSections = [
    {
      title: 'Health Tracking',
      items: [
        { id: 'steps_settings', label: 'Steps Goal',       icon: Footprints, color: '#4ade80',  action: () => setStepsGoalDialog(true) },
        { id: 'calories_goal',  label: 'Calorie Target',   icon: Zap,         color: '#a855f7',  action: () => setCalsGoalDialog(true) },
        { id: 'weight',         label: 'Weight & Measures',icon: Scale,        color: '#10b981',  action: () => setActivePanel('weight') },
        { id: 'sleep',          label: 'Sleep Tracking',   icon: Moon,         color: '#6366f1',  action: () => setActivePanel('sleep') },
        { id: 'fasting',        label: 'Intermittent Fasting', icon: Timer,   color: '#f59e0b',  action: () => setActivePanel('fasting') },
        { id: 'workout',        label: 'Workout Routine',  icon: Dumbbell,    color: '#ec4899',  action: () => setActivePanel('workout') },
      ]
    },
    {
      title: 'Goals & Reports',
      items: [
        { id: 'goals',   label: 'My Goals',       icon: Target,   color: '#3b82f6', action: () => setActivePanel('goals') },
        { id: 'report',  label: 'Weekly Report',  icon: FileText, color: '#a855f7', action: () => setActivePanel('report') },
        { id: 'kglost',  label: 'KG Lost',        icon: TrendingDown, color: '#4ade80', action: () => setActivePanel('kglost') },
      ]
    },
    {
      title: 'Settings & Privacy',
      items: [
        { id: 'reminders', label: 'Reminders',    icon: Bell,        color: '#f59e0b', action: () => setActivePanel('reminders') },
        { id: 'privacy',   label: 'Privacy Policy',icon: Shield,     color: '#6b7280', action: () => setActivePanel('privacy') },
        { id: 'terms',     label: 'Terms of Service',icon: FileText, color: '#6b7280', action: () => setActivePanel('terms') },
        { id: 'help',      label: 'Help Center',   icon: HelpCircle, color: '#6366f1', action: () => setActivePanel('help') },
        { id: 'data',      label: 'Delete My Data', icon: Trash2,    color: '#f43f5e', action: () => setActivePanel('delete') },
      ]
    }
  ];

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="pt-2 mb-5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Account</p>
        <h1 className="text-2xl font-black text-white">More</h1>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-green rounded-3xl p-5 mb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4ade80, #a855f7)' }}>
            {(user?.full_name || 'S')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{user?.full_name || 'Shedit User'}</h3>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            <p className="text-[10px] text-green-400/70 mt-1 italic">Walk it off. Climb it up. Shed it.</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'KG Lost',     value: kgLost,                         color: '#4ade80', suffix: 'kg' },
            { label: 'Steps',       value: `${(totalSteps/1000).toFixed(0)}k`, color: '#22d3ee', suffix: '' },
            { label: 'Day Streak',  value: streak,                         color: '#f59e0b', suffix: '🔥' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-lg font-black" style={{ color: s.color }}>
                {s.value}{s.suffix}
              </p>
              <p className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <div key={section.title} className="mb-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-2 px-0.5">
            {section.title}
          </p>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
            {section.items.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (si * 6 + i) * 0.025 }}
                whileTap={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-sm text-white font-medium flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => base44.auth.logout()}
        className="w-full flex items-center justify-center gap-2.5 p-4 glass-card rounded-2xl mb-8 transition-colors"
        style={{ borderColor: 'rgba(244, 63, 94, 0.2)' }}
      >
        <LogOut className="w-4 h-4 text-red-400" />
        <span className="text-sm font-semibold text-red-400">Sign Out</span>
      </motion.button>

      {/* Dialogs */}
      <LogValueDialog
        isOpen={stepsGoalDialog}
        onClose={() => setStepsGoalDialog(false)}
        title="Daily Steps Goal"
        unit="steps"
        value={todayLog.steps_goal || 10000}
        step={500} min={1000} max={50000}
        color="#4ade80"
        onSave={(v) => upsertLog.mutate({ steps_goal: v })}
      />
      <LogValueDialog
        isOpen={calsGoalDialog}
        onClose={() => setCalsGoalDialog(false)}
        title="Daily Calorie Target"
        unit="kcal"
        value={todayLog.calories_goal || 2000}
        step={50} min={800} max={5000}
        color="#a855f7"
        onSave={(v) => upsertLog.mutate({ calories_goal: v })}
      />

      {/* Info panels */}
      <AnimatePresence>
        {activePanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActivePanel(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] max-w-md mx-auto"
            >
              <div className="bg-[#111C16] rounded-t-3xl pt-5 pb-10 max-h-[80vh] overflow-y-auto border-t border-white/[0.07]">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
                <div className="px-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white capitalize">{activePanel.replace('_', ' ')}</h3>
                    <button onClick={() => setActivePanel(null)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {activePanel === 'privacy' && (
                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                      <h4 className="text-white font-bold text-base">Privacy Policy</h4>
                      <p>Last updated: January 2025</p>
                      <p><strong className="text-white">Data Collection:</strong> Shedit collects health data including steps, weight, nutrition, and activity logs solely to provide personalized fitness tracking. All data is encrypted in transit and at rest.</p>
                      <p><strong className="text-white">Health Data:</strong> Device health integrations (HealthKit/Google Fit) require explicit user permission. You may revoke access at any time through device settings.</p>
                      <p><strong className="text-white">Data Storage:</strong> Your data is stored securely in our cloud database. We do not sell personal data to third parties.</p>
                      <p><strong className="text-white">Data Deletion:</strong> You may delete all your data at any time from Settings → Delete My Data.</p>
                      <p><strong className="text-white">Contact:</strong> privacy@sheditapp.com</p>
                    </div>
                  )}

                  {activePanel === 'terms' && (
                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                      <h4 className="text-white font-bold text-base">Terms of Service</h4>
                      <p>By using Shedit, you agree to these terms.</p>
                      <p><strong className="text-white">Health Disclaimer:</strong> Shedit provides general wellness tracking. It is not a medical device and should not be used for medical diagnosis. Always consult a healthcare professional before starting a fitness program.</p>
                      <p><strong className="text-white">User Responsibility:</strong> You are responsible for the accuracy of data you enter. Calorie and nutrition estimates are approximations.</p>
                      <p><strong className="text-white">Account:</strong> You are responsible for maintaining account security. Do not share your credentials.</p>
                      <p><strong className="text-white">Acceptable Use:</strong> Do not use Shedit for any unlawful purpose or to harm others.</p>
                    </div>
                  )}

                  {activePanel === 'delete' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Deleting your data will permanently remove all your logs, meals, progress, and settings. This cannot be undone.</p>
                      <div className="glass-card rounded-2xl p-4 border border-red-500/20">
                        <p className="text-sm text-red-400 font-medium mb-3">⚠️ This action is irreversible</p>
                        <button
                          onClick={async () => {
                            const allLogs = await base44.entities.DailyLog.list('-date', 365);
                            for (const l of allLogs) await base44.entities.DailyLog.delete(l.id);
                            const allMeals = await base44.entities.MealEntry.list('-date', 365);
                            for (const m of allMeals) await base44.entities.MealEntry.delete(m.id);
                            queryClient.clear();
                            setActivePanel(null);
                          }}
                          className="w-full py-3 rounded-xl text-sm font-bold text-white"
                          style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}
                        >
                          Delete All My Data
                        </button>
                      </div>
                    </div>
                  )}

                  {activePanel === 'help' && (
                    <div className="space-y-3">
                      {[
                        { q: 'How do I log food?', a: 'Tap the + button or add directly from the Food Diary on the Today tab. Use AI ✨ to auto-fill nutrition.' },
                        { q: 'How does step tracking work?', a: 'Tap Steps in the Today tab to manually log your steps, or connect Apple Health / Google Fit in device settings.' },
                        { q: 'How is calorie burn calculated?', a: 'Exercise calories are estimated at 6 kcal per minute of logged exercise time.' },
                        { q: 'Can I change my calorie goal?', a: 'Yes — go to More → Calorie Target to update your daily goal.' },
                      ].map((faq, i) => (
                        <div key={i} className="glass-card rounded-2xl p-4">
                          <p className="text-sm font-semibold text-white">{faq.q}</p>
                          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {(activePanel === 'goals' || activePanel === 'kglost' || activePanel === 'report' ||
                    activePanel === 'sleep' || activePanel === 'fasting' || activePanel === 'workout' ||
                    activePanel === 'reminders' || activePanel === 'weight') && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🚀</div>
                      <h3 className="text-lg font-bold text-white mb-2">Coming Soon</h3>
                      <p className="text-sm text-gray-500">This feature is in development and will be available in a future update.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}