import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 72; // px to pull before triggering

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);
  const triggered = useRef(false);

  const handleTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    // Only start pull if already at top
    if (el.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    triggered.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const el = containerRef.current;
    if (!el || el.scrollTop > 0) { startY.current = null; return; }

    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) { setPullDistance(0); return; }

    // Rubber-band resistance
    const dist = Math.min(delta * 0.45, THRESHOLD * 1.4);
    setPullDistance(dist);
    if (dist >= THRESHOLD && !triggered.current) {
      triggered.current = true;
    }
    // Prevent native scroll while pulling
    if (delta > 4) e.preventDefault();
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (triggered.current && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD * 0.75);
      await onRefresh?.();
      setRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
    triggered.current = false;
  }, [onRefresh, refreshing]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const shouldTrigger = pullDistance >= THRESHOLD;

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull indicator */}
      <div
        style={{
          height: pullDistance > 0 ? pullDistance : refreshing ? THRESHOLD * 0.75 : 0,
          transition: pullDistance === 0 ? 'height 0.3s ease' : 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          style={{ opacity: Math.min(progress * 1.5, 1), scale: 0.6 + progress * 0.4 }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: shouldTrigger || refreshing ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${shouldTrigger || refreshing ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
            opacity: Math.min(progress * 1.5, 1),
            transform: `scale(${0.6 + progress * 0.4})`,
          }}
        >
          <RefreshCw
            className="w-4 h-4"
            style={{
              color: shouldTrigger || refreshing ? '#a855f7' : '#6b7280',
              transform: `rotate(${progress * 360}deg)`,
              transition: refreshing ? 'none' : undefined,
              animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
            }}
          />
        </motion.div>
        {(shouldTrigger || refreshing) && (
          <span className="text-[10px] text-purple-400 font-semibold ml-2">
            {refreshing ? 'Refreshing…' : 'Release to refresh'}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}