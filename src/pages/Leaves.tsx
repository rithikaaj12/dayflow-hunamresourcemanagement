import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest, LeaveStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { ApplyLeaveModal } from '../components/leaves/ApplyLeaveModal';
import { Modal } from '../components/common/Modal';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  User,
  Shield,
  FileText,
} from 'lucide-react';

export const Leaves: React.FC = () => {
  const { leaveBalances, leaveRequests, reviewLeave, showToast } = useApp();
  const { userRole } = useAuth();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (req: LeaveRequest) => {
    setSelectedReviewRequest(req);
    setReviewRemarks('');
  };

  const handlePerformReview = (status: 'approved' | 'rejected') => {
    if (selectedReviewRequest) {
      reviewLeave(selectedReviewRequest.id, status, reviewRemarks);
      setSelectedReviewRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Track annual quotas, submit absence requests, and manage manager approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" /> Apply for Leave
          </button>
        </div>
      </div>

      {/* Leave Balance Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((bal) => {
          const usedPct = Math.round((bal.used / bal.total) * 100);

          return (
            <div key={bal.type} className="card-subtle p-6 rounded-[32px] flex flex-col justify-between border border-slate-200/90">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {bal.label}
                  </span>
                  <Badge variant={bal.color as any}>
                    {bal.available}d left
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {bal.available}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">/ {bal.total} Days</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1.5">
                  <span>Used: {bal.used}d</span>
                  <span>{usedPct}% used</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bal.type === 'annual'
                        ? 'bg-emerald-600'
                        : bal.type === 'sick'
                        ? 'bg-blue-600'
                        : bal.type === 'casual'
                        ? 'bg-amber-500'
                        : 'bg-purple-600'
                    }`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave Request Management Table */}
      <div className="card-subtle p-6 lg:p-7 rounded-[32px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Leave Applications & History</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Review status, reviewer remarks, and delegate handovers
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applicant or reason..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 w-48 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Request Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Declined</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 rounded-l-2xl">Applicant</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Interval / Duration</th>
                <th className="py-3.5 px-4">Reason & Handover</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reviewer Remarks</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-black text-slate-900">{req.employeeName}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{req.department}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-black text-slate-800 capitalize">
                    {req.type.replace('_', ' ')}
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-700">
                    <p>
                      {req.startDate} {req.startDate !== req.endDate && `→ ${req.endDate}`}
                    </p>
                    <p className="text-[11px] text-emerald-900 font-black">
                      {req.days} Day(s) {req.isHalfDay && `(${req.halfDayType?.replace('_', ' ')})`}
                    </p>
                  </td>

                  <td className="py-4 px-4 max-w-[200px]">
                    <p className="font-medium text-slate-800 line-clamp-1">{req.reason}</p>
                    {req.handoverTo && (
                      <p className="text-[11px] text-slate-400 font-semibold">Handover: {req.handoverTo}</p>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant="status" value={req.status} dot>
                      {req.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-slate-500 font-medium max-w-[160px] truncate">
                    {req.reviewerRemarks || 'Pending review'}
                  </td>

                  <td className="py-4 px-4 text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenReview(req)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => reviewLeave(req.id, 'approved', 'Fast 1-click approval')}
                          className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Fast Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono font-bold">
                        {req.reviewDate || req.appliedDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              No leave requests matching criteria.
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedReviewRequest}
        onClose={() => setSelectedReviewRequest(null)}
        title="Manager Leave Decision"
        subtitle={`Review request submitted by ${selectedReviewRequest?.employeeName}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <p>
              <span className="text-slate-500 font-medium">Type & Duration:</span>{' '}
              <span className="font-bold text-slate-900 capitalize">
                {selectedReviewRequest?.type} ({selectedReviewRequest?.days} Days)
              </span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Dates:</span>{' '}
              <span className="font-semibold text-slate-800 font-mono">
                {selectedReviewRequest?.startDate} to {selectedReviewRequest?.endDate}
              </span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Reason:</span>{' '}
              <span className="text-slate-800">{selectedReviewRequest?.reason}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reviewer Notes / Feedback
            </label>
            <textarea
              rows={3}
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
              placeholder="e.g. Approved. Please confirm sprint tickets are assigned to Devon."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handlePerformReview('rejected')}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
            >
              Decline Request
            </button>
            <button
              onClick={() => handlePerformReview('approved')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all"
            >
              Approve Leave
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
