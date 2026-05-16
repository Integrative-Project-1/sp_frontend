import { useState, useEffect, useRef } from 'react';
import { X, StickyNote, Loader2 } from 'lucide-react';
import { getApiErrorMessage } from '../../utils/apiError';

/**
 * Ver / editar nota de subtarea pospuesta.
 * Props: milestone { id, text, note }, onSave(note:string), onClose()
 */
const SubtaskNotesModal = ({ milestone, onSave, onClose }) => {
  const [note, setNote] = useState(milestone.note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    setNote(milestone.note || '');
  }, [milestone]);

  useEffect(() => {
    textareaRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = modalRef.current?.querySelectorAll(
        'button, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
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
      setError(getApiErrorMessage(e, 'No se pudo guardar la nota.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
        className="w-full rounded-2xl p-6 shadow-2xl"
        style={{
          maxWidth: '440px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          fontFamily: "'Lexend', sans-serif",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="notes-modal-title" className="text-white font-bold text-lg flex items-center gap-2">
            <StickyNote size={20} className="text-amber-400" />
            Notas
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p
          className="text-gray-300 text-sm mb-3 px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #1e3a5f' }}
        >
          {milestone.text || '(Sin título)'}
        </p>
        <label htmlFor="subtask-notes-body" className="block text-sm text-gray-400 mb-1">
          Contenido
        </label>
        <textarea
          ref={textareaRef}
          id="subtask-notes-body"
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. esperando respuesta del profesor..."
          className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-y min-h-[100px]"
          style={{
            backgroundColor: 'rgba(15,23,42,0.8)',
            border: '1px solid #334155',
          }}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700/60 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-[#0f172a] text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : null}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubtaskNotesModal;
