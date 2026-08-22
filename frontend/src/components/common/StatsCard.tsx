import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  onClick?: () => void;
  actionText?: string;
  id?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#1B4332]',
  iconBg = 'bg-emerald-50 border border-emerald-100',
  trend,
  onClick,
  actionText,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`card-subtle p-6 rounded-[32px] transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-lg card-hover' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          </div>
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-2xl shadow-2xs ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      {(trend || actionText) && (
        <div className="mt-4 pt-3.5 border-t border-slate-100/90 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1.5 font-bold">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                    : 'bg-rose-50 text-rose-800 border border-rose-200/80'
                }`}
              >
                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.value}
              </span>
              {trend.label && <span className="text-[11px] font-bold text-slate-400">{trend.label}</span>}
            </div>
          )}
          {actionText && (
            <span className="text-emerald-800 font-black text-xs uppercase tracking-wider hover:underline ml-auto flex items-center gap-1">
              {actionText} →
            </span>
          )}
        </div>
      )}
    </div>
  );
};
