import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, Activity, Flame, Shield, X } from 'lucide-react';

export default function HealthPermissionPrompt({ onAllow, onDeny }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden mb-4"
      style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.18), rgba(168,85,247,0.08))', border: '1px solid rgba(168,85,247,0.3)' }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.2)' }}>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Enable Motion Tracking</p>
            <p className="text-[10px] text-purple-300/50">Steps &amp; stairs — on device only</p>
          </div>
        </div>
        <button onClick={onDeny} className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {/* Explanation */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          Shedit needs access to motion sensors to accurately track your steps and stairs climbed. Only actual stairs will be counted — elevators, escalators, and flat walking are ignored.
        </p>

        {/* Permissions list */}
        <div className="space-y-2 mb-4">
          {[
            { icon: Footprints, label: 'Step Count',      desc: 'Track all daily steps automatically',              color: '#a855f7' },
            { icon: Activity,   label: 'Stairs Climbed',  desc: 'Count only real stairs — not elevators/escalators', color: '#ec4899' },
            { icon: Flame,      label: 'Active Calories', desc: 'Calculate calories burned from movement',           color: '#f59e0b' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <Shield className="w-3 h-3 text-green-400 flex-shrink-0" />
          <p className="text-[10px] text-gray-500">Motion data is processed on-device and never sent to any server.</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDeny}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-500 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            Enter manually
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}
          >
            Allow Motion Access
          </button>
        </div>
      </div>
    </motion.div>
  );
}