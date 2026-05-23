import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CalendarDays, Plus, TrendingUp, MoreHorizontal } from 'lucide-react';
import { createPageUrl } from '@/utils';
import QuickAddModal from './QuickAddModal.jsx';

const navItems = [
  { label: 'Today', icon: Home, page: 'Today' },
  { label: 'Plan', icon: CalendarDays, page: 'Plan' },
  { label: 'Add', icon: Plus, page: null },
  { label: 'Progress', icon: TrendingUp, page: 'Progress' },
  { label: 'More', icon: MoreHorizontal, page: 'More' },
];

export default function BottomNav({ onQuickAction }) {
  const location = useLocation();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <>
      <QuickAddModal 
        isOpen={showQuickAdd} 
        onClose={() => setShowQuickAdd(false)}
        onAction={onQuickAction}
      />
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-[#0D0D0D]/90 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
            {navItems.map((item) => {
              if (item.page === null) {
                return (
                  <button
                    key="add"
                    onClick={() => setShowQuickAdd(true)}
                    className="relative -mt-6"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg glow-purple"
                    >
                      <Plus className="w-6 h-6 text-white" />
                    </motion.div>
                  </button>
                );
              }

              const isActive = location.pathname.includes(item.page);
              return (
                <Link
                  key={item.label}
                  to={createPageUrl(item.page)}
                  className="flex flex-col items-center gap-1 py-1 px-3 relative"
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -top-0.5 w-6 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="h-safe-area-inset-bottom" />
        </div>
      </div>
    </>
  );
}