import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  ArrowBack,
  ArrowForward,
  Share,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AttractionTabPanel from './attraction/AttractionTabPanel';

// Placeholder image if no image is available
const defaultImage = "https://via.placeholder.com/1200x600?text=No+Image+Available";

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

// Custom section renderers
const sectionRenderers = {
  // Hero Section with full-width background image and overlay text
  heroSection: ({ data, darkMode }) => (
    <Box 
      sx={{ 
        position: 'relative',
        height: { xs: '50vh', md: '70vh' },
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${data.backgroundImage || defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: { xs: 3, md: 5 },
        mb: 4
      }}
    >
      <Typography variant="h2" component="h1" color="white" fontWeight="bold" gutterBottom>
        {sanitizeContent(data.title)}
      </Typography>
      <Typography variant="h5" color="white" sx={{ mb: 2, maxWidth: '800px' }}>
        {sanitizeContent(data.subtitle)}
      </Typography>
      {data.showButton && (
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            mt: 2, 
            alignSelf: 'flex-start',
            bgcolor: data.buttonColor || 'primary.main',
            '&:hover': {
              bgcolor: data.buttonHoverColor || 'primary.dark'
            }
          }}
        >
          {sanitizeContent(data.buttonText) || "Learn More"}
        </Button>
      )}
    </Box>
  ),

  // Two-column section with image on one side and text on the other
  twoColumnSection: ({ data, darkMode, imageOnLeft = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // On mobile, always stack with image on top
    const imageColumn = (
      <Grid item xs={12} md={6}>
        <Box 
          component="img"
          src={data.image || defaultImage}
          alt={data.imageAlt || "Destination image"}
          sx={{
            width: '100%',
            height: { xs: '300px', md: '100%' },
            objectFit: 'cover',
            borderRadius: 2
          }}
        />
      </Grid>
    );
    
    const textColumn = (
      <Grid item xs={12} md={6}>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h2" gutterBottom color={darkMode ? 'white' : 'text.primary'}>
            {sanitizeContent(data.title)}
          </Typography>
          <Typography variant="body1" paragraph color={darkMode ? 'white' : 'text.primary'}>
            {sanitizeContent(data.content)}
          </Typography>
          {data.showButton && (
            <Button 
              variant="contained" 
              size="medium"
              sx={{ 
                mt: 2,
                bgcolor: data.buttonColor || 'primary.main',
                '&:hover': {
                  bgcolor: data.buttonHoverColor || 'primary.dark'
                }
              }}
            >
              {sanitizeContent(data.buttonText) || "Learn More"}
            </Button>
          )}
        </Box>
      </Grid>
    );

    return (
      <Paper elevation={0} sx={{ mb: 4, bgcolor: data.backgroundColor || (darkMode ? 'background.paper' : 'white'), overflow: 'hidden', borderRadius: 2 }}>
        <Grid container spacing={0}>
          {isMobile ? (
            // On mobile, always image on top, text below
            <>
              {imageColumn}
              {textColumn}
            </>
          ) : (
            // On desktop, respect the imageOnLeft prop
            imageOnLeft ? (
              <>
                {imageColumn}
                {textColumn}
              </>
            ) : (
              <>
                {textColumn}
                {imageColumn}
              </>
            )
          )}
        </Grid>
      </Paper>
    );
  },

  // Blueish photo box (similar to Odisha State Museum design)
  blueishPhotoBox: ({ data, darkMode }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 4, 
        bgcolor: data.backgroundColor || '#0a2351', 
        color: 'white',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {sanitizeContent(data.title)}
            </Typography>
            <Typography variant="body1" paragraph>
              {sanitizeContent(data.content)}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
              {data.highlights && data.highlights.map((highlight, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    px: 2, 
                    py: 1, 
                    borderRadius: 1,
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <Typography variant="body2">{sanitizeContent(highlight)}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box 
            component="img"
            src={data.image || defaultImage}
            alt={data.imageAlt || "Feature image"}
            sx={{
              width: '100%',
              height: { xs: '300px', md: '100%', minHeight: '400px' },
              objectFit: 'cover'
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  ),

  // Gallery section with multiple images
  gallerySection: ({ data, darkMode }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = data.images || [];
    
    const showPrevious = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
    
    const showNext = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };
    
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: { xs: 2, md: 4 }, 
          bgcolor: data.backgroundColor || (darkMode ? 'background.paper' : 'white'),
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }} color={darkMode ? 'white' : 'text.primary'}>
          {data.title || "Photo Gallery"}
        </Typography>
        
        {images.length > 0 ? (
          <Box sx={{ position: 'relative' }}>
            <Box 
              component="img"
              src={images[currentIndex] || defaultImage}
              alt={`Gallery image ${currentIndex + 1}`}
              sx={{
                width: '100%',
                height: { xs: '300px', sm: '400px', md: '500px' },
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
            
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: 16, 
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              onClick={showPrevious}
            >
              <ArrowBack />
            </IconButton>
            
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                right: 16, 
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              onClick={showNext}
            >
              <ArrowForward />
            </IconButton>
            
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              width: '100%',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 2
            }}>
              <Typography variant="body1">
                {data.captions?.[currentIndex] || `Image ${currentIndex + 1} of ${images.length}`}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">No gallery images available</Typography>
        )}
      </Paper>
    );
  },

  // Grid of cards (for things to do, places to see, etc.)
  cardGridSection: ({ data, darkMode }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 4, 
        p: { xs: 2, md: 4 }, 
        bgcolor: data.backgroundColor || (darkMode ? 'background.paper' : 'white'),
        borderRadius: 2
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom color={darkMode ? 'white' : 'text.primary'}>
        {data.title}
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }} color={darkMode ? 'white' : 'text.primary'}>
        {data.description}
      </Typography>
      
      <Grid container spacing={3}>
        {(data.cards || []).map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)'
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={card.image || defaultImage}
                alt={card.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  ),

  // Tabbed content section
  tabbedContentSection: ({ data, darkMode, attraction }) => {
    // Get a short description - either from aiDescription or truncate the regular description
    const shortDescription = attraction?.aiDescription || 
      (attraction?.description && attraction.description.length > 150 
        ? `${attraction.description.substring(0, 150)}...` 
        : attraction?.description);
    
    return (
      <Paper elevation={0} sx={{ mb: 4 }}>
        {/* Short description above the tabs */}
        {shortDescription && (
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="body1" paragraph>
              {sanitizeContent(shortDescription)}
            </Typography>
          </Box>
        )}
        <AttractionTabPanel attraction={attraction} showShortDescription={false} />
      </Paper>
    );
  }
};

// Main destination template component
const DestinationTemplate = ({ attraction, layoutSections, darkMode = false }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
  };

  return (
    <Box sx={{ 
      bgcolor: darkMode ? '#1a1a2e' : '#f8f9fa',
      color: darkMode ? '#f8f9fa' : '#121212',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back button */}
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/attractions')}
          sx={{ mb: 3 }}
        >
          Back to Attractions
        </Button>

        {/* Render each section based on the layout configuration */}
        {layoutSections && layoutSections.map((section, index) => {
          const SectionRenderer = sectionRenderers[section.type];
          if (!SectionRenderer) return null;
          
          return (
            <Box key={index}>
              {SectionRenderer({ 
                data: section.data, 
                darkMode, 
                imageOnLeft: section.imageOnLeft,
                attraction
              })}
            </Box>
          );
        })}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, gap: 1 }}>
          <IconButton 
            aria-label="share" 
            color="primary"
            sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)' }}
          >
            <Share />
          </IconButton>
          <IconButton 
            aria-label="favorite" 
            color="primary"
            sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)' }}
            onClick={handleFavoriteToggle}
          >
            {favorite ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default DestinationTemplate; 