import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Check, Trash2, Pencil, CalendarDays } from 'lucide-react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ConfirmModal from '../common/ConfirmModal';
import RescheduleModal from '../subtask/RescheduleModal';
import { useToast } from '../../context/ToastContext';
import { useActivitiesContext } from '../../context/ActivitiesContext';
import { useSubtaskReschedule } from '../../hooks/useSubtaskReschedule';

const formatDeadline = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    return format(date, "d 'de' MMMM", { locale: es });
  } catch {
    return dateStr;
  }
};

const formatCountdown = (dateStr) => {
  if (!dateStr) return null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = parseISO(dateStr);
    date.setHours(0, 0, 0, 0);
    const diff = differenceInCalendarDays(date, today);
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    if (diff > 1) return `En ${diff} días`;
    if (diff === -1) return 'Ayer';
    return `Hace ${Math.abs(diff)} días`;
  } catch {
    return null;
  }
};

const BORDER_VARIANTS = {
  vencidas: 'border-red-500',
  paraHoy: 'border-emerald-500',
  proximas: 'border-emerald-700',
  terminadas: 'border-emerald-600',
};

const ICON_VARIANTS = {
  vencidas: 'bg-red-500/20 text-red-500',
  paraHoy: 'bg-emerald-500/20 text-emerald-300',
  proximas: 'bg-emerald-700/20 text-emerald-400',
  terminadas: 'bg-emerald-500/20 text-emerald-200',
};

const BADGE_VARIANTS = {
  vencidas: 'bg-red-500/10 text-red-400 border-red-500/20',
  paraHoy: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  proximas: 'bg-emerald-700/10 text-emerald-400 border-emerald-700/20',
  terminadas: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
};

const UrgentTaskCard = ({
  activity,
  isExpanded,
  onToggleExpand,
  onUpdateActivity,
  onEditActivity,
  onDeleteActivity,
  variant = 'vencidas', // vencidas | paraHoy | proximas | terminadas
}) => {
  const { showSuccess } = useToast();
  const { activities, rescheduleSubtask } = useActivitiesContext();
  const { dailyLimit } = useSubtaskReschedule();
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // milestone | null

  const title = activity?.title || activity?.activityTitle;
  const course = activity?.course;
  const deadline = activity?.eventDate;
  const countdown = formatCountdown(deadline);
  const milestones = activity?.milestones || [];

  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // 'activity' | { type: 'milestone', index }
  const [confirmEdit, setConfirmEdit] = useState(false);

  const handleUpdateMilestones = (newMilestones) => {
    onUpdateActivity(activity.id, { milestones: newMilestones });
  };

  const handleToggleCompleted = (index) => {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, completed: !m.completed } : m
    );
    handleUpdateMilestones(updated);
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditText(milestones[index]?.text || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const updated = milestones.map((m, i) =>
      i === editingIndex ? { ...m, text: editText.trim() } : m
    );
    handleUpdateMilestones(updated);
    setEditingIndex(null);
    setEditText('');
    showSuccess('Subtarea modificada correctamente');
  };

  const handleDeleteMilestone = (index) => {
    handleUpdateMilestones(milestones.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditText('');
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
    showSuccess('Subtarea eliminada correctamente');
  };

  const borderClass = BORDER_VARIANTS[variant] || BORDER_VARIANTS.vencidas;
  const iconClass = ICON_VARIANTS[variant] || ICON_VARIANTS.vencidas;
  const badgeClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.vencidas;

  const progress = milestones.length
    ? Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100)
    : 0;

  return (
    <div className={`bg-[#01230f]/45 border-l-4 ${borderClass} rounded-xl overflow-hidden transition-all`}>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => e.key === 'Enter' && onToggleExpand()}
        className="p-5 flex items-center justify-between group hover:bg-[#0f8f4f]/15 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${iconClass}`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-white font-semibold">{title}</h4>
            <p className="text-gray-400 text-xs">
              {course} • Vence: {formatDeadline(deadline)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
            {variant === 'terminadas' ? `${progress}%` : (countdown ?? 'Pronto')}
          </span>
          {isExpanded ? (
            <ChevronUp className="text-emerald-100/60" size={20} />
          ) : (
            <ChevronDown className="text-emerald-100/60" size={20} />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-emerald-950 bg-[#001507]/55 px-5 pb-5 pt-3">
          <h5 className="text-xs font-medium text-emerald-300 uppercase tracking-wider mb-3">
            Subtareas
          </h5>
          {milestones.length > 0 ? (
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-[#01230f]/55 border border-emerald-950 rounded-xl px-4 py-3 group/milestone"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCompleted(index);
                    }}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-emerald-500 border-emerald-500 text-[#001507]'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {milestone.completed && <Check size={12} strokeWidth={3} />}
                  </button>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') {
                          setEditingIndex(null);
                          setEditText('');
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-[#001507] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(index);
                      }}
                      className={`flex-1 text-sm cursor-text ${
                        milestone.completed ? 'text-gray-500 line-through' : 'text-white'
                      }`}
                    >
                      {milestone.text || '(Sin título)'}
                      {milestone.targetDate && (
                        <span className="ml-2 text-xs text-gray-500">
                          · {formatCountdown(milestone.targetDate)}
                        </span>
                      )}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRescheduleTarget(milestone);
                    }}
                    aria-label={`Reprogramar subtarea: ${milestone.text}`}
                    className="text-gray-500 hover:text-emerald-300 transition-colors p-1"
                  >
                    <CalendarDays size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete({ type: 'milestone', index });
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2">No hay subtareas asociadas.</p>
          )}
          <div className="flex gap-2 mt-4 pt-3 border-t border-emerald-950">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete('activity');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
            >
              <Trash2 size={14} />
              Eliminar actividad
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmEdit(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-sm font-medium transition-colors"
            >
              <Pencil size={14} />
              Editar actividad
            </button>
          </div>
          <ConfirmModal
            open={confirmEdit}
            onClose={() => setConfirmEdit(false)}
            onConfirm={() => {
              onEditActivity?.(activity);
              setConfirmEdit(false);
            }}
            title="Editar actividad"
            message="¿Deseas modificar los datos de esta actividad?"
            confirmLabel="Editar"
            variant="info"
          />
          <ConfirmModal
            open={confirmDelete === 'activity'}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => onDeleteActivity?.(activity.id)}
            title="Eliminar actividad"
            message="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            variant="danger"
          />
          <ConfirmModal
            open={confirmDelete?.type === 'milestone'}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => {
              handleDeleteMilestone(confirmDelete?.index ?? -1);
              setConfirmDelete(null);
            }}
            title="Eliminar subtarea"
            message="¿Estás seguro de que deseas eliminar esta subtarea?"
            confirmLabel="Eliminar"
            variant="danger"
          />
          {rescheduleTarget && (
            <RescheduleModal
              milestone={rescheduleTarget}
              activityId={activity.id}
              activities={activities}
              dailyLimit={dailyLimit}
              onSave={async (activityId, subtaskId, data) => {
                await rescheduleSubtask(activityId, subtaskId, data);
                showSuccess('Subtarea reprogramada correctamente');
              }}
              onClose={() => setRescheduleTarget(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UrgentTaskCard;
