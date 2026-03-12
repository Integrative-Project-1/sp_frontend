import { createContext, useContext } from 'react';
import { useActivities } from '../hooks/useActivities';

const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
  const value = useActivities();
  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
};

export const useActivitiesContext = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivitiesContext must be used within ActivitiesProvider');
  return ctx;
};
