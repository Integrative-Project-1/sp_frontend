import { useState } from 'react';
import { CheckCircle2, Clock, Circle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useActivitiesContext } from '../context/ActivitiesContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), "d 'de' MMMM yyyy", { locale: es });
  } catch {
    return dateStr;
  }
};

const STATUS_ICON = {
  done: <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />,
  postponed: <Clock size={14} className="text-amber-400 flex-shrink-0" />,
  pending: <Circle size={14} className="text-gray-500 flex-shrink-0" />,
};

const STATUS_TEXT = {
  done: 'text-emerald-400 line-through',
  postponed: 'text-amber-400',
  pending: 'text-gray-300',
};

const activityProgress = (milestones) => {
  if (!milestones.length) return { done: 0, total: 0, pct: 0 };
  const done = milestones.filter((m) => m.status === 'done').length;
  return { done, total: milestones.length, pct: Math.round((done / milestones.length) * 100) };
};

const activityState = (milestones) => {
  if (!milestones.length) return 'empty';
  const { done, total } = activityProgress(milestones);
  if (done === total) return 'completed';
  if (done > 0) return 'in_progress';
  return 'pending';
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completadas' },
  { value: 'pending', label: 'Sin iniciar' },
];

const ProgressCard = ({ activity }) => {
  const [expanded, setExpanded] = useState(false);
  const { done, total, pct } = activityProgress(activity.milestones);
  const state = activityState(activity.milestones);

  const barColor =
    state === 'completed' ? '#22c55e' :
    state === 'in_progress' ? '#2b9dee' :
    '#475569';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
        className="p-5 cursor-pointer hover:bg-[#263248] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-white font-semibold truncate">{activity.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {activity.course} · Vence: {formatDate(activity.eventDate)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-bold" style={{ color: barColor }}>
              {done}/{total}
            </span>
            {expanded
              ? <ChevronUp size={18} className="text-gray-400" />
              : <ChevronDown size={18} className="text-gray-400" />
            }
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{pct}% completado</span>
            <span>{total - done} pendientes</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso de ${activity.title}: ${pct}%`}
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#0f172a' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 px-5 pb-4 pt-3">
          {activity.milestones.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay subtareas.</p>
          ) : (
            <ul className="space-y-2">
              {activity.milestones.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}
                >
                  {STATUS_ICON[m.status] || STATUS_ICON.pending}
                  <span className={`flex-1 truncate ${STATUS_TEXT[m.status] || STATUS_TEXT.pending}`}>
                    {m.text}
                  </span>
                  {m.note && (
                    <span className="text-xs text-amber-500 italic truncate max-w-[120px]" title={m.note}>
                      {m.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const ProgressPage = () => {
  const { activities, loading, error } = useActivitiesContext();
  const [filter, setFilter] = useState('all');

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Progreso</h1>
        </header>
        <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center gap-4">
          <AlertTriangle className="text-red-400" size={48} />
          <p className="text-red-200 text-center">No se pudo cargar el progreso. {error}</p>
        </div>
      </div>
    );
  }

  const filtered = activities.filter((a) => {
    if (filter === 'all') return true;
    return activityState(a.milestones) === filter;
  });

  const totalActivities = activities.length;
  const completedActivities = activities.filter(
    (a) => activityState(a.milestones) === 'completed'
  ).length;
  const globalPct = totalActivities
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Progreso</h1>
        <p className="text-gray-400 mt-1">
          {completedActivities} de {totalActivities} actividades completadas
        </p>
      </header>

      {totalActivities > 0 && (
        <div
          className="p-5 rounded-2xl"
          style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 font-medium">Progreso general</span>
            <span className="text-white font-bold">{globalPct}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={globalPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso general: ${globalPct}%`}
            className="h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: '#0f172a' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${globalPct}%`,
                backgroundColor: globalPct === 100 ? '#22c55e' : '#2b9dee',
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: filter === opt.value ? '#2b9dee' : 'rgba(30,41,59,0.5)',
              color: filter === opt.value ? '#fff' : '#94a3b8',
              border: `1px solid ${filter === opt.value ? '#2b9dee' : '#334155'}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-gray-800 rounded-2xl text-center">
          <p className="text-gray-500">
            {totalActivities === 0
              ? 'No tienes actividades creadas aún.'
              : 'No hay actividades en esta categoría.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((activity) => (
            <ProgressCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
