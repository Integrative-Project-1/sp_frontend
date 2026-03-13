import { createTheme } from '@mui/material/styles';

// Palette Emerald-11-kigen-design
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#001507',
      paper: '#0A753F',
    },
    primary: {
      main: '#0F8F4F', // Emerald-500
      light: '#24FB8F', // Emerald-100
      dark: '#06592F', // Emerald-700
      contrastText: '#001507',
    },
    secondary: {
      main: '#17B867', // Emerald-300
    },
    success: {
      main: '#1DD779', // Emerald-200
    },
    text: {
      primary: '#EAFDF2',
      secondary: '#A7D8BF',
    },
  },
});
