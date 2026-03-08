import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, isAfter } from 'date-fns';

export default function WeekSelector({ selectedDate, onSelect }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
      {days.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday    = isSameDay(day, today);
        const isFuture   = isAfter(day, today) && !isToday;

        return (
          <motion.button
            key={day.toISOString()}
            whileTap={{ scale: 0.9 }}
            onClick={() => !isFuture && onSelect(day)}
            className="flex flex-col items-center gap-1 flex-1 min-w-[40px] py-2.5 px-1 rounded-2xl transition-all duration-200"
            style={isSelected
              ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }
              : isToday
                ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }
                : { background: 'rgba(255,255,255,0.03)' }
            }
          >
            <span className="text-[10px] font-semibold uppercase"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#4b5563' }}>
              {format(day, 'EEE').slice(0, 1)}
            </span>
            <span className="text-sm font-black"
              style={{ color: isSelected ? 'white' : isFuture ? '#2d2d3d' : isToday ? '#c084fc' : '#9ca3af' }}>
              {format(day, 'd')}
            </span>
            {isToday && !isSelected && (
              <div className="w-1 h-1 rounded-full" style={{ background: '#a855f7' }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}