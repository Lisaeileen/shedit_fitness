import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ActivityRing({
  value = 0, max = 100, size = 120, strokeWidth = 10,
  color = '#a855f7', trackColor, label, sublabel, children
}) {
  const [animated, setAnimated] = useState(false);
  const radius       = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress     = Math.min((value || 0) / Math.max(max, 1), 1);
  const offset       = circumference - progress * circumference;
  const track        = trackColor || `${color}18`;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Re-animate on value change
  useEffect(() => { setAnimated(false); const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, [value, max]);

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90" style={{ overflow: 'visible' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={track} strokeWidth={strokeWidth} strokeLinecap="round" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? offset : circumference }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}70)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
        {children || (
          <>
            {label !== undefined && (
              <span className="font-black text-white leading-none" style={{ fontSize: size * 0.17 }}>{label}</span>
            )}
            {sublabel && (
              <span className="text-gray-500 leading-none mt-0.5" style={{ fontSize: size * 0.1 }}>{sublabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}