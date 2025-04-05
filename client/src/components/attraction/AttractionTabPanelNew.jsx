import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Rating, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  InfoOutlined, 
  Hotel, 
  Restaurant, 
  Place, 
  Lightbulb,
  LocalOffer,
  AttachMoney,
  Star
} from '@mui/icons-material';

const defaultImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

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

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attraction-tabpanel-${index}`}
      aria-labelledby={`attraction-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to render price range
const renderPriceRange = (priceRange) => {
  const priceRangeMap = {
    'budget': { icon: 1, label: 'Budget' },
    'economy': { icon: 1, label: 'Economy' },
    'moderate': { icon: 2, label: 'Moderate' },
    'mid-range': { icon: 2, label: 'Mid-Range' },
    'expensive': { icon: 3, label: 'Expensive' },
    'luxury': { icon: 4, label: 'Luxury' },
    'ultra-luxury': { icon: 5, label: 'Ultra Luxury' }
  };

  const range = priceRangeMap[priceRange] || { icon: 1, label: 'Unknown' };

  return (
    <Box display="flex" alignItems="center">
      {[...Array(range.icon)].map((_, i) => (
        <AttachMoney key={i} fontSize="small" color="primary" />
      ))}
      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
        {range.label}
      </Typography>
    </Box>
  );
};

function AttractionTabPanelNew({ attraction, showShortDescription = true }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!attraction) return null;

  // Get a short description - either from aiDescription or truncate the regular description
  const shortDescription = attraction.aiDescription || 
    (attraction.description && attraction.description.length > 150 
      ? `${attraction.description.substring(0, 150)}...` 
      : attraction.description);

  return (
    <Paper elevation={0} sx={{ mt: 4, mb: 4 }}>
      {/* Short description above the tabs - only shown if showShortDescription is true */}
      {showShortDescription && shortDescription && (
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="body1" paragraph>
            {sanitizeContent(shortDescription)}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="attraction details tabs"
        >
          <Tab icon={<InfoOutlined />} label="Overview" />
          <Tab icon={<Hotel />} label="Nearby Hotels" />
          <Tab icon={<Restaurant />} label="Nearby Restaurants" />
          <Tab icon={<Place />} label="Nearby Attractions" />
          <Tab icon={<Lightbulb />} label="Visitor Tips" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* About Section */}
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>
              {sanitizeContent(attraction.overview || attraction.description)}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Key Significance Section */}
            <Typography variant="h6" gutterBottom>
              Key Significance
            </Typography>
            {attraction.keySignificance && attraction.keySignificance.length > 0 ? (
              <List>
                {attraction.keySignificance.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={sanitizeContent(item)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No key significance information available
              </Typography>
            )}
            
            {/* Rest of component remains the same */}
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Other tabs */}
    </Paper>
  );
}

export default AttractionTabPanelNew; 