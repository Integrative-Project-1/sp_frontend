import { useState, useMemo } from 'react';

export const useFilters = (activities) => {
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // '' | 'pending' | 'done'

  const courses = useMemo(
    () => [...new Set(activities.map((a) => a.course).filter(Boolean))],
    [activities]
  );

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchCourse = !filterCourse || a.course === filterCourse;
      const allDone = a.milestones.length > 0 && a.milestones.every((m) => m.completed);
      const matchStatus =
        !filterStatus ||
        (filterStatus === 'done' && allDone) ||
        (filterStatus === 'pending' && !allDone);
      return matchCourse && matchStatus;
    });
  }, [activities, filterCourse, filterStatus]);

  const clearFilters = () => {
    setFilterCourse('');
    setFilterStatus('');
  };

  const hasActiveFilters = Boolean(filterCourse || filterStatus);

  return {
    filtered,
    courses,
    filterCourse,
    setFilterCourse,
    filterStatus,
    setFilterStatus,
    clearFilters,
    hasActiveFilters,
  };
};
