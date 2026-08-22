import confetti from 'canvas-confetti';

export function formatSecondsToTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatHoursDecimal(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#059669', '#34d399', '#047857', '#3b82f6'],
  });
}

export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getStatusBadgeStyles(status: string): { bg: string; text: string; border: string } {
  switch (status?.toLowerCase()) {
    case 'present':
    case 'active':
    case 'approved':
    case 'completed':
      return { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'in_progress':
    case 'in_meeting':
      return { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-700', border: 'border-blue-200' };
    case 'pending':
    case 'review':
    case 'remote':
      return { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700', border: 'border-amber-200' };
    case 'urgent':
    case 'late':
    case 'rejected':
      return { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200' };
    case 'on_leave':
    case 'on-leave':
    case 'half-day':
      return { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-200' };
    case 'todo':
    default:
      return { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getPriorityStyles(priority: string): { bg: string; text: string; dot: string } {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'text-rose-700', dot: 'bg-rose-500' };
    case 'high':
      return { bg: 'bg-orange-50 border-orange-200 text-orange-700', text: 'text-orange-700', dot: 'bg-orange-500' };
    case 'medium':
      return { bg: 'bg-amber-50 border-amber-200 text-amber-700', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'low':
    default:
      return { bg: 'bg-slate-100 border-slate-200 text-slate-700', text: 'text-slate-700', dot: 'bg-slate-400' };
  }
}
