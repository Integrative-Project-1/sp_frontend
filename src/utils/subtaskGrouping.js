/**
 * Regla de ordenamiento para la vista "Hoy":
 * 1. Agrupar: Vencidas (fecha < hoy) → Para hoy (fecha = hoy) → Próximas (fecha > hoy)
 * 2. Orden: Vencidas por fecha más antigua primero; Próximas por fecha más cercana primero
 * 3. Desempate: menor esfuerzo estimado primero
 */

const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

/**
 * Aplanar actividades en subtareas con contexto de la actividad padre
 */
export const flattenSubtasks = (activities) => {
  const today = getTodayStr();
  const flat = [];

  activities.forEach((activity) => {
    const milestones = activity.milestones || [];
    milestones.forEach((m, index) => {
      const targetDate = normalizeDate(m.targetDate) || normalizeDate(activity.eventDate) || today;
      flat.push({
        ...m,
        index,
        activityId: activity.id,
        activityTitle: activity.title || activity.activityTitle,
        activityCourse: activity.course,
        activityEventDate: activity.eventDate,
        targetDate,
        estimatedEffort: Number(m.estimatedEffort) || 3,
      });
    });
  });

  return flat;
};

/**
 * Agrupa y ordena subtareas según la regla
 */
export const groupAndSortSubtasks = (activities) => {
  const flat = flattenSubtasks(activities);
  const today = getTodayStr();

  const vencidas = flat.filter((s) => !s.completed && s.targetDate < today);
  const paraHoy = flat.filter((s) => !s.completed && s.targetDate === today);
  const proximas = flat.filter((s) => !s.completed && s.targetDate > today);
  const terminadasHoy = flat.filter((s) => s.completed);

  const sortByDateAndEffort = (a, b) => {
    const dateCompare = new Date(a.targetDate) - new Date(b.targetDate);
    if (dateCompare !== 0) return dateCompare;
    return (a.estimatedEffort || 99) - (b.estimatedEffort || 99);
  };

  vencidas.sort(sortByDateAndEffort); // más antigua primero
  paraHoy.sort((a, b) => (a.estimatedEffort || 99) - (b.estimatedEffort || 99)); // solo esfuerzo
  proximas.sort(sortByDateAndEffort); // más cercana primero

  return { vencidas, paraHoy, proximas, terminadasHoy };
};

export const SORTING_RULE_TEXT =
  'Orden: Vencidas primero (más antiguas arriba), luego Para hoy, luego Próximas por fecha más cercana. Desempate: menor esfuerzo estimado primero.';
