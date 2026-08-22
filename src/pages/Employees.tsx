import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types';
import { Badge } from '../components/common/Badge';
import { StatsCard } from '../components/common/StatsCard';
import { EmployeeDetailModal } from '../components/employees/EmployeeDetailModal';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const Employees: React.FC = () => {
  const { employees } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = employees.filter((e) => e.status === 'active' || e.status === 'remote').length;
  const remoteCount = employees.filter((e) => e.status === 'remote').length;
  const onLeaveCount = employees.filter((e) => e.status === 'on_leave').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            Employee Directory
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Organization members, department distribution, attendance, and skills matrix.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View toggle */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-[11px] ${
                viewMode === 'grid' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" /> Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-[11px] ${
                viewMode === 'table' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              <List className="w-3.5 h-3.5 stroke-[2.5]" /> Table
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" /> Add Employee
          </button>
        </div>
      </div>

      {/* Directory KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Headcount"
          value={employees.length}
          subtitle="Across 6 key departments"
          icon={Users}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
          trend={{ value: '+2 this month', isPositive: true }}
        />

        <StatsCard
          title="Active & On-Duty"
          value={activeCount}
          subtitle="Punched in today"
          icon={CheckCircle2}
          iconColor="text-blue-700"
          iconBg="bg-blue-50 border border-blue-100"
          trend={{ value: '100% Verified', isPositive: true }}
        />

        <StatsCard
          title="Remote Workstations"
          value={remoteCount}
          subtitle="Distributed teams"
          icon={Sparkles}
          iconColor="text-purple-700"
          iconBg="bg-purple-50 border border-purple-100"
        />

        <StatsCard
          title="On Scheduled Leave"
          value={onLeaveCount}
          subtitle="Approved PTO & casual"
          icon={Clock}
          iconColor="text-amber-700"
          iconBg="bg-amber-50 border border-amber-100"
        />
      </div>

      {/* Filter Bar */}
      <div className="card-subtle p-4 lg:p-5 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-200/90">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, department or ID (DF-...)"
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-2xl font-black uppercase tracking-wider text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design & UX</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-2xl font-black uppercase tracking-wider text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Work Statuses</option>
            <option value="active">Active (On-Site)</option>
            <option value="remote">Remote</option>
            <option value="in_meeting">In Meeting</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="card-subtle p-6 rounded-[32px] card-hover cursor-pointer flex flex-col justify-between group border border-slate-200/90"
            >
              <div>
                {/* Avatar & Status Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-300 transition-all shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        emp.status === 'active'
                          ? 'bg-emerald-500'
                          : emp.status === 'remote'
                          ? 'bg-blue-500'
                          : emp.status === 'in_meeting'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <Badge variant="emerald" className="font-mono font-black text-[10px]">
                    {emp.employeeId}
                  </Badge>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors tracking-tight">
                  {emp.name}
                </h3>
                <p className="text-xs text-slate-600 font-bold line-clamp-1 mt-0.5">{emp.role}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{emp.department}</p>

                {/* Skills tags preview */}
                <div className="flex flex-wrap gap-1 mt-3.5">
                  {emp.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-black uppercase tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-black">
                      +{emp.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-emerald-900 text-xs">{emp.productivityScore}% Flow</span>
                </div>
                <span className="text-emerald-900 font-black text-[11px] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Dossier →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card-subtle p-6 lg:p-7 rounded-[32px] overflow-x-auto border border-slate-200/90">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 rounded-l-2xl">Employee</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Role Title</th>
                <th className="py-3.5 px-4">Work Status</th>
                <th className="py-3.5 px-4">Productivity</th>
                <th className="py-3.5 px-4">Direct Manager</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{emp.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-700">{emp.employeeId}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{emp.department}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{emp.role}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="status" value={emp.status} dot className="font-black text-[10px]">
                      {emp.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-900">{emp.productivityScore}%</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{emp.manager}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-emerald-900 font-black uppercase tracking-wider text-[11px] hover:underline">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Dossier Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />

      {/* Onboard Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
