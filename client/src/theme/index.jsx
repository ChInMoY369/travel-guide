import { createTheme } from '@mui/material';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b6b', // Red-pink
      dark: '#ff5252', // Darker red-pink for hover
    },
    secondary: {
      main: '#ff6b6b', // Red-pink
      dark: '#ff5252', // Darker red-pink for hover
    },
    background: {
      default: '#f8f9fa', // Very light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // Dark blue-gray
      secondary: '#5d6d7e', // Medium blue-gray
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        containedPrimary: {
          backgroundColor: '#ff6b6b',
          '&:hover': {
            backgroundColor: '#ff5252',
          },
        },
        containedSecondary: {
          backgroundColor: '#ff6b6b',
          '&:hover': {
            backgroundColor: '#ff5252',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#ff6b6b',
        },
        colorSecondary: {
          backgroundColor: '#ff6b6b',
        },
      },
    },
  },
});

export default theme; 