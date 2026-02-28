import React from 'react';
import ActivityForm from '../components/activities/ActivityForm';
import { useActivities } from '../hooks/useActivities';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const CreateActivityPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { addActivity } = useActivities();

  const handleCreateActivity = async (data) => {
    await addActivity(data);
    showSuccess('Actividad creada correctamente');
    navigate('/hoy');
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6">
      <ActivityForm onSubmit={handleCreateActivity} onCancel={() => navigate(-1)} />
    </div>
  );
};

export default CreateActivityPage;
