import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Chip, OutlinedInput, Divider, Alert, 
  CircularProgress, IconButton, Tabs, Tab,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save as SaveIcon,
  Add as PlusIcon, 
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import api from '../utils/api';
import AdminTabPanel from './AdminTabPanel';
import LayoutDesigner from '../components/admin/LayoutDesigner';

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

const AdminEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'temple',
    overview: '',
    location: {
      address: '',
      coordinates: {
        latitude: '',
        longitude: ''
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
    tags: [],
    visitorTips: [{ title: '', content: '', category: 'general' }],
    nearbyRestaurants: [],
    nearbyHotels: [],
    nearbyAttractions: [],
    layout: [],
    templateType: 'standard'
  });

  // Add a new state for layout configuration
  const [pageLayout, setPageLayout] = useState([]);

  // State for structured content
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

  const [tabValue, setTabValue] = useState(0);

  // Function to prevent automatic Markdown formatting
  const preventMarkdownFormatting = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Replace common Markdown patterns that might be auto-added
    return text
      .replace(/(\n|^)#+\s/g, '$1') // Remove heading markers
      .replace(/(\s|^)\*\*(.+?)\*\*(\s|$)/g, '$1$2$3') // Remove bold markers
      .replace(/(\s|^)_(.+?)_(\s|$)/g, '$1$2$3') // Remove italic markers
      .replace(/(\s|^)~~(.+?)~~(\s|$)/g, '$1$2$3') // Remove strikethrough
      .replace(/(\s|^)`(.+?)`(\s|$)/g, '$1$2$3'); // Remove inline code
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

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // During testing phase, allow anyone to access the admin page
        setIsAdmin(true);
        return;

        // Original code (commented out during testing)
        /*
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          setError('You must be logged in as an admin to access this page');
          return;
        }

        const response = await axios.get('/api/users/check-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsAdmin(response.data.isAdmin);
        if (!response.data.isAdmin) {
          setError('You do not have admin permissions to access this page');
        }
        */
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status. Please log in again.');
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  // Fetch attraction data
  useEffect(() => {
    const fetchAttractionData = async () => {
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
        const response = await api.get(`/attractions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const attraction = response.data;
        
        // Format the data for the form
        setFormData({
          name: attraction.name || '',
          type: attraction.type || 'temple',
          overview: attraction.overview || '',
          location: {
            address: attraction.location?.address || '',
            coordinates: {
              latitude: attraction.location?.coordinates?.latitude || '',
              longitude: attraction.location?.coordinates?.longitude || ''
            }
          },
          images: attraction.images?.length ? attraction.images : [''],
          culturalSignificance: attraction.culturalSignificance || '',
          bestTimeToVisit: attraction.bestTimeToVisit || '',
          entryFee: {
            amount: attraction.entryFee?.amount || 0,
            currency: attraction.entryFee?.currency || 'INR'
          },
          openingHours: {
            monday: { 
              open: attraction.openingHours?.monday?.open || '09:00', 
              close: attraction.openingHours?.monday?.close || '18:00' 
            },
            tuesday: { 
              open: attraction.openingHours?.tuesday?.open || '09:00', 
              close: attraction.openingHours?.tuesday?.close || '18:00' 
            },
            wednesday: { 
              open: attraction.openingHours?.wednesday?.open || '09:00', 
              close: attraction.openingHours?.wednesday?.close || '18:00' 
            },
            thursday: { 
              open: attraction.openingHours?.thursday?.open || '09:00', 
              close: attraction.openingHours?.thursday?.close || '18:00' 
            },
            friday: { 
              open: attraction.openingHours?.friday?.open || '09:00', 
              close: attraction.openingHours?.friday?.close || '18:00' 
            },
            saturday: { 
              open: attraction.openingHours?.saturday?.open || '09:00', 
              close: attraction.openingHours?.saturday?.close || '18:00' 
            },
            sunday: { 
              open: attraction.openingHours?.sunday?.open || '09:00', 
              close: attraction.openingHours?.sunday?.close || '18:00' 
            }
          },
          tags: attraction.tags || [],
          visitorTips: attraction.visitorTips || [{ title: '', content: '', category: 'general' }],
          nearbyRestaurants: attraction.nearbyRestaurants || [],
          nearbyHotels: attraction.nearbyHotels || [],
          nearbyAttractions: attraction.nearbyAttractions || [],
          layout: attraction.layout || [],
          templateType: attraction.templateType || 'standard'
        });
        
        // Set the layout for the designer
        setPageLayout(attraction.layout || []);
        
        // Initialize structured content from attraction data
        setKeySignificance(attraction.keySignificance || []);
        setMainAttractions(attraction.mainAttractions || []);
        setFamousFor(attraction.famousFor || []);
        setEducationalValue(attraction.educationalValue || []);
        setFacilities(attraction.facilities || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attraction:', err);
        setError('Failed to load attraction data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    if (isAdmin && id) {
      fetchAttractionData();
    }
  }, [isAdmin, id]);

  // Fetch related data
  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch all hotels
        try {
          const hotelsResponse = await api.get('/hotels', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setHotels(hotelsResponse.data);
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
          setRestaurants(restaurantsResponse.data);
        } catch (err) {
          console.error('Error fetching restaurants:', err);
          // Use mock data if API fails
          setRestaurants([
            { _id: 'rest1', name: 'Spice Garden' },
            { _id: 'rest2', name: 'City Bistro' },
            { _id: 'rest3', name: 'Ocean View' }
          ]);
        }
        
        // Fetch all attractions (except current one)
        try {
          const attractionsResponse = await api.get('/attractions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Filter out the current attraction
          const filteredAttractions = attractionsResponse.data.attractions.filter(
            attraction => attraction._id !== id
          );
          setAttractions(filteredAttractions);
        } catch (err) {
          console.error('Error fetching attractions:', err);
          // Use mock data if API fails
          setAttractions([
            { _id: 'attr1', name: 'City Museum' },
            { _id: 'attr2', name: 'Botanical Garden' },
            { _id: 'attr3', name: 'Ancient Temple' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching related data:', err);
      }
    };

    if (isAdmin) {
      fetchRelatedData();
    }
  }, [isAdmin, id]);

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
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [name]: value
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Functions to add/remove items for each structured content type
  const handleAddKeySignificance = () => {
    if (newKeySignificance.trim()) {
      setKeySignificance([...keySignificance, newKeySignificance.trim()]);
      setNewKeySignificance('');
    }
  };
  
  const handleRemoveKeySignificance = (index) => {
    setKeySignificance(keySignificance.filter((_, i) => i !== index));
  };
  
  const addMainAttraction = () => {
    if (newMainAttraction.trim()) {
      setMainAttractions([...mainAttractions, newMainAttraction.trim()]);
      setNewMainAttraction('');
    }
  };
  
  const removeMainAttraction = (index) => {
    setMainAttractions(mainAttractions.filter((_, i) => i !== index));
  };
  
  const addFamousFor = () => {
    if (newFamousFor.trim()) {
      setFamousFor([...famousFor, newFamousFor.trim()]);
      setNewFamousFor('');
    }
  };
  
  const removeFamousFor = (index) => {
    setFamousFor(famousFor.filter((_, i) => i !== index));
  };
  
  const addEducationalValue = () => {
    if (newEducationalValue.trim()) {
      setEducationalValue([...educationalValue, newEducationalValue.trim()]);
      setNewEducationalValue('');
    }
  };
  
  const removeEducationalValue = (index) => {
    setEducationalValue(educationalValue.filter((_, i) => i !== index));
  };
  
  const addFacility = () => {
    if (newFacility.trim()) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };
  
  const removeFacility = (index) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Include structured content in the form data
      const cleanedFormData = {
        ...formData,
        keySignificance,
        mainAttractions,
        famousFor,
        educationalValue,
        facilities,
        name: preventMarkdownFormatting(formData.name),
        culturalSignificance: preventMarkdownFormatting(formData.culturalSignificance),
        bestTimeToVisit: preventMarkdownFormatting(formData.bestTimeToVisit),
        overview: preventMarkdownFormatting(formData.overview),
        location: {
          ...formData.location,
          address: preventMarkdownFormatting(formData.location.address)
        },
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.map(tag => preventMarkdownFormatting(tag)),
        entryFee: {
          ...formData.entryFee,
          amount: Number(formData.entryFee.amount),
          currency: formData.entryFee.currency
        },
        openingHours: {
          ...formData.openingHours,
          monday: {
            ...formData.openingHours.monday,
            open: preventMarkdownFormatting(formData.openingHours.monday.open),
            close: preventMarkdownFormatting(formData.openingHours.monday.close)
          },
          tuesday: {
            ...formData.openingHours.tuesday,
            open: preventMarkdownFormatting(formData.openingHours.tuesday.open),
            close: preventMarkdownFormatting(formData.openingHours.tuesday.close)
          },
          wednesday: {
            ...formData.openingHours.wednesday,
            open: preventMarkdownFormatting(formData.openingHours.wednesday.open),
            close: preventMarkdownFormatting(formData.openingHours.wednesday.close)
          },
          thursday: {
            ...formData.openingHours.thursday,
            open: preventMarkdownFormatting(formData.openingHours.thursday.open),
            close: preventMarkdownFormatting(formData.openingHours.thursday.close)
          },
          friday: {
            ...formData.openingHours.friday,
            open: preventMarkdownFormatting(formData.openingHours.friday.open),
            close: preventMarkdownFormatting(formData.openingHours.friday.close)
          },
          saturday: {
            ...formData.openingHours.saturday,
            open: preventMarkdownFormatting(formData.openingHours.saturday.open),
            close: preventMarkdownFormatting(formData.openingHours.saturday.close)
          },
          sunday: {
            ...formData.openingHours.sunday,
            open: preventMarkdownFormatting(formData.openingHours.sunday.open),
            close: preventMarkdownFormatting(formData.openingHours.sunday.close)
          }
        },
        visitorTips: formData.visitorTips.map(tip => ({
          ...tip,
          title: preventMarkdownFormatting(tip.title),
          content: preventMarkdownFormatting(tip.content)
        })),
        nearbyRestaurants: formData.nearbyRestaurants.map(restaurant => preventMarkdownFormatting(restaurant)),
        nearbyHotels: formData.nearbyHotels.map(hotel => preventMarkdownFormatting(hotel)),
        nearbyAttractions: formData.nearbyAttractions.map(attraction => preventMarkdownFormatting(attraction)),
        layout: formData.layout.map(section => preventMarkdownFormatting(section)),
        templateType: preventMarkdownFormatting(formData.templateType)
      };
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Make API request to update the attraction
      await api.put(`/attractions/${id}`, cleanedFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Attraction updated successfully!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating attraction:', err);
      setError(err.response?.data?.message || 'Failed to update attraction');
      setLoading(false);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Add a handler for saving the page layout
  const handleSaveLayout = (newLayout, templateType) => {
    console.log('Saving layout:', newLayout, 'with template type:', templateType);
    setFormData(prev => ({
      ...prev,
      layout: newLayout,
      templateType: templateType
    }));
    setPageLayout(newLayout);
    setSuccess('Layout saved successfully! Don\'t forget to submit the form to save all changes.');
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

  if (loading) {
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
        <Typography variant="h6">Loading attraction data...</Typography>
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: darkMode ? '#232333' : '#f5f5f5',
      color: darkMode ? '#e0e0e0' : 'inherit',
      pt: 4, 
      pb: 8 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin')}
            sx={{ mr: 2 }}
          >
            Back to Admin
          </Button>
          <Typography variant="h4" component="h1">
            Edit Attraction: {formData.name}
          </Typography>
        </Box>

        {/* Success or Error messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: darkMode ? '#1f1f2c' : 'white',
            borderRadius: 2
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Attraction Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
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
                    <MenuItem value="beach">Beach</MenuItem>
                    <MenuItem value="park">Park</MenuItem>
                    <MenuItem value="museum">Museum</MenuItem>
                    <MenuItem value="sanctuary">Wildlife Sanctuary</MenuItem>
                    <MenuItem value="lake">Lake</MenuItem>
                    <MenuItem value="garden">Garden</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Tags */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    multiple
                    value={formData.tags}
                    onChange={handleTagsChange}
                    input={<OutlinedInput id="select-tags" label="Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {tagOptions.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Location */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Location
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        address: e.target.value
                      }
                    }));
                  }}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="latitude"
                  label="Latitude"
                  name="latitude"
                  type="number"
                  inputProps={{ step: "0.0001" }}
                  value={formData.location.coordinates.latitude}
                  onChange={handleCoordinatesChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="longitude"
                  label="Longitude"
                  name="longitude"
                  type="number"
                  inputProps={{ step: "0.0001" }}
                  value={formData.location.coordinates.longitude}
                  onChange={handleCoordinatesChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* Images */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Images (URLs)
                </Typography>
                
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Image URL ${index + 1}`}
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      variant="outlined"
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
              <Grid item xs={12} md={6}>
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
              
              <Grid item xs={12} md={6}>
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
              
              {/* Opening Hours */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Opening Hours
                </Typography>
                
                <Grid container spacing={2}>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', mb: 1 }}>
                          {day}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Open"
                              type="time"
                              value={formData.openingHours[day].open}
                              onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ step: 300 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Close"
                              type="time"
                              value={formData.openingHours[day].close}
                              onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ step: 300 }}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              {/* Additional Tabs for managing related data */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                  Additional Information and Related Places
                </Typography>
                <AdminTabPanel 
                  formData={formData} 
                  setFormData={setFormData} 
                  hotels={hotels}
                  restaurants={restaurants}
                  attractions={attractions}
                />
              </Grid>
              
              {/* Page Layout Design */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
                  Page Layout Design
                </Typography>
                <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
                  <LayoutDesigner 
                    initialLayout={pageLayout}
                    onSave={handleSaveLayout}
                    attractionData={formData}
                    initialTemplateType={formData.templateType}
                  />
                </Paper>
              </Grid>
              
              {/* Structured Content */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Structured Content
                </Typography>
                
                {/* Only keep Key Significance section */}
                <Box sx={{ p: 3, mt: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Structured Content
                  </Typography>
                  
                  {/* Only keep Key Significance section */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Key Significance
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add important points highlighting the key significance of this attraction
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Add Key Significance Point"
                            value={newKeySignificance}
                            onChange={(e) => setNewKeySignificance(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newKeySignificance.trim()) {
                                handleAddKeySignificance();
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={handleAddKeySignificance} 
                            disabled={!newKeySignificance.trim()}
                            startIcon={<AddIcon />}
                          >
                            Add Point
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <List>
                      {keySignificance.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveKeySignificance(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    {keySignificance.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        No key significance points added yet
                      </Typography>
                    )}
                  </Box>

                  {/* Main Attraction */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Main Attraction
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add the main attractions of this place
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Add Main Attraction"
                            value={newMainAttraction}
                            onChange={(e) => setNewMainAttraction(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newMainAttraction.trim()) {
                                addMainAttraction();
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={addMainAttraction} 
                            disabled={!newMainAttraction.trim()}
                            startIcon={<AddIcon />}
                          >
                            Add Attraction
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <List>
                      {mainAttractions.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => removeMainAttraction(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    {mainAttractions.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        No main attractions added yet
                      </Typography>
                    )}
                  </Box>

                  {/* Famous For */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Famous For
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add what this place is famous for
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Add Famous Feature"
                            value={newFamousFor}
                            onChange={(e) => setNewFamousFor(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newFamousFor.trim()) {
                                addFamousFor();
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={addFamousFor} 
                            disabled={!newFamousFor.trim()}
                            startIcon={<AddIcon />}
                          >
                            Add Feature
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <List>
                      {famousFor.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => removeFamousFor(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    {famousFor.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        No famous features added yet
                      </Typography>
                    )}
                  </Box>

                  {/* Educational Value */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Educational Value
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add educational values visitors can learn from this place
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Add Educational Value"
                            value={newEducationalValue}
                            onChange={(e) => setNewEducationalValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newEducationalValue.trim()) {
                                addEducationalValue();
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={addEducationalValue} 
                            disabled={!newEducationalValue.trim()}
                            startIcon={<AddIcon />}
                          >
                            Add Value
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <List>
                      {educationalValue.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => removeEducationalValue(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    {educationalValue.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        No educational values added yet
                      </Typography>
                    )}
                  </Box>

                  {/* Facilities */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Facilities
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add available facilities at this location
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Add Facility"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newFacility.trim()) {
                                addFacility();
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={addFacility} 
                            disabled={!newFacility.trim()}
                            startIcon={<AddIcon />}
                          >
                            Add Facility
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <List>
                      {facilities.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => removeFacility(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    {facilities.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        No facilities added yet
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
              
              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontSize: '1rem'
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminEditPage; 