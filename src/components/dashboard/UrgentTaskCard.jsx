import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  Trash2,
  Pencil,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ConfirmModal from '../common/ConfirmModal';
import RescheduleModal from '../subtask/RescheduleModal';
import PostponeModal from '../subtask/PostponeModal';
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
  paraHoy: 'border-blue-500',
  proximas: 'border-amber-500',
  terminadas: 'border-emerald-500',
};

const ICON_VARIANTS = {
  vencidas: 'bg-red-500/20 text-red-500',
  paraHoy: 'bg-blue-500/20 text-blue-500',
  proximas: 'bg-amber-500/20 text-amber-500',
  terminadas: 'bg-emerald-500/20 text-emerald-500',
};

const BADGE_VARIANTS = {
  vencidas: 'bg-red-500/10 text-red-400 border-red-500/20',
  paraHoy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  proximas: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  terminadas: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

/* ── Checkbox styles by status ── */
const checkboxClass = (status) => {
  if (status === 'done') return 'bg-emerald-500 border-emerald-500 text-white';
  if (status === 'postponed') return 'bg-amber-500/20 border-amber-500 text-amber-400';
  return 'border-gray-600 hover:border-gray-500';
};

const milestoneTextClass = (status) => {
  if (status === 'done') return 'text-gray-500 line-through';
  if (status === 'postponed') return 'text-amber-400';
  return 'text-white';
};

const UrgentTaskCard = ({
  activity,
  isExpanded,
  onToggleExpand,
  onUpdateActivity,
  onEditActivity,
  onDeleteActivity,
  variant = 'vencidas',
  showEmergency = false,
  Icon = AlertCircle,
}) => {
  const { showSuccess, showError } = useToast();
  const { activities, rescheduleSubtask, updateSubtaskStatus } = useActivitiesContext();
  const { dailyLimit } = useSubtaskReschedule();
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [postponeTarget, setPostponeTarget] = useState(null);

  const title = activity?.title || activity?.activityTitle;
  const course = activity?.course;
  const deadline = activity?.eventDate;
  const countdown = formatCountdown(deadline);
  const milestones = activity?.milestones || [];

  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmComplete, setConfirmComplete] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(false);

  const handleUpdateMilestones = (newMilestones) => {
    onUpdateActivity(activity.id, { milestones: newMilestones });
  };

  /* Toggle done/pending via API */
  const handleToggleCompleted = async (milestone) => {
    // open confirmation modal instead of toggling immediately
    setConfirmComplete({ milestone });
  };

  const confirmCompleteAction = async () => {
    if (!confirmComplete) return;
    const { milestone } = confirmComplete;
    try {
      await updateSubtaskStatus(activity.id, milestone.id, {
        status: 'done',
        note: milestone.note,
      });
      showSuccess('Subtarea marcada como realizada');
    } catch (e) {
      showError('Error al marcar la subtarea. Intenta de nuevo.');
    } finally {
      setConfirmComplete(null);
    }
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
    ? Math.round((milestones.filter((m) => m.status === 'done').length / milestones.length) * 100)
    : 0;

  return (
    <div
      className={`relative bg-[#1e293b]/40 border-l-4 ${borderClass} rounded-xl overflow-hidden transition-all`}
    >
      {showEmergency && (
        <div className="absolute -top-3 -right-3 z-20 group">
          <div className="bg-red-600 text-white rounded-full p-2 border-2 border-red-700 shadow-lg">
            <AlertTriangle size={18} />
          </div>
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <div className="relative px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap bg-[#001507] border border-emerald-800 text-emerald-100 shadow-lg shadow-emerald-950/40">
              Te has pasado del límite de horas
              <div className="absolute right-4 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#001507] border-r border-b border-emerald-800" />
            </div>
          </div>
        </div>
      )}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => e.key === 'Enter' && onToggleExpand()}
        className="p-5 group hover:bg-[#1e293b]/60 transition-all cursor-pointer"
      >
        <div className="grid gap-4">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-full ${iconClass}`}>
              <Icon size={24} />
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                {variant === 'terminadas' ? `${progress}%` : (countdown ?? 'Pronto')}
              </span>
              {isExpanded ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold">{title}</h4>
            <p className="text-gray-400 text-xs mt-1">
              {course} • Vence: {formatDeadline(deadline)}
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-800 bg-[#1e293b]/20 px-5 pb-5 pt-3">
          <h5 className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-3">
            Subtareas
          </h5>
          {milestones.length > 0 ? (
            <div className="space-y-2">
              {milestones
                .filter((m) => m.status !== 'done')
                .map((milestone, index) => (
                  <div
                    key={milestone.id || index}
                    className="flex items-center gap-3 bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 group/milestone"
                  >
                    {/* Checkbox — marca done/pending */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompleted(milestone);
                      }}
                      aria-label={
                        milestone.status === 'done'
                          ? `Desmarcar subtarea: ${milestone.text}`
                          : `Marcar como hecha: ${milestone.text}`
                      }
                      className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${checkboxClass(milestone.status)}`}
                    >
                      {milestone.status === 'done' && <Check size={12} strokeWidth={3} />}
                      {milestone.status === 'postponed' && <Clock size={11} />}
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
                        className="flex-1 bg-[#0f172a] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(index);
                        }}
                        className={`flex-1 text-sm cursor-text ${milestoneTextClass(milestone.status)}`}
                      >
                        {milestone.text || '(Sin título)'}
                        {milestone.targetDate && (
                          <span className="ml-2 text-xs text-gray-500">
                            · {formatCountdown(milestone.targetDate)}
                          </span>
                        )}
                        {milestone.note && (
                          <span className="ml-2 text-xs text-amber-600 italic">
                            · {milestone.note}
                          </span>
                        )}
                      </span>
                    )}

                    {/* Posponer */}
                    {milestone.status !== 'done' && (
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostponeTarget(milestone);
                          }}
                          aria-label={`Posponer subtarea: ${milestone.text}`}
                          className="text-gray-500 hover:text-amber-400 transition-colors p-1"
                        >
                          <Clock size={16} />
                        </button>
                        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                          <div className="relative px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap bg-[#001507] border border-emerald-800 text-emerald-100 shadow-lg shadow-emerald-950/40">
                            Posponer
                            <div className="absolute right-4 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#001507] border-r border-b border-emerald-800" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reprogramar */}
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRescheduleTarget(milestone);
                        }}
                        aria-label={`Reprogramar subtarea: ${milestone.text}`}
                        className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                      >
                        <CalendarDays size={16} />
                      </button>
                      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                        <div className="relative px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap bg-[#001507] border border-emerald-800 text-emerald-100 shadow-lg shadow-emerald-950/40">
                          Reprogramar
                          <div className="absolute right-4 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#001507] border-r border-b border-emerald-800" />
                        </div>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete({ type: 'milestone', index });
                        }}
                        aria-label={`Eliminar subtarea: ${milestone.text}`}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                        <div className="relative px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap bg-[#001507] border border-emerald-800 text-emerald-100 shadow-lg shadow-emerald-950/40">
                          Eliminar subtarea
                          <div className="absolute right-4 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#001507] border-r border-b border-emerald-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2">No hay subtareas asociadas.</p>
          )}

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-800">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium transition-colors"
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

          <ConfirmModal
            open={!!confirmComplete}
            onClose={() => setConfirmComplete(null)}
            onConfirm={confirmCompleteAction}
            title="Marcar subtarea como realizada"
            message="¿Deseas marcar esta subtarea como realizada?"
            confirmLabel="Completar"
            variant="info"
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

          {postponeTarget && (
            <PostponeModal
              milestone={postponeTarget}
              onSave={async (note) => {
                await updateSubtaskStatus(activity.id, postponeTarget.id, {
                  status: 'postponed',
                  note,
                });
                showSuccess('Subtarea pospuesta');
              }}
              onClose={() => setPostponeTarget(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UrgentTaskCard;
