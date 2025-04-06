import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Chip, OutlinedInput, Divider, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress,
  Snackbar, Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as PlusIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  BeachAccess as BeachIcon
} from '@mui/icons-material';
import api from '../utils/api';
import AdminTabPanel from './AdminTabPanel';
import CulturalInsightsForm from '../components/admin/CulturalInsightsForm';
import DestinationsForm from '../components/admin/DestinationsForm';

// Tab Panel component for structured content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`structured-tabpanel-${index}`}
      aria-labelledby={`structured-tab-${index}`}
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

const AdminPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [attractions, setAttractions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attractionToDelete, setAttractionToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for structured content tabs
  const [tabValue, setTabValue] = useState(0);
  const [keySignificance, setKeySignificance] = useState([]);
  const [newKeySignificance, setNewKeySignificance] = useState('');
  
  const [mainAttractions, setMainAttractions] = useState([]);
  const [newMainAttraction, setNewMainAttraction] = useState('');
  
  const [famousFor, setFamousFor] = useState([]);
  const [newFamousFor, setNewFamousFor] = useState('');
  
  const [educationalValue, setEducationalValue] = useState([]);
  const [newEducationalValue, setNewEducationalValue] = useState('');
  
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState('');

  // Add a new state for admin main tabs
  const [adminTabValue, setAdminTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    overview: '',
    location: {
      address: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    images: [''],
    culturalSignificance: '',
    bestTimeToVisit: '',
    entryFee: {
      amount: 0,
      currency: 'INR'
    },
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00' }
    },
    tags: []
  });

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

  // Function to prevent automatic Markdown formatting
  const preventMarkdownFormatting = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Replace common Markdown patterns that might be auto-added
    // This only removes if they appear at the beginning of a line or surrounded by spaces
    return text
      .replace(/(\n|^)#+\s/g, '$1') // Remove heading markers
      .replace(/(\s|^)\*\*(.+?)\*\*(\s|$)/g, '$1$2$3') // Remove bold markers
      .replace(/(\s|^)_(.+?)_(\s|$)/g, '$1$2$3') // Remove italic markers
      .replace(/(\s|^)~~(.+?)~~(\s|$)/g, '$1$2$3') // Remove strikethrough
      .replace(/(\s|^)`(.+?)`(\s|$)/g, '$1$2$3'); // Remove inline code
  };

  // Check if user is admin
  useEffect(() => {
    // Log all available routes for debugging
    console.log('AdminPage - Available routes check:');
    console.log('  - /attraction/:id - For direct attraction links');
    console.log('  - /destination/:id - For dynamic destination pages');
    console.log('  - /destination-page/:slug - For slug-based destination pages');
    
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          setError('You must be logged in as an admin to access this page');
          setLoading(false);
          return;
        }

        const response = await api.get('/users/check-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsAdmin(response.data.isAdmin);
        if (!response.data.isAdmin) {
          setError('You do not have admin permissions to access this page');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status. Please log in again.');
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Fetch attractions function
  const fetchAttractions = async () => {
    try {
      setLoading(true);
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Make API request
      const response = await api.get('/attractions', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 } // Increase the limit to fetch more attractions
      });
      
      setAttractions(response.data.attractions || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attractions:', err);
      setError('Failed to load attractions: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Fetch attractions on load
  useEffect(() => {
    if (isAdmin) {
      fetchAttractions();
    }
  }, [isAdmin]);

  // Fetch related data (hotels, restaurants, attractions)
  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch all hotels
        try {
          const hotelsResponse = await api.get('/hotels', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setHotels(hotelsResponse.data || []);
        } catch (err) {
          console.error('Error fetching hotels:', err);
          // Use mock data if API fails
          setHotels([
            { _id: 'hotel1', name: 'Grand Hyatt' },
            { _id: 'hotel2', name: 'Marriott' },
            { _id: 'hotel3', name: 'Taj Palace' }
          ]);
        }
        
        // Fetch all restaurants
        try {
          const restaurantsResponse = await api.get('/restaurants', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRestaurants(restaurantsResponse.data || []);
        } catch (err) {
          console.error('Error fetching restaurants:', err);
          // Use mock data if API fails
          setRestaurants([
            { _id: 'rest1', name: 'Spice Garden' },
            { _id: 'rest2', name: 'City Bistro' },
            { _id: 'rest3', name: 'Ocean View' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching related data:', err);
      }
    };

    if (isAdmin) {
      fetchRelatedData();
    }
  }, [isAdmin]);

  // Update filtered attractions when main attraction list changes
  useEffect(() => {
    // Filter out the current attraction (when editing)
    if (formData._id) {
      setFilteredAttractions(attractions.filter(a => a._id !== formData._id));
    } else {
      setFilteredAttractions(attractions);
    }
  }, [attractions, formData._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clean the value to prevent Markdown formatting
    const cleanedValue = preventMarkdownFormatting(value);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: cleanedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    }
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    // Sanitize number input - only allow numbers and decimal point
    let sanitizedValue = value;
    if (value !== '') {
      sanitizedValue = value.replace(/[^\d.-]/g, '');
      // For coordinates, limit to 6 decimal places
      const parsed = parseFloat(sanitizedValue);
      if (!isNaN(parsed)) {
        sanitizedValue = parsed;
      } else {
        sanitizedValue = 0;
      }
    } else {
      sanitizedValue = 0;
    }
    
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [name]: sanitizedValue
        }
      }
    }));
  };

  const handleEntryFeeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      entryFee: {
        ...prev.entryFee,
        [name]: name === 'amount' ? Number(value) : value
      }
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleTagsChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      tags: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages.length ? newImages : ['']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log('Submitting attraction form data...');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Enhanced validation for required fields
      const requiredFields = ['name', 'type', 'overview'];
      const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());
      
      if (missingFields.length > 0) {
        setError(`The following required fields are missing: ${missingFields.join(', ')}`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Check if attraction name already exists
      const nameExists = attractions.some(
        attraction => attraction.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      
      if (nameExists) {
        setError(`An attraction with the name "${formData.name}" already exists. Please use a different name.`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Type validation - must be one of the allowed types
      const validTypes = ['temple', 'museum', 'park', 'monument', 'lake', 'market', 'other'];
      if (!validTypes.includes(formData.type)) {
        setError(`Invalid attraction type: ${formData.type}. Must be one of: ${validTypes.join(', ')}`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      if (filteredImages.length === 0) {
        setError('At least one valid image URL is required');
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Location validation
      if (!formData.location || !formData.location.address || !formData.location.address.trim()) {
        setError('Location address is required');
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Coordinate validation
      if (isNaN(formData.location.coordinates.latitude)) {
        setError('Latitude must be a valid number');
        setTimeout(() => setError(null), 5000);
        return;
      }

      if (isNaN(formData.location.coordinates.longitude)) {
        setError('Longitude must be a valid number');
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Entry fee validation
      const entryFee = {
        amount: Number(formData.entryFee.amount) || 0,
        currency: formData.entryFee.currency || 'INR'
      };

      // Prepare the data with proper type conversions
      const attractionData = {
        name: formData.name.trim(),
        type: formData.type,
        overview: formData.overview.trim(),
        location: {
          address: formData.location.address ? formData.location.address.trim() : '',
          coordinates: {
            latitude: parseFloat(Number(formData.location.coordinates.latitude).toFixed(6)),
            longitude: parseFloat(Number(formData.location.coordinates.longitude).toFixed(6))
          }
        },
        entryFee,
        images: filteredImages,
        keySignificance: keySignificance.filter(item => item && item.trim() !== ''),
        mainAttractions: mainAttractions.filter(item => item && item.trim() !== ''),
        famousFor: famousFor.filter(item => item && item.trim() !== ''),
        educationalValue: educationalValue.filter(item => item && item.trim() !== ''),
        facilities: facilities.filter(item => item && item.trim() !== ''),
        virtualTour: { available: false },
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        culturalSignificance: formData.culturalSignificance || '',
        bestTimeToVisit: formData.bestTimeToVisit || '',
        // Ensure proper format for opening hours
        openingHours: {
          monday: { 
            open: formData.openingHours.monday.open || '09:00', 
            close: formData.openingHours.monday.close || '18:00' 
          },
          tuesday: { 
            open: formData.openingHours.tuesday.open || '09:00', 
            close: formData.openingHours.tuesday.close || '18:00' 
          },
          wednesday: { 
            open: formData.openingHours.wednesday.open || '09:00', 
            close: formData.openingHours.wednesday.close || '18:00' 
          },
          thursday: { 
            open: formData.openingHours.thursday.open || '09:00', 
            close: formData.openingHours.thursday.close || '18:00' 
          },
          friday: { 
            open: formData.openingHours.friday.open || '09:00', 
            close: formData.openingHours.friday.close || '18:00' 
          },
          saturday: { 
            open: formData.openingHours.saturday.open || '09:00', 
            close: formData.openingHours.saturday.close || '18:00' 
          },
          sunday: { 
            open: formData.openingHours.sunday.open || '09:00', 
            close: formData.openingHours.sunday.close || '18:00' 
          }
        }
      };

      // Log the final attraction data for debugging
      console.log('Validated attraction data ready for submission:', JSON.stringify(attractionData, null, 2));
      
      try {
        const response = await api.post('/attractions', attractionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Attraction added successfully:', response.data);
        
        // Reset form data
        setFormData({
          name: '',
          type: '',
          overview: '',
          location: {
            address: '',
            coordinates: {
              latitude: 0,
              longitude: 0
            }
          },
          images: [''],
          culturalSignificance: '',
          bestTimeToVisit: '',
          entryFee: {
            amount: 0,
            currency: 'INR'
          },
          openingHours: {
            monday: { open: '09:00', close: '18:00' },
            tuesday: { open: '09:00', close: '18:00' },
            wednesday: { open: '09:00', close: '18:00' },
            thursday: { open: '09:00', close: '18:00' },
            friday: { open: '09:00', close: '18:00' },
            saturday: { open: '09:00', close: '18:00' },
            sunday: { open: '09:00', close: '18:00' }
          },
          tags: []
        });
        
        // Reset structured content
        setKeySignificance([]);
        setMainAttractions([]);
        setFamousFor([]);
        setEducationalValue([]);
        setFacilities([]);
        
        setSuccess(`Attraction "${response.data.name}" added successfully!`);
        fetchAttractions(); // Refresh the list

        setTimeout(() => setSuccess(null), 5000);
      } catch (axiosError) {
        console.error('Axios error adding attraction:', axiosError);
        
        // Enhanced error logging
        if (axiosError.response) {
          console.error('Response status:', axiosError.response.status);
          console.error('Response data:', JSON.stringify(axiosError.response.data, null, 2));
          
          if (axiosError.response.data && axiosError.response.data.validationErrors) {
            console.error('Validation Errors:', axiosError.response.data.validationErrors);
          }
          
          if (axiosError.response.data && axiosError.response.data.details) {
            console.error('Error Details:', axiosError.response.data.details);
          }
        } else if (axiosError.request) {
          console.error('Request was made but no response received:', axiosError.request);
        } else {
          console.error('Error setting up request:', axiosError.message);
        }
        
        if (axiosError.response?.data?.validationErrors) {
          const validationErrors = axiosError.response.data.validationErrors;
          // Format validation errors for display
          const errorMessages = validationErrors.map(error => 
            `${error.field}: ${error.message}`
          ).join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          const errorMessage = axiosError.response?.data?.message || 
                              axiosError.response?.data?.details || 
                              axiosError.response?.data?.error || 
                              axiosError.message || 
                              'Failed to add attraction';
          setError(`Server error: ${errorMessage}`);
        }
        setTimeout(() => setError(null), 8000); // Longer timeout to read errors
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const openDeleteDialog = (attraction) => {
    setAttractionToDelete(attraction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAttraction = async () => {
    try {
      setLoading(true);
      console.log(`Attempting to delete attraction: ${attractionToDelete.name} (${attractionToDelete._id})`);
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      // Make API request
      const response = await api.delete(`/attractions/${attractionToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Delete response:', response.data);
      
      // Remove from list
      setAttractions(prev => prev.filter(a => a._id !== attractionToDelete._id));
      
      setSuccess(`Attraction "${attractionToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting attraction:', err);
      console.error('Error details:', err.response?.data || 'No response data');
      
      // Show a more descriptive error message
      const errorMessage = err.response?.data?.message || err.response?.data?.details || err.message || 'Server error occurred';
      setError(`Failed to delete attraction: ${errorMessage}`);
      
      setDeleteDialogOpen(false);
      setLoading(false);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleEditAttraction = (attraction) => {
    navigate(`/admin/edit/${attraction._id}`);
  };

  // Common tag options
  const tagOptions = [
    'Temple', 'Heritage', 'Architecture', 'UNESCO', 'History',
    'Beach', 'Pilgrimage', 'Sunrise', 'Sand Art', 'Seashore',
    'Hindu', 'Spiritual', 'Park', 'Garden', 'Zoo',
    'Wildlife', 'Conservation', 'Safari', 'Botanical Garden',
    'Museum', 'Art', 'Culture', 'Crafts', 'Traditional',
    'Lake', 'Nature', 'Waterfront', 'Scenic', 'Peaceful'
  ];

  // Handle tab changes for structured content
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Functions for Key Significance
  const handleAddKeySignificance = () => {
    if (newKeySignificance.trim()) {
      setKeySignificance([...keySignificance, newKeySignificance.trim()]);
      setNewKeySignificance('');
    }
  };

  const handleRemoveKeySignificance = (index) => {
    setKeySignificance(keySignificance.filter((_, i) => i !== index));
  };

  // Functions for Main Attractions
  const handleAddMainAttraction = () => {
    if (newMainAttraction.trim()) {
      setMainAttractions([...mainAttractions, newMainAttraction.trim()]);
      setNewMainAttraction('');
    }
  };

  const handleRemoveMainAttraction = (index) => {
    setMainAttractions(mainAttractions.filter((_, i) => i !== index));
  };

  // Functions for Famous For
  const handleAddFamousFor = () => {
    if (newFamousFor.trim()) {
      setFamousFor([...famousFor, newFamousFor.trim()]);
      setNewFamousFor('');
    }
  };

  const handleRemoveFamousFor = (index) => {
    setFamousFor(famousFor.filter((_, i) => i !== index));
  };

  // Functions for Educational Value
  const handleAddEducationalValue = () => {
    if (newEducationalValue.trim()) {
      setEducationalValue([...educationalValue, newEducationalValue.trim()]);
      setNewEducationalValue('');
    }
  };

  const handleRemoveEducationalValue = (index) => {
    setEducationalValue(educationalValue.filter((_, i) => i !== index));
  };

  // Functions for Facilities
  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (index) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  // Handler for changing admin main tab
  const handleAdminTabChange = (event, newValue) => {
    setAdminTabValue(newValue);
  };

  if (loading && !attractions.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2,
        bgcolor: darkMode ? '#232333' : '#f5f5f5',
        color: darkMode ? '#fff' : 'inherit',
        p: 4
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2,
        bgcolor: darkMode ? '#232333' : '#f5f5f5',
        color: darkMode ? '#fff' : 'inherit',
        p: 4
      }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {error || 'You must be an admin to access this page'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      py: 4, 
      minHeight: '80vh',
      bgcolor: darkMode ? '#121212' : '#f5f5f5',
      color: darkMode ? '#e0e0e0' : 'inherit'
    }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      {!isAdmin ? (
        <Alert severity="warning" sx={{ my: 3 }}>
          You need admin privileges to access this page.
        </Alert>
      ) : loading && !attractions.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ width: '100%', mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={adminTabValue} 
                onChange={handleAdminTabChange}
                aria-label="admin dashboard tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Attractions" />
                <Tab label="Section Destinations" icon={<LocationIcon />} iconPosition="start" />
                <Tab label="Cultural Insights" />
              </Tabs>
            </Box>
            
            {/* Attractions Tab */}
            <Box role="tabpanel" hidden={adminTabValue !== 0}>
              {adminTabValue === 0 && (
                <Box sx={{ p: { xs: 1, md: 3 } }}>
                  <Grid container spacing={3}>
                    {/* Left column: Add attraction form */}
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          bgcolor: darkMode ? '#1f1f2c' : 'white',
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="h5" gutterBottom>
                          Add New Attraction
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box component="form" onSubmit={handleSubmit}>
                          <Grid container spacing={2}>
                            {/* Basic Information */}
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Basic Information
                              </Typography>
                            </Grid>
                            
                            {/* Name Field */}
                            <Grid item xs={12} sm={8}>
                              <TextField
                                fullWidth
                                required
                                id="name"
                                label="Attraction Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                              />
                            </Grid>
                            
                            {/* Type Field */}
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth required>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                  labelId="type-label"
                                  id="type"
                                  name="type"
                                  value={formData.type}
                                  onChange={handleInputChange}
                                  label="Type"
                                >
                                  <MenuItem value="temple">Temple</MenuItem>
                                  <MenuItem value="museum">Museum</MenuItem>
                                  <MenuItem value="park">Park</MenuItem>
                                  <MenuItem value="monument">Monument</MenuItem>
                                  <MenuItem value="lake">Lake</MenuItem>
                                  <MenuItem value="beach">Beach</MenuItem>
                                  <MenuItem value="market">Market</MenuItem>
                                  <MenuItem value="other">Other</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            {/* Location */}
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Location Information
                              </Typography>
                              <TextField
                                fullWidth
                                required
                                id="address"
                                label="Address"
                                name="location.address"
                                value={formData.location.address}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                placeholder="e.g., 123 Main Street, Bhubaneswar, Odisha 751001"
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                id="latitude"
                                label="Latitude"
                                name="latitude"
                                type="number"
                                inputProps={{ step: "any" }}
                                value={formData.location.coordinates.latitude}
                                onChange={handleCoordinatesChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                placeholder="e.g., 20.2961"
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                id="longitude"
                                label="Longitude"
                                name="longitude"
                                type="number"
                                inputProps={{ step: "any" }}
                                value={formData.location.coordinates.longitude}
                                onChange={handleCoordinatesChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                placeholder="e.g., 85.8245"
                              />
                            </Grid>
                            
                            {/* Tags */}
                            <Grid item xs={12}>
                              <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="tags-label">Tags</InputLabel>
                                <Select
                                  labelId="tags-label"
                                  id="tags"
                                  multiple
                                  value={formData.tags}
                                  onChange={handleTagsChange}
                                  input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  <MenuItem value="Heritage">Heritage</MenuItem>
                                  <MenuItem value="Nature">Nature</MenuItem>
                                  <MenuItem value="Religious">Religious</MenuItem>
                                  <MenuItem value="Family">Family</MenuItem>
                                  <MenuItem value="Historical">Historical</MenuItem>
                                  <MenuItem value="Art">Art</MenuItem>
                                  <MenuItem value="Wildlife">Wildlife</MenuItem>
                                  <MenuItem value="Market">Market</MenuItem>
                                  <MenuItem value="Beach">Beach</MenuItem>
                                  <MenuItem value="Waterfront">Waterfront</MenuItem>
                                  <MenuItem value="Adventure">Adventure</MenuItem>
                                  <MenuItem value="Photography">Photography</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            {/* Images */}
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Images
                              </Typography>
                              {formData.images.map((image, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <TextField
                                    fullWidth
                                    id={`image-${index}`}
                                    label={`Image URL ${index + 1}`}
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    variant="outlined"
                                    error={!image.trim() && index === 0}
                                    helperText={!image.trim() && index === 0 ? "At least one valid image URL is required" : ""}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                  <IconButton 
                                    color="error" 
                                    onClick={() => removeImageField(index)}
                                    disabled={formData.images.length === 1}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Box>
                              ))}
                              
                              <Button
                                startIcon={<PlusIcon />}
                                onClick={addImageField}
                                sx={{ mt: 1 }}
                              >
                                Add Image
                              </Button>
                            </Grid>
                            
                            {/* Entry Fee */}
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                id="amount"
                                label="Entry Fee Amount"
                                name="amount"
                                type="number"
                                value={formData.entryFee.amount}
                                onChange={handleEntryFeeChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel id="currency-label">Currency</InputLabel>
                                <Select
                                  labelId="currency-label"
                                  id="currency"
                                  name="currency"
                                  value={formData.entryFee.currency}
                                  onChange={handleEntryFeeChange}
                                  label="Currency"
                                >
                                  <MenuItem value="INR">INR</MenuItem>
                                  <MenuItem value="USD">USD</MenuItem>
                                  <MenuItem value="EUR">EUR</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            {/* Best Time to Visit */}
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                id="bestTimeToVisit"
                                label="Best Time to Visit"
                                name="bestTimeToVisit"
                                value={formData.bestTimeToVisit}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                              />
                            </Grid>
                            
                            {/* Cultural Significance */}
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                id="culturalSignificance"
                                label="Cultural Significance"
                                name="culturalSignificance"
                                value={formData.culturalSignificance}
                                onChange={handleInputChange}
                                variant="outlined"
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                              />
                            </Grid>
                            
                            {/* Additional Information and Related Places */}
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                                Additional Information and Related Places
                              </Typography>
                              <AdminTabPanel 
                                formData={formData} 
                                setFormData={setFormData} 
                                hotels={hotels}
                                restaurants={restaurants}
                                attractions={filteredAttractions}
                              />
                            </Grid>
                            
                            {/* Submit Button */}
                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<SaveIcon />}
                                disabled={loading}
                                sx={{ 
                                  py: 1.5, 
                                  mt: 2,
                                  fontSize: '1rem'
                                }}
                              >
                                {loading ? <CircularProgress size={24} /> : 'Add Attraction'}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    {/* Right column: List of attractions */}
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          bgcolor: darkMode ? '#1f1f2c' : 'white',
                          borderRadius: 2,
                          height: '100%'
                        }}
                      >
                        <Typography variant="h5" gutterBottom>
                          Existing Attractions
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        {loading && !attractions.length ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                          </Box>
                        ) : attractions.length === 0 ? (
                          <Alert severity="info">No attractions found</Alert>
                        ) : (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {attractions.map((attraction) => (
                                  <TableRow key={attraction._id}>
                                    <TableCell>{attraction.name}</TableCell>
                                    <TableCell>{attraction.type}</TableCell>
                                    <TableCell>
                                      <IconButton 
                                        size="small" 
                                        color="primary"
                                        onClick={() => handleEditAttraction(attraction)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton 
                                        size="small" 
                                        color="error"
                                        onClick={() => openDeleteDialog(attraction)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
            
            {/* Section Destinations Tab */}
            <Box role="tabpanel" hidden={adminTabValue !== 1}>
              {adminTabValue === 1 && (
                <Box sx={{ p: { xs: 1, md: 3 } }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: darkMode ? '#1f1f2c' : 'white',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Manage Homepage Sections
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <DestinationsForm 
                      attractions={attractions} 
                      darkMode={darkMode} 
                    />
                  </Paper>
                </Box>
              )}
            </Box>
            
            {/* Cultural Insights Tab */}
            <Box role="tabpanel" hidden={adminTabValue !== 2}>
              {adminTabValue === 2 && (
                <Box sx={{ p: { xs: 1, md: 3 } }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: darkMode ? '#1f1f2c' : 'white',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Manage Cultural Insights
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <CulturalInsightsForm />
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
      
      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the attraction "{attractionToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAttraction} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage; 