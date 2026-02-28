import { Box, Typography, Paper, IconButton, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const STATUS_COLOR = {
  pending: 'default',
  done: 'success',
  postponed: 'warning',
};

export default function SubtaskList({ subtasks, onEdit, onDelete }) {
  if (subtasks.length === 0) {
    return (
      <Typography color="text.secondary">
        Sin subtareas aún. Agrega la primera con el botón de abajo.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {subtasks.map((subtask) => (
        <Paper key={subtask.id} variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={500}>{subtask.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha: {subtask.target_date} · {parseFloat(subtask.estimated_hours)}h estimadas
              </Typography>
            </Box>
            <Chip
              label={subtask.status_display}
              size="small"
              color={STATUS_COLOR[subtask.status] || 'default'}
            />
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
  );
}
