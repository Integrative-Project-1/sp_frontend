// Mock: simula endpoint de capacidad
// Reemplazar con llamadas reales al backend cuando esté listo

let mockLimit = 6;

export const getCapacity = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return { daily_limit: mockLimit };
};

export const updateCapacity = async ({ daily_limit }) => {
  await new Promise((r) => setTimeout(r, 400));
  if (daily_limit < 1 || daily_limit > 16) {
    const err = new Error('Valor fuera de rango.');
    err.fieldErrors = { daily_limit: 'El límite debe estar entre 1 y 16 horas.' };
    throw err;
  }
  mockLimit = daily_limit;
  return { daily_limit: mockLimit };
};
