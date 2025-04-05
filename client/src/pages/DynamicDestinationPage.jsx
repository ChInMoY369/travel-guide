import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid, 
  Paper, 
  Chip,
  Card,
  CardContent,
  IconButton,
  Rating,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  ArrowBack, 
  LocationOn, 
  AccessTime, 
  Money, 
  Info, 
  CheckCircle,
  Star
} from '@mui/icons-material';

// Function to sanitize markdown formatting that might be in the content
const sanitizeContent = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Remove markdown formatting that might have been added
  return text
    .replace(/(\n|^)#+\s/g, '$1') // Remove heading markers
    .replace(/(\s|^)\*\*(.+?)\*\*(\s|$)/g, '$1$2$3') // Remove bold markers
    .replace(/(\s|^)\*\*\*(.+?)\*\*\*(\s|$)/g, '$1$2$3') // Remove bold+italic markers
    .replace(/(\s|^)_(.+?)_(\s|$)/g, '$1$2$3') // Remove italic markers
    .replace(/(\s|^)~~(.+?)~~(\s|$)/g, '$1$2$3') // Remove strikethrough
    .replace(/(\s|^)`(.+?)`(\s|$)/g, '$1$2$3'); // Remove inline code
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DynamicDestinationPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [tabValue, setTabValue] = useState(0);

  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkMode(event.detail.darkMode);
    };
    
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Sanitize attraction data before displaying
  const sanitizeAttractionData = (data) => {
    if (!data) return null;
    
    return {
      ...data,
      name: sanitizeContent(data.name),
      description: sanitizeContent(data.description),
      aiDescription: sanitizeContent(data.aiDescription),
      culturalSignificance: sanitizeContent(data.culturalSignificance),
      bestTimeToVisit: sanitizeContent(data.bestTimeToVisit),
      overview: sanitizeContent(data.overview),
      location: data.location ? {
        ...data.location,
        address: sanitizeContent(data.location.address)
      } : data.location,
      visitorTips: data.visitorTips ? data.visitorTips.map(tip => ({
        ...tip,
        title: sanitizeContent(tip.title),
        content: sanitizeContent(tip.content)
      })) : data.visitorTips
    };
  };

  // Fetch attraction data
  useEffect(() => {
    const fetchAttractionData = async () => {
      try {
        setLoading(true);
        let response;
        
        // Determine if we're using id or slug
        const paramId = id || slug;
        
        console.log('DynamicDestinationPage - Fetching attraction with param:', paramId);
        console.log('DynamicDestinationPage - Route params:', { id, slug });
        
        // Check if paramId is a MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(paramId);
        console.log('DynamicDestinationPage - Is MongoDB ObjectId?', isObjectId);
        
        if (isObjectId) {
          // If it's an ObjectId, fetch directly
          console.log('DynamicDestinationPage - Fetching by ID:', paramId);
          response = await api.get(`/attractions/${paramId}`);
          console.log('DynamicDestinationPage - Fetched attraction by ID:', response.data);
        } else {
          // If it's a slug, transform to a name for filtering
          const nameFromSlug = paramId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          console.log('DynamicDestinationPage - Fetching by name:', nameFromSlug);
          // Fetch by name
          response = await api.get(`/attractions?name=${encodeURIComponent(nameFromSlug)}`);
          
          // Get the first result
          if (response.data && response.data.length > 0) {
            response = { data: response.data[0] };
            console.log('DynamicDestinationPage - Fetched attraction by name:', response.data);
          } else {
            console.error('DynamicDestinationPage - No attraction found with name:', nameFromSlug);
            throw new Error('Attraction not found');
          }
        }
        
        // Sanitize the data before setting state
        setAttraction(sanitizeAttractionData(response.data));
        setLoading(false);
      } catch (err) {
        console.error('DynamicDestinationPage - Error fetching attraction:', err);
        setError('Failed to load attraction data. Please try again later.');
        setLoading(false);
      }
    };

    if (id || slug) {
      fetchAttractionData();
    } else {
      console.error('DynamicDestinationPage - No ID or slug provided in params');
    }
  }, [id, slug]);

  // Go back to attractions page
  const handleBack = () => {
    navigate('/attractions');
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        bgcolor: darkMode ? '#121212' : '#f5f5f5'
      }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: darkMode ? '#e0e0e0' : '#333' }}>
          Loading destination...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '60vh' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Attractions
        </Button>
      </Container>
    );
  }

  // If attraction data loaded successfully
  if (attraction) {
    return (
      <Box sx={{ 
        bgcolor: darkMode ? '#121212' : '#f5f5f5', 
        color: darkMode ? '#e0e0e0' : '#333333',
        minHeight: '100vh'
      }}>
        {/* Hero section with image background */}
        <Box 
          sx={{ 
            position: 'relative',
            height: '55vh',
            color: '#ffffff',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url(${attraction.images && attraction.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            textAlign: 'left',
            p: 3
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', pb: 2 }}>
            {/* Navigation button */}
            <IconButton 
              onClick={handleBack} 
              sx={{ 
                position: 'absolute',
                top: '-40px',
                left: 0,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                },
                boxShadow: 2
              }}
            >
              <ArrowBack />
            </IconButton>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                mb: 2
              }}
            >
              {attraction.name}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              <LocationOn sx={{ fontSize: 18, verticalAlign: 'text-bottom', mr: 0.5 }} />
              {attraction.location?.address || 'Location not available'} 
              {attraction.location?.address?.includes('km from') ? '' : ' (4.5 km from Bhubaneswar Railway Station)'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={attraction.averageRating || 4.6} precision={0.1} readOnly size="small" sx={{ color: '#ffb400', mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                {attraction.averageRating?.toFixed(1) || '4.6'} ({attraction.reviews?.length || '2100'} reviews)
              </Typography>
              
              {/* Tags/Chips */}
              {(attraction.tags && attraction.tags.length > 0) ? (
                attraction.tags.slice(0, 2).map((tag, idx) => (
                  <Chip 
                    key={idx}
                    label={tag} 
                    size="small"
                    sx={{ 
                      mr: 1, 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }} 
                  />
                ))
              ) : (
                <>
                  <Chip 
                    label="Heritage" 
                    size="small"
                    sx={{ 
                      mr: 1, 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }} 
                  />
                  <Chip 
                    label="13th Century" 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }} 
                  />
                </>
              )}
            </Box>
          </Container>
        </Box>
        
        {/* Main content with tabs and sidebar */}
        <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
          <Grid container spacing={3}>
            {/* Main content area with tabs */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: 1, overflow: 'hidden' }}>
                {/* Short description above the tabs */}
                <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <Typography variant="body1">
                    {sanitizeContent(
                      attraction.aiDescription || 
                      (attraction.description && attraction.description.length > 180 
                        ? `${attraction.description.substring(0, 180)}...` 
                        : attraction.description)
                    )}
                  </Typography>
                </Box>
                
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="destination tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{ style: { background: '#f56565' } }}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'uppercase',
                        minWidth: 'auto',
                        px: 3,
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: darkMode ? '#aaa' : '#666'
                      },
                      '& .Mui-selected': {
                        color: '#f56565 !important',
                        fontWeight: 600
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#f56565'
                      }
                    }}
                  >
                    <Tab label="ABOUT" />
                    <Tab label="ARCHITECTURE" />
                    <Tab label="HISTORY" />
                    <Tab label="PHOTOS" />
                    <Tab label="TIPS" />
                    <Tab label="HOTELS" />
                    <Tab label="RESTAURANTS" />
                  </Tabs>
                </Box>
                
                {/* Tab content panels */}
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3, color: darkMode ? '#e0e0e0' : '#333' }}>
                    About
                  </Typography>
                  
                  <Typography paragraph sx={{ mb: 4, lineHeight: 1.7 }}>
                    {sanitizeContent(attraction.description) || `The Ananta Vasudeva Temple, built in the 13th century, is a magnificent example of Kalinga architecture dedicated to Lord Krishna. This temple is particularly significant as it represents the Vaishnavite tradition in a city predominantly known for its Shaivite temples. Standing as a testament to the religious harmony and architectural excellence of medieval Odisha, the temple features three main deities: Lord Krishna (Vasudeva) in the center, flanked by his brother Balarama and sister Subhadra. The temple follows the classic Kalinga style of architecture with its characteristic curvilinear tower (Rekha Deula) and intricately carved walls. The temple complex includes the main sanctum (Garbha Griha), a hall of offerings (Jagamohana), and a dance hall (Natamandira). The walls are adorned with exquisite carvings depicting various scenes from the life of Lord Krishna and other mythological narratives. One of the most striking features of the temple is its perfect symmetry and the harmonious blend of architectural elements. The temple's design reflects the mature phase of Kalinga architecture, with its refined proportions and sophisticated decorative elements.`}
                  </Typography>
                  
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 5, color: darkMode ? '#e0e0e0' : '#333' }}>
                    Key Significance
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The Ananta Vasudeva Temple represents a unique example of Vaishnavite architecture in a predominantly Shaivite city."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The temple houses three main deities: Lord Krishna (Vasudeva), Balarama, and Subhadra, showcasing the Vaishnava tradition."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The temple's architecture reflects the mature phase of Kalinga style, with its perfect symmetry and sophisticated decorative elements."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 5, color: darkMode ? '#e0e0e0' : '#333' }}>
                    What It's Famous For
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The exquisite carvings depicting scenes from Lord Krishna's life and other mythological narratives."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The harmonious blend of architectural elements and perfect symmetry in temple design."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="The celebration of Janmashtami that attracts devotees from across the region."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 5, color: darkMode ? '#e0e0e0' : '#333' }}>
                    Educational Value
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Provides insights into the Vaishnavite traditions and their coexistence with Shaivite practices in medieval Odisha."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Demonstrates the architectural excellence achieved during the Eastern Ganga dynasty."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ pl: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f56565', mr: 2 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Showcases the intricate stone carving techniques and artistic traditions of 13th-century Odisha."
                        primaryTypographyProps={{ 
                          sx: { 
                            lineHeight: 1.6,
                            color: darkMode ? '#e0e0e0' : '#333'
                          }
                        }}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 5, color: darkMode ? '#e0e0e0' : '#333' }}>
                    Facilities
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <Chip label="Shoe stands" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Water facility" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Prasad distribution" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Rest areas" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Security services" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Clean washrooms" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                    <Chip label="Wheelchair accessibility" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                  </Box>
                </TabPanel>
                
                {/* Other tab panels */}
                <TabPanel value={tabValue} index={1}>
                  <Typography>Architecture information would appear here.</Typography>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  <Typography>History information would appear here.</Typography>
                </TabPanel>
                
                <TabPanel value={tabValue} index={3}>
                  <Typography>Photos would appear here.</Typography>
                </TabPanel>
                
                <TabPanel value={tabValue} index={4}>
                  <Typography>Tips for visitors would appear here.</Typography>
                </TabPanel>
                
                <TabPanel value={tabValue} index={5}>
                  <Typography>Nearby hotels would appear here.</Typography>
                </TabPanel>
                
                <TabPanel value={tabValue} index={6}>
                  <Typography>Nearby restaurants would appear here.</Typography>
                </TabPanel>
              </Paper>
            </Grid>
            
            {/* Sidebar with Quick Info and Nearby Attractions */}
            <Grid item xs={12} md={4}>
              {/* Quick Info Box */}
              <Paper sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Quick Info
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ mt: 0.5, color: '#ff6b6b' }}>
                      <AccessTime sx={{ color: 'inherit', fontSize: 20, mr: 2 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Opening Hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attraction.openingHours?.monday?.open && attraction.openingHours?.monday?.close ? 
                          `${attraction.openingHours.monday.open} - ${attraction.openingHours.monday.close}` : 
                          '6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ mt: 0.5, color: '#ff6b6b' }}>
                      <Money sx={{ color: 'inherit', fontSize: 20, mr: 2 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Entry Fee
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attraction.entryFee?.amount ? 
                          `${attraction.entryFee.amount} ${attraction.entryFee.currency}` : 
                          'Indian: Free, Foreign: Free'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ mt: 0.5, color: '#ff6b6b' }}>
                      <Info sx={{ color: 'inherit', fontSize: 20, mr: 2 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Best Time to Visit
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attraction.bestTimeToVisit || 'October to March'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ mt: 0.5, color: '#ff6b6b' }}>
                      <LocationOn sx={{ color: 'inherit', fontSize: 20, mr: 2 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Contact
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +91 674 2430 968
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.5, color: '#ff6b6b' }}>
                      <Star sx={{ color: 'inherit', fontSize: 20, mr: 2 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Website
                      </Typography>
                      <Button 
                        variant="text" 
                        size="small" 
                        sx={{ pl: 0, textTransform: 'none', color: 'primary.main' }}
                      >
                        Visit Website
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              
              {/* Facilities Box */}
              <Paper sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Facilities
                </Typography>
                
                <List disablePadding>
                  {['Shoe stands', 'Water facility', 'Prasad distribution', 'Rest areas', 'Security services', 'Clean washrooms', 'Wheelchair accessibility'].map((facility, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle sx={{ color: '#f56565', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={facility} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500 }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              {/* Nearby Attractions Box */}
              <Paper sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Nearby Attractions
                </Typography>
                
                <List disablePadding>
                  {(attraction.nearbyAttractions && attraction.nearbyAttractions.length > 0 ? 
                    attraction.nearbyAttractions.map(nearby => nearby.name) : 
                    ['Lingaraj Temple', 'Bindusagar Lake', 'Rajarani Temple', 'Mukteshwar Temple', 'Parasurameswara Temple']).map((place, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 36, alignSelf: 'flex-start', mt: 0.5 }}>
                        <LocationOn sx={{ color: '#f56565', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={place} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500 }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              {/* Similar Attractions would go here */}
              {attraction.layout && attraction.layout.length > 0 && (
                <Paper sx={{ p: 3, mt: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Similar Attractions
                  </Typography>
                  
                  {/* Example of a similar attraction card */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Lingaraj Temple</Typography>
                    <Rating value={5} readOnly size="small" sx={{ color: '#ffb400', mb: 1 }} />
                    <Box 
                      component="img"
                      src="https://example.com/temple-image.jpg" 
                      alt="Lingaraj Temple"
                      sx={{ 
                        width: '100%', 
                        height: 150, 
                        objectFit: 'cover',
                        borderRadius: 1,
                        mt: 1
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>Konark Sun Temple</Typography>
                    <Rating value={5} readOnly size="small" sx={{ color: '#ffb400', mb: 1 }} />
                    <Box 
                      component="img"
                      src="https://example.com/konark-image.jpg" 
                      alt="Konark Sun Temple"
                      sx={{ 
                        width: '100%', 
                        height: 150, 
                        objectFit: 'cover',
                        borderRadius: 1,
                        mt: 1
                      }}
                    />
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Fallback return if no attraction data
  return null;
};

export default DynamicDestinationPage; 