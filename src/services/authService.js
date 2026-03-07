import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'sp_token';
const USER_KEY = 'sp_user';

export const login = async ({ username, password }) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login/`, { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { user: data.user, token: data.token };
  } catch (err) {
    const message = err.response?.data?.detail || 'Credenciales inválidas.';
    const error = new Error(message);
    error.status = err.response?.status || 401;
    throw error;
  }
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
