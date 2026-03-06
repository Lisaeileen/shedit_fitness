import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export default function WeekSelector({ selectedDate, onSelect }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="flex justify-between px-2">
      {days.map((day, i) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        return (
          <button
            key={i}
            onClick={() => onSelect(day)}
            className="flex flex-col items-center gap-1.5 relative"
          >
            <span className="text-[11px] font-medium text-gray-500">{dayLabels[i]}</span>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white glow-purple' 
                  : isToday 
                    ? 'bg-white/10 text-white ring-1 ring-purple-500/40' 
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]'
                }`}
            >
              {format(day, 'd')}
            </motion.div>
            {isToday && !isSelected && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}