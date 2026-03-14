/**
 * Calcula las horas totales planificadas para una fecha dada.
 *
 * @param {Array}       activities        - Lista de actividades con milestones
 * @param {string}      targetDate        - Fecha en formato YYYY-MM-DD
 * @param {string|null} excludeSubtaskId  - ID de subtarea a excluir (la que se está reprogramando)
 * @returns {number} Total de horas planificadas para ese día
 */
export const getHoursForDay = (activities, targetDate, excludeSubtaskId = null) => {
  const normalizedTarget = /^\d{4}-\d{2}-\d{2}$/.test(targetDate)
    ? targetDate
    : (() => {
        const d = new Date(targetDate);
        if (isNaN(d.getTime())) return targetDate;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      })();

  let total = 0;
  for (const activity of activities) {
    for (const m of activity.milestones || []) {
      const normalizedMilestoneDate = /^\d{4}-\d{2}-\d{2}$/.test(m.targetDate)
        ? m.targetDate
        : (() => {
            const d = new Date(m.targetDate);
            if (isNaN(d.getTime())) return null;
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${mo}-${day}`;
          })();

      if (normalizedMilestoneDate === normalizedTarget && m.id !== excludeSubtaskId) {
        total += Number(m.estimatedEffort) || 0;
      }
    }
  }
  return total;
};

/**
 * Detecta si reprogramar una subtarea genera sobrecarga.
 *
 * @param {Array}  activities    - Lista de actividades
 * @param {object} subtask       - Milestone a reprogramar (debe tener id y estimatedEffort)
 * @param {string} newTargetDate - Nueva fecha objetivo YYYY-MM-DD
 * @param {number} dailyLimit    - Límite diario de horas del usuario
 * @returns {{ hasConflict: boolean, currentHours: number, newTotal: number, limit: number }}
 */
export const detectConflict = (activities, subtask, newTargetDate, dailyLimit) => {
  const currentHours = getHoursForDay(activities, newTargetDate, subtask.id);
  const newTotal = currentHours + (Number(subtask.estimatedEffort) || 0);
  return {
    hasConflict: newTotal > dailyLimit,
    currentHours,
    newTotal,
    limit: dailyLimit,
  };
};
