import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SubtaskList from '../components/activities/SubtaskList';
import SubtaskForm from '../components/activities/SubtaskForm';
import ConfirmModal from '../components/common/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { getActivity, deleteActivity, deleteSubtask, updateSubtask } from '../services/activitiesService';

const TYPE_BADGE = {
  exam:     'bg-red-500/15 text-red-400 border-red-500/30',
  quiz:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  workshop: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  project:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  other:    'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showError } = useToast();
  const [activity, setActivity] = useState(null);
  const [pageState, setPageState] = useState('loading');
  const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadActivity = useCallback(async () => {
    setPageState('loading');
    try {
      const data = await getActivity(id);
      setActivity(data);
      setPageState('success');
    } catch {
      setPageState('error');
    }
  }, [id]);

  useEffect(() => { loadActivity(); }, [loadActivity]);

  const handleSubtaskSaved = () => {
    setSubtaskFormOpen(false);
    setEditingSubtask(null);
    loadActivity();
  };

  const handleSubtaskStatusChange = async (subtask, { status, note }) => {
    try {
      await updateSubtask(id, subtask.id, { status, note });
      await loadActivity();
    } catch {
      showError('Error al actualizar la subtarea. Intenta de nuevo.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteTarget.type === 'activity') {
        await deleteActivity(id);
        navigate('/hoy');
      } else {
        await deleteSubtask(id, deleteTarget.id);
        setDeleteTarget(null);
        await loadActivity();
      }
    } catch {
      showError('Error al eliminar. Intenta de nuevo.');
    }
  };

  if (pageState === 'loading') return <LoadingSpinner />;

  if (pageState === 'error') {
    return (
      <div className="space-y-6">
        <div className="p-8 rounded-2xl flex flex-col items-center gap-4"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle className="text-red-400" size={40} />
          <p className="text-red-300 text-center">No se pudo cargar la actividad.</p>
          <button
            onClick={loadActivity}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 transition-colors"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <RotateCcw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const typeBadgeClass = TYPE_BADGE[activity.activity_type] || TYPE_BADGE.other;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver
      </button>

      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{activity.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${typeBadgeClass}`}>
                {activity.activity_type_display}
              </span>
              <span className="text-xs text-gray-500">{activity.course}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/editar/${id}`)}
              aria-label="Editar actividad"
              className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget({ type: 'activity', id: activity.id, name: activity.title })}
              aria-label="Eliminar actividad"
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-gray-500 text-xs">Fecha límite</dt>
            <dd className="text-gray-200 mt-0.5">{activity.deadline}</dd>
          </div>
          {activity.event_date && (
            <div>
              <dt className="text-gray-500 text-xs">Fecha del evento</dt>
              <dd className="text-gray-200 mt-0.5">
                {new Date(activity.event_date).toLocaleString('es-CO')}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Subtasks */}
      <section aria-labelledby="subtasks-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="subtasks-heading" className="text-base font-semibold text-white">
            Subtareas
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({activity.subtasks?.length ?? 0})
            </span>
          </h2>
          {!subtaskFormOpen && (
            <button
              type="button"
              onClick={() => { setEditingSubtask(null); setSubtaskFormOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
              style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <Plus size={15} />
              Agregar subtarea
            </button>
          )}
        </div>

        <SubtaskList
          subtasks={activity.subtasks ?? []}
          activityId={id}
          onEdit={(st) => { setEditingSubtask(st); setSubtaskFormOpen(true); }}
          onDelete={(st) => setDeleteTarget({ type: 'subtask', id: st.id, name: st.name })}
          onStatusChange={handleSubtaskStatusChange}
        />

        {subtaskFormOpen && (
          <div className="mt-3">
            <SubtaskForm
              activityId={id}
              initialData={editingSubtask}
              subtaskId={editingSubtask?.id}
              onSave={handleSubtaskSaved}
              onCancel={() => { setSubtaskFormOpen(false); setEditingSubtask(null); }}
            />
          </div>
        )}
      </section>

      {/* Confirm delete */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.type === 'activity' ? 'Eliminar actividad' : 'Eliminar subtarea'}
        message={
          deleteTarget?.type === 'activity'
            ? `¿Seguro que deseas eliminar "${deleteTarget?.name}"? Se eliminarán también todas sus subtareas.`
            : `¿Seguro que deseas eliminar "${deleteTarget?.name}"?`
        }
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
