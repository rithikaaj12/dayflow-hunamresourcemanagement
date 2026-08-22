import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatSecondsToTime } from '../../utils';
import { Play, Pause, LogOut, MapPin, Coffee, Sparkles } from 'lucide-react';

export const LiveClockWidget: React.FC = () => {
  const {
    clockState,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    setWorkLocation,
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="card-subtle p-6 lg:p-7 rounded-[32px] bg-gradient-to-br from-white via-white to-emerald-50/40 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Workday Punch Terminal</h3>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                clockState.isCheckedIn
                  ? clockState.isOnBreak
                    ? 'bg-amber-100/80 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100/80 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  clockState.isCheckedIn
                    ? clockState.isOnBreak
                      ? 'bg-amber-500'
                      : 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />
              {clockState.isCheckedIn
                ? clockState.isOnBreak
                  ? 'On Break (Paused)'
                  : 'Active Flowing'
                : 'Checked Out'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{formattedDate}</p>
        </div>

        {/* Work Location Selector */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold">
          <span className="text-slate-400 px-2 text-[10px] uppercase tracking-wider font-black flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-700" /> Zone:
          </span>
          <button
            onClick={() => setWorkLocation('office')}
            className={`px-3 py-1.5 rounded-xl transition-all text-[11px] uppercase tracking-wider ${
              clockState.workLocation === 'office'
                ? 'bg-white text-emerald-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-950 font-bold'
            }`}
          >
            HQ Office
          </button>
          <button
            onClick={() => setWorkLocation('remote')}
            className={`px-3 py-1.5 rounded-xl transition-all text-[11px] uppercase tracking-wider ${
              clockState.workLocation === 'remote'
                ? 'bg-white text-emerald-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-950 font-bold'
            }`}
          >
            Remote
          </button>
        </div>
      </div>

      {/* Main Counter Display */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Time</p>
          <p className="text-xl font-black font-mono text-slate-800 mt-1.5 tracking-tight">{formattedClock}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Pacific Time (PT)</p>
        </div>

        <div className="p-5 bg-gradient-to-b from-emerald-50/90 to-emerald-100/40 rounded-2xl border border-emerald-200 sm:col-span-1 shadow-xs">
          <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-700" /> Today's Flow
          </p>
          <p className="text-3xl lg:text-4xl font-black font-mono text-emerald-950 mt-1.5 tracking-tight">
            {formatSecondsToTime(clockState.accumulatedWorkSeconds)}
          </p>
          <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
            {clockState.checkInTime ? `Punched in @ ${clockState.checkInTime}` : 'Not clocked in yet'}
          </p>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break Duration</p>
          <p className="text-xl font-black font-mono text-amber-800 mt-1.5 tracking-tight">
            {formatSecondsToTime(clockState.accumulatedBreakSeconds)}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Limit: 1h 00m</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap gap-3">
        {!clockState.isCheckedIn ? (
          <button
            onClick={() => checkIn(clockState.workLocation)}
            className="flex-1 py-3.5 px-5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white stroke-[2.5]" /> Punch In for Today
          </button>
        ) : (
          <>
            {clockState.isOnBreak ? (
              <button
                onClick={endBreak}
                className="flex-1 py-3.5 px-5 bg-[#1B4332] hover:bg-[#245741] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" /> Resume Flow State
              </button>
            ) : (
              <button
                onClick={startBreak}
                className="flex-1 py-3.5 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 transition-all"
              >
                <Coffee className="w-4 h-4 stroke-[2.5]" /> Take Break
              </button>
            )}

            <button
              onClick={checkOut}
              className="py-3.5 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Clock Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};
