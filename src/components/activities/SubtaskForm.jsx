import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  LinearProgress,
  Alert,
  Stack,
} from '@mui/material';
import { createSubtask, updateSubtask } from '../../services/activitiesService';

function validate(data) {
  const errors = {};
  if (!data.name.trim())   errors.name = 'El nombre es obligatorio';
  if (!data.target_date)   errors.target_date = 'La fecha objetivo es obligatoria';
  const h = parseFloat(data.estimated_hours);
  if (isNaN(h) || h < 0.1) errors.estimated_hours = 'Mínimo 0.1 horas';
  return errors;
}

export default function SubtaskForm({ activityId, initialData, subtaskId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target_date: initialData?.target_date || '',
    estimated_hours: initialData?.estimated_hours
      ? parseFloat(initialData.estimated_hours).toString()
      : '',
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

    try {
      let result;
      if (subtaskId) {
        result = await updateSubtask(activityId, subtaskId, formData);
      } else {
        result = await createSubtask(activityId, formData);
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
          label="Nombre de la subtarea"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!fieldErrors.name}
          helperText={fieldErrors.name}
          disabled={loading}
          required
          fullWidth
        />

        <TextField
          label="Fecha objetivo"
          name="target_date"
          type="date"
          value={formData.target_date}
          onChange={handleChange}
          error={!!fieldErrors.target_date}
          helperText={fieldErrors.target_date}
          disabled={loading}
          required
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Horas estimadas"
          name="estimated_hours"
          type="number"
          value={formData.estimated_hours}
          onChange={handleChange}
          error={!!fieldErrors.estimated_hours}
          helperText={fieldErrors.estimated_hours}
          disabled={loading}
          required
          fullWidth
          slotProps={{ input: { min: 0.1, step: 0.1 } }}
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {subtaskId ? 'Guardar cambios' : 'Agregar subtarea'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
