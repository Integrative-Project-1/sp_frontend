import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/activitiesService';

const TYPE_UI_TO_API = {
  examen: 'exam',
  quiz: 'quiz',
  taller: 'workshop',
  proyecto: 'project',
  otro: 'other',
};

const TYPE_API_TO_UI = Object.fromEntries(
  Object.entries(TYPE_UI_TO_API).map(([k, v]) => [v, k])
);

const apiToUI = (activity) => ({
  id: String(activity.id),
  title: activity.title,
  type: TYPE_API_TO_UI[activity.activity_type] || activity.activity_type,
  course: activity.course,
  eventDate: activity.deadline,
  startTime: activity.event_date || '',
  milestones: (activity.subtasks || []).map((s) => ({
    text: s.name,
    completed: s.status === 'done',
    targetDate: s.target_date,
    estimatedEffort: Number(s.estimated_hours),
  })),
});

const uiToApiActivity = (data) => ({
  title: data.title,
  activity_type: TYPE_UI_TO_API[data.type] || data.type,
  course: data.course,
  deadline: data.eventDate || data.deadline,
  ...(data.startTime && {
    event_date: /^\d{2}:\d{2}$/.test(data.startTime)
      ? `${data.eventDate || data.deadline}T${data.startTime}:00`
      : data.startTime,
  }),
});

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await svc.getActivities();
      const list = Array.isArray(data) ? data : data.results || [];
      const details = await Promise.all(list.map((a) => svc.getActivity(a.id)));
      setActivities(details.map(apiToUI));
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const retry = fetchActivities;

  const addActivity = async (formData) => {
    const created = await svc.createActivity(uiToApiActivity(formData));
    const milestones = (formData.milestones || []).filter((m) => m.text?.trim());
    for (const m of milestones) {
      await svc.createSubtask(created.id, {
        name: m.text,
        target_date: m.targetDate || created.deadline,
        estimated_hours: Number(m.estimatedEffort) || 1,
      });
    }
    await fetchActivities();
    return created;
  };

  const updateActivity = async (activityId, updates) => {
    if (updates.title !== undefined) {
      await svc.updateActivity(activityId, uiToApiActivity(updates));
      await fetchActivities();
    } else {
      setActivities((prev) =>
        prev.map((a) => (a.id === String(activityId) ? { ...a, ...updates } : a))
      );
    }
  };

  const deleteActivity = async (activityId) => {
    await svc.deleteActivity(activityId);
    setActivities((prev) => prev.filter((a) => a.id !== String(activityId)));
  };

  return { activities, loading, addActivity, updateActivity, deleteActivity, error, retry };
};
