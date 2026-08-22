import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  LayoutDashboard,
  Clock,
  CheckSquare,
  Users,
  CalendarCheck,
  BarChart3,
  User,
  Settings,
  Shield,
  PlusCircle,
  Play,
  Coffee,
  X,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CommandSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, employees, tasks, clockState, checkIn, startBreak, endBreak } =
    useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { label: 'Live Attendance & Calendar', path: '/attendance', icon: Clock, category: 'Pages' },
    { label: 'My Tasks & Workflow', path: '/tasks', icon: CheckSquare, category: 'Pages' },
    { label: 'Employee Directory', path: '/employees', icon: Users, category: 'Pages' },
    { label: 'Leave Management', path: '/leaves', icon: CalendarCheck, category: 'Pages' },
    { label: 'HR Analytics & Trends', path: '/analytics', icon: BarChart3, category: 'Pages' },
    { label: 'My Profile & Work Details', path: '/profile', icon: User, category: 'Pages' },
    { label: 'Settings & Preferences', path: '/settings', icon: Settings, category: 'Pages' },
    { label: 'Admin Dashboard', path: '/admin', icon: Shield, category: 'Pages' },
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEmployees = employees
    .filter(
      (e) =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.department.toLowerCase().includes(query.toLowerCase()) ||
        e.role.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  const filteredTasks = tasks
    .filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.department.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
        <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="flex items-center px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0 stroke-[2.5]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, employees, tasks, or actions... (Cmd+K)"
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base font-bold focus:outline-hidden"
            />
            {query ? (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-xl bg-slate-200 text-slate-700">
                ESC
              </span>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-black uppercase text-[10px] tracking-wider whitespace-nowrap pl-1">Actions:</span>
            {!clockState.isCheckedIn ? (
              <button
                onClick={() => {
                  checkIn('office');
                  setIsSearchOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4332] hover:bg-[#245741] text-white rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Clock In Now
              </button>
            ) : clockState.isOnBreak ? (
              <button
                onClick={() => {
                  endBreak();
                  setIsSearchOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Resume Work
              </button>
            ) : (
              <button
                onClick={() => {
                  startBreak();
                  setIsSearchOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" /> Take Break
              </button>
            )}
            <button
              onClick={() => handleSelect('/leaves?action=apply')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" /> Apply Leave
            </button>
            <button
              onClick={() => handleSelect('/tasks?action=new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" /> Create Task
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Pages */}
            <div>
              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pages & Workflows
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-900" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Employees */}
            {filteredEmployees.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Colleagues & Directory
                </div>
                <div className="space-y-1">
                  {filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelect(`/employees?id=${emp.id}`)}
                      className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-7 h-7 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-black text-slate-900 leading-tight text-xs">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{emp.role} • {emp.department}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{emp.employeeId}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {filteredTasks.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Tasks
                </div>
                <div className="space-y-1">
                  {filteredTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelect('/tasks')}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-900 text-xs">{t.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.status}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between font-medium">
            <span>Tip: Press <kbd className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border text-[10px]">↑</kbd> <kbd className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border text-[10px]">↓</kbd> to navigate</span>
            <span className="font-black uppercase tracking-wider text-[10px]">DAYFLOW • HRMS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
