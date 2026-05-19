import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { SheditWordmark } from './SheditLogo';

// Root tab paths — these show the logo, not a back button
const ROOT_TABS = ['/', '/Plan', '/Progress', '/More', '/Social'];

export default function PageHeader({ title, subtitle, rightSlot }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRootTab = ROOT_TABS.some(
    p => location.pathname === p || location.pathname === p.toLowerCase()
  );

  if (isRootTab) {
    // Show logo wordmark for root tab screens — pages inject their own header,
    // so PageHeader is a no-op on root tabs unless callers explicitly pass a title.
    if (!title) return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 pt-3 pb-2"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Left: back button or logo */}
      <div className="flex items-center gap-2 min-w-0">
        {!isRootTab ? (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 mr-1"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ChevronLeft className="w-4 h-4 text-purple-300" />
            </div>
          </motion.button>
        ) : (
          <SheditWordmark size={28} />
        )}

        {title && (
          <div className="min-w-0">
            <p className="text-base font-black text-white truncate">{title}</p>
            {subtitle && <p className="text-[10px] text-purple-300/50 truncate">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right slot */}
      {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
    </motion.div>
  );
}