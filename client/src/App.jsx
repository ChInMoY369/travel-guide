import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/navigation/ScrollToTop';
import DarkModeProvider, { DarkModeContext } from './contexts/DarkModeContext';
import ThemeProvider from './contexts/ThemeContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// App component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext) || { darkMode: false };
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Theme setup for Material UI
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#ff6b6b',
        light: '#ff9d9d',
        dark: '#da4848',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkMode ? '#2c3e50' : '#ff6b6b',
        light: darkMode ? '#3e5771' : '#ff9d9d',
        dark: darkMode ? '#1a2530' : '#da4848',
        contrastText: '#ffffff',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e2d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#333333',
        secondary: darkMode ? '#a0a0a0' : '#5a5a5a',
      },
      action: {
        active: '#ff6b6b',
        hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 107, 107, 0.08)',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 107, 107, 0.12)',
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      button: { fontWeight: 500 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: darkMode 
                ? '0 4px 8px rgba(0, 0, 0, 0.2)' 
                : '0 4px 8px rgba(255, 107, 107, 0.25)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(145deg, #ff6b6b, #ff8e8e)',
          },
          containedSecondary: {
            background: darkMode 
              ? 'linear-gradient(145deg, #2c3e50, #34495e)'
              : 'linear-gradient(145deg, #ff6b6b, #ff8e8e)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: darkMode 
              ? '0 8px 16px rgba(0,0,0,0.4)' 
              : '0 8px 16px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
  });
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: darkMode ? '#121212' : '#ffffff'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh' 
            }}>
              <Header />
              <Box sx={{ flexGrow: 1 }}>
                <AppRoutes />
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

// Wrap App with DarkModeProvider
const AppWithDarkMode = () => {
  return (
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  );
};

export default AppWithDarkMode;
