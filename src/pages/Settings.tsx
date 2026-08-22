import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Lock,
  Globe,
  Clock,
  Shield,
  Sliders,
  CheckCircle2,
  Save,
  Moon,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { showToast } = useApp();
  const { userRole } = useAuth();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [flowReminders, setFlowReminders] = useState(true);
  const [leaveNotifications, setLeaveNotifications] = useState(true);
  const [autoClockOut, setAutoClockOut] = useState(false);
  const [geofenceEnforce, setGeofenceEnforce] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [dailyWorkTarget, setDailyWorkTarget] = useState('8.0');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'System preferences and notification rules updated', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
          System Preferences & Workday Configuration
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Customize notification triggers, biometric compliance rules, and security controls.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Workday & Flow Parameters */}
        <div className="card-subtle p-6 lg:p-7 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Clock className="w-5 h-5 text-emerald-800 stroke-[2.5]" />
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Workday & Flow Parameters</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Core shift times, break limits, and target hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
                Daily Work Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="4"
                max="12"
                value={dailyWorkTarget}
                onChange={(e) => setDailyWorkTarget(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
                Preferred Timezone
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer">
                <option>America/Los_Angeles (Pacific Standard Time - UTC-8)</option>
                <option>America/New_York (Eastern Standard Time - UTC-5)</option>
                <option>Europe/London (GMT - UTC+0)</option>
                <option>Asia/Tokyo (JST - UTC+9)</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">Enforce Geofenced Terminal Verification</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verify punch-in GPS coordinates against authorized corporate hub</p>
              </div>
              <input
                type="checkbox"
                checked={geofenceEnforce}
                onChange={(e) => setGeofenceEnforce(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">Automatic Clock-Out at Midnight</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Cap runaway sessions if punch-out is accidentally missed</p>
              </div>
              <input
                type="checkbox"
                checked={autoClockOut}
                onChange={(e) => setAutoClockOut(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Flow Triggers */}
        <div className="card-subtle p-6 lg:p-7 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Bell className="w-5 h-5 text-emerald-800 stroke-[2.5]" />
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Notification Triggers & Alerts</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Stay aligned on task handoffs and leave approvals</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">Daily Morning Alignment Briefing</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Receive today's schedule and priority tasks at 08:30 AM</p>
              </div>
              <input
                type="checkbox"
                checked={flowReminders}
                onChange={(e) => setFlowReminders(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">Leave Decision & Review Updates</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Immediate email and push notification on PTO approvals</p>
              </div>
              <input
                type="checkbox"
                checked={leaveNotifications}
                onChange={(e) => setLeaveNotifications(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">Email Digest for Timesheet Records</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Weekly PDF timesheet sent to registered work email</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="card-subtle p-6 lg:p-7 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Shield className="w-5 h-5 text-emerald-800 stroke-[2.5]" />
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Security & Authentication</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Multi-factor security and biometric tokens</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div>
              <p className="text-xs font-black text-slate-900 tracking-tight">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Requires authenticator app confirmation on login</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-4 h-4 text-[#1B4332] rounded-md border-slate-300 focus:ring-emerald-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Update All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
