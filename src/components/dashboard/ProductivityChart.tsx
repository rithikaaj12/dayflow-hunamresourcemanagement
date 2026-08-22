import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PRODUCTIVITY_HOURLY_DATA } from '../../data/mockData';
import { Sparkles, Info } from 'lucide-react';

export const ProductivityChart: React.FC = () => {
  const [metric, setMetric] = useState<'score' | 'focus' | 'energy'>('score');

  const metricConfig = {
    score: {
      name: 'Productivity Index',
      color: '#10b981',
      unit: '%',
      description: 'Calculated from code commits, task completions, and active focus time.',
    },
    focus: {
      name: 'Focus Block Duration',
      color: '#3b82f6',
      unit: ' mins/hr',
      description: 'Continuous uninterrupted flow intervals without app context switching.',
    },
    energy: {
      name: 'Peak Energy Rhythm',
      color: '#8b5cf6',
      unit: ' pts',
      description: 'Ultradian workday flow rhythm measured from work cadences.',
    },
  }[metric];

  return (
    <div className="card-subtle p-6 lg:p-7 rounded-[32px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Flow & Productivity Rhythm</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3 h-3" /> Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">{metricConfig.description}</p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setMetric('score')}
            className={`px-3 py-1.5 rounded-xl transition-all text-[11px] uppercase tracking-wider ${
              metric === 'score' ? 'bg-white text-emerald-900 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            Productivity
          </button>
          <button
            onClick={() => setMetric('focus')}
            className={`px-3 py-1.5 rounded-xl transition-all text-[11px] uppercase tracking-wider ${
              metric === 'focus' ? 'bg-white text-blue-900 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            Deep Focus
          </button>
          <button
            onClick={() => setMetric('energy')}
            className={`px-3 py-1.5 rounded-xl transition-all text-[11px] uppercase tracking-wider ${
              metric === 'energy' ? 'bg-white text-purple-900 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            Energy Flow
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PRODUCTIVITY_HOURLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
                      <p className="font-semibold text-slate-300">{label} Workday Slot</p>
                      <p className="text-base font-bold text-white mt-1">
                        {payload[0].value}
                        {metricConfig.unit}
                      </p>
                      <p className="text-[11px] text-emerald-400 mt-0.5">High Flow Alignment</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={metricConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" /> Peak focus window: 10:30 AM – 12:30 PM (No meetings scheduled)
        </span>
        <span className="font-semibold text-emerald-700">Average: 92% today</span>
      </div>
    </div>
  );
};
