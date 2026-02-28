import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

const SubtaskCard = ({
  subtask,
  activity,
  onToggleComplete,
  onEditActivity,
  showProgress,
}) => {
  const progress = activity?.milestones?.length
    ? Math.round(
        (activity.milestones.filter((m) => m.completed).length / activity.milestones.length) * 100
      )
    : 0;

  return (
    <div className="flex items-center gap-3 bg-[#1e293b]/60 border border-gray-700 rounded-xl px-4 py-3 hover:bg-[#1e293b]/80 transition-colors">
      <button
        type="button"
        onClick={() => onToggleComplete(subtask)}
        className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          subtask.completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {subtask.completed && <Check size={12} strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            subtask.completed ? 'text-gray-500 line-through' : 'text-white font-medium'
          }`}
        >
          {subtask.text || '(Sin título)'}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">
          {subtask.activityTitle} • {subtask.activityCourse}
          {subtask.targetDate && ` • ${subtask.targetDate}`}
          {subtask.estimatedEffort && ` • Esf. ${subtask.estimatedEffort}`}
        </p>
      </div>
      {showProgress && (
        <div className="shrink-0 text-xs text-gray-400">
          {progress}%
        </div>
      )}
      <button
        type="button"
        onClick={() => onEditActivity?.(activity)}
        className="shrink-0 p-1 text-gray-500 hover:text-blue-400 transition-colors"
        title="Editar actividad"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default SubtaskCard;
