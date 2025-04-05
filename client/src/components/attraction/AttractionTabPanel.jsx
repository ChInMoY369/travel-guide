import React from 'react';
import { 
  Box, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid
} from '@mui/material';

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

function AttractionTabPanel({ attraction }) {
  if (!attraction) return null;

  // Debug logging
  console.log('AttractionTabPanel - attraction object:', attraction);
  console.log('AttractionTabPanel - description:', attraction.description, 'type:', typeof attraction.description, 'empty?:', !attraction.description || attraction.description.trim() === '');
  console.log('AttractionTabPanel - overview:', attraction.overview, 'type:', typeof attraction.overview, 'empty?:', !attraction.overview || attraction.overview.trim() === '');

  // Convert null/undefined/empty to empty string for consistent handling
  const description = attraction.description || '';
  const overview = attraction.overview || '';
  
  // Check if there's actual content
  const hasDescription = description.trim() !== '';
  const hasOverview = overview.trim() !== '';

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* About Section with Overview content */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
        About
      </Typography>
      {hasOverview ? (
        <Typography variant="body2" paragraph sx={{ mb: 2 }}>
          {sanitizeContent(overview)}
        </Typography>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }} variant="outlined" size="small">
          Overview currently unavailable.
        </Alert>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Key Significance Section */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
        Key Significance
      </Typography>
      {attraction.keySignificance && attraction.keySignificance.length > 0 ? (
        <List dense disablePadding>
          {attraction.keySignificance.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary={sanitizeContent(item)} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No key significance information available
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Main Attractions Section */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
        Main Attractions
      </Typography>
      {attraction.mainAttractions && attraction.mainAttractions.length > 0 ? (
        <List dense disablePadding>
          {attraction.mainAttractions.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary={sanitizeContent(item)} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No main attractions information available
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* What It's Famous For Section */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
        What It's Famous For
      </Typography>
      {attraction.famousFor && attraction.famousFor.length > 0 ? (
        <List dense disablePadding>
          {attraction.famousFor.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary={sanitizeContent(item)} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No 'famous for' information available
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Educational Value Section */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
        Educational Value
      </Typography>
      {attraction.educationalValue && attraction.educationalValue.length > 0 ? (
        <List dense disablePadding>
          {attraction.educationalValue.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary={sanitizeContent(item)} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No educational value information available
        </Typography>
      )}
    </Box>
  );
}

export default AttractionTabPanel; 