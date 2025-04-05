import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Favorite,
  Delete,
  LocationOn,
  AccessTime,
  Share
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/users/${user.id}/favorites`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
      
      // For demo purposes, set mock data
      setFavorites([
        {
          id: '1',
          name: 'Lingaraj Temple',
          description: 'The Lingaraj Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg',
          location: 'Lingaraj Road, Old Town, Bhubaneswar',
          rating: 4.8,
          bestTimeToVisit: 'October to March',
          tags: ['Temple', 'Heritage', 'Religious'],
          addedOn: '2023-12-15'
        },
        {
          id: '2',
          name: 'Nandankanan Zoological Park',
          description: 'Nandankanan Zoological Park is a 400-hectare zoo and botanical garden near Bhubaneswar.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg',
          location: 'Nandankanan Road, Barang, Bhubaneswar',
          rating: 4.5,
          bestTimeToVisit: 'November to February',
          tags: ['Wildlife', 'Nature', 'Family'],
          addedOn: '2023-11-20'
        },
        {
          id: '3',
          name: 'Udayagiri and Khandagiri Caves',
          description: 'Udayagiri and Khandagiri Caves are partly natural and partly artificial caves of archaeological, historical and religious importance.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Udayagiri_and_Khandagiri_Caves.jpg',
          location: 'Khandagiri, Bhubaneswar',
          rating: 4.3,
          bestTimeToVisit: 'October to March',
          tags: ['Historical', 'Caves', 'Architecture'],
          addedOn: '2023-10-05'
        },
        {
          id: '4',
          name: 'Dhauli Shanti Stupa',
          description: 'Dhauli Shanti Stupa is a Buddhist structure built during the 1970s atop the Dhauli hills.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Dhauli_Giri_Shanti_Stupa.jpg',
          location: 'Dhauli Hills, Bhubaneswar',
          rating: 4.6,
          bestTimeToVisit: 'October to March',
          tags: ['Buddhist', 'Peace Pagoda', 'Historical'],
          addedOn: '2023-09-12'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/users/${user.id}/favorites/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }
      
      setFavorites(favorites.filter(item => item.id !== id));
    } catch (err) {
      // For demo purposes, remove anyway
      setFavorites(favorites.filter(item => item.id !== id));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (tabValue === 0) {
      // Recently added (default)
      return new Date(b.addedOn) - new Date(a.addedOn);
    } else if (tabValue === 1) {
      // Highest rated
      return b.rating - a.rating;
    } else {
      // Alphabetical
      return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please log in to view your favorites.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorite Attractions
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Recently Added" />
          <Tab label="Highest Rated" />
          <Tab label="Alphabetical" />
        </Tabs>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {favorites.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You haven't added any favorites yet
          </Typography>
          <Typography variant="body1" paragraph>
            Explore attractions and add them to your favorites to see them here.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/attractions')}
          >
            Explore Attractions
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedFavorites.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <CardActionArea onClick={() => navigate(`/attractions/${item.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      borderRadius: '50%',
                      p: 0.5
                    }}
                  >
                    <Favorite color="error" />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={item.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {item.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <LocationOn fontSize="small" sx={{ mt: 0.3, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                        {item.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <AccessTime fontSize="small" sx={{ mt: 0.3, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Best time: {item.bestTimeToVisit}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      {item.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Added on {new Date(item.addedOn).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        // Share functionality
                        navigator.clipboard.writeText(
                          `${window.location.origin}/attractions/${item.id}`
                        );
                        alert('Link copied to clipboard!');
                      }}
                    >
                      <Share fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveFavorite(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage; 