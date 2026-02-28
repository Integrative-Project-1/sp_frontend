import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showSuccess = useCallback((message) => {
    setToast({ type: 'success', message });
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showSuccess, hideToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 bg-[#1e293b] border border-emerald-500/30 rounded-xl shadow-lg shadow-emerald-500/10 animate-toast"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-emerald-400" size={22} />
          </div>
          <p className="text-white font-medium text-sm">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
