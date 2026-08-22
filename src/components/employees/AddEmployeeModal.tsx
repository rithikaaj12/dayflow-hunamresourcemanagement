import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Employee } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [phone, setPhone] = useState('+1 (555) ');
  const [manager, setManager] = useState('Sarah Jenkins');
  const [salaryTier, setSalaryTier] = useState('Tier IV ($140k)');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Collaboration');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const randomAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    ];

    addEmployee({
      employeeId: `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      role,
      department,
      phone,
      manager,
      salaryTier,
      skills,
      avatar: randomAvatars[Math.floor(Math.random() * randomAvatars.length)],
      status: 'active',
      attendanceToday: 'present',
      checkInTimeToday: '09:00 AM',
      joinDate: new Date().toISOString().split('T')[0],
      productivityScore: 92,
      performanceRating: 4.8,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Team Member"
      subtitle="Register an employee profile into Dayflow HRMS."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Miller"
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Work Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.m@dayflow.io"
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Job Title / Role *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Security Specialist"
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
              <option value="Design">Design & UX</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Direct Reporting Manager
            </label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Next.js, Cloud Run, CI/CD, Scrum"
            className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden"
          />
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
            Complete Onboarding
          </button>
        </div>
      </form>
    </Modal>
  );
};
