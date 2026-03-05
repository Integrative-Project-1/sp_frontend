import { useState, useEffect } from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { getCapacity, updateCapacity } from '../services/capacityService';
import { useToast } from '../context/ToastContext';

const CapacityPage = () => {
  const { showSuccess } = useToast();
  const [dailyLimit, setDailyLimit] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    getCapacity()
      .then((data) => setDailyLimit(String(data.daily_limit)))
      .finally(() => setLoadingData(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError(null);
    const parsed = parseInt(dailyLimit, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 16) {
      setFieldError('El límite debe estar entre 1 y 16 horas.');
      return;
    }
    setSaving(true);
    try {
      const result = await updateCapacity({ daily_limit: parsed });
      setDailyLimit(String(result.daily_limit));
      showSuccess('Límite diario actualizado correctamente.');
    } catch (err) {
      setFieldError(err.fieldErrors?.daily_limit || err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg">
      <header className="flex items-center gap-3">
        <div className="bg-blue-500/10 p-2 rounded-xl">
          <Settings className="text-blue-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Capacidad diaria</h1>
          <p className="text-gray-400 mt-1">Configura cuántas horas máximas puedes dedicar por día.</p>
        </div>
      </header>

      <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-8">
        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="text-blue-400 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="daily_limit" className="text-sm font-medium text-gray-300">
                Límite de horas por día
              </label>
              <input
                id="daily_limit"
                type="number"
                min={1}
                max={16}
                step={1}
                value={dailyLimit}
                onChange={(e) => {
                  setDailyLimit(e.target.value);
                  setFieldError(null);
                }}
                disabled={saving}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="6"
              />
              <p className="text-xs text-gray-500">Rango válido: 1 – 16 horas.</p>
            </div>

            {fieldError && (
              <div role="alert" className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {fieldError}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CapacityPage;
