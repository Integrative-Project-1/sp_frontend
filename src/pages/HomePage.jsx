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
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import UrgentTaskCard from '../components/dashboard/UrgentTaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useActivities } from '../hooks/useActivities';
import { useToast } from '../context/ToastContext';
import { groupAndSortActivities, SORTING_RULE_TEXT } from '../utils/activityGrouping';

const HomePage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { activities, loading, updateActivity, deleteActivity, error, retry } = useActivities();
  const [showRule, setShowRule] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { vencidas, paraHoy, proximas, terminadasHoy } = groupAndSortActivities(activities);
  const hasAnyActivities =
    vencidas.length > 0 || paraHoy.length > 0 || proximas.length > 0 || terminadasHoy.length > 0;

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
          type="text"
          placeholder="Buscar tareas, cursos o notas..."
          className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <header>
        <h1 className="text-3xl font-bold text-white">Prioridades de Hoy</h1>
        <p className="text-gray-400 mt-1">Concéntrate en lo más importante hoy.</p>
      </header>

      {/* Regla visible - ¿Cómo se ordena esto? */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowRule(!showRule)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          <HelpCircle size={18} />
          ¿Cómo se ordena esto?
        </button>
        {showRule && (
          <div className="mt-2 p-4 bg-[#1e293b] border border-blue-500/30 rounded-xl text-sm text-blue-100">
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
          colorClass="text-blue-400"
          bgColorClass="bg-blue-500/10"
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
          <p className="text-gray-500">No tienes actividades programadas.</p>
          <p className="text-gray-500 text-sm mt-2">
            Usa el botón &quot;Nueva Actividad&quot; en el menú para crear una.
          </p>
        </div>
      )}

      {/* Grupos de ACTIVIDADES */}
      {hasAnyActivities && (
        <div className="space-y-8">
          {vencidas.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle size={20} />
                Vencidas
              </h2>
              <div className="space-y-2">
                {vencidas.map((activity) => renderActivityCard(activity, 'vencidas'))}
              </div>
            </section>
          )}

          {paraHoy.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                <Calendar size={20} />
                Para hoy
              </h2>
              <div className="space-y-2">
                {paraHoy.map((activity) => renderActivityCard(activity, 'paraHoy'))}
              </div>
            </section>
          )}

          {proximas.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                <Timer size={20} />
                Próximas
              </h2>
              <div className="space-y-2">
                {proximas.map((activity) => renderActivityCard(activity, 'proximas'))}
              </div>
            </section>
          )}

          {terminadasHoy.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={20} />
                Terminadas hoy
              </h2>
              <div className="space-y-2">
                {terminadasHoy.map((activity) => renderActivityCard(activity, 'terminadas'))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
