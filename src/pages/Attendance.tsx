import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { StatsCard } from '../components/common/StatsCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { exportToCSV, formatSecondsToTime } from '../utils';
import {
  Clock,
  Play,
  Pause,
  LogOut,
  Download,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Laptop,
  Plus,
  FileText,
  Sparkles,
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const {
    clockState,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    setWorkLocation,
    attendanceHistory,
    logAttendanceNote,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecordDate, setSelectedRecordDate] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const filteredHistory = attendanceHistory.filter((item) => {
    const matchesSearch =
      item.date.includes(searchQuery) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    exportToCSV('dayflow-attendance-august-2026.csv', attendanceHistory);
    showToast('Timesheet Exported', 'Downloaded attendance records to CSV', 'success');
  };

  const handleOpenNote = (date: string, currentNote?: string) => {
    setSelectedRecordDate(date);
    setNoteText(currentNote || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedRecordDate) {
      logAttendanceNote(selectedRecordDate, noteText);
      showToast('Timesheet Note Saved', `Saved remark for ${selectedRecordDate}`, 'success');
      setIsNoteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            Attendance & Workday Logs
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Biometric punch tracking, break auditing, and monthly compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-black text-slate-800 shadow-2xs flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Download className="w-4 h-4 text-emerald-800 stroke-[2.5]" /> Export CSV Timesheet
          </button>
        </div>
      </div>

      {/* Monthly Attendance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Attendance Rate"
          value="98.4%"
          subtitle="Target: ≥95.0%"
          icon={CheckCircle2}
          iconColor="text-emerald-800"
          iconBg="bg-emerald-50 border border-emerald-100"
          trend={{ value: '+1.2%', isPositive: true, label: 'MoM improvement' }}
        />

        <StatsCard
          title="Avg. Daily Work Hours"
          value="8.35h"
          subtitle="Overtime logged: 14.5h"
          icon={Clock}
          iconColor="text-blue-800"
          iconBg="bg-blue-50 border border-blue-100"
          trend={{ value: '+0.2h', isPositive: true, label: 'above standard' }}
        />

        <StatsCard
          title="Avg. Punch-In Time"
          value="08:56 AM"
          subtitle="Office opening: 09:00 AM"
          icon={Calendar}
          iconColor="text-purple-800"
          iconBg="bg-purple-50 border border-purple-100"
          trend={{ value: 'Punctual', isPositive: true }}
        />

        <StatsCard
          title="Total Days Present"
          value="18 / 19"
          subtitle="1 Late Arrival • 1 Half Day"
          icon={AlertCircle}
          iconColor="text-amber-800"
          iconBg="bg-amber-50 border border-amber-100"
          trend={{ value: '94.7%', isPositive: true, label: 'active working days' }}
        />
      </div>

      {/* Interactive Punch Terminal & Live Status Card */}
      <div className="card-subtle p-6 lg:p-8 rounded-[32px] bg-[#1B4332] text-white border-[#153427] shadow-xl shadow-emerald-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Biometric Sync Terminal
              </span>
              <span className="text-emerald-800">•</span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  clockState.isCheckedIn
                    ? clockState.isOnBreak
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {clockState.isCheckedIn
                  ? clockState.isOnBreak
                    ? 'Break Paused'
                    : 'Active Working'
                  : 'Checked Out'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              {clockState.isCheckedIn
                ? `Logged in since ${clockState.checkInTime} (${clockState.workLocation.toUpperCase()})`
                : 'You are currently off the clock'}
            </h3>
            <p className="text-xs text-emerald-200/70 font-semibold tracking-wide">
              IP: 192.168.10.45 • Device: Apple Silicon MacBook Pro • Verified Geofence
            </p>
          </div>

          {/* Time Displays and Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-[#153427] px-5 py-3 rounded-2xl border border-[#245741] text-center min-w-[140px]">
              <p className="text-[10px] font-black text-emerald-300/70 uppercase tracking-widest">Worked Today</p>
              <p className="font-mono text-2xl font-black text-white mt-0.5">
                {formatSecondsToTime(clockState.accumulatedWorkSeconds)}
              </p>
            </div>

            <div className="bg-[#153427] px-5 py-3 rounded-2xl border border-[#245741] text-center min-w-[120px]">
              <p className="text-[10px] font-black text-emerald-300/70 uppercase tracking-widest">Break Time</p>
              <p className="font-mono text-2xl font-black text-amber-300 mt-0.5">
                {formatSecondsToTime(clockState.accumulatedBreakSeconds)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!clockState.isCheckedIn ? (
                <button
                  onClick={() => checkIn('office')}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/30 flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950 stroke-[3]" /> Clock In Now
                </button>
              ) : (
                <>
                  {clockState.isOnBreak ? (
                    <button
                      onClick={endBreak}
                      className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4" /> Resume Work
                    </button>
                  ) : (
                    <button
                      onClick={startBreak}
                      className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <Pause className="w-4 h-4 stroke-[3]" /> Take Break
                    </button>
                  )}
                  <button
                    onClick={checkOut}
                    className="px-5 py-3.5 bg-[#245741] hover:bg-[#2e6d52] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Clock Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Calendar Grid */}
      <AttendanceCalendar
        records={attendanceHistory}
        onSelectDate={(d) => handleOpenNote(d)}
      />

      {/* Attendance History Table */}
      <div className="card-subtle p-6 lg:p-7 rounded-[32px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Attendance Log Records</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Verified punch intervals, devices, and remarks</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by date or note..."
                className="pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 w-48 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late Arrival</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 rounded-l-2xl">Date</th>
                <th className="py-3.5 px-4">Punch In</th>
                <th className="py-3.5 px-4">Punch Out</th>
                <th className="py-3.5 px-4">Work Duration</th>
                <th className="py-3.5 px-4">Break</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Location / Zone</th>
                <th className="py-3.5 px-4">Remarks</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-black text-slate-900 font-mono">{item.date}</td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-900">{item.checkIn}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-700">{item.checkOut || 'Active'}</td>
                  <td className="py-4 px-4 font-black text-slate-900">{item.workingHours}h</td>
                  <td className="py-4 px-4 font-semibold text-slate-600">{item.breakDurationMinutes}m</td>
                  <td className="py-4 px-4">
                    <Badge variant="status" value={item.status} dot>
                      {item.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700 truncate max-w-[140px]">{item.location}</td>
                  <td className="py-4 px-4 font-medium text-slate-500 truncate max-w-[160px]">
                    {item.notes || '—'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenNote(item.date, item.notes)}
                      className="text-xs font-black text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[2.5]" /> Edit Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              No matching attendance records found.
            </div>
          )}
        </div>
      </div>

      {/* Edit Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Attendance Regularization & Remark"
        subtitle={`Add explanation or log note for ${selectedRecordDate}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Remark / Reason
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Worked on client site; transit delay on Highway 101; approved project sprint review."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-5 py-2.5 bg-[#1B4332] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#245741] transition-colors shadow-md shadow-emerald-950/20"
            >
              Save Remark
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
