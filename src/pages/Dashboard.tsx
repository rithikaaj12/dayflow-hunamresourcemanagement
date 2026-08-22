import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/common/StatsCard';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { ScheduleTimeline } from '../components/dashboard/ScheduleTimeline';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { LiveClockWidget } from '../components/dashboard/LiveClockWidget';
import {
  Clock,
  Zap,
  CheckSquare,
  AlertCircle,
  CalendarCheck,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { clockState, tasks, leaveBalances, setIsSearchOpen } = useApp();
  const navigate = useNavigate();

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const hoursLoggedNum = Number((clockState.accumulatedWorkSeconds / 3600).toFixed(1));

  const totalLeaveAvailable = leaveBalances.reduce((acc, curr) => acc + curr.available, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Header & Quick Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
              {getGreeting()}, {currentUser?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-2 font-bold tracking-wide">
            <span className="text-slate-400 uppercase tracking-widest text-[11px]">Every Workday, Perfectly Aligned</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-800 font-black flex items-center gap-1 text-[11px] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5" /> High Flow Active
            </span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-black shadow-2xs flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            Quick Find <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </button>
          <button
            onClick={() => navigate('/leaves?action=apply')}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-black shadow-2xs flex items-center gap-1.5 transition-all uppercase tracking-wider"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Apply Leave
          </button>
          <button
            onClick={() => navigate('/tasks?action=new')}
            className="px-5 py-2.5 rounded-2xl bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300 stroke-[2.5]" /> New Task
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Work Hours"
          value={`${hoursLoggedNum}h`}
          subtitle="Target: 8.0h / day"
          icon={Clock}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
          trend={{ value: '+0.5h', isPositive: true, label: 'vs yesterday' }}
          actionText="View Timesheet"
          onClick={() => navigate('/attendance')}
        />

        <StatsCard
          title="Productivity Score"
          value="94%"
          subtitle="Flow state alignment: Optimal"
          icon={Zap}
          iconColor="text-teal-700"
          iconBg="bg-teal-50 border border-teal-100"
          trend={{ value: '+3.2%', isPositive: true, label: 'vs team average' }}
          actionText="Analytics"
          onClick={() => navigate('/analytics')}
        />

        <StatsCard
          title="Completed Tasks"
          value={completedTasksCount}
          subtitle={`${tasks.length} total tasks assigned`}
          icon={CheckSquare}
          iconColor="text-indigo-700"
          iconBg="bg-indigo-50 border border-indigo-100"
          trend={{ value: '100%', isPositive: true, label: 'on time delivery' }}
          actionText="Task Board"
          onClick={() => navigate('/tasks')}
        />

        <StatsCard
          title="Available Leave Balance"
          value={`${totalLeaveAvailable} Days`}
          subtitle="Annual, Sick & Casual"
          icon={CalendarCheck}
          iconColor="text-purple-700"
          iconBg="bg-purple-50 border border-purple-100"
          trend={{ value: '1 Pending', isPositive: true, label: 'under review' }}
          actionText="Manage Leaves"
          onClick={() => navigate('/leaves')}
        />
      </div>

      {/* Main Interactive Grid: Live Clock + Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Punch Clock Widget */}
        <div className="lg:col-span-5">
          <LiveClockWidget />
        </div>

        {/* Productivity & Flow Telemetry Chart */}
        <div className="lg:col-span-7">
          <ProductivityChart />
        </div>
      </div>

      {/* Bottom Row: Today's Schedule + Live Workday Pulse Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aligned Schedule */}
        <div className="lg:col-span-7">
          <ScheduleTimeline />
        </div>

        {/* Real-time Activity Feed */}
        <div className="lg:col-span-5">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
