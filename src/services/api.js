import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- ACTIVIDADES (US-01 / US-03) ---

// Crear actividad (T1)
export const createActivity = async (activityData) => {
  const response = await api.post('/activities/', activityData);
  return response.data;
};

// Obtener todas las actividades
export const getActivities = async () => {
  const response = await api.get('/activities/');
  return response.data;
};

// Eliminar actividad (Borrado en cascada debe ser manejado por el Backend)
export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}/`);
  return response.data;
};

// --- SUBTAREAS (US-02) ---

// Crear subtarea asociada a una actividad
export const createSubtask = async (subtaskData) => {
  const response = await api.post('/subtasks/', subtaskData);
  return response.data;
};

export default api;
