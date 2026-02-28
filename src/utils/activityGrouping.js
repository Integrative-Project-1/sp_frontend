/**
 * Regla de ordenamiento para la vista "Hoy" (por ACTIVIDADES):
 * 1. Agrupar: Vencidas → Para hoy → Próximas → Terminadas hoy
 * 2. Una actividad va a Terminadas hoy solo si TODAS sus subtareas están completadas
 * 3. Orden: Vencidas por fecha más antigua; Próximas por fecha más cercana
 * 4. Desempate: menor esfuerzo estimado primero
 */

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

const getActivityPendingSubtasks = (activity) => {
  const today = getTodayStr();
  const milestones = activity.milestones || [];
  return milestones
    .filter((m) => !m.completed)
    .map((m) => ({
      ...m,
      targetDate: normalizeDate(m.targetDate) || normalizeDate(activity.eventDate) || today,
      estimatedEffort: Number(m.estimatedEffort) || 3,
    }));
};

const allSubtasksCompleted = (activity) => {
  const milestones = activity.milestones || [];
  if (milestones.length === 0) return false; // sin subtareas no se considera "terminada"
  return milestones.every((m) => m.completed);
};

/**
 * Clasifica y ordena ACTIVIDADES (no subtareas)
 */
export const groupAndSortActivities = (activities) => {
  const today = getTodayStr();

  const terminadasHoy = [];
  const vencidas = [];
  const paraHoy = [];
  const proximas = [];

  activities.forEach((activity) => {
    if (allSubtasksCompleted(activity)) {
      terminadasHoy.push(activity);
      return;
    }

    const pending = getActivityPendingSubtasks(activity);

    if (pending.length === 0) {
      terminadasHoy.push(activity);
      return;
    }

    const hasVencidas = pending.some((p) => p.targetDate && p.targetDate < today);
    const hasParaHoy = pending.some((p) => p.targetDate && p.targetDate === today);
    const hasProximas = pending.some((p) => p.targetDate && p.targetDate > today);

    if (hasVencidas) vencidas.push({ activity, pending });
    else if (hasParaHoy) paraHoy.push({ activity, pending });
    else if (hasProximas) proximas.push({ activity, pending });
    else {
      const actDate = normalizeDate(activity.eventDate) || today;
      if (actDate < today) vencidas.push({ activity, pending });
      else if (actDate === today) paraHoy.push({ activity, pending });
      else proximas.push({ activity, pending });
    }
  });

  const sortVencidas = (a, b) => {
    const dateA = Math.min(...a.pending.map((p) => new Date(p.targetDate).getTime()));
    const dateB = Math.min(...b.pending.map((p) => new Date(p.targetDate).getTime()));
    if (dateA !== dateB) return dateA - dateB;
    const minEffortA = Math.min(...a.pending.map((p) => p.estimatedEffort));
    const minEffortB = Math.min(...b.pending.map((p) => p.estimatedEffort));
    return minEffortA - minEffortB;
  };

  const sortParaHoy = (a, b) => {
    const minEffortA = Math.min(...a.pending.map((p) => p.estimatedEffort));
    const minEffortB = Math.min(...b.pending.map((p) => p.estimatedEffort));
    return minEffortA - minEffortB;
  };

  const sortProximas = (a, b) => {
    const dateA = Math.min(...a.pending.map((p) => new Date(p.targetDate).getTime()));
    const dateB = Math.min(...b.pending.map((p) => new Date(p.targetDate).getTime()));
    if (dateA !== dateB) return dateA - dateB;
    const minEffortA = Math.min(...a.pending.map((p) => p.estimatedEffort));
    const minEffortB = Math.min(...b.pending.map((p) => p.estimatedEffort));
    return minEffortA - minEffortB;
  };

  vencidas.sort(sortVencidas);
  paraHoy.sort(sortParaHoy);
  proximas.sort(sortProximas);

  return {
    vencidas: vencidas.map((x) => x.activity),
    paraHoy: paraHoy.map((x) => x.activity),
    proximas: proximas.map((x) => x.activity),
    terminadasHoy,
  };
};

export const SORTING_RULE_TEXT =
  'Orden: Vencidas primero (más antiguas arriba), luego Para hoy, luego Próximas por fecha más cercana. Desempate: menor esfuerzo estimado primero. Una actividad pasa a Terminadas hoy cuando todas sus subtareas están completadas.';
