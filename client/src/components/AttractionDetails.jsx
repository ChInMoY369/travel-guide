import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Rating,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  TextField,
  IconButton,
  useTheme
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Info as InfoIcon,
  AttachMoney as AttachMoneyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  ArrowBack as ArrowBackIcon,
  MonetizationOn as MonetizationOnIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  WbSunny as WbSunnyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { getAttractionById, getAttractions, addAttractionReview } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { DarkModeContext } from '../contexts/DarkModeContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AttractionTabPanel from './attraction/AttractionTabPanel';

// Function to sanitize markdown formatting that might be in the content
const sanitizeContent = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Remove markdown formatting that might have been added
  return text
    .replace(/(\n|^)#+\s/g, '$1') // Remove heading markers
    .replace(/(\s|^)\*\*\*(.+?)\*\*\*(\s|$)/g, '$1$2$3') // Remove bold+italic markers
    .replace(/(\s|^)\*\*(.+?)\*\*(\s|$)/g, '$1$2$3') // Remove bold markers
    .replace(/(\s|^)_(.+?)_(\s|$)/g, '$1$2$3') // Remove italic markers
    .replace(/(\s|^)~~(.+?)~~(\s|$)/g, '$1$2$3') // Remove strikethrough
    .replace(/(\s|^)`(.+?)`(\s|$)/g, '$1$2$3'); // Remove inline code
};

const AttractionDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [relatedAttractions, setRelatedAttractions] = useState([]);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Determine the actual ID (either from URL params or convert slug to find by name)
  const paramId = id || slug;

  useEffect(() => {
    const fetchAttractionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add detailed logging about the parameter received
        console.log('AttractionDetails - Parameters received:', { id, slug, paramId });
        console.log('AttractionDetails - Parameter type:', typeof paramId);
        
        let attractionData;
        
        // Check if we have a MongoDB ObjectId format or a slug
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(paramId);
        console.log('AttractionDetails - Is ObjectId format:', isObjectId);
        
        if (isObjectId) {
          // If it's an ObjectId, fetch directly by ID
          console.log('AttractionDetails - Fetching by ObjectId:', paramId);
          
          try {
            // Import and use the api utility that includes auth tokens
            const response = await axios.get(`/api/attractions/${paramId}`);
            console.log('AttractionDetails - ObjectId fetch response:', response);
            attractionData = response.data;
          } catch (err) {
            console.error('AttractionDetails - Error fetching by ObjectId:', err);
            console.error('Error details:', {
              status: err.response?.status,
              statusText: err.response?.statusText,
              message: err.message,
              data: err.response?.data
            });
            
            // Try the regular API as a fallback
            console.log('AttractionDetails - Trying regular API as fallback');
            const fallbackResponse = await getAttractionById(paramId);
            attractionData = fallbackResponse.data;
          }
        } else {
          // If it's a slug, convert to name format (e.g., "konark-sun-temple" -> "Konark Sun Temple")
          // Then fetch by name
          const nameFromSlug = paramId.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
            
          console.log('AttractionDetails - Fetching attraction by name:', nameFromSlug);
          
          try {
            // Use the api utility
            const response = await axios.get(`/api/attractions?name=${encodeURIComponent(nameFromSlug)}`);
            console.log('AttractionDetails - Name search response:', response);
            
            if (response.data.attractions && response.data.attractions.length > 0) {
              attractionData = response.data.attractions[0];
              console.log('AttractionDetails - Found attraction by name:', attractionData.name);
            } else {
              console.error('AttractionDetails - No attractions found for name:', nameFromSlug);
              console.log('Response data structure:', JSON.stringify(response.data));
              
              // Try the regular API as a fallback
              console.log('AttractionDetails - Trying regular API as fallback');
              const fallbackResponse = await getAttractions({ name: nameFromSlug });
              
              if (fallbackResponse.data.attractions && fallbackResponse.data.attractions.length > 0) {
                attractionData = fallbackResponse.data.attractions[0];
              } else {
                throw new Error(`No attraction found with the name: ${nameFromSlug}`);
              }
            }
          } catch (err) {
            console.error('AttractionDetails - Error fetching by name:', err);
            console.error('Error details:', {
              status: err.response?.status,
              statusText: err.response?.statusText,
              message: err.message,
              data: err.response?.data
            });
            throw err;
          }
        }
        
        console.log('AttractionDetails - Attraction data loaded:', attractionData);
        console.log('AttractionDetails - Description available:', 
          Boolean(attractionData?.description), 
          'Description:', attractionData?.description);
        
        // Sanitize the attraction data before setting state
        if (attractionData) {
          // Sanitize text fields to remove unwanted formatting
          const sanitizedData = {
            ...attractionData,
            name: sanitizeContent(attractionData.name),
            description: sanitizeContent(attractionData.description || ''),
            aiDescription: sanitizeContent(attractionData.aiDescription),
            culturalSignificance: sanitizeContent(attractionData.culturalSignificance),
            bestTimeToVisit: sanitizeContent(attractionData.bestTimeToVisit),
            overview: sanitizeContent(attractionData.overview),
            location: attractionData.location ? {
              ...attractionData.location,
              address: sanitizeContent(attractionData.location.address)
            } : attractionData.location,
            visitorTips: attractionData.visitorTips ? attractionData.visitorTips.map(tip => ({
              ...tip,
              title: sanitizeContent(tip.title),
              content: sanitizeContent(tip.content)
            })) : attractionData.visitorTips
          };
          
          console.log('AttractionDetails - Sanitized data:', sanitizedData);
          setAttraction(sanitizedData);
        } else {
          setAttraction(attractionData);
        }
        
        // Fetch related attractions based on type or tags
        if (attractionData) {
          try {
            console.log('AttractionDetails - Fetching related attractions for type:', attractionData.type);
            const relatedResponse = await getAttractions({
              type: attractionData.type,
              limit: 4
            });
            
            console.log('AttractionDetails - Related attractions response:', relatedResponse);
            
            // Filter out the current attraction
            const filtered = relatedResponse.data.attractions.filter(
              related => related._id !== attractionData._id
            ).slice(0, 3); // Limit to 3 related attractions
            
            console.log('AttractionDetails - Related attractions filtered:', filtered);
            
            // Sanitize text in related attractions
            const sanitizedRelated = filtered.map(related => ({
              ...related,
              name: sanitizeContent(related.name),
              description: sanitizeContent(related.description)
            }));
            
            setRelatedAttractions(sanitizedRelated);
          } catch (relatedError) {
            console.error('AttractionDetails - Error fetching related attractions:', relatedError);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('AttractionDetails - Error in fetchAttractionData:', err);
        setError('Failed to load attraction data. ' + (err.message || ''));
        setLoading(false);
      }
    };

    if (paramId) {
      fetchAttractionData();
    } else {
      console.error('AttractionDetails - No valid ID or slug provided');
      setError('No valid attraction ID or slug provided');
      setLoading(false);
    }
  }, [paramId]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      // Toggle favorite status
      setFavorite(!favorite);
      
      // Call API to add/remove from favorites
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      if (!favorite) {
        // Add to favorites
        await axios.post('/api/users/favorites', 
          { attractionId: attraction._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Remove from favorites
        await axios.delete(`/api/users/favorites/${attraction._id}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      // Revert the toggle if the API call fails
      setFavorite(!favorite);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (reviewRating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    try {
      setReviewSubmitting(true);
      setReviewError(null);
      
      await addAttractionReview(attraction._id, {
        rating: reviewRating,
        comment: reviewComment
      });
      
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment('');
      
      // Refresh attraction data to show the new review
      const response = await getAttractionById(attraction._id);
      setAttraction(response.data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
      
      setReviewSubmitting(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. ' + (err.response?.data?.message || err.message));
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Loading attraction details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
            {error}
          </Alert>
          <Typography variant="body1" sx={{ mt: 1, mb: 2, maxWidth: 600 }}>
            Possible reasons for this error:
            <ul>
              <li>The server is not running</li>
              <li>MongoDB is not connected or accessible</li>
              <li>The attraction ID is invalid or does not exist in the database</li>
              <li>There is a network connectivity issue</li>
            </ul>
            Try the troubleshooting options below:
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="secondary"
              component={Link} 
              to="/test-db"
            >
              Database Test Page
            </Button>
            
            <Button 
              variant="contained" 
              color="primary"
              component={Link} 
              to="/debug/attraction"
            >
              Debug Attraction Data
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => navigate('/attractions')}
              startIcon={<ArrowBackIcon />}
            >
              Back to Attractions
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!attraction) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Alert severity="warning" sx={{ width: '100%', maxWidth: 600 }}>
            Attraction not found
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/attractions')}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Attractions
          </Button>
        </Box>
      </Container>
    );
  }

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return 'Closed';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${suffix}`;
    } catch (e) {
      return timeString;
    }
  };

  // Get today's opening hours
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = attraction.openingHours && attraction.openingHours[today];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/attractions')}
        sx={{ mb: 3 }}
      >
        Back to Attractions
      </Button>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" paragraph>
              Possible reasons for the error:
              <ul>
                <li>The server is not running</li>
                <li>MongoDB connection issue</li>
                <li>Invalid attraction ID</li>
                <li>Network issue</li>
              </ul>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" color="primary" component={Link} to="/test-db">
                Database Test Page
              </Button>
              <Button variant="outlined" color="primary" component={Link} to="/debug/attraction">
                Debug Attraction Data
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/attractions')}
                startIcon={<ArrowBackIcon />}
              >
                Back to Attractions List
              </Button>
            </Box>
          </Box>
        </Alert>
      ) : attraction ? (
        <>
          {/* Hero Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              mb: 4, 
              overflow: 'hidden',
              bgcolor: darkMode ? 'background.paper' : 'white',
              borderRadius: 2
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                height: { xs: '250px', md: '400px' },
                overflow: 'hidden',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${
                  attraction.images && 
                  attraction.images.length > 0 && 
                  attraction.images[0] && 
                  attraction.images[0].trim() !== '' 
                    ? attraction.images[0] 
                    : 'https://via.placeholder.com/1200x800?text=No+Image+Available'
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 3
              }}
            >
              <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {attraction.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Rating value={attraction.averageRating || 0} precision={0.5} readOnly />
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  {attraction.averageRating ? attraction.averageRating.toFixed(1) : 'No ratings yet'} 
                  {attraction.reviews && ` (${attraction.reviews.length} reviews)`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {attraction.tags && attraction.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                    }} 
                  />
                ))}
              </Box>
            </Box>
          </Paper>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton 
              color={favorite ? 'error' : 'default'} 
              onClick={handleFavoriteToggle}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
              sx={{ mr: 1 }}
            >
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          {/* Main Content Layout */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Main Content - Overview */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: darkMode ? 'background.paper' : 'white',
                }}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Overview
                  </Typography>
                </Box>
                <AttractionTabPanel attraction={attraction} />
              </Paper>
            </Grid>
            
            {/* Quick Info Sidebar */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: darkMode ? 'background.paper' : 'white',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                  Quick Info
                </Typography>
                
                {/* Opening Hours */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, mt: 2 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Opening Hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {attraction.openingHours ? (
                        `${attraction.openingHours.monday?.open || '9:00 AM'} - ${attraction.openingHours.monday?.close || '6:00 PM'}`
                      ) : (
                        '9:00 AM - 6:00 PM (Default)'
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Entry Fee */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <MonetizationOnIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Entry Fee
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {attraction.entryFee?.amount > 0 ? (
                        `${attraction.entryFee.amount} ${attraction.entryFee.currency || 'INR'}`
                      ) : (
                        'Free Entry'
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Best Time to Visit */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <WbSunnyIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Best Time to Visit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {attraction.bestTimeToVisit || 'Information not available'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Contact */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <PhoneIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Contact
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +91 674 2430 968
                    </Typography>
                  </Box>
                </Box>
                
                {/* Website */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LanguageIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Website
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      href="https://odishatourism.gov.in" 
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none' }}
                    >
                      Visit Website
                    </Button>
                  </Box>
                </Box>
              </Paper>
              
              {/* Facilities Card */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: darkMode ? 'background.paper' : 'white',
                  mt: 3
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                  Facilities
                </Typography>
                
                {attraction.facilities && attraction.facilities.length > 0 ? (
                  <List dense disablePadding>
                    {attraction.facilities.map((facility, index) => (
                      <ListItem key={index} disablePadding sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box 
                            sx={{ 
                              color: 'primary.main',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '1px solid',
                              borderColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 16 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary={sanitizeContent(facility)}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No facility information available
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Reviews Section */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? 'background.paper' : 'white',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Reviews
            </Typography>
            
            {/* Submit Review Form */}
            {isAuthenticated && (
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                
                {reviewError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {reviewError}
                  </Alert>
                )}
                
                {reviewSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Your review has been submitted successfully!
                  </Alert>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="rating"
                    value={reviewRating}
                    onChange={(event, newValue) => {
                      setReviewRating(newValue);
                    }}
                    size="large"
                  />
                </Box>
                
                <TextField
                  label="Your Review"
                  multiline
                  rows={4}
                  fullWidth
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={reviewSubmitting || reviewRating === 0}
                  sx={{ mt: 1 }}
                >
                  {reviewSubmitting ? <CircularProgress size={24} /> : 'Submit Review'}
                </Button>
              </Box>
            )}
            
            {/* Reviews List */}
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {attraction.reviews && attraction.reviews.length > 0 
                ? `${attraction.reviews.length} Reviews` 
                : 'No Reviews Yet'}
            </Typography>
            
            {!isAuthenticated && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Want to share your experience?
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/login')}
                  startIcon={<CommentIcon />}
                  size="small"
                >
                  Login to Write a Review
                </Button>
              </Box>
            )}
            
            {attraction.reviews && attraction.reviews.length > 0 ? (
              attraction.reviews.map((review, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">
                        {review.user?.name || 'Anonymous User'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 7 }}>
                    {review.comment}
                  </Typography>
                  {index < attraction.reviews.length - 1 && <Divider sx={{ my: 3 }} />}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Be the first to review this attraction!
              </Typography>
            )}
          </Paper>
        </>
      ) : (
        <Alert severity="info">Loading attraction data...</Alert>
      )}
    </Container>
  );
};

export default AttractionDetails; 