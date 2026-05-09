import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const show = useCallback((type, message) => {
    setToast({ type, message });
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, []);

  const showSuccess = useCallback((message) => show('success', message), [show]);
  const showError   = useCallback((message) => show('error',   message), [show]);
  const hideToast   = useCallback(() => setToast(null), []);

  const isSuccess = toast?.type === 'success';

  return (
    <ToastContext.Provider value={{ showSuccess, showError, hideToast }}>
      {children}
      {toast && (
        <div
          role={isSuccess ? 'status' : 'alert'}
          aria-live={isSuccess ? 'polite' : 'assertive'}
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg animate-toast"
          style={{
            backgroundColor: '#1e293b',
            border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            boxShadow: `0 4px 24px -4px ${isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: isSuccess ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)' }}
          >
            {isSuccess
              ? <CheckCircle2 className="text-emerald-400" size={22} />
              : <XCircle className="text-red-400" size={22} />
            }
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
