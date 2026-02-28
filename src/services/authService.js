// Mock: simula login con usuario demo
// Reemplazar implementación por llamadas reales cuando el backend esté listo

const MOCK_USER = { id: 1, username: 'demo', email: 'demo@example.com' };
const MOCK_PASSWORD = 'demo123';
const TOKEN_KEY = 'sp_token';
const USER_KEY = 'sp_user';

export const login = async ({ username, password }) => {
  await new Promise((r) => setTimeout(r, 600));

  if (username === MOCK_USER.username && password === MOCK_PASSWORD) {
    const token = 'mock-token-' + Date.now();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
    return { user: MOCK_USER, token };
  }
  const err = new Error('Credenciales inválidas.');
  err.status = 401;
  throw err;
};

export const logout = async () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
