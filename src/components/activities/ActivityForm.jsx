import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Lightbulb, Type, GraduationCap, Clock, X, Check, Plus, Trash2, Info } from 'lucide-react';

// Esquema de validación
const activitySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  type: z.enum(['examen', 'quiz', 'taller', 'proyecto', 'otro'], {
    errorMap: () => ({ message: 'Selecciona un tipo válido' }),
  }),
  course: z.string().min(1, 'El curso es obligatorio'),
  eventDate: z.string().min(1, 'La fecha es obligatoria'),
  startTime: z.string().optional(),
  deadline: z.string().optional(),
});

const ActivityForm = ({ onSubmit, onCancel, initialData }) => {
  const isEdit = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: initialData
      ? {
          title: initialData.title || initialData.activityTitle || '',
          type: initialData.type || '',
          course: initialData.course || '',
          eventDate: initialData.eventDate || '',
          startTime: initialData.startTime || '',
          deadline: initialData.deadline || '',
        }
      : undefined,
  });

  const watchedEventDate = watch('eventDate');
  const defaultEventDate = initialData?.eventDate || watchedEventDate || new Date().toISOString().slice(0, 10);

  const [milestones, setMilestones] = useState(() => {
    const ms = initialData?.milestones || [];
    if (ms.length === 0) return [{ id: crypto.randomUUID(), text: '', completed: false, targetDate: defaultEventDate, estimatedEffort: 3 }];
    return ms.map((m) => ({
      id: crypto.randomUUID(),
      text: m.text || '',
      completed: Boolean(m.completed),
      targetDate: m.targetDate || defaultEventDate,
      estimatedEffort: Number(m.estimatedEffort) || 3,
    }));
  });

  const addMilestone = () => {
    const date = watchedEventDate || defaultEventDate;
    setMilestones((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: '', completed: false, targetDate: date, estimatedEffort: 3 },
    ]);
  };;

  const removeMilestone = (id) => {
    setMilestones((prev) => {
      const next = prev.filter((m) => m.id !== id);
      return next.length === 0
        ? [{ id: crypto.randomUUID(), text: '', completed: false, targetDate: defaultEventDate, estimatedEffort: 3 }]
        : next;
    });
  };

  const updateMilestone = (id, field, value) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleFormSubmit = async (data) => {
    const tasks = milestones
      .filter((m) => m.text.trim())
      .map(({ text, completed, targetDate, estimatedEffort }) => ({
        text: text.trim(),
        completed,
        targetDate: targetDate || data.eventDate,
        estimatedEffort: Number(estimatedEffort) || 3,
      }));
    await onSubmit({ ...data, milestones: tasks, ...(isEdit && { id: initialData.id }) });
  };

  return (
    <div className="flex w-full max-w-4xl bg-[#121826] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Sidebar Izquierdo (Gradiente) */}
      <div className="w-1/3 bg-gradient-to-br from-[#1e3a8a] to-[#1e293b] p-8 flex flex-col justify-between text-white relative">
        <div>
          <div className="bg-[#3b82f6] w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <Calendar size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-4 italic">Planifica</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Añadir tus exámenes y proyectos con antelación te ayuda a crear un horario de estudio
            equilibrado.
          </p>
        </div>

        <div className="bg-[#1e293b]/50 p-4 rounded-2xl border border-blue-400/20 flex gap-3 items-start">
          <Lightbulb className="text-yellow-400 shrink-0" size={18} />
          <p className="text-xs text-blue-100">
            Tip: Desglosa los proyectos grandes en tareas más pequeñas más adelante.
          </p>
        </div>
      </div>

      {/* Formulario Derecho */}
      <div className="w-2/3 p-10 relative">
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            {isEdit ? 'Editar Actividad' : 'Crear Actividad'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isEdit ? 'Modifica los detalles de tu actividad' : 'Detalles de tu próxima evaluación'}
          </p>
        </header>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
              Título de la Actividad *
            </label>
            <div className="relative group">
              <Type
                className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                size={18}
              />
              <input
                {...register('title')}
                placeholder="ej., Examen Parcial, Proyecto Final"
                className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Tipo *
              </label>
              <select
                {...register('type')}
                className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Selecciona tipo</option>
                <option value="examen">Examen</option>
                <option value="quiz">Quiz</option>
                <option value="taller">Taller</option>
                <option value="proyecto">Proyecto</option>
                <option value="otro">Otro</option>
              </select>
              {errors.type && <span className="text-red-400 text-xs">{errors.type.message}</span>}
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Curso *
              </label>
              <div className="relative group">
                <GraduationCap
                  className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400"
                  size={18}
                />
                <input
                  {...register('course')}
                  placeholder="ej., Programación I"
                  className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none"
                />
              </div>
              {errors.course && (
                <span className="text-red-400 text-xs">{errors.course.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha Evento */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Fecha del Evento *
              </label>
              <input
                type="date"
                {...register('eventDate')}
                className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none"
              />
              {errors.eventDate && (
                <span className="text-red-400 text-xs">{errors.eventDate.message}</span>
              )}
            </div>

            {/* Hora */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Hora de Inicio
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Milestones & Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Hitos y Subtareas
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Añadir
              </button>
            </div>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 group"
                >
                  <button
                    type="button"
                    onClick={() => updateMilestone(milestone.id, 'completed', !milestone.completed)}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {milestone.completed && <Check size={12} strokeWidth={3} />}
                  </button>
                  <input
                    type="text"
                    value={milestone.text}
                    onChange={(e) => updateMilestone(milestone.id, 'text', e.target.value)}
                    placeholder="Añadir un hito..."
                    className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                  />
                  <input
                    type="date"
                    value={milestone.targetDate || ''}
                    onChange={(e) => updateMilestone(milestone.id, 'targetDate', e.target.value)}
                    className="bg-[#0f172a] border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                  <select
                    value={milestone.estimatedEffort ?? 3}
                    onChange={(e) => updateMilestone(milestone.id, 'estimatedEffort', Number(e.target.value))}
                    className="bg-[#0f172a] border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    title="Esfuerzo estimado (1=mínimo, 5=máximo)"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Esfuerzo {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeMilestone(milestone.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
              <Info className="text-blue-400 shrink-0" size={18} />
              <p className="text-xs text-blue-200">
                Las actividades programadas en las próximas 48 horas se marcarán como &quot;Alta prioridad&quot; en tu panel automáticamente.
              </p>
            </div>
          </div>

          {/* Botones Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-400 font-medium hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Check size={18} />
              {isSubmitting ? (isEdit ? 'Guardando...' : 'Creando...') : isEdit ? 'Guardar Cambios' : 'Crear Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
