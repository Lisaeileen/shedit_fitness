import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ActivityRing({ 
  value = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 10, 
  color = '#a855f7',
  bgColor = 'rgba(255,255,255,0.06)',
  label,
  sublabel,
  children 
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(animatedValue / max, 1);
  const offset = circumference - (progress * circumference);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children || (
          <>
            {label && <span className="text-lg font-bold text-white">{label}</span>}
            {sublabel && <span className="text-[10px] text-gray-400 mt-0.5">{sublabel}</span>}
          </>
        )}
      </div>
    </div>
  );
}