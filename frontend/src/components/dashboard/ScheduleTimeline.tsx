import React, { useState } from 'react';
import { TODAY_SCHEDULE } from '../../data/mockData';
import { ScheduleEvent } from '../../types';
import { Clock, Video, CheckCircle2, Circle, MapPin, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScheduleTimeline: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(TODAY_SCHEDULE);
  const { showToast } = useApp();

  const toggleEventComplete = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isCompleted;
          showToast(
            next ? 'Event Marked Completed' : 'Event Reopened',
            `"${item.title}" status updated`,
            'info'
          );
          return { ...item, isCompleted: next };
        }
        return item;
      })
    );
  };

  return (
    <div className="card-subtle p-6 lg:p-7 rounded-[32px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Aligned Schedule</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Flow blocks & synced team sessions</p>
          </div>
          <button
            onClick={() => showToast('Calendar Sync', 'Synced with Google Calendar / Workday', 'success')}
            className="text-xs font-black text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80"
          >
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" /> 4 blocks
          </button>
        </div>

        <div className="space-y-3 mt-5">
          {schedule.map((item) => {
            let typeColor = 'bg-blue-50 text-blue-800 border-blue-200/80';
            if (item.type === 'focus') typeColor = 'bg-emerald-50 text-emerald-900 border-emerald-200/80';
            if (item.type === 'standup') typeColor = 'bg-purple-50 text-purple-900 border-purple-200/80';
            if (item.type === 'review') typeColor = 'bg-amber-50 text-amber-900 border-amber-200/80';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                  item.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleEventComplete(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeColor}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.startTime} - {item.endTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Participants Avatars */}
                <div className="flex -space-x-2 shrink-0">
                  {item.participants.map((p, i) => (
                    <img
                      key={i}
                      src={p.avatar}
                      alt={p.name}
                      title={p.name}
                      className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next: 02:00 PM (1-on-1 Sync)</span>
        <button
          onClick={() => showToast('New Event', 'Add schedule feature active in calendar', 'info')}
          className="text-xs font-black text-emerald-800 hover:underline flex items-center gap-1 uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Event
        </button>
      </div>
    </div>
  );
};
