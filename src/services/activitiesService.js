import api from './api';

// Actividades
export const getActivities = () =>
  api.get('/activities/').then((r) => r.data);

export const getActivity = (id) =>
  api.get(`/activities/${id}/`).then((r) => r.data);

export const createActivity = (data) =>
  api.post('/activities/', data).then((r) => r.data);

export const updateActivity = (id, data) =>
  api.patch(`/activities/${id}/`, data).then((r) => r.data);

export const deleteActivity = (id) =>
  api.delete(`/activities/${id}/`);

// Subtareas
export const createSubtask = (activityId, data) =>
  api.post(`/activities/${activityId}/subtasks/`, data).then((r) => r.data);

export const updateSubtask = (activityId, subtaskId, data) =>
  api.patch(`/activities/${activityId}/subtasks/${subtaskId}/`, data).then((r) => r.data);

export const deleteSubtask = (activityId, subtaskId) =>
  api.delete(`/activities/${activityId}/subtasks/${subtaskId}/`);
