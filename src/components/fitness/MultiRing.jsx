import React from 'react';
import { motion } from 'framer-motion';

export default function MultiRing({ rings = [], size = 160, strokeWidth = 9, gap = 5, children }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90" style={{ overflow: 'visible' }}>
        {rings.map((ring, i) => {
          const r = (size - strokeWidth) / 2 - i * (strokeWidth + gap);
          if (r <= 0) return null;
          const circ = 2 * Math.PI * r;
          const progress = Math.min((ring.value || 0) / Math.max(ring.max || 100, 1), 1);
          const off = circ - progress * circ;
          const track = `${ring.color}18`;

          return (
            <React.Fragment key={i}>
              <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={track}
                strokeWidth={strokeWidth} strokeLinecap="round"
              />
              <motion.circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: off }}
                transition={{ duration: 1.6, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.15 }}
                style={{ filter: `drop-shadow(0 0 6px ${ring.color}50)` }}
              />
            </React.Fragment>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}