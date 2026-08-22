import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  WEEKLY_ATTENDANCE_TREND,
  MONTHLY_HOURS_DISTRIBUTION,
  DEPARTMENT_STATS,
  PRODUCTIVITY_HOURLY_DATA,
} from '../data/mockData';
import { StatsCard } from '../components/common/StatsCard';
import {
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Zap,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';
import { exportToCSV } from '../utils';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const { showToast } = useApp();

  const radarData = DEPARTMENT_STATS.map((d) => ({
    department: d.name.split(' ')[0],
    productivity: d.avgProductivity,
    attendance: d.attendanceRate,
    tasksVelocity: Math.round((d.completedTasks / (d.openTasks + d.completedTasks)) * 100),
  }));

  const handleExportAnalytics = () => {
    exportToCSV('dayflow-analytics-august-2026.csv', DEPARTMENT_STATS);
    showToast('Analytics Report Exported', 'Downloaded department telemetry to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            Workday Analytics & Alignment Telemetry
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Real-time organizational performance, attendance velocity, and flow trends.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Range Filter */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-xl transition-all text-[11px] ${
                timeRange === 'week' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-xl transition-all text-[11px] ${
                timeRange === 'month' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              Month (Aug 2026)
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1.5 rounded-xl transition-all text-[11px] ${
                timeRange === 'quarter' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              Q3 Overview
            </button>
          </div>

          <button
            onClick={handleExportAnalytics}
            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Download className="w-4 h-4 text-emerald-300 stroke-[3]" /> Export Report
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Company Flow Index"
          value="93.8 / 100"
          subtitle="Top decile across tech benchmark"
          icon={Zap}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
          trend={{ value: '+4.1%', isPositive: true, label: 'vs last month' }}
        />

        <StatsCard
          title="Overall Attendance Rate"
          value="98.1%"
          subtitle="120 active team members"
          icon={CheckCircle2}
          iconColor="text-blue-700"
          iconBg="bg-blue-50 border border-blue-100"
          trend={{ value: 'Punctual', isPositive: true }}
        />

        <StatsCard
          title="Avg Daily Work Output"
          value="8.42 hrs"
          subtitle="Standard benchmark: 8.0h"
          icon={Clock}
          iconColor="text-purple-700"
          iconBg="bg-purple-50 border border-purple-100"
          trend={{ value: '+5.2%', isPositive: true }}
        />

        <StatsCard
          title="Sprint Task Velocity"
          value="86.4%"
          subtitle="642 total delivered stories"
          icon={TrendingUp}
          iconColor="text-teal-700"
          iconBg="bg-teal-50 border border-teal-100"
          trend={{ value: '+8.3%', isPositive: true }}
        />
      </div>

      {/* Charts Grid Row 1: Attendance Trends + Working Hours Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Attendance Trend */}
        <div className="lg:col-span-7 card-subtle p-6 lg:p-7 rounded-[32px] border border-slate-200/90">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Weekly Attendance & On-Site Alignment</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Punch-in compliance vs remote distribution (%)</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
              Avg 98% Present
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ATTENDANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-xl text-xs border border-slate-800">
                          <p className="font-black uppercase tracking-wider text-slate-300 text-[10px]">{label} Attendance</p>
                          <p className="text-emerald-400 font-black mt-1">Present: {payload[0]?.value}%</p>
                          <p className="text-blue-400 font-bold">Remote: {payload[1]?.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                <Bar dataKey="present" name="Present %" fill="#1B4332" radius={[8, 8, 0, 0]} />
                <Bar dataKey="remote" name="Remote %" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Working Hours Distribution */}
        <div className="lg:col-span-5 card-subtle p-6 lg:p-7 rounded-[32px] border border-slate-200/90">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Monthly Hours Breakdown</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Regular, Overtime, and Leave hours</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Past 5 Months
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_HOURS_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1 border border-slate-800">
                          <p className="font-black uppercase tracking-wider text-slate-300 text-[10px]">{label} Work Hours</p>
                          <p className="text-emerald-400 font-bold">Regular: {payload[0]?.value}h</p>
                          <p className="text-amber-400 font-bold">Overtime: {payload[1]?.value}h</p>
                          <p className="text-purple-400 font-bold">Leave: {payload[2]?.value}h</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                <Area type="monotone" dataKey="regularHours" name="Regular (h)" stackId="1" stroke="#1B4332" fill="#1B4332" fillOpacity={0.7} />
                <Area type="monotone" dataKey="overtimeHours" name="Overtime (h)" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="leaveHours" name="Leave (h)" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Department Performance Radar & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Matrix */}
        <div className="lg:col-span-5 card-subtle p-6 lg:p-7 rounded-[32px] border border-slate-200/90">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Department Alignment Radar</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Productivity vs Attendance vs Task Velocity</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-800" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="department" tick={{ fill: '#334155', fontSize: 11, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[80, 100]} stroke="#cbd5e1" />
                <Radar name="Productivity %" dataKey="productivity" stroke="#1B4332" fill="#1B4332" fillOpacity={0.5} />
                <Radar name="Attendance %" dataKey="attendance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown Table */}
        <div className="lg:col-span-7 card-subtle p-6 lg:p-7 rounded-[32px] flex flex-col justify-between border border-slate-200/90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Department Performance League</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Headcount, productivity rating, and task delivery ratio</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-3 rounded-l-2xl">Department</th>
                    <th className="py-3.5 px-3">Team Size</th>
                    <th className="py-3.5 px-3">Avg Flow</th>
                    <th className="py-3.5 px-3">Attendance</th>
                    <th className="py-3.5 px-3">Tasks (Done / Open)</th>
                    <th className="py-3.5 px-3 rounded-r-2xl text-right">Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEPARTMENT_STATS.map((dept) => {
                    const rate = Math.round(
                      (dept.completedTasks / (dept.openTasks + dept.completedTasks)) * 100
                    );

                    return (
                      <tr key={dept.name} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-black text-slate-900">{dept.name}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-600">{dept.headCount} members</td>
                        <td className="py-3.5 px-3">
                          <span className="font-black text-emerald-900">{dept.avgProductivity}%</span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-700">{dept.attendanceRate}%</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-600">
                          {dept.completedTasks} / {dept.openTasks}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100/90 text-emerald-950 border border-emerald-300">
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider flex justify-between">
            <span>Overall Org Velocity: Top 3% industry quadrant</span>
            <span className="font-black text-emerald-900">100% Policy Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
