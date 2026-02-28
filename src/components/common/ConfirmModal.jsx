import React from 'react';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) => {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      confirmBg: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      confirmBg: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: Pencil,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-4`}>
            <Icon className={style.iconColor} size={28} />
          </div>
          <h2 id="confirm-title" className="text-xl font-semibold text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-400 font-medium hover:text-white hover:bg-white/5 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors ${style.confirmBg}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
