import { createContext, useContext, useState } from 'react';
import { login as svcLogin, logout as svcLogout, getStoredUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user: u } = await svcLogin(credentials);
      setUser(u);
    } catch (e) {
      setError(e.message || 'Error al iniciar sesión.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await svcLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
