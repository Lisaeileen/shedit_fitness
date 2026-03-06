import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  User, Scale, Timer, Moon, Dumbbell, Target, Ruler, 
  FileText, Apple, Bell, Footprints, Shield, HelpCircle, 
  RefreshCw, Settings, ChevronRight, LogOut, TrendingDown
} from 'lucide-react';

const menuSections = [
  {
    title: 'Health',
    items: [
      { label: 'My Profile', icon: User, color: '#a855f7' },
      { label: 'KG Lost', icon: TrendingDown, color: '#10b981' },
      { label: 'Intermittent Fasting', icon: Timer, color: '#f59e0b' },
      { label: 'Sleep Tracking', icon: Moon, color: '#6366f1' },
      { label: 'Workout Routine', icon: Dumbbell, color: '#ec4899' },
    ]
  },
  {
    title: 'Goals & Progress',
    items: [
      { label: 'Goals', icon: Target, color: '#3b82f6' },
      { label: 'Weight & Measurements', icon: Ruler, color: '#06b6d4' },
      { label: 'Weekly Report', icon: FileText, color: '#a855f7' },
      { label: 'Nutrition Insights', icon: Apple, color: '#10b981' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Reminders', icon: Bell, color: '#f59e0b' },
      { label: 'Steps Settings', icon: Footprints, color: '#3b82f6' },
      { label: 'Privacy', icon: Shield, color: '#6b7280' },
      { label: 'Help Center', icon: HelpCircle, color: '#6366f1' },
      { label: 'Data Sync', icon: RefreshCw, color: '#06b6d4' },
      { label: 'Settings', icon: Settings, color: '#6b7280' },
    ]
  }
];

export default function More() {
  const { data: logs = [] } = useQuery({
    queryKey: ['allLogs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 90),
  });

  const weightLogs = logs.filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstWeight = weightLogs.length > 0 ? weightLogs[0].weight : null;
  const lastWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;
  const totalLost = firstWeight && lastWeight ? Math.max(firstWeight - lastWeight, 0) : 0;

  const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
  const streak = logs.filter(l => (l.calories_consumed || 0) > 0).length;

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">More</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-5 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
            S
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Shedit User</h3>
            <p className="text-xs text-gray-500">Walk it off. Climb it up. Shed it.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="text-center p-3 rounded-xl bg-white/[0.03]">
            <p className="text-lg font-bold text-purple-400">{totalLost.toFixed(1)}</p>
            <p className="text-[10px] text-gray-500">KG Lost</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.03]">
            <p className="text-lg font-bold text-blue-400">{(totalSteps / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-gray-500">Total Steps</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.03]">
            <p className="text-lg font-bold text-pink-400">{streak}</p>
            <p className="text-[10px] text-gray-500">Day Streak</p>
          </div>
        </div>
      </motion.div>

      {/* Menu Sections */}
      {menuSections.map((section, si) => (
        <div key={section.title} className="mb-5">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 px-1">{section.title}</h3>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
            {section.items.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (si * section.items.length + i) * 0.03 }}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-sm text-white font-medium flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button 
        onClick={() => base44.auth.logout()}
        className="w-full flex items-center justify-center gap-2 p-4 glass-card rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors mb-8"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
}