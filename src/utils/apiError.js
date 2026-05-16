/** Extrae mensaje útil cuando el backend devuelve formato estándar { error: { message } } o detail. */
export function getApiErrorMessage(error, fallback = 'Algo salió mal. Intenta de nuevo.') {
  const data = error?.response?.data;
  if (!data) return typeof error?.message === 'string' ? error.message : fallback;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail) && data.detail.length && typeof data.detail[0] === 'string') {
    return data.detail[0];
  }
  const msg = data.error?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  return fallback;
}
