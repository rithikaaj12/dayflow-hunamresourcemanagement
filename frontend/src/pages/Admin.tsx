import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/common/StatsCard';
import { Badge } from '../components/common/Badge';
import { DEPARTMENT_STATS } from '../data/mockData';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  CalendarCheck,
  Zap,
  TrendingUp,
  Cpu,
  RefreshCw,
  Send,
  Download,
  Building,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { userRole, switchRole } = useAuth();
  const { employees, leaveRequests, tasks, showToast } = useApp();
  const navigate = useNavigate();

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length;

  const handleBroadcast = () => {
    showToast('Company Broadcast Sent', 'Sent workday alignment notice to 120 employees', 'success');
  };

  const handleSyncTerminals = () => {
    showToast('Biometrics Synced', 'All 4 corporate badge readers synchronized', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
              Executive Administration
            </h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-100/90 text-purple-950 border border-purple-300">
              Control Plane
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Global HR compliance, payroll synchronizer, department governance, and system audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBroadcast}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" /> Send Broadcast
          </button>
          <button
            onClick={handleSyncTerminals}
            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-300 stroke-[3]" /> Sync Readers
          </button>
        </div>
      </div>

      {/* Role Switcher Demo Box */}
      <div className="card-subtle p-6 rounded-[32px] bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Key className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-base font-black text-white tracking-tight">Live Role Permission Switcher</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Currently active as:{' '}
              <span className="text-emerald-400 font-black">{userRole}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap font-black uppercase tracking-wider text-[11px]">
          <button
            onClick={() => switchRole('admin')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              userRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('manager')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              userRole === 'manager'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => switchRole('employee')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              userRole === 'employee'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Employee
          </button>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Organization Staff"
          value={employees.length}
          subtitle="6 business units"
          icon={Users}
          iconColor="text-purple-700"
          iconBg="bg-purple-50 border border-purple-100"
          trend={{ value: '100% Onboarded', isPositive: true }}
          actionText="Directory"
          onClick={() => navigate('/employees')}
        />

        <StatsCard
          title="Pending Leave Reviews"
          value={pendingLeaves}
          subtitle="Requires executive decision"
          icon={CalendarCheck}
          iconColor="text-amber-700"
          iconBg="bg-amber-50 border border-amber-100"
          trend={{ value: 'Action Required', isPositive: false }}
          actionText="Review Leaves"
          onClick={() => navigate('/leaves')}
        />

        <StatsCard
          title="Avg Flow Productivity"
          value="94.2%"
          subtitle="All squads exceeding SLA"
          icon={Zap}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
          trend={{ value: '+2.8%', isPositive: true }}
          actionText="Analytics"
          onClick={() => navigate('/analytics')}
        />

        <StatsCard
          title="HR Compliance & Biometrics"
          value="100%"
          subtitle="SOC2 Type II & GDPR Verified"
          icon={ShieldCheck}
          iconColor="text-teal-700"
          iconBg="bg-teal-50 border border-teal-100"
        />
      </div>

      {/* Department Status & Health Grid */}
      <div className="card-subtle p-6 lg:p-7 rounded-[32px] border border-slate-200/90">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Department Governance Matrix</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Workload distribution, flow state health, and active attendance rate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENT_STATS.map((d) => (
            <div
              key={d.name}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-900 tracking-tight">{d.name}</h4>
                <Badge variant="emerald" className="font-mono font-black text-[10px]">{d.headCount} Staff</Badge>
              </div>

              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Flow State Score:</span>
                  <span className="font-black text-emerald-900">{d.avgProductivity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Attendance Rate:</span>
                  <span className="font-bold text-slate-800">{d.attendanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Delivered Tasks:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {d.completedTasks} / {d.completedTasks + d.openTasks}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Audit Log */}
      <div className="card-subtle p-6 lg:p-7 rounded-[32px] border border-slate-200/90">
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">Administrative Audit Trail</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-5">Recent platform security, role changes, and compliance events</p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <div>
                <p className="font-black text-slate-900 text-sm">Biometric Clock Terminal Auto-Reconciliation</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Synced 120 attendance punch records with zero anomalies</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">10 mins ago</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
              <div>
                <p className="font-black text-slate-900 text-sm">Annual Leave Policy Quota Allocation</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Accrued 1.5 PTO days for all full-time personnel</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">2 hours ago</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
              <div>
                <p className="font-black text-slate-900 text-sm">SOC2 Type II Security Protocol Audit</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">2FA enforced across 100% active corporate accounts</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};
