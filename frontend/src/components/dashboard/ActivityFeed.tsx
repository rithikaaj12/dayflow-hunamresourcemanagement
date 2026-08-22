import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Clock, CheckSquare, CalendarCheck, Shield } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { activities } = useApp();

  return (
    <div className="card-subtle p-6 lg:p-7 rounded-[32px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Activity className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            Live Workday Pulse
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Real-time team actions & events</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
          Live Stream
        </span>
      </div>

      <div className="space-y-4 mt-5 max-h-80 overflow-y-auto pr-1">
        {activities.slice(0, 6).map((act) => {
          let icon = <Clock className="w-3.5 h-3.5 text-emerald-600" />;
          if (act.type === 'task') icon = <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />;
          if (act.type === 'leave') icon = <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />;
          if (act.type === 'system') icon = <Shield className="w-3.5 h-3.5 text-amber-600" />;

          return (
            <div key={act.id} className="flex items-start gap-3.5 text-xs">
              <img
                src={act.user.avatar}
                alt={act.user.name}
                className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 leading-snug">
                  <span className="font-black text-slate-900">{act.user.name}</span>{' '}
                  <span className="text-slate-600 font-medium">{act.action}</span>{' '}
                  <span className="font-bold text-emerald-950">{act.target}</span>
                </p>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{act.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
