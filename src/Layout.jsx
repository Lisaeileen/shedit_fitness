import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CalendarDays, Plus, TrendingUp, MoreHorizontal } from 'lucide-react';
import { createPageUrl } from '@/utils';
import QuickAddModal from './components/fitness/QuickAddModal';

const navItems = [
  { label: 'Today',    icon: Home,           page: 'Today' },
  { label: 'Plan',     icon: CalendarDays,   page: 'Plan' },
  { label: 'Add',      icon: Plus,           page: null },
  { label: 'Progress', icon: TrendingUp,     page: 'Progress' },
  { label: 'More',     icon: MoreHorizontal, page: 'More' },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <div className="bg-app min-h-screen text-white">
      <style>{`
        body { background: #12062A; }
        #root { min-height: 100vh; }
      `}</style>

      <div className="max-w-md mx-auto w-full min-h-screen relative">
        <div className="safe-top" />

        <AnimatePresence mode="wait">
          <motion.div key={currentPageName}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }} className="pb-28">
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-md mx-auto">
            <div className="nav-bg border-t" style={{ borderColor: 'rgba(168,85,247,0.12)' }}>
              <div className="flex items-center justify-around px-2 pt-2 safe-nav-bottom">
                {navItems.map((item) => {
                  if (item.page === null) {
                    return (
                      <button key="add" onClick={() => setShowQuickAdd(true)} className="relative -mt-5 flex-shrink-0">
                        <motion.div whileTap={{ scale: 0.88 }}
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            boxShadow: '0 6px 24px rgba(124,58,237,0.5)'
                          }}>
                          <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </motion.div>
                      </button>
                    );
                  }
                  const isActive = location.pathname.includes(item.page) ||
                    (item.page === 'Today' && location.pathname === '/');
                  return (
                    <Link key={item.label} to={createPageUrl(item.page)}
                      className="flex flex-col items-center gap-1 py-1 px-3 min-w-[48px] relative">
                      <item.icon className="w-5 h-5 transition-all duration-200"
                        style={{ color: isActive ? '#a855f7' : '#3d2460' }}
                        strokeWidth={isActive ? 2.5 : 1.8} />
                      <span className="text-[10px] font-medium transition-all duration-200"
                        style={{ color: isActive ? '#a855f7' : '#3d2460' }}>
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div layoutId="nav-dot"
                          className="absolute -top-0.5 w-1 h-1 rounded-full"
                          style={{ background: '#a855f7' }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickAddModal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} />
    </div>
  );
}