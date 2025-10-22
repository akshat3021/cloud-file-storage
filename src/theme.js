import { createTheme } from '@mui/material/styles';

const sunnyPalette = {
  primary: {
    main: '#f59e0b',
    contrastText: '#ffffff',
  },
  secondary: { 
    main: '#0ea5e9', 
  },
  background: {
    default: '#87CEEB', 
    paper: 'rgba(255, 255, 255, 0.6)',
  },
  text: {
    primary: '#0f172a', 
    secondary: '#64748b', 
  },
  action: {
    active: '#f59e0b', 
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    ...sunnyPalette, 
  },
  typography: {
    fontFamily: '"Space Grotesk", "Roboto", "Helvetica", "Arial", sans-serif', 
    h1: { fontWeight: 700 }, 
    h5: { fontWeight: 600 },
    button: {
      textTransform: 'none', 
      fontWeight: 600,
    }
  },
 
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: '1.5rem', 
          margin: '1.25rem auto',
          width: 'calc(100% - 2.5rem)', 
          maxWidth: '960px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)', 
          color: sunnyPalette.text.primary, 
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: sunnyPalette.background.paper, 
          borderRadius: '1.5rem', 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', 
        },
        containedPrimary: { 
           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
        }
      }
    },
     MuiPaper: { 
      styleOverrides: {
        root: {
           backgroundColor: 'rgba(255, 255, 255, 0.85)', 
           borderRadius: '1rem', 
        }
      }
    },
    MuiTextField: { 
       defaultProps: {
           variant: 'outlined', 
       },
       styleOverrides: {
           root: {
               '& label.Mui-focused': {
                  color: sunnyPalette.primary.main, 
               },
               '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                  '&.Mui-focused fieldset': {
                     borderColor: sunnyPalette.primary.main, 
                  },
               },
           }
       }
    }
  }
});

export default theme;