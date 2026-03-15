import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Timer, Moon, Dumbbell, Target, FileText,
  Bell, Footprints, Shield, HelpCircle, ChevronRight,
  TrendingDown, Zap, X, Trash2, Users, Brain, Camera, Trophy, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { DailyLogs, deleteAllData } from '../components/storage';
import LogValueDialog from '../components/fitness/LogValueDialog';
import { SheditIcon } from '../components/fitness/SheditLogo';
import GoalsPanel from '../components/fitness/panels/GoalsPanel';
import WeightPanel from '../components/fitness/panels/WeightPanel';
import WeeklyReportPanel from '../components/fitness/panels/WeeklyReportPanel';
import SleepPanel from '../components/fitness/panels/SleepPanel';
import FastingPanel from '../components/fitness/panels/FastingPanel';
import WorkoutPanel from '../components/fitness/panels/WorkoutPanel';
import RemindersPanel from '../components/fitness/panels/RemindersPanel';
import BodyTransformationPanel from '../components/fitness/panels/BodyTransformationPanel';
import AchievementsPanel from '../components/fitness/panels/AchievementsPanel';
import ShareProgressCard from '../components/fitness/ShareProgressCard';

export default function More() {
  const [activePanel, setActivePanel]     = useState(null);
  const [showShare, setShowShare]         = useState(false);
  const [stepsGoalDialog, setStepsGoalDialog] = useState(false);
  const [calsGoalDialog, setCalsGoalDialog]   = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const logs     = useMemo(() => DailyLogs.list(), [tick]);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = useMemo(() => logs.find(l => l.date === todayStr) || {}, [logs, todayStr]);

  const upsertTodayLog = (fields) => { DailyLogs.upsert(todayStr, fields); refresh(); };

  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const kgLost     = weightLogs.length >= 2
    ? Math.max(weightLogs[0].weight - weightLogs.at(-1).weight, 0).toFixed(1) : '0.0';
  const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
  const streak     = (() => {
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let s = 0; for (const l of sorted) { if ((l.calories_consumed || 0) > 0) s++; else break; } return s;
  })();

  const sections = [
    {
      title: 'Health Tracking',
      items: [
        { id: 'steps_goal', label: 'Steps Goal',           icon: Footprints, color: '#a855f7', action: () => setStepsGoalDialog(true) },
        { id: 'cal_goal',   label: 'Calorie Target',       icon: Zap,        color: '#c084fc', action: () => setCalsGoalDialog(true) },
        { id: 'weight',     label: 'Weight & Measures',    icon: Scale,      color: '#10b981', action: () => setActivePanel('weight') },
        { id: 'body',       label: 'Body Transformation',  icon: Camera,     color: '#ec4899', action: () => setActivePanel('body') },
        { id: 'sleep',      label: 'Sleep Tracking',       icon: Moon,       color: '#6366f1', action: () => setActivePanel('sleep') },
        { id: 'fasting',    label: 'Intermittent Fasting', icon: Timer,      color: '#f59e0b', action: () => setActivePanel('fasting') },
        { id: 'workout',    label: 'Workout Routine',      icon: Dumbbell,   color: '#ec4899', action: () => setActivePanel('workout') },
      ]
    },
    {
      title: 'Goals & Reports',
      items: [
        { id: 'goals',        label: 'My Goals',        icon: Target,      color: '#3b82f6', action: () => setActivePanel('goals') },
        { id: 'report',       label: 'Weekly Report',   icon: FileText,    color: '#a855f7', action: () => setActivePanel('report') },
        { id: 'kglost',       label: 'Weight Loss',     icon: TrendingDown,color: '#10b981', action: () => setActivePanel('kglost') },
        { id: 'achievements', label: 'Achievements',    icon: Trophy,      color: '#f59e0b', action: () => setActivePanel('achievements') },
        { id: 'share',        label: 'Share Progress',  icon: Share2,      color: '#ec4899', action: () => setShowShare(true) },
      ]
    },
    {
      title: 'Settings & Support',
      items: [
        { id: 'reminders', label: 'Reminders',        icon: Bell,       color: '#f59e0b', action: () => setActivePanel('reminders') },
        { id: 'privacy',   label: 'Privacy Policy',   icon: Shield,     color: '#6b7280', action: () => setActivePanel('privacy') },
        { id: 'terms',     label: 'Terms of Service', icon: FileText,   color: '#6b7280', action: () => setActivePanel('terms') },
        { id: 'help',      label: 'Help Center',      icon: HelpCircle, color: '#6366f1', action: () => setActivePanel('help') },
        { id: 'delete',    label: 'Delete My Data',   icon: Trash2,     color: '#f43f5e', action: () => setActivePanel('delete') },
      ]
    }
  ];

  return (
    <div className="px-4 pt-2">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="pt-2 mb-5">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Account</p>
        <h1 className="text-2xl font-black text-white">More</h1>
      </motion.div>

      {/* Quick links */}
      <div className="flex gap-2.5 mb-5">
        <Link to={createPageUrl('Social')} className="flex-1 rounded-2xl p-4 flex flex-col items-center gap-2"
          style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <Users className="w-6 h-6 text-purple-400" />
          <span className="text-xs font-bold text-white">Community</span>
          <span className="text-[10px] text-gray-600">Friends & Challenges</span>
        </Link>
        <Link to={createPageUrl('Coach')} className="flex-1 rounded-2xl p-4 flex flex-col items-center gap-2"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <Brain className="w-6 h-6 text-purple-400" />
          <span className="text-xs font-bold text-white">AI Coach</span>
          <span className="text-[10px] text-gray-600">Your assistant</span>
        </Link>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card-purple rounded-3xl p-5 mb-5">
        <div className="flex items-center gap-4 mb-4">
          <SheditIcon size={64} rounded="2xl" />
          <div>
            <h3 className="text-lg font-bold text-white">Shedit User</h3>
            <p className="text-[10px] text-purple-300/50 mt-0.5 italic">Walk it off. Climb it up. Shed it.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'KG Lost',    value: `${kgLost}`,                       color: '#10b981', suffix: 'kg' },
            { label: 'Steps',      value: `${(totalSteps/1000).toFixed(0)}k`,color: '#c084fc', suffix: '' },
            { label: 'Day Streak', value: `${streak}`,                       color: '#f59e0b', suffix: '🔥' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}{s.suffix && <span className="text-xs ml-0.5">{s.suffix}</span>}</p>
              <p className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {sections.map((section, si) => (
        <div key={section.title} className="mb-4">
          <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-2 px-0.5">{section.title}</p>
          <div className="rounded-2xl overflow-hidden divide-y" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.05)' }}>
            {section.items.map((item, i) => (
              <motion.button key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: (si * 6 + i) * 0.025 }}
                whileTap={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-sm text-white font-medium flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-8" />

      {showShare && <ShareProgressCard onClose={() => setShowShare(false)} />}

      <LogValueDialog isOpen={stepsGoalDialog} onClose={() => setStepsGoalDialog(false)}
        title="Daily Steps Goal" unit="steps" value={todayLog.steps_goal || 10000}
        step={500} min={1000} max={50000} color="#a855f7" onSave={(v) => upsertTodayLog({ steps_goal: v })} />
      <LogValueDialog isOpen={calsGoalDialog} onClose={() => setCalsGoalDialog(false)}
        title="Daily Calorie Target" unit="kcal" value={todayLog.calories_goal || 2000}
        step={50} min={800} max={5000} color="#7c3aed" onSave={(v) => upsertTodayLog({ calories_goal: v })} />

      <AnimatePresence>
        {activePanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActivePanel(null)} className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] max-w-md mx-auto">
              <div className="rounded-t-3xl pt-5 pb-10 max-h-[80vh] overflow-y-auto border-t"
                style={{ background: '#1A0835', borderColor: 'rgba(168,85,247,0.2)' }}>
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
                <div className="px-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white capitalize">
                      {activePanel === 'kglost' ? 'Weight Loss Tracker'
                        : activePanel === 'weight' ? 'Weight Tracker'
                        : activePanel === 'report' ? 'Weekly Report'
                        : activePanel === 'fasting' ? 'Intermittent Fasting'
                        : activePanel === 'workout' ? 'Workout Routines'
                        : activePanel === 'reminders' ? 'Reminders'
                        : activePanel === 'goals' ? 'My Goals'
                        : activePanel === 'sleep' ? 'Sleep Tracking'
                        : activePanel === 'body' ? 'Body Transformation'
                        : activePanel === 'achievements' ? 'Achievements'
                        : activePanel.replace(/_/g, ' ')}
                    </h3>
                    <button onClick={() => setActivePanel(null)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {activePanel === 'privacy' && (
                    <div className="space-y-5 text-sm text-gray-400 leading-relaxed pb-4">
                      <p className="text-xs text-gray-600">Last updated: March 2026</p>

                      <div>
                        <p className="text-white font-bold mb-1">Data We Collect</p>
                        <p>Shedit may collect the following data to provide personalised fitness and nutrition tracking:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500 text-xs">
                          <li>Account information (name, email if signed in)</li>
                          <li>Weight and body metrics</li>
                          <li>Food and meal logs</li>
                          <li>Workout and exercise data</li>
                          <li>Step count and activity data</li>
                          <li>Device health data (if health permissions are granted)</li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Health Integrations</p>
                        <p>Shedit may integrate with Apple Health and Google Fit to read step counts and activity data. This data is used solely for fitness tracking within the app. You control all health permissions through your device settings and can revoke access at any time.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Camera Use</p>
                        <p>The app uses your camera for AI-powered meal scanning and body transformation tracking. Images are processed to identify nutritional information and body metrics. Photos are not uploaded to any server or stored beyond the immediate analysis session.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Data Storage & Protection</p>
                        <p>Your data is stored locally on your device. When cloud sync is enabled, data is encrypted in transit and at rest. We do not sell, rent, or share your personal data with third parties for advertising purposes.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Your Rights</p>
                        <p>You may delete all your data at any time from <span className="text-purple-400">More → Delete My Data</span>. For privacy-related requests, contact us at <span className="text-purple-400">privacy@sheditapp.com</span>.</p>
                      </div>
                    </div>
                  )}

                  {activePanel === 'terms' && (
                    <div className="space-y-5 text-sm text-gray-400 leading-relaxed pb-4">
                      <p className="text-xs text-gray-600">Last updated: March 2026</p>

                      <div>
                        <p className="text-white font-bold mb-1">Use of the App</p>
                        <p>Shedit is a personal fitness and nutrition tracking application designed to support your health and wellness journey. It provides tools for tracking calories, macronutrients, workouts, hydration, and body metrics. Shedit does not provide medical diagnosis or treatment and is not a substitute for professional medical advice.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Health Disclaimer</p>
                        <p>Calorie, macro, and exercise estimates are approximations based on general data. Individual results will vary. Always consult a qualified healthcare professional before making significant changes to your diet or exercise routine, especially if you have a medical condition.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">User Responsibilities</p>
                        <p>By using Shedit, you agree to:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500 text-xs">
                          <li>Provide accurate information about yourself</li>
                          <li>Use the app responsibly and for lawful purposes</li>
                          <li>Consult healthcare professionals when needed</li>
                          <li>Not misuse, reverse engineer, or attempt to exploit the app</li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Account Usage</p>
                        <p>Your account and data are for personal use only. You are responsible for maintaining the confidentiality of your account. Sharing accounts or using the app to store third-party data without consent is prohibited.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Limitation of Liability</p>
                        <p>Shedit provides informational tools for health and fitness tracking. We are not liable for any health outcomes, injuries, or losses resulting from use of the app or reliance on its estimates. Use the app as a supportive tool, not a medical device.</p>
                      </div>

                      <div>
                        <p className="text-white font-bold mb-1">Changes to Terms</p>
                        <p>We may update these Terms from time to time. Continued use of the app constitutes acceptance of the updated Terms. Contact us at <span className="text-purple-400">support@sheditapp.com</span> with any questions.</p>
                      </div>
                    </div>
                  )}

                  {activePanel === 'delete' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">This will permanently erase all your logs, meals, progress and settings from this device. This cannot be undone.</p>
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
                        <p className="text-sm text-red-400 font-semibold mb-3">⚠️ This action is irreversible</p>
                        <button onClick={() => { deleteAllData(); refresh(); setActivePanel(null); }}
                          className="w-full py-3 rounded-xl text-sm font-bold text-white"
                          style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}>
                          Delete All My Data
                        </button>
                      </div>
                    </div>
                  )}

                  {activePanel === 'help' && (
                    <div className="space-y-3">
                      {[
                        { q: 'How do I log food?', a: 'Tap + on the bottom nav or use the + button on any meal card. Use AI Scan to photograph your meal, Voice Log to speak it, or type manually with autocomplete.' },
                        { q: 'Where is my data stored?', a: 'All data is stored locally on your device only — no account or internet connection required.' },
                        { q: 'How do I track steps?', a: 'Tap the "+ Log" button next to the Steps section on the Today screen to manually enter your step count.' },
                        { q: 'How is calorie burn calculated?', a: 'Exercise calories are estimated at 6 kcal per minute of logged exercise.' },
                        { q: 'Can I change my calorie goal?', a: 'Yes — go to More → Calorie Target to update your daily goal.' },
                        { q: 'How do I generate a meal plan?', a: 'Go to the Plan tab. If you haven\'t done onboarding, complete it first. Then tap Generate to create a personalised weekly plan.' },
                      ].map((faq, i) => (
                        <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-sm font-semibold text-white">{faq.q}</p>
                          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activePanel === 'goals'     && <GoalsPanel onClose={() => setActivePanel(null)} />}
                  {activePanel === 'kglost'    && <WeightPanel onClose={() => setActivePanel(null)} />}
                  {activePanel === 'weight'    && <WeightPanel onClose={() => setActivePanel(null)} />}
                  {activePanel === 'report'    && <WeeklyReportPanel />}
                  {activePanel === 'sleep'     && <SleepPanel />}
                  {activePanel === 'fasting'   && <FastingPanel />}
                  {activePanel === 'workout'   && <WorkoutPanel />}
                  {activePanel === 'reminders' && <RemindersPanel />}
                  {activePanel === 'body'         && <BodyTransformationPanel />}
                  {activePanel === 'achievements' && <AchievementsPanel />}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}