import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('alex.chen@dayflow.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, switchRole } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(email, selectedRole);
      switchRole(selectedRole);
      showToast('Welcome back!', `Logged in as ${selectedRole.toUpperCase()}`, 'success');
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleSelectDemo = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-5xl grid lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800/40">
        {/* Left Form Section */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/20">
                DF
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  DAYFLOW
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                    HRMS
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">Every Workday, Perfectly Aligned</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your workplace</h2>
              <p className="text-sm text-slate-600 mt-1">
                Access your attendance, daily flow, leave records, and team collaboration.
              </p>
            </div>

            {/* Quick 1-Click Role Accounts */}
            <div className="mt-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Quick 1-Click Demo Profiles:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('employee', 'alex.chen@dayflow.io')}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedRole === 'employee'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">Employee</p>
                  <p className={`text-[10px] mt-0.5 truncate ${selectedRole === 'employee' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Alexandre C.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('manager', 'sarah.jenkins@dayflow.io')}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedRole === 'manager'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">HR Manager</p>
                  <p className={`text-[10px] mt-0.5 truncate ${selectedRole === 'manager' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Sarah J.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('admin', 'marcus.vance@dayflow.io')}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">Admin Org</p>
                  <p className={`text-[10px] mt-0.5 truncate ${selectedRole === 'admin' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Marcus V.
                  </p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Password Reset Link Sent',
                        'Instructions sent to ' + (email || 'your email'),
                        'info'
                      )
                    }
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                </label>
                <span className="text-xs text-slate-400">Single Sign-On (SSO) active</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all group disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Dayflow
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SOC2 Type II Certified
            </span>
            <span>DAYFLOW v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Visual Panel */}
        <div className="hidden lg:flex lg:col-span-6 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden border-l border-slate-800">
          {/* Background decorative grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          {/* Top Badge */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> High-Performance Workday Engine
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
              TIME <span className="text-emerald-400 font-mono">→</span> FLOW <span className="text-emerald-400 font-mono">→</span> PRODUCTIVITY
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Align your team’s schedule, automate attendance verification, track flow-state productivity, and empower leadership with real-time org analytics.
            </p>
          </div>

          {/* Dynamic Interactive Preview Mockup */}
          <div className="relative z-10 my-8 space-y-3">
            {/* Metric pill 1 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Smart Punch-In Accuracy</p>
                  <p className="text-base font-bold text-white">98.4% On-Time Alignment</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                +4.2% MoM
              </span>
            </div>

            {/* Metric pill 2 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Weekly Flow State Score</p>
                  <p className="text-base font-bold text-white">94/100 Team Index</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                Optimal
              </span>
            </div>

            {/* Metric pill 3 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Automated Leave & Payroll</p>
                  <p className="text-base font-bold text-white">100% Policy Compliant</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                Zero Friction
              </span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <p>“Dayflow connected our hybrid engineers and halved HR administrative overhead.”</p>
          </div>
        </div>
      </div>
    </div>
  );
};
