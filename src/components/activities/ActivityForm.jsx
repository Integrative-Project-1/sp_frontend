import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  LinearProgress,
  Alert,
  FormHelperText,
  Stack,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { createActivity, updateActivity } from '../../services/activitiesService';

const ACTIVITY_TYPES = [
  { value: 'exam', label: 'Examen' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'workshop', label: 'Taller' },
  { value: 'project', label: 'Proyecto' },
  { value: 'other', label: 'Otro' },
];

function validate(data) {
  const errors = {};
  if (!data.title.trim())      errors.title = 'El título es obligatorio';
  if (!data.activity_type)     errors.activity_type = 'Selecciona un tipo';
  if (!data.course.trim())     errors.course = 'El curso es obligatorio';
  if (!data.deadline)          errors.deadline = 'La fecha límite es obligatoria';
  return errors;
}

function toInputEventDate(isoString) {
  if (!isoString) return '';
  try {
    return format(parseISO(isoString), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
}

export default function ActivityForm({ initialData, activityId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    activity_type: initialData?.activity_type || '',
    course: initialData?.course || '',
    event_date: toInputEventDate(initialData?.event_date),
    deadline: initialData?.deadline || '',
  });
  const [formState, setFormState] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormState('loading');
    setFieldErrors({});
    setErrorMessage('');

    const payload = {
      ...formData,
      event_date: formData.event_date || null,
    };

    try {
      let result;
      if (activityId) {
        result = await updateActivity(activityId, payload);
      } else {
        result = await createActivity(payload);
      }
      setFormState('idle');
      onSave(result);
    } catch (err) {
      setFormState('error');
      if (err.response?.status === 400) {
        const data = err.response.data;
        const mapped = {};
        Object.keys(data).forEach((key) => {
          mapped[key] = Array.isArray(data[key]) ? data[key][0] : String(data[key]);
        });
        setFieldErrors(mapped);
        setErrorMessage('Por favor corrige los errores indicados.');
      } else {
        setErrorMessage('Error al guardar. Intenta de nuevo.');
      }
    }
  };

  const loading = formState === 'loading';

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {formState === 'error' && errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!fieldErrors.title}
          helperText={fieldErrors.title}
          disabled={loading}
          required
          fullWidth
        />

        <FormControl fullWidth required error={!!fieldErrors.activity_type} disabled={loading}>
          <InputLabel id="activity-type-label">Tipo de actividad</InputLabel>
          <Select
            labelId="activity-type-label"
            name="activity_type"
            value={formData.activity_type}
            label="Tipo de actividad"
            onChange={handleChange}
          >
            {ACTIVITY_TYPES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
          {fieldErrors.activity_type && (
            <FormHelperText>{fieldErrors.activity_type}</FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Curso"
          name="course"
          value={formData.course}
          onChange={handleChange}
          error={!!fieldErrors.course}
          helperText={fieldErrors.course}
          disabled={loading}
          required
          fullWidth
        />

        <TextField
          label="Fecha del evento (opcional)"
          name="event_date"
          type="datetime-local"
          value={formData.event_date}
          onChange={handleChange}
          error={!!fieldErrors.event_date}
          helperText={fieldErrors.event_date}
          disabled={loading}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Fecha límite"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={!!fieldErrors.deadline}
          helperText={fieldErrors.deadline}
          disabled={loading}
          required
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {activityId ? 'Guardar cambios' : 'Crear actividad'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
