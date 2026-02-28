import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ActivityForm from '../components/activities/ActivityForm';
import SubtaskList from '../components/activities/SubtaskList';
import SubtaskForm from '../components/activities/SubtaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getActivity, deleteActivity, deleteSubtask } from '../services/activitiesService';

const ACTIVITY_TYPE_COLOR = {
  exam: 'error',
  quiz: 'warning',
  workshop: 'info',
  project: 'primary',
  other: 'default',
};

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [pageState, setPageState] = useState('loading'); // 'loading' | 'success' | 'error'
  const [editActivityMode, setEditActivityMode] = useState(false);
  const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState(null); // null = crear, objeto = editar
  const [deleteTarget, setDeleteTarget] = useState(null); // {type:'activity'|'subtask', id, name}
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleActivitySaved = (updated) => {
    setActivity(updated);
    setEditActivityMode(false);
  };

  const handleSubtaskSaved = () => {
    setSubtaskFormOpen(false);
    setEditingSubtask(null);
    loadActivity();
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      if (deleteTarget.type === 'activity') {
        await deleteActivity(id);
        navigate('/crear');
      } else {
        await deleteSubtask(id, deleteTarget.id);
        setDeleteTarget(null);
        await loadActivity();
      }
    } catch {
      setDeleteError('Error al eliminar. Intenta de nuevo.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (pageState === 'loading') return <LoadingSpinner />;

  if (pageState === 'error') {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>No se pudo cargar la actividad.</Alert>
        <Button variant="outlined" onClick={loadActivity}>Reintentar</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h1" sx={{ flex: 1 }}>{activity.title}</Typography>
        <IconButton onClick={() => setEditActivityMode(true)} aria-label="Editar actividad">
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => setDeleteTarget({ type: 'activity', id: activity.id, name: activity.title })}
          aria-label="Eliminar actividad"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          label={activity.activity_type_display}
          color={ACTIVITY_TYPE_COLOR[activity.activity_type] || 'default'}
          size="small"
        />
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        <strong>Curso:</strong> {activity.course}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        <strong>Fecha límite:</strong> {activity.deadline}
      </Typography>
      {activity.event_date && (
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Fecha del evento:</strong> {new Date(activity.event_date).toLocaleString('es-CO')}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Formulario de edición de actividad (inline) */}
      {editActivityMode && (
        <>
          <ActivityForm
            initialData={activity}
            activityId={activity.id}
            onSave={handleActivitySaved}
            onCancel={() => setEditActivityMode(false)}
          />
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Subtareas */}
      <Typography variant="h2" gutterBottom>Subtareas</Typography>

      <SubtaskList
        subtasks={activity.subtasks}
        activityId={id}
        onEdit={(st) => { setEditingSubtask(st); setSubtaskFormOpen(true); }}
        onDelete={(st) => setDeleteTarget({ type: 'subtask', id: st.id, name: st.name })}
      />

      <Box sx={{ mt: 2 }}>
        {subtaskFormOpen ? (
          <SubtaskForm
            activityId={id}
            initialData={editingSubtask}
            subtaskId={editingSubtask?.id}
            onSave={handleSubtaskSaved}
            onCancel={() => { setSubtaskFormOpen(false); setEditingSubtask(null); }}
          />
        ) : (
          <Button
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => { setEditingSubtask(null); setSubtaskFormOpen(true); }}
          >
            Agregar subtarea
          </Button>
        )}
      </Box>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.type === 'activity' ? 'Eliminar actividad' : 'Eliminar subtarea'}
        message={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
        loading={deleteLoading}
        error={deleteError}
      />
    </Box>
  );
}
