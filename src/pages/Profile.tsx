import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  Shield,
  Clock,
  Sparkles,
  Camera,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Alexandre Chen');
  const [email, setEmail] = useState(currentUser?.email || 'alexandre.c@dayflow.io');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 382-9912');
  const [department, setDepartment] = useState(currentUser?.department || 'Engineering');
  const [role, setRole] = useState(currentUser?.role || 'Staff Platform Architect');
  const [bio, setBio] = useState(
    'Specializing in distributed systems, developer flow acceleration, and reactive HR infrastructure. Dayflow engineering lead.'
  );
  const [emergencyContact, setEmergencyContact] = useState('Elena Chen (+1 555-912-0043) - Spouse');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST - UTC-8)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      department,
      role,
    });
    showToast('Profile Updated', 'Your profile details were saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
          My Profile & Workday Dossier
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Manage personal credentials, contact info, bio, and workday configuration.
        </p>
      </div>

      {/* Hero Profile Banner */}
      <div className="card-subtle p-7 rounded-[32px] bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative group">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/20 shadow-2xl"
            />
            <button
              onClick={() => showToast('Avatar Update', 'Avatar uploaded and synced', 'info')}
              className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">{currentUser?.name}</h2>
              <Badge variant="emerald" className="font-mono text-xs font-black">
                {currentUser?.employeeId}
              </Badge>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentUser?.role}
              </span>
            </div>

            <p className="text-sm font-black text-emerald-400 uppercase tracking-wider">{currentUser?.role}</p>
            <p className="text-xs text-slate-300 font-bold">
              {currentUser?.department} • Full-Time • Joined {currentUser?.joinDate}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300 flex-wrap font-bold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> San Francisco HQ
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> PST (UTC-8)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-black">
                <Sparkles className="w-3.5 h-3.5" /> 94% Peak Flow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <form onSubmit={handleSave} className="card-subtle p-6 lg:p-7 rounded-[32px] space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Personal & Contact Information</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Keep your corporate credentials up to date</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Corporate Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Primary Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Emergency Contact & Relation
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Job Title / Designation
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Professional Biography & Focus Area
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>
    </div>
  );
};
