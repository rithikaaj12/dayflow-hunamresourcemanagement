import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          let bg = 'bg-white border-emerald-200 shadow-emerald-900/5';
          if (toast.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            bg = 'bg-white border-rose-200 shadow-rose-900/5';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            bg = 'bg-white border-amber-200 shadow-amber-900/5';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
            bg = 'bg-white border-blue-200 shadow-blue-900/5';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 ${bg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-wider">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
