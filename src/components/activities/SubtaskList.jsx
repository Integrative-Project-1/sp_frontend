import { useState } from 'react';
import { Box, Typography, Paper, IconButton, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PostponeModal from '../subtask/PostponeModal';

const STATUS_COLOR = {
  pending: 'default',
  done: 'success',
  postponed: 'warning',
};

export default function SubtaskList({ subtasks, onEdit, onDelete, onStatusChange }) {
  const [postponeTarget, setPostponeTarget] = useState(null);

  if (subtasks.length === 0) {
    return (
      <Typography color="text.secondary">
        Sin subtareas aún. Agrega la primera con el botón de abajo.
      </Typography>
    );
  }

  const handleToggleDone = (subtask) => {
    const newStatus = subtask.status === 'done' ? 'pending' : 'done';
    onStatusChange?.(subtask, { status: newStatus, note: newStatus === 'pending' ? '' : subtask.note });
  };

  return (
    <>
      <Stack spacing={1}>
        {subtasks.map((subtask) => (
          <Paper key={subtask.id} variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleToggleDone(subtask)}
                aria-label={subtask.status === 'done' ? `Desmarcar: ${subtask.name}` : `Marcar como hecha: ${subtask.name}`}
                color={subtask.status === 'done' ? 'success' : 'default'}
              >
                {subtask.status === 'done'
                  ? <CheckCircleOutlineIcon fontSize="small" />
                  : <RadioButtonUncheckedIcon fontSize="small" />
                }
              </IconButton>

              <Box sx={{ flex: 1 }}>
                <Typography
                  fontWeight={500}
                  sx={{
                    textDecoration: subtask.status === 'done' ? 'line-through' : 'none',
                    color: subtask.status === 'done' ? 'text.disabled' : 'inherit',
                  }}
                >
                  {subtask.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {subtask.target_date} · {parseFloat(subtask.estimated_hours)}h estimadas
                </Typography>
                {subtask.status === 'postponed' && subtask.note && (
                  <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                    Nota: {subtask.note}
                  </Typography>
                )}
              </Box>

              <Chip
                label={subtask.status_display}
                size="small"
                color={STATUS_COLOR[subtask.status] || 'default'}
              />

              {subtask.status !== 'done' && (
                <IconButton
                  size="small"
                  onClick={() => setPostponeTarget(subtask)}
                  aria-label={`Posponer: ${subtask.name}`}
                >
                  <ScheduleIcon fontSize="small" />
                </IconButton>
              )}

              <IconButton size="small" onClick={() => onEdit(subtask)} aria-label="Editar subtarea">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(subtask)} aria-label="Eliminar subtarea">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Stack>

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
