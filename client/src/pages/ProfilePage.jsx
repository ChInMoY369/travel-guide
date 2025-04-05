import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Grid, 
  Button, 
  TextField, 
  Chip, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Rating,
  Badge,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from '@mui/material';
import { Edit, Save, Favorite, Delete, FavoriteBorder, PhotoCamera, Close, Recommend } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserFavorites, 
  removeFavoriteAttraction, 
  uploadProfileImage,
  getRecommendedAttractions
} from '../utils/api';

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [],
    bio: ''
  });
  const [newInterest, setNewInterest] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Add logger function
  const logProfileData = (label, data) => {
    console.log(`ProfilePage - ${label}:`, {
      ...data,
      profilePicture: data?.profilePicture || 'none',
      imagePreview: imagePreview ? 'has preview' : 'no preview'
    });
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadUserData = async () => {
      if (!user) {
        return;
      }
      
      try {
        await fetchUserProfile();
        if (isMounted) {
          await fetchUserFavorites();
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading user data:', err);
        }
      }
    };
    
    if (!authLoading) {
      loadUserData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  // Add debug info to help diagnose
  useEffect(() => {
    console.log('ProfilePage - Auth status:', { 
      isAuthenticated: !!user, 
      authLoading, 
      user: user ? user.email : 'no user' 
    });
  }, [user, authLoading]);

  // Add effect to log when profile changes
  useEffect(() => {
    if (profile) {
      logProfileData('Profile state updated', profile);
    }
  }, [profile]);

  // Add effect to fetch recommendations when interests change
  useEffect(() => {
    let isMounted = true;
    
    if (profile && profile.preferences?.interests && profile.preferences.interests.length > 0) {
      console.log('Interests changed in profile, fetching new recommendations');
      fetchRecommendations(profile.preferences.interests).catch(err => {
        if (isMounted) console.error(err);
      });
    } else if (formData.interests && formData.interests.length > 0) {
      console.log('Interests changed in form data, fetching new recommendations');
      fetchRecommendations(formData.interests).catch(err => {
        if (isMounted) console.error(err);
      });
    } else {
      console.log('No interests found, clearing recommendations');
      setRecommendations([]);
    }
    
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(profile?.preferences?.interests), JSON.stringify(formData.interests)]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getUserProfile();
      
      console.log('Fetched profile data:', data);
      logProfileData('Setting profile from API', data);
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        interests: data.preferences?.interests || [],
        bio: data.bio || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user) return;
    
    try {
      // Use the API function to fetch favorites
      const { data } = await getUserFavorites();
      console.log('Fetched favorites:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected favorites data to be an array, got:', typeof data);
        setFavorites([]);
        return;
      }
      
      // Process favorites to clean up names
      const processedFavorites = data.map(favorite => ({
        ...favorite,
        name: cleanAttractionName(favorite.name)
      }));
      
      // Log each favorite to debug
      processedFavorites.forEach((fav, index) => {
        console.log(`Favorite ${index + 1}: id=${fav.id}, name=${fav.name}, type=${fav.type || 'unknown'}`);
      });
      
      // Store the favorites in state
      setFavorites(processedFavorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      // Initialize with empty array
      setFavorites([]);
    }
  };

  const fetchRecommendations = async (interests) => {
    if (!interests || interests.length === 0) {
      console.log('No interests provided for recommendations, clearing recommendations list');
      setRecommendations([]);
      return;
    }
    
    try {
      console.log('Fetching recommendations with interests:', interests);
      setLoadingRecommendations(true);
      // Force a new request by adding a timestamp to avoid caching
      const { data } = await getRecommendedAttractions(interests);
      console.log('Fetched recommendations:', data);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Force recommendations refresh after profile update
  useEffect(() => {
    let timer;
    if (!editing && profile?.preferences?.interests) {
      // Small delay to ensure state is updated
      timer = setTimeout(() => {
        fetchRecommendations(profile.preferences.interests);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [editing, profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      const updatedInterests = [...formData.interests, newInterest.trim()];
      setFormData({
        ...formData,
        interests: updatedInterests
      });
      setNewInterest('');
      
      // Immediately fetch new recommendations with a small delay to ensure state updates
      setTimeout(() => {
        console.log('Fetching new recommendations after adding interest:', updatedInterests);
        fetchRecommendations(updatedInterests);
      }, 100);
    }
  };

  const handleRemoveInterest = (interest) => {
    const updatedInterests = formData.interests.filter(i => i !== interest);
    setFormData({
      ...formData,
      interests: updatedInterests
    });
    
    // Immediately fetch new recommendations with a small delay to ensure state updates
    setTimeout(() => {
      console.log('Fetching new recommendations after removing interest:', updatedInterests);
      fetchRecommendations(updatedInterests);
    }, 100);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    
    try {
      setUploadingImage(true);
      setError(null);
      
      // Validate file size and type before upload
      if (selectedImage.size > 5000000) { // 5MB limit
        throw new Error('Image size exceeds 5MB limit. Please choose a smaller image.');
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedImage.type)) {
        throw new Error('Invalid file type. Please use JPG, PNG, GIF or WEBP images.');
      }
      
      // Log the file details
      console.log('Uploading file:', {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size,
        lastModified: new Date(selectedImage.lastModified).toISOString()
      });
      
      // Get token manually to validate
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      console.log('Sending image upload request...');
      
      // Try direct API call to test if the issue is in the utility function
      let response;
      try {
        // First attempt with the utility function
        const { data } = await uploadProfileImage(formData);
        response = data;
      } catch (apiError) {
        console.error('API utility function failed, trying direct fetch:', apiError);
        
        // Fallback to direct fetch API call
        const baseUrl = window.location.origin.includes('localhost') 
          ? 'http://localhost:5000' 
          : window.location.origin;
        
        const result = await fetch(`${baseUrl}/api/images/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(errorData.message || `Server error: ${result.status}`);
        }
        
        response = await result.json();
      }
      
      console.log('Upload response received:', response);
      
      // Make sure the data contains the profilePicture property
      if (!response.profilePicture) {
        throw new Error('No profile picture URL returned from server');
      }
      
      console.log('Profile image updated:', response.profilePicture);
      
      // Update profile with the new image URL
      setProfile({
        ...profile,
        profilePicture: response.profilePicture
      });
      
      // Reset file selection and preview
      setSelectedImage(null);
      setImagePreview(null);
      
      setSnackbar({
        open: true,
        message: 'Profile image updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error uploading image:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image. Please try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const cancelImageUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data for the API
      const userData = {
        name: formData.name,
        email: formData.email,
        preferences: {
          interests: formData.interests
        },
        bio: formData.bio,
        profilePicture: profile.profilePicture // Preserve existing profile picture
      };
      
      logProfileData('Submitting profile update with', userData);
      
      // Use the updateUserProfile API function
      const { data } = await updateUserProfile(userData);
      
      logProfileData('Received updated profile from API', data);
      
      // Update local state with the returned data, preserving the profile picture if not returned
      const updatedProfile = {
        ...data,
        profilePicture: data.profilePicture || profile.profilePicture
      };
      
      logProfileData('Setting updated profile state', updatedProfile);
      
      setProfile(updatedProfile);
      setEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
      
      // Trigger recommendations refresh with a guaranteed delay to ensure state is updated
      setTimeout(() => {
        console.log('Profile updated, refreshing recommendations with:', formData.interests);
        fetchRecommendations(formData.interests);
      }, 500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleRemoveFavorite = async (attractionId) => {
    try {
      console.log(`Removing favorite with ID: ${attractionId}`);
      setLoading(true);
      
      // Call the API to remove the favorite
      const response = await removeFavoriteAttraction(attractionId);
      console.log('Remove favorite response:', response.data);
      
      // Update the local favorites list by removing the deleted item
      setFavorites(favorites.filter(favorite => favorite.id !== attractionId));
      
      setSnackbar({
        open: true,
        message: 'Attraction removed from favorites',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error removing favorite:', err);
      
      if (err.response?.status === 404) {
        // If the server says the attraction wasn't found, remove it from the UI anyway
        setFavorites(favorites.filter(favorite => favorite.id !== attractionId));
        setSnackbar({
          open: true,
          message: 'Attraction not found in favorites on server, but removed from your view',
          severity: 'info'
        });
      } else {
        // For other errors, show an error message
      setSnackbar({
        open: true,
          message: 'Failed to remove from favorites. Please try again.',
        severity: 'error'
      });
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get a valid image URL
  const getProfileImageUrl = () => {
    if (!profile || !profile.profilePicture) {
      return 'https://placehold.co/150';
    }
    
    // If it already has http/https, use it directly
    if (profile.profilePicture.startsWith('http')) {
      return profile.profilePicture;
    }
    
    // If it's an API route, append the base URL
    if (profile.profilePicture.startsWith('/api')) {
      // For development, use the current origin
      return `${window.location.origin}${profile.profilePicture}`;
    }
    
    // Otherwise return a placeholder
    return 'https://placehold.co/150';
  };

  // Helper function to clean up attraction names
  const cleanAttractionName = (name) => {
    if (!name) return 'Unnamed Attraction';
    
    // Map numeric IDs to actual attraction names
    const knownAttractions = {
      '1': 'Lingaraj Temple',
      '2': 'Konark Sun Temple',
      '3': 'Nandankanan Zoological Park',
      '4': 'Udayagiri and Khandagiri Caves',
      '5': 'Dhauli Shanti Stupa',
      '6': 'Puri Beach'
    };
    
    // If the name is just a number or a known ID, return the proper name
    if (knownAttractions[name]) {
      return knownAttractions[name];
    }
    
    // Remove "Attraction" prefix if present
    if (name.startsWith('Attraction ')) {
      return name.substring(11);
    }
    
    // Convert dash-case to title case if needed
    if (name.includes('-')) {
      return name.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return name;
  };

  if (authLoading || (loading && !profile)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              {/* Avatar with image preview or profile picture */}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                  imagePreview ? (
                    <IconButton 
                      size="small" 
                      onClick={cancelImageUpload}
                      sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: '#e0e0e0' } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton 
                      component="label" 
                      htmlFor="profile-image-upload"
                      size="small"
                      color="primary"
                      sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: '#e0e0e0' } }}
                    >
                      <PhotoCamera fontSize="small" />
                      <input
                        id="profile-image-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  )
                  }
                >
                  <Avatar 
                  src={imagePreview || getProfileImageUrl()}
                    alt={profile.name}
                    sx={{ width: 120, height: 120, mr: 3 }}
                  />
                </Badge>
            </Box>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h5">{profile.name}</Typography>
              <Typography variant="body1" color="text.secondary">{profile.email}</Typography>
              
              {selectedImage && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  startIcon={uploadingImage ? <CircularProgress size={20} /> : <PhotoCamera />}
                  sx={{ mt: 2 }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload New Image'}
                </Button>
              )}
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            startIcon={editing ? <Save /> : <Edit />}
            onClick={() => editing ? handleSubmit() : setEditing(true)}
          >
            {editing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>
    
        {editing ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Interests</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.interests.map((interest, index) => (
                    <Chip 
                      key={index}
                      label={interest}
                      onDelete={() => handleRemoveInterest(interest)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Add interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddInterest}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            {profile.bio && (
              <>
                <Typography variant="subtitle1" gutterBottom>About</Typography>
                <Typography variant="body1" paragraph>{profile.bio}</Typography>
              </>
            )}
            
            <Typography variant="subtitle1" gutterBottom>Interests</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {(profile?.preferences?.interests || formData.interests || []).length > 0 ? (
                (profile?.preferences?.interests || formData.interests || []).map((interest, index) => (
                  <Chip 
                    key={index}
                    label={interest}
                    color="primary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No interests added yet</Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Favorite color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Favorite Attractions</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {favorites.length > 0 ? (
              <List>
                {favorites.map((favorite) => {
                  // Ensure favorite has an id and all required fields
                  if (!favorite || !favorite.id) {
                    console.warn('Invalid favorite item:', favorite);
                    return null;
                  }
                  
                  console.log('Rendering favorite:', favorite);
                  
                  return (
                  <ListItem 
                    key={favorite.id} 
                    disablePadding 
                    sx={{ 
                      mb: 1, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                          src={favorite.image || 'https://placehold.co/100'} 
                        alt={favorite.name} 
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      component="div"
                      primary={
                        <Link 
                          to={`/attractions/${favorite.id}`} 
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit',
                            fontWeight: 'bold'
                          }}
                        >
                          {favorite.name}
                        </Link>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Rating value={favorite.rating || 0} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }} component="span">
                            ({favorite.rating || '0'})
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Remove from favorites">
                        <IconButton 
                          edge="end" 
                          aria-label="remove" 
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  );
                }).filter(Boolean)} {/* Filter out null items */}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <FavoriteBorder sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  No favorites added yet
                </Typography>
                <Button 
                  component={Link} 
                  to="/attractions" 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Explore Attractions
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Recommend color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Recommended Places</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {loadingRecommendations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
              </Box>
            ) : recommendations.length > 0 ? (
              <Grid container spacing={2}>
                {recommendations.map((recommendation) => (
                  <Grid item xs={12} key={recommendation.id}>
                    <Card sx={{ display: 'flex', height: '100%' }}>
                      <CardActionArea 
                        component={Link} 
                        to={`/attractions/${recommendation.id}`}
                        sx={{ display: 'flex', alignItems: 'stretch', width: '100%', justifyContent: 'flex-start' }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 100, height: 'auto' }}
                          image={recommendation.image || 'https://placehold.co/100'}
                          alt={recommendation.name}
                        />
                        <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                          <Typography variant="subtitle1" component="div" gutterBottom>
                            {recommendation.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={recommendation.rating || 0} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }} component="span">
                              ({recommendation.rating || '0'})
                            </Typography>
                          </Box>
                          {recommendation.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {recommendation.description}
                            </Typography>
                          )}
                          {recommendation.tags && recommendation.tags.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {recommendation.tags.slice(0, 3).map((tag, index) => (
                                <Chip 
                                  key={index} 
                                  label={tag} 
                                  size="small"
                                  sx={{ height: '20px', fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Recommend sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary" paragraph>
                  {formData.interests.length > 0 
                    ? "We couldn't find recommendations based on your interests." 
                    : "Add some interests to get personalized recommendations."
                  }
              </Typography>
                {formData.interests.length === 0 && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setEditing(true)}
                  >
                    Add Interests
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage; 