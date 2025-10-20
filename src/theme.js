import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      
      main: '#673ab7',  
       light: '#9a67ea',
      dark: '#320b86',
    },
    secondary: {
      
      main: '#ff9800', 
      light: '#ffc947',
      dark: '#c66900',
    },
    background: {
      
      default: '#121212', 
      paper: '#1e1e1e',   
    },
    text: {
      primary: '#ffffff', 
      secondary: '#b0bec5', 
    },
  },
  typography: {
   
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600, 
    },
  },
});

export default theme;