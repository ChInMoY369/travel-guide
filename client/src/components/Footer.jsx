import React, { useContext } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { DarkModeContext } from '../contexts/DarkModeContext';

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: darkMode ? theme.palette.background.paper : '#f8f9fa',
        color: darkMode ? theme.palette.text.primary : theme.palette.text.primary,
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Bhubaneswar Travel Guide
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ maxWidth: '600px', mb: 2 }}>
            Your comprehensive guide to exploring the beautiful city of Bhubaneswar and the wonders of Odisha.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
            <LocationOn fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Bhubaneswar, Odisha, India
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
          pt: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Bhubaneswar Travel Guide. All rights reserved.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
            Designed with ❤️ for travel enthusiasts
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 