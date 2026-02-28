import React from 'react';
import ActivityForm from '../components/activities/ActivityForm';
import { useActivities } from '../hooks/useActivities';
import { useToast } from '../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditActivityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess } = useToast();
  const { activities, updateActivity } = useActivities();

  const activity = activities.find((a) => a.id === id);

  const handleUpdateActivity = (data) => {
    updateActivity(id, data);
    showSuccess('Actividad modificada correctamente');
    navigate('/');
  };

  if (!activity) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center text-gray-400">
          <p>Actividad no encontrada.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6">
      <ActivityForm
        initialData={activity}
        onSubmit={handleUpdateActivity}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default EditActivityPage;
