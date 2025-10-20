import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles'; 
import theme from './theme'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Wrap everything inside ThemeProvider */}
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline /> {/* CssBaseline should come after ThemeProvider */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);