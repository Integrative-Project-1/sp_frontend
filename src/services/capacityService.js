import api from './api';

export const getCapacity = () =>
  api.get('/capacity/').then((r) => r.data);

export const updateCapacity = ({ daily_limit }) =>
  api.patch('/capacity/', { daily_limit }).then((r) => r.data).catch((err) => {
    const fieldErrors = err.response?.data || {};
    const error = new Error(fieldErrors.daily_limit?.[0] || 'Error al guardar.');
    error.fieldErrors = { daily_limit: fieldErrors.daily_limit?.[0] };
    throw error;
  });
