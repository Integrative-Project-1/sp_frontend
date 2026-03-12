import { useState, useEffect } from 'react';
import { getCapacity } from '../services/capacityService';

/**
 * Provee el límite diario del usuario para usarlo en la detección de conflictos.
 */
export const useSubtaskReschedule = () => {
  const [dailyLimit, setDailyLimit] = useState(6);

  useEffect(() => {
    getCapacity()
      .then((data) => setDailyLimit(data.daily_limit ?? 6))
      .catch(() => {});
  }, []);

  return { dailyLimit };
};
