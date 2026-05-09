import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  CalendarDays,
  Pencil,
  Trash2,
} from 'lucide-react';
import PostponeModal from '../subtask/PostponeModal';

const STATUS_STYLES = {
  done: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    text: 'text-gray-500 line-through',
    label: 'Hecha',
  },
  postponed: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    text: 'text-amber-300',
    label: 'Pospuesta',
  },
  pending: {
    badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    text: 'text-gray-200',
    label: 'Pendiente',
  },
};

const StatusIcon = ({ status }) => {
  if (status === 'done') return <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />;
  if (status === 'postponed') return <Clock size={16} className="text-amber-400 flex-shrink-0" />;
  return <Circle size={16} className="text-gray-500 flex-shrink-0" />;
};

export default function SubtaskList({ subtasks, onEdit, onDelete, onStatusChange }) {
  const [postponeTarget, setPostponeTarget] = useState(null);

  if (subtasks.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">
        Sin subtareas aún. Agrega la primera con el botón de abajo.
      </p>
    );
  }

  const handleToggleDone = (subtask) => {
    const newStatus = subtask.status === 'done' ? 'pending' : 'done';
    onStatusChange?.(subtask, {
      status: newStatus,
      note: newStatus === 'pending' ? '' : subtask.note,
    });
  };

  const styles = (status) => STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <>
      <ul className="space-y-2">
        {subtasks.map((subtask) => {
          const s = styles(subtask.status);
          return (
            <li
              key={subtask.id}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            >
              {/* Toggle done/pending */}
              <button
                type="button"
                onClick={() => handleToggleDone(subtask)}
                aria-label={
                  subtask.status === 'done'
                    ? `Desmarcar como hecha: ${subtask.name}`
                    : `Marcar como hecha: ${subtask.name}`
                }
                className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
              >
                <StatusIcon status={subtask.status} />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${s.text}`}>{subtask.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {subtask.target_date} · {parseFloat(subtask.estimated_hours)}h estimadas
                </p>
                {subtask.status === 'postponed' && subtask.note && (
                  <p className="text-xs text-amber-500 italic mt-0.5">Nota: {subtask.note}</p>
                )}
              </div>

              {/* Status badge */}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${s.badge}`}>
                {subtask.status_display || s.label}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {subtask.status !== 'done' && (
                  <button
                    type="button"
                    onClick={() => setPostponeTarget(subtask)}
                    aria-label={`Posponer: ${subtask.name}`}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Clock size={15} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(subtask)}
                  aria-label={`Editar: ${subtask.name}`}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(subtask)}
                  aria-label={`Eliminar: ${subtask.name}`}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {postponeTarget && (
        <PostponeModal
          milestone={{ id: postponeTarget.id, text: postponeTarget.name, note: postponeTarget.note || '' }}
          onSave={async (note) => {
            await onStatusChange?.(postponeTarget, { status: 'postponed', note });
          }}
          onClose={() => setPostponeTarget(null)}
        />
      )}
    </>
  );
}
