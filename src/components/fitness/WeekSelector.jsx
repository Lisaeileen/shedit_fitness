import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';

export default function WeekSelector({ selectedDate, onSelect }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="flex justify-between gap-1">
      {days.map((day, i) => {
        const isSelected = isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);
        const isFuture = day > new Date();

        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.88 }}
            onClick={() => !isFuture && onSelect(day)}
            disabled={isFuture}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <span className={`text-[10px] font-semibold uppercase tracking-wider
              ${isSelected ? 'text-green-400' : 'text-gray-600'}`}>
              {dayLabels[i]}
            </span>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold relative transition-all duration-200
              ${isSelected
                ? 'text-white'
                : isFuture
                  ? 'text-gray-700'
                  : isTodayDate
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-gray-400 hover:bg-white/5'
              }`}
              style={isSelected ? {
                background: 'linear-gradient(135deg, #4ade80, #a855f7)',
                boxShadow: '0 0 16px rgba(74, 222, 128, 0.35)'
              } : {}}>
              {format(day, 'd')}
              {isTodayDate && !isSelected && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-green-400" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}