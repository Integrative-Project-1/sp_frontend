import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ActivityForm from '../components/activities/ActivityForm';

export default function CreateActivityPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h1" gutterBottom>Crear Actividad</Typography>
      <ActivityForm
        onSave={(activity) => navigate(`/actividad/${activity.id}`)}
        onCancel={() => navigate('/hoy')}
      />
    </Box>
  );
}
