import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // Esto le dice a CssBaseline que use colores oscuros
    background: {
      default: '#0b0f1a', // El color de fondo de tu diseño original
      paper: '#1e293b',
    },
    primary: {
      main: '#3b82f6', // El azul de tus botones
    },
  },
});
