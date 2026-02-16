import { Typography, Paper, Box } from '@mui/material';

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>Vista "Hoy"</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Esta vista mostrará las prioridades del día (Sprint 2).</Typography>
      </Paper>
    </Box>
  );
}
