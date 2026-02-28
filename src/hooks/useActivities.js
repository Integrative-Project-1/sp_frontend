import { useState, useEffect, useCallback } from 'react';
import { initialActivities } from '../mock/activitiesMock';

export const useActivities = () => {
  const [error, setError] = useState(null);

  const [activities, setActivities] = useState(() => {
    // Criterio C1: Persistencia verificable en localStorage
    const saved = localStorage.getItem('activities');
    if (!saved) return initialActivities;
    try {
      const parsed = JSON.parse(saved);
      // Si no hay actividades guardadas, mostrar los mocks iniciales
      if (!Array.isArray(parsed) || parsed.length === 0) return initialActivities;
      // Migración suave: si venías de una versión sin subtareas, completa desde el mock por id
      const mockById = new Map(initialActivities.map((a) => [a.id, a]));
      return parsed.map((a) => {
        const mock = mockById.get(a?.id);
        const next = { ...a };
        if (next.milestones === undefined && mock?.milestones) next.milestones = mock.milestones;
        if (!Array.isArray(next.milestones)) next.milestones = [];
        next.milestones = next.milestones
          .filter(Boolean)
          .map((m) => (typeof m === 'string' ? { text: m, completed: false } : m))
          .map((m) => ({
            text: (m?.text ?? '').toString(),
            completed: Boolean(m?.completed),
            targetDate: m?.targetDate || next.eventDate,
            estimatedEffort: Number(m?.estimatedEffort) || 3,
          }));
        return next;
      });
    } catch (e) {
      setError(e?.message || 'Error al cargar actividades');
      return initialActivities;
    }
  });

  const retry = useCallback(() => {
    setError(null);
    try {
      const saved = localStorage.getItem('activities');
      if (!saved) {
        setActivities(initialActivities);
        return;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setActivities(initialActivities);
        return;
      }
      const mockById = new Map(initialActivities.map((a) => [a.id, a]));
      const migrated = parsed.map((a) => {
        const mock = mockById.get(a?.id);
        const next = { ...a };
        if (next.milestones === undefined && mock?.milestones) next.milestones = mock.milestones;
        if (!Array.isArray(next.milestones)) next.milestones = [];
        next.milestones = next.milestones
          .filter(Boolean)
          .map((m) => (typeof m === 'string' ? { text: m, completed: false } : m))
          .map((m) => ({
            text: (m?.text ?? '').toString(),
            completed: Boolean(m?.completed),
            targetDate: m?.targetDate || next.eventDate,
            estimatedEffort: Number(m?.estimatedEffort) || 3,
          }));
        return next;
      });
      setActivities(migrated);
    } catch {
      setActivities(initialActivities);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    setActivities((prev) => [...prev, { ...activity, id: Date.now().toString() }]);
  };

  const updateActivity = (activityId, updates) => {
    setActivities((prev) => prev.map((a) => (a.id === activityId ? { ...a, ...updates } : a)));
  };

  const deleteActivity = (activityId) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
  };

  return { activities, addActivity, updateActivity, deleteActivity, error, retry };
};
