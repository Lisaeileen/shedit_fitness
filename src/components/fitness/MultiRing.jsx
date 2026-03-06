import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MultiRing({ rings = [], size = 140, strokeWidth = 8, children }) {
  const gap = 3;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {rings.map((ring, index) => {
          const r = (size - strokeWidth) / 2 - (index * (strokeWidth + gap));
          const circ = 2 * Math.PI * r;
          const progress = Math.min((ring.value || 0) / (ring.max || 100), 1);
          const off = circ - (progress * circ);

          return (
            <React.Fragment key={index}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: off }}
                transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                style={{ filter: `drop-shadow(0 0 6px ${ring.color}40)` }}
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