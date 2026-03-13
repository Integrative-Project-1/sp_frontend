import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  AlertTriangle,
  Calendar,
  Timer,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  X,
  Plus,
  KanbanSquare,
  Rows3,
  LayoutGrid,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import UrgentTaskCard from '../components/dashboard/UrgentTaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useActivitiesContext as useActivities } from '../context/ActivitiesContext';
import { useToast } from '../context/ToastContext';
import { groupAndSortActivities, SORTING_RULE_TEXT } from '../utils/activityGrouping';
import { useFilters } from '../hooks/useFilters';

const HomePage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { activities, loading, updateActivity, deleteActivity, error, retry } = useActivities();
  const [showRule, setShowRule] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [boardView, setBoardView] = useState('grouped'); // grouped | continuous

  const {
    filtered,
    courses,
    filterCourse,
    setFilterCourse,
    filterStatus,
    setFilterStatus,
    clearFilters,
    hasActiveFilters,
  } = useFilters(activities);

  const searchFiltered = search.trim()
    ? filtered.filter(
        (a) =>
          a.title?.toLowerCase().includes(search.toLowerCase()) ||
          a.course?.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  const { vencidas, paraHoy, proximas, terminadasHoy } = groupAndSortActivities(searchFiltered);
  const hasAnyActivities =
    vencidas.length > 0 || paraHoy.length > 0 || proximas.length > 0 || terminadasHoy.length > 0;

  const kanbanColumns = [
    {
      key: 'vencidas',
      title: 'Vencidas',
      icon: AlertTriangle,
      iconClass: 'text-red-400',
      badgeClass: 'bg-red-500/15 border-red-500/40 text-red-300',
      cards: vencidas,
      variant: 'vencidas',
    },
    {
      key: 'paraHoy',
      title: 'Para hoy',
      icon: Calendar,
      iconClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      cards: paraHoy,
      variant: 'paraHoy',
    },
    {
      key: 'proximas',
      title: 'Proximas',
      icon: Timer,
      iconClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-700/20 border-emerald-700/35 text-emerald-300',
      cards: proximas,
      variant: 'proximas',
    },
    {
      key: 'terminadas',
      title: 'Terminadas',
      icon: CheckCircle2,
      iconClass: 'text-emerald-200',
      badgeClass: 'bg-emerald-600/20 border-emerald-600/30 text-emerald-200',
      cards: terminadasHoy,
      variant: 'terminadas',
    },
  ];

  const handleDeleteActivity = (id) => {
    deleteActivity(id);
    setExpandedId((prev) => (prev === id ? null : prev));
    showSuccess('Actividad eliminada correctamente');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Prioridades de Hoy</h1>
        </header>
        <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center gap-4">
          <AlertCircle className="text-red-400" size={48} />
          <p className="text-red-200 text-center">No se pudieron cargar las actividades. {error}</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-medium transition-colors"
          >
            <RotateCcw size={18} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const renderActivityCard = (activity, variant) => (
    <UrgentTaskCard
      key={activity.id}
      activity={activity}
      isExpanded={expandedId === activity.id}
      onToggleExpand={() => setExpandedId((prev) => (prev === activity.id ? null : activity.id))}
      onUpdateActivity={updateActivity}
      onEditActivity={(a) => navigate(`/editar/${a.id}`)}
      onDeleteActivity={handleDeleteActivity}
      variant={variant}
    />
  );

  return (
    <div className="space-y-8">
      {/* Barra de Búsqueda */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-3 text-gray-500" size={20} />
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tareas, cursos o notas..."
          className="w-full bg-[#01230f]/55 border border-emerald-950 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filtrar por curso"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="bg-[#01230f]/55 border border-emerald-950 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="">Todos los cursos</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#01230f]/55 border border-emerald-950 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="done">Completadas</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      <header>
        <h1 className="text-3xl font-bold text-white">Prioridades de Hoy</h1>
        <p className="text-emerald-100/70 mt-1">Visualiza tus tareas como tablero Kanban para priorizar rapido.</p>
      </header>

      {/* Regla visible - ¿Cómo se ordena esto? */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowRule(!showRule)}
          className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
        >
          <HelpCircle size={18} />
          ¿Cómo se ordena esto?
        </button>
        {showRule && (
          <div className="mt-2 p-4 bg-[#01230f]/75 border border-emerald-600/40 rounded-xl text-sm text-emerald-50">
            {SORTING_RULE_TEXT}
          </div>
        )}
      </div>

      {/* Grid de Estadísticas (por ACTIVIDADES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vencidas"
          value={String(vencidas.length)}
          footer="Por hacer"
          icon={AlertTriangle}
          colorClass="text-red-400"
          bgColorClass="bg-red-500/10"
        />
        <StatCard
          title="Para hoy"
          value={String(paraHoy.length)}
          footer="Objetivo del día"
          icon={Calendar}
          colorClass="text-emerald-300"
          bgColorClass="bg-emerald-500/10"
        />
        <StatCard
          title="Próximas"
          value={String(proximas.length)}
          footer="Por fecha"
          icon={Timer}
          colorClass="text-amber-400"
          bgColorClass="bg-amber-500/10"
        />
        <StatCard
          title="Completadas"
          value={String(terminadasHoy.length)}
          footer="Hoy"
          icon={CheckCircle2}
          colorClass="text-emerald-400"
          bgColorClass="bg-emerald-500/10"
        />
      </div>

      {/* Estado vacío */}
      {!hasAnyActivities && (
        <div className="p-12 border-2 border-dashed border-gray-800 rounded-2xl text-center">
          {hasActiveFilters || search.trim() ? (
            <>
              <p className="text-gray-500">No hay actividades que coincidan con los filtros.</p>
              <button
                type="button"
                onClick={() => { clearFilters(); setSearch(''); }}
                className="mt-3 text-emerald-300 hover:text-emerald-200 text-sm transition-colors"
              >
                Limpiar filtros
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500">No tienes actividades programadas.</p>
              <p className="text-gray-500 text-sm mt-2">Comienza creando tu primera actividad.</p>
              <button
                type="button"
                onClick={() => navigate('/crear')}
                className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-[#001507] inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Plus size={20} />
                Nueva Actividad
              </button>
            </>
          )}
        </div>
      )}

      {/* Kanban de ACTIVIDADES */}
      {hasAnyActivities && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-emerald-200">
              <KanbanSquare size={18} />
              <span className="text-sm font-medium">Tablero De Actividades</span>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() =>
                  setBoardView((prev) => (prev === 'grouped' ? 'continuous' : 'grouped'))
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-800 bg-[#01230f]/60 text-emerald-200 hover:bg-[#01230f] transition-colors text-xs"
                aria-label="Cambiar vista del tablero"
              >
                {boardView === 'grouped' ? <Rows3 size={14} /> : <LayoutGrid size={14} />}
                {boardView === 'grouped' ? 'Columnas seguidas' : 'Vista actual'}
              </button>
              <div className="pointer-events-none absolute -top-10 right-0 px-2 py-1 rounded-md text-[11px] whitespace-nowrap bg-[#001507] border border-emerald-800 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity">
                {boardView === 'grouped'
                  ? 'Cambiar a columnas de seguido'
                  : 'Cambiar a vista en bloques'}
              </div>
            </div>
          </div>

          <div className={boardView === 'continuous' ? 'overflow-x-auto pb-2' : ''}>
            <div
              className={
                boardView === 'continuous'
                  ? 'flex gap-4 min-w-max'
                  : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'
              }
            >
              {kanbanColumns.map((column) => {
                const ColumnIcon = column.icon;
                return (
                  <section
                    key={column.key}
                    className={`bg-[#01230f]/45 border border-emerald-950 rounded-2xl p-3 h-fit ${
                      boardView === 'continuous' ? 'w-[290px] shrink-0' : 'w-full'
                    }`}
                  >
                    <header className="flex items-center justify-between mb-3">
                      <h2 className={`text-sm font-semibold flex items-center gap-2 ${column.iconClass}`}>
                        <ColumnIcon size={16} />
                        {column.title}
                      </h2>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${column.badgeClass}`}>
                        {column.cards.length}
                      </span>
                    </header>

                    <div className="space-y-2 min-h-20">
                      {column.cards.length > 0 ? (
                        column.cards.map((activity) => renderActivityCard(activity, column.variant))
                      ) : (
                        <div className="px-3 py-6 text-center rounded-xl border border-dashed border-emerald-900 text-emerald-100/45 text-xs">
                          Sin tareas en esta columna
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
