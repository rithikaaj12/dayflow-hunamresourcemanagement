import React, { useState } from 'react';
import { AttendanceRecord } from '../../types';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock } from 'lucide-react';

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  onSelectDate?: (date: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records, onSelectDate }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const getRecordForDay = (dayNum: number): AttendanceRecord | undefined => {
    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return records.find((r) => r.date === formattedDate);
  };

  return (
    <div className="card-subtle p-6 lg:p-7 rounded-[32px]">
      {/* Header Month Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Attendance Calendar Matrix</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Punch-in compliance & daily status overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-slate-900 font-display">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {daysOfWeek.map((day, i) => (
          <div key={day} className={`text-[11px] font-black uppercase tracking-widest py-1 ${i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-700'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Leading empty days */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-2xl bg-slate-50/50 border border-transparent" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayOfWeek = (firstDayIndex + i) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const record = getRecordForDay(dayNum);
          const isToday = dayNum === 21 && month === 7 && year === 2026;

          let bgStyle = 'bg-white hover:border-slate-300';
          let statusDot = null;
          let label = null;

          if (isWeekend) {
            bgStyle = 'bg-slate-50/70 border-slate-200 text-slate-400';
          } else if (record) {
            if (record.status === 'present') {
              bgStyle = 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-400';
              statusDot = <span className="w-2 h-2 rounded-full bg-emerald-600" />;
              label = `${record.workingHours}h`;
            } else if (record.status === 'late') {
              bgStyle = 'bg-rose-50/40 border-rose-200/90 hover:border-rose-400';
              statusDot = <span className="w-2 h-2 rounded-full bg-rose-600" />;
              label = 'Late';
            } else if (record.status === 'half-day') {
              bgStyle = 'bg-purple-50/40 border-purple-200/90 hover:border-purple-400';
              statusDot = <span className="w-2 h-2 rounded-full bg-purple-600" />;
              label = '0.5 Day';
            }
          } else if (dayNum < 21) {
            bgStyle = 'bg-emerald-50/20 border-emerald-100';
            statusDot = <span className="w-2 h-2 rounded-full bg-emerald-500" />;
            label = '8.0h';
          }

          return (
            <div
              key={dayNum}
              onClick={() => {
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                onSelectDate?.(dateStr);
              }}
              className={`h-16 sm:h-20 p-2.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-150 relative ${bgStyle} ${
                isToday ? 'ring-2 ring-emerald-700 font-black shadow-sm' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isToday ? 'text-emerald-950 font-black' : 'text-slate-800 font-bold'}`}>
                  {dayNum}
                </span>
                {isToday && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-[#1B4332] text-white font-black">
                    Today
                  </span>
                )}
              </div>

              {!isWeekend && (
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    {statusDot}
                    <span className="truncate">{label}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present (8h+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Late Arrival
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Half-Day Leave
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Weekend / Holiday
          </span>
        </div>
        <span className="font-black text-emerald-900 uppercase tracking-wider text-[11px]">Monthly Compliance: 98.4%</span>
      </div>
    </div>
  );
};
