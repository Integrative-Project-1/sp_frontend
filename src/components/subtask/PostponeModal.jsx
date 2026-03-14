import { useState, useEffect, useRef } from 'react';
import { X, Clock, Loader2 } from 'lucide-react';

/**
 * Modal para posponer una subtarea con nota opcional.
 *
 * Props:
 *   milestone  — { id, text, note }
 *   onSave(note) — callback async
 *   onClose()
 */
const PostponeModal = ({ milestone, onSave, onClose }) => {
  const [note, setNote] = useState(milestone.note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  /* ── Focus trap (TS-06) ── */
  useEffect(() => {
    textareaRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, textarea, [tabindex]:not([tabindex="-1"])'
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

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await onSave(note.trim());
      onClose();
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="postpone-title"
        className="w-full rounded-2xl p-6 shadow-2xl"
        style={{
          maxWidth: '420px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          fontFamily: "'Lexend', sans-serif",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id="postpone-title"
            className="text-white font-bold text-lg flex items-center gap-2"
          >
            <Clock size={20} className="text-amber-400" />
            Posponer subtarea
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

        {/* Note */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label
            htmlFor="postpone-note"
            className="text-xs font-medium text-gray-400"
          >
            Nota (opcional)
          </label>
          <textarea
            ref={textareaRef}
            id="postpone-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Por qué pospones esta subtarea?"
            className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              border: '1px solid #334155',
              fontFamily: "'Lexend', sans-serif",
            }}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl text-sm text-red-300"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {error}
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
            disabled={saving}
            aria-label="Confirmar posposición de subtarea"
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#f59e0b', boxShadow: '0 4px 6px -4px rgba(245,158,11,0.4)' }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Posponer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostponeModal;
