import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Grid
} from '@mui/material';
import { Home, Search, ArrowBack } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            borderRadius: 2,
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)'
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ mb: 3 }}
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Oops! The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable. Let's get you back on track.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'center',
              gap: 2,
              mb: 4
            }}
          >
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<Home />}
              component={RouterLink}
              to="/"
            >
              Back to Home
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
          
          <Grid container spacing={3} sx={{ mt: 4, textAlign: 'left' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Popular Destinations
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <RouterLink to="/attractions" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Explore Attractions
                    </Typography>
                  </RouterLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <RouterLink to="/cultural-insights" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Cultural Insights
                    </Typography>
                  </RouterLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Login / Register
                    </Typography>
                  </RouterLink>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                If you're looking for something specific, try using the search function in the header.
              </Typography>
              <Button 
                variant="text" 
                color="primary"
                startIcon={<Search />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Search the site
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 