import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/activitiesService';
import { getApiErrorMessage } from '../utils/apiError';

const TYPE_UI_TO_API = {
  examen: 'exam',
  quiz: 'quiz',
  taller: 'workshop',
  proyecto: 'project',
  otro: 'other',
};

const TYPE_API_TO_UI = Object.fromEntries(Object.entries(TYPE_UI_TO_API).map(([k, v]) => [v, k]));

const apiToUI = (activity) => ({
  id: String(activity.id),
  title: activity.title,
  type: TYPE_API_TO_UI[activity.activity_type] || activity.activity_type,
  course: activity.course,
  eventDate: activity.deadline,
  startTime: activity.event_date || '',
  milestones: (activity.subtasks || []).map((s) => ({
    id: String(s.id),
    text: s.name,
    status: s.status, // 'pending' | 'done' | 'postponed'
    completed: s.status === 'done',
    note: s.note || '',
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

  const fetchActivities = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await svc.getActivities();
      const list = Array.isArray(data) ? data : data.results || [];
      const details = await Promise.all(list.map((a) => svc.getActivity(a.id)));
      setActivities(details.map(apiToUI));
      setError(null);
    } catch (e) {
      if (!silent) setError(getApiErrorMessage(e, 'Error al cargar actividades'));
    } finally {
      if (!silent) setLoading(false);
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
    const activityFields = uiToApiActivity(updates);
    const hasActivityFields = Object.keys(activityFields).length > 0;
    const hasMilestones = Array.isArray(updates.milestones);

    if (hasActivityFields) {
      await svc.updateActivity(activityId, activityFields);
    }

    if (hasMilestones) {
      const activity = activities.find((a) => a.id === String(activityId));
      const existingMilestones = activity?.milestones || [];
      const incomingMilestones = updates.milestones.filter((m) => m.text?.trim());

      const incomingById = new Map(
        incomingMilestones.filter((m) => m.subtaskId).map((m) => [String(m.subtaskId), m])
      );

      const milestonesToDelete = existingMilestones.filter((m) => !incomingById.has(String(m.id)));

      const milestonesToUpdate = incomingMilestones.filter((m) => m.subtaskId);
      const milestonesToCreate = incomingMilestones.filter((m) => !m.subtaskId);

      await Promise.all(
        milestonesToDelete.map((milestone) => svc.deleteSubtask(activityId, milestone.id))
      );

      await Promise.all(
        milestonesToUpdate.map((milestone) =>
          svc.updateSubtask(activityId, milestone.subtaskId, {
            name: milestone.text,
            target_date: milestone.targetDate,
            estimated_hours: Number(milestone.estimatedEffort) || 1,
            status: milestone.status || (milestone.completed ? 'done' : 'pending'),
          })
        )
      );

      await Promise.all(
        milestonesToCreate.map((milestone) =>
          svc.createSubtask(activityId, {
            name: milestone.text,
            target_date: milestone.targetDate,
            estimated_hours: Number(milestone.estimatedEffort) || 1,
            status: milestone.status || (milestone.completed ? 'done' : 'pending'),
          })
        )
      );
    }

    if (hasActivityFields || hasMilestones) {
      await fetchActivities();
    } else {
      setActivities((prev) =>
        prev.map((a) => (a.id === String(activityId) ? { ...a, ...updates } : a))
      );
    }
  };

  /** PATCH parcial; solo incluye los campos que envíes (la nota se conserva si no mandas note). */
  const patchSubtask = async (activityId, subtaskId, body) => {
    await svc.updateSubtask(activityId, subtaskId, body);
    await fetchActivities({ silent: true });
  };

  const updateSubtaskStatus = async (activityId, subtaskId, { status, note }) => {
    const body = {};
    if (status !== undefined) body.status = status;
    if (note !== undefined) body.note = note;

    // Optimistic update — el cambio se ve de inmediato sin spinner
    const snapshot = activities;
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== String(activityId)) return a;
        return {
          ...a,
          milestones: a.milestones.map((m) => {
            if (m.id !== String(subtaskId)) return m;
            const newStatus = status !== undefined ? status : m.status;
            return {
              ...m,
              status: newStatus,
              completed: newStatus === 'done',
              ...(note !== undefined && { note }),
            };
          }),
        };
      })
    );

    try {
      await svc.updateSubtask(activityId, subtaskId, body);
      // Sincroniza con el servidor en segundo plano sin mostrar spinner
      fetchActivities({ silent: true });
    } catch (e) {
      // Revierte el estado optimista si la API falla
      setActivities(snapshot);
      throw e;
    }
  };

  /** unsetPostponed: al reprogramar, quitar de «pospuestas» (status → pending); la nota se mantiene. */
  const rescheduleSubtask = async (
    activityId,
    subtaskId,
    { targetDate, estimatedHours, unsetPostponed = false }
  ) => {
    const body = {
      target_date: targetDate,
      estimated_hours: estimatedHours,
    };
    if (unsetPostponed) body.status = 'pending';
    await svc.updateSubtask(activityId, subtaskId, body);
    await fetchActivities({ silent: true });
  };

  const deleteActivity = async (activityId) => {
    await svc.deleteActivity(activityId);
    setActivities((prev) => prev.filter((a) => a.id !== String(activityId)));
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    rescheduleSubtask,
    updateSubtaskStatus,
    patchSubtask,
    error,
    retry,
  };
};
