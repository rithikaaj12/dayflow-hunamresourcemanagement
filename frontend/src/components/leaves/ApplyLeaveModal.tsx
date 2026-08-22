import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { LeaveType } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { applyLeave, employees } = useApp();
  const { currentUser } = useAuth();

  const [type, setType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('2026-09-04');
  const [endDate, setEndDate] = useState('2026-09-05');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState<'first_half' | 'second_half'>('first_half');
  const [reason, setReason] = useState('');
  const [handoverTo, setHandoverTo] = useState('Devon Bradley');

  const calculateDays = () => {
    if (isHalfDay) return 0.5;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    applyLeave({
      employeeId: currentUser?.employeeId || 'DF-8834',
      employeeName: currentUser?.name || 'Alexandre Chen',
      employeeAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      department: currentUser?.department || 'Engineering',
      type,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      days: calculateDays(),
      isHalfDay,
      halfDayType: isHalfDay ? halfDayType : undefined,
      reason,
      handoverTo,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Workday Leave"
      subtitle="Submit request for manager approval and automated calendar blockage."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Leave Category *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="annual">Annual Paid Leave (14 days left)</option>
            <option value="sick">Medical & Sick Leave (10 days left)</option>
            <option value="casual">Casual / Personal Leave (5 days left)</option>
            <option value="comp_off">Compensatory Off (3 days left)</option>
            <option value="unpaid">Unpaid Leave of Absence</option>
          </select>
        </div>

        {/* Half Day Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
          <div>
            <p className="text-xs font-black text-slate-900 tracking-tight">Half-Day Leave</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Apply for 4 hours morning or afternoon</p>
          </div>
          <input
            type="checkbox"
            checked={isHalfDay}
            onChange={(e) => setIsHalfDay(e.target.checked)}
            className="w-4 h-4 text-emerald-900 rounded-md border-slate-300 focus:ring-emerald-800 cursor-pointer"
          />
        </div>

        {isHalfDay && (
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Half Day Session
            </label>
            <select
              value={halfDayType}
              onChange={(e) => setHalfDayType(e.target.value as 'first_half' | 'second_half')}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="first_half">First Half (09:00 AM – 01:30 PM)</option>
              <option value="second_half">Second Half (01:30 PM – 06:00 PM)</option>
            </select>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
            />
          </div>

          {!isHalfDay && (
            <div>
              <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Task Handover Delegate
          </label>
          <select
            value={handoverTo}
            onChange={(e) => setHandoverTo(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.name}>
                {e.name} ({e.department} - {e.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Reason & Justification *
          </label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Attending family wedding in Seattle; coverage arranged with Devon."
            className="w-full p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
          />
        </div>

        {/* Calculated summary pill */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-emerald-950 font-black uppercase tracking-wider text-[10px]">Total Duration Requested:</span>
          <span className="font-black text-emerald-950 font-mono text-sm">{calculateDays()} Day(s)</span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
          >
            Submit Application
          </button>
        </div>
      </form>
    </Modal>
  );
};
