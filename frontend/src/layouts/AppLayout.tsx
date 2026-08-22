import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatSecondsToTime } from '../utils';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  Users,
  CalendarCheck,
  BarChart3,
  User,
  Settings,
  Shield,
  Search,
  Bell,
  Play,
  Pause,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Layers,
  Zap,
  Check,
  ChevronDown,
} from 'lucide-react';
import { CommandSearchModal } from '../components/common/CommandSearchModal';
import { ToastContainer } from '../components/common/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';

export const AppLayout: React.FC = () => {
  const { currentUser, userRole, switchRole, logout } = useAuth();
  const {
    clockState,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    tasks,
    leaveRequests,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchOpen,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'pending').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: Clock,
      badge: clockState.isCheckedIn ? (clockState.isOnBreak ? 'Break' : 'Active') : undefined,
      badgeColor: clockState.isOnBreak ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-850',
    },
    {
      label: 'My Tasks',
      path: '/tasks',
      icon: CheckSquare,
      count: pendingTasksCount,
    },
    { label: 'Employees', path: '/employees', icon: Users },
    {
      label: 'Leave Management',
      path: '/leaves',
      icon: CalendarCheck,
      count: userRole !== 'employee' ? pendingLeavesCount : undefined,
    },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex flex-col antialiased">
      {/* Top Banner: Role Switcher & Live HR Demo helper */}
      <div className="bg-[#112D20] text-emerald-100/90 text-xs px-4 lg:px-6 py-2 flex items-center justify-between border-b border-emerald-900/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-black text-white tracking-wider text-[11px] uppercase">DAYFLOW LIVE HRMS</span>
          <span className="hidden md:inline text-emerald-700">|</span>
          <span className="hidden md:inline text-emerald-200/80 font-bold text-[11px] tracking-wide">
            TIME <span className="text-emerald-400 font-black">→</span> FLOW <span className="text-emerald-400 font-black">→</span> PRODUCTIVITY
          </span>
        </div>

        {/* Quick Persona / Role Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-emerald-300/70 font-bold text-[11px] uppercase tracking-wider hidden sm:inline">Active Persona:</span>
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#245741] text-white px-3 py-1 rounded-xl font-bold text-xs border border-emerald-700/50 shadow-xs transition-colors"
            >
              <span className="capitalize font-black text-emerald-300">{userRole}</span>
              <span className="text-emerald-100/80 font-medium">({currentUser?.name?.split(' ')[0]})</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {isRoleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRoleMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 text-slate-800">
                  <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => {
                      switchRole('employee');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      userRole === 'employee' ? 'bg-emerald-50 text-emerald-950 font-bold' : ''
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">Alexandre Chen</p>
                      <p className="text-[11px] text-slate-500 font-medium">Employee • Engineering</p>
                    </div>
                    {userRole === 'employee' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('manager');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      userRole === 'manager' ? 'bg-emerald-50 text-emerald-950 font-bold' : ''
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">Sarah Jenkins</p>
                      <p className="text-[11px] text-slate-500 font-medium">HR Manager • Approver</p>
                    </div>
                    {userRole === 'manager' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      userRole === 'admin' ? 'bg-emerald-50 text-emerald-950 font-bold' : ''
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">Marcus Vance</p>
                      <p className="text-[11px] text-slate-500 font-medium">Admin • Executive Org</p>
                    </div>
                    {userRole === 'admin' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-[#1B4332] text-white border-r border-[#153427] shrink-0 select-none">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#245741] flex items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-slate-950 font-black text-2xl tracking-tighter">
                DF
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-display">
                  DAYFLOW
                  <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    HRMS
                  </span>
                </span>
                <p className="text-[11px] text-emerald-200/70 font-semibold tracking-wide">Workday Aligned</p>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
            <div className="px-3.5 py-1.5 text-[10px] font-black text-emerald-300/60 uppercase tracking-widest">
              Core Workspace
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 group ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/30 font-black'
                      : 'text-emerald-100/80 hover:bg-[#245741] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                      location.pathname === item.path ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-300/80'
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      location.pathname === item.path
                        ? 'bg-slate-950 text-emerald-300'
                        : 'bg-[#153427] text-emerald-200'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Management / Admin Section */}
            <div className="pt-5 px-3.5 py-1.5 text-[10px] font-black text-emerald-300/60 uppercase tracking-widest">
              Governance & Org
            </div>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 group ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-950/30'
                    : 'text-emerald-100/80 hover:bg-[#245741] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Shield
                  className={`w-4 h-4 ${
                    location.pathname === '/admin' ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400'
                  }`}
                />
                <span className="flex items-center gap-1.5 tracking-tight">
                  Admin Control Plane
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                Org
              </span>
            </NavLink>
          </div>

          {/* Sidebar Mini Widget: Live Time & Flow status */}
          <div className="p-4 m-3 rounded-2xl bg-[#153427] border border-[#245741]">
            <div className="flex items-center justify-between text-xs text-emerald-200 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Workday Status
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  clockState.isCheckedIn
                    ? clockState.isOnBreak
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {clockState.isCheckedIn
                  ? clockState.isOnBreak
                    ? 'Break'
                    : 'Working'
                  : 'Off-Clock'}
              </span>
            </div>

            <div className="font-mono text-2xl font-black text-white tracking-tight text-center py-1">
              {formatSecondsToTime(clockState.accumulatedWorkSeconds)}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {!clockState.isCheckedIn ? (
                <button
                  onClick={() => checkIn('office')}
                  className="col-span-2 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2 rounded-xl transition-all shadow-md shadow-emerald-950/30 uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 stroke-[3]" /> Clock In
                </button>
              ) : (
                <>
                  {clockState.isOnBreak ? (
                    <button
                      onClick={endBreak}
                      className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      <Play className="w-3 h-3 stroke-[3]" /> Resume
                    </button>
                  ) : (
                    <button
                      onClick={startBreak}
                      className="flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-2 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      <Pause className="w-3 h-3 stroke-[3]" /> Break
                    </button>
                  )}
                  <button
                    onClick={checkOut}
                    className="flex items-center justify-center gap-1 bg-[#245741] hover:bg-[#2e6d52] text-white text-xs font-black py-2 rounded-xl transition-colors uppercase tracking-wider"
                  >
                    <LogOut className="w-3 h-3" /> Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Quick Profile Footer */}
          <div className="p-4 border-t border-[#245741] flex items-center justify-between">
            <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 hover:opacity-90">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-2xl object-cover ring-2 ring-emerald-400/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate tracking-tight">{currentUser?.name}</p>
                <p className="text-[10px] font-bold text-emerald-200/70 truncate capitalize tracking-wide">{currentUser?.role} • {currentUser?.department}</p>
              </div>
            </NavLink>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-[#245741] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOP APP HEADER */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Toggle & Search trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Command Bar Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-500 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 rounded-2xl transition-all w-48 sm:w-80 justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Search Dayflow command & actions...</span>
                  <span className="sm:hidden">Search...</span>
                </div>
                <kbd className="hidden sm:inline-block font-mono font-bold text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Live Work Hours Pill, Notifications, User Avatar */}
            <div className="flex items-center gap-3">
              {/* Live Punch-In Status Widget */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-slate-200 bg-white text-xs shadow-2xs">
                <span className="flex h-2.5 w-2.5 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      clockState.isCheckedIn
                        ? clockState.isOnBreak
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      clockState.isCheckedIn
                        ? clockState.isOnBreak
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                </span>
                <span className="font-black text-slate-800 text-[11px] uppercase tracking-wider">
                  {clockState.isCheckedIn
                    ? clockState.isOnBreak
                      ? 'On Break'
                      : 'Working'
                    : 'Off-Clock'}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-mono font-black text-slate-900 text-xs">
                  {formatSecondsToTime(clockState.accumulatedWorkSeconds)}
                </span>
                <NavLink
                  to="/attendance"
                  className="text-emerald-800 font-black hover:underline text-[11px] uppercase tracking-wider ml-1"
                >
                  Manage →
                </NavLink>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent hover:border-slate-200"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[28px] shadow-2xl border border-slate-200 py-3 z-50 overflow-hidden">
                      <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h4>
                          {unreadNotifsCount > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                              {unreadNotifsCount} new
                            </span>
                          )}
                        </div>
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs font-bold text-emerald-800 hover:underline uppercase tracking-wider text-[11px]"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-black text-slate-900 leading-snug">{n.title}</p>
                              <span className="text-[10px] text-slate-400 shrink-0 font-bold">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{n.message}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs font-black text-emerald-800 hover:underline uppercase tracking-wider"
                        >
                          View all company activity →
                        </NavLink>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200/80 bg-white"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-600/30"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline mr-1" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-[28px] shadow-2xl border border-slate-200 py-3 z-50">
                      <div className="px-5 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-900 tracking-tight">{currentUser?.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{currentUser?.email}</p>
                      </div>

                      <div className="py-2 px-2">
                        <NavLink
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <User className="w-4 h-4 text-slate-400" /> My Profile
                        </NavLink>
                        <NavLink
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                        </NavLink>
                        <NavLink
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-950"
                        >
                          <Shield className="w-4 h-4 text-emerald-600" /> Admin Console
                        </NavLink>
                      </div>

                      <div className="border-t border-slate-100 pt-2 px-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* MOBILE DRAWER NAVIGATION */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -250 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -250 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#1B4332] text-white z-50 shadow-2xl p-6 flex flex-col justify-between lg:hidden"
              >
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-[#245741]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
                        DF
                      </div>
                      <span className="font-black text-lg tracking-tight">DAYFLOW</span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 text-emerald-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-5 space-y-1.5">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold ${
                            isActive ? 'bg-emerald-500 text-slate-950 font-black' : 'text-emerald-100 hover:bg-[#245741]'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </NavLink>
                    ))}
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-black text-emerald-300 hover:bg-[#245741]"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Control Plane</span>
                    </NavLink>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#245741]">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-black text-white">{currentUser?.name}</p>
                      <p className="text-[10px] font-bold text-emerald-200 capitalize">{currentUser?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-[#245741] hover:bg-[#2e6d52] text-rose-300 text-xs font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PAGE CONTENT OUTLET */}
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto pb-20">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Command Search Modal */}
      <CommandSearchModal />
      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
