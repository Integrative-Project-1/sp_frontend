import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ActivityDetailPage() {
  const { id } = useParams();
  return (
    <Box>
      <Typography variant="h1" gutterBottom>Detalle de Actividad {id}</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Detalles y subtareas (Sprint 1).</Typography>
      </Paper>
    </Box>
  );
}
