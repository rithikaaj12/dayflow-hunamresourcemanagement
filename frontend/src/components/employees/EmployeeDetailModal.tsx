import React from 'react';
import { Modal } from '../common/Modal';
import { Employee } from '../../types';
import { Badge } from '../common/Badge';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Zap,
  Briefcase,
  Shield,
  Clock,
  User,
  Star,
} from 'lucide-react';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Profile & Alignment Dossier"
      subtitle={`Comprehensive records for ${employee.name} (${employee.employeeId})`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-[28px] bg-slate-50/80 border border-slate-200">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-20 h-20 rounded-[22px] object-cover ring-4 ring-white shadow-md shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight font-display">{employee.name}</h3>
              <div className="flex items-center gap-1.5">
                <Badge variant="status" value={employee.status} dot className="font-black text-[10px]">
                  {employee.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="emerald" className="font-mono font-black text-[10px]">ID: {employee.employeeId}</Badge>
              </div>
            </div>

            <p className="text-xs font-black text-emerald-950 uppercase tracking-wider mt-1">{employee.role}</p>
            <p className="text-xs text-slate-500 font-bold">{employee.department} • Reports to {employee.manager}</p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-600 flex-wrap font-medium">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" /> {employee.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" /> {employee.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Performance & Productivity Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center">
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">Productivity</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">{employee.productivityScore}%</p>
            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">Optimal Flow</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-center">
            <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Rating</p>
            <p className="text-2xl font-black text-blue-950 mt-1 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {employee.performanceRating}
            </p>
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-0.5">Top 5% Tier</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-center">
            <p className="text-[10px] font-black text-purple-900 uppercase tracking-wider">Attendance</p>
            <p className="text-2xl font-black text-purple-950 mt-1">98.8%</p>
            <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider mt-0.5">Punctual</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Tenure</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{employee.joinDate.split('-')[0]}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Joined {employee.joinDate}</p>
          </div>
        </div>

        {/* Skills & Competencies */}
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> Technical & Domain Competencies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {employee.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-black bg-white border border-slate-200 text-slate-800 shadow-2xs uppercase tracking-wider text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Workday & Compensation Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Compensation Level:</span>
            <span className="font-black text-slate-900">{employee.salaryTier || 'Tier IV ($140k)'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Punch-In Recorded Today:</span>
            <span className="font-black text-emerald-900">{employee.checkInTimeToday || '08:58 AM'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Work Location:</span>
            <span className="font-black text-slate-900">San Francisco HQ / Hybrid Protocol</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};
