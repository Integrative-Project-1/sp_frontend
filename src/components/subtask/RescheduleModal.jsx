import { useState, useEffect, useRef } from 'react';
import { X, CalendarDays, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { detectConflict } from '../../utils/conflictDetection';

const inputStyle = {
  backgroundColor: 'rgba(15,23,42,0.8)',
  border: '1px solid #334155',
  fontFamily: "'Lexend', sans-serif",
  colorScheme: 'dark',
};

/**
 * Modal de reprogramación de subtarea.
 *
 * Props:
 *   milestone     — objeto { id, text, targetDate, estimatedEffort }
 *   activityId    — id de la actividad padre
 *   activities    — lista completa de actividades (para detección de conflicto)
 *   dailyLimit    — límite diario de horas del usuario
 *   onSave(activityId, subtaskId, { targetDate, estimatedHours }) — callback async
 *   onClose()     — callback para cerrar
 */
const RescheduleModal = ({ milestone, activityId, activities, dailyLimit, onSave, onClose }) => {
  const [newDate, setNewDate] = useState(milestone.targetDate || '');
  const [newHours, setNewHours] = useState(String(milestone.estimatedEffort ?? 1));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const firstFocusRef = useRef(null);
  const modalRef = useRef(null);

  /* ── Focus trap (TS-06) ── */
  useEffect(() => {
    firstFocusRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  /* ── Detección de conflicto en tiempo real ── */
  const hours = Math.max(0.5, Number(newHours) || 0);
  const subtaskForDetection = { ...milestone, estimatedEffort: hours };
  const conflict = newDate
    ? detectConflict(activities, subtaskForDetection, newDate, dailyLimit)
    : null;

  const loadPercent = conflict
    ? Math.min(100, Math.round((conflict.newTotal / conflict.limit) * 100))
    : 0;

  const canSave = newDate && hours > 0 && !saving;

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      await onSave(activityId, milestone.id, { targetDate: newDate, estimatedHours: hours });
      onClose();
    } catch (e) {
      setSaveError(e?.response?.data?.detail || e?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Panel ── */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-title"
        className="w-full rounded-2xl p-6 shadow-2xl"
        style={{
          maxWidth: '440px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          fontFamily: "'Lexend', sans-serif",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id="reschedule-title"
            className="text-white font-bold text-lg flex items-center gap-2"
          >
            <CalendarDays size={20} className="text-blue-400" />
            Reprogramar subtarea
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtask name */}
        <p
          className="text-gray-300 text-sm mb-5 px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #1e3a5f' }}
        >
          {milestone.text || '(Sin título)'}
        </p>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reschedule-date"
              className="text-xs font-medium text-gray-400 flex items-center gap-1"
            >
              <CalendarDays size={13} />
              Nueva fecha
            </label>
            <input
              ref={firstFocusRef}
              id="reschedule-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
              style={inputStyle}
            />
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reschedule-hours"
              className="text-xs font-medium text-gray-400 flex items-center gap-1"
            >
              <Clock size={13} />
              Horas estimadas
            </label>
            <input
              id="reschedule-hours"
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={newHours}
              onChange={(e) => setNewHours(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Conflict preview */}
        {conflict && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Carga del día seleccionado</span>
              <span
                className={conflict.hasConflict ? 'text-red-400 font-semibold' : 'text-emerald-400'}
              >
                {conflict.newTotal}h / {conflict.limit}h
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${loadPercent}%`,
                  backgroundColor: conflict.hasConflict ? '#ef4444' : '#22c55e',
                }}
              />
            </div>

            {/* Alert */}
            {conflict.hasConflict ? (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 p-3 rounded-xl text-sm text-red-300"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                <span>
                  Quedarías con <strong>{conflict.newTotal}h</strong> planificadas (límite{' '}
                  <strong>{conflict.limit}h</strong>). Ajusta la fecha o reduce las horas estimadas.
                </span>
              </div>
            ) : (
              <div
                role="status"
                className="mt-3 flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-300"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <CheckCircle2 size={16} className="text-emerald-400" />
                Sin sobrecarga para ese día.
              </div>
            )}
          </div>
        )}

        {/* Save error */}
        {saveError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl text-sm text-red-300"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {saveError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #334155' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            aria-label="Guardar nueva fecha y horas"
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#2b9dee',
              boxShadow: '0 4px 6px -4px rgba(43,157,238,0.4)',
            }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
