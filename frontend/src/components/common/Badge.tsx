import React from 'react';
import { getStatusBadgeStyles, getPriorityStyles } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'priority' | 'neutral' | 'emerald' | 'blue' | 'purple' | 'amber';
  value?: string;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  value = '',
  dot = false,
  className = '',
}) => {
  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (variant === 'status') {
    const s = getStatusBadgeStyles(value || String(children));
    styles = `${s.bg} ${s.border}`;
  } else if (variant === 'priority') {
    const p = getPriorityStyles(value || String(children));
    styles = p.bg;
    dotColor = p.dot;
  } else if (variant === 'emerald') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotColor = 'bg-emerald-600';
  } else if (variant === 'blue') {
    styles = 'bg-blue-50 text-blue-800 border-blue-200/80';
    dotColor = 'bg-blue-600';
  } else if (variant === 'purple') {
    styles = 'bg-purple-50 text-purple-800 border-purple-200/80';
    dotColor = 'bg-purple-600';
  } else if (variant === 'amber') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-600';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border whitespace-nowrap leading-none shadow-2xs ${styles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};
