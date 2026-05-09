import { useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { createSubtask, updateSubtask } from '../../services/activitiesService';

const inputClass =
  'w-full bg-[#0f172a] border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50';

const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'El nombre es obligatorio';
  if (!data.target_date) errors.target_date = 'La fecha objetivo es obligatoria';
  const h = parseFloat(data.estimated_hours);
  if (isNaN(h) || h < 0.1) errors.estimated_hours = 'Mínimo 0.1 horas';
  return errors;
}

export default function SubtaskForm({ activityId, initialData, subtaskId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target_date: initialData?.target_date || '',
    estimated_hours: initialData?.estimated_hours
      ? parseFloat(initialData.estimated_hours).toString()
      : '',
  });
  const [formState, setFormState] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormState('loading');
    setFieldErrors({});
    setErrorMessage('');

    try {
      const result = subtaskId
        ? await updateSubtask(activityId, subtaskId, formData)
        : await createSubtask(activityId, formData);
      setFormState('idle');
      onSave(result);
    } catch (err) {
      setFormState('error');
      if (err.response?.status === 400) {
        const data = err.response.data;
        const mapped = {};
        Object.keys(data).forEach((key) => {
          mapped[key] = Array.isArray(data[key]) ? data[key][0] : String(data[key]);
        });
        setFieldErrors(mapped);
        setErrorMessage('Por favor corrige los errores indicados.');
      } else {
        setErrorMessage('Error al guardar. Intenta de nuevo.');
      }
    }
  };

  const loading = formState === 'loading';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 space-y-4"
    >
      {loading && (
        <div className="h-0.5 rounded-full bg-emerald-500/30 overflow-hidden">
          <div className="h-full bg-emerald-500 animate-pulse w-1/2" />
        </div>
      )}

      {formState === 'error' && errorMessage && (
        <div role="alert" className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="subtask-name" className={labelClass}>
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          id="subtask-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          placeholder="ej., Estudiar capítulo 3"
          className={inputClass}
        />
        {fieldErrors.name && (
          <p role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fecha objetivo */}
        <div>
          <label htmlFor="subtask-target-date" className={labelClass}>
            Fecha objetivo <span className="text-red-400">*</span>
          </label>
          <input
            id="subtask-target-date"
            name="target_date"
            type="date"
            value={formData.target_date}
            onChange={handleChange}
            disabled={loading}
            className={inputClass}
            style={{ colorScheme: 'dark' }}
          />
          {fieldErrors.target_date && (
            <p role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.target_date}</p>
          )}
        </div>

        {/* Horas estimadas */}
        <div>
          <label htmlFor="subtask-hours" className={labelClass}>
            Horas estimadas <span className="text-red-400">*</span>
          </label>
          <input
            id="subtask-hours"
            name="estimated_hours"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.estimated_hours}
            onChange={handleChange}
            disabled={loading}
            placeholder="ej., 2.5"
            className={inputClass}
          />
          {fieldErrors.estimated_hours && (
            <p role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.estimated_hours}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #334155' }}
        >
          <span className="flex items-center gap-2">
            <X size={15} />
            Cancelar
          </span>
        </button>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#001507] bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check size={15} />
              {subtaskId ? 'Guardar cambios' : 'Agregar subtarea'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
