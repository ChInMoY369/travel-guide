import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import axios from 'axios';
import api from '../../utils/api';

const DestinationsForm = ({ attractions, darkMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [selectedSection, setSelectedSection] = useState('famous-locations');
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [sectionDestinations, setSectionDestinations] = useState({
    'famous-locations': [],
    'pristine-beaches': []
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh section destinations
  const refreshDestinations = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  // Fetch existing section destinations
  useEffect(() => {
    const fetchSectionDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/sections');
        
        if (response.data) {
          console.log('DestinationsForm - Fetched section destinations:', JSON.stringify(response.data, null, 2));
          console.log('DestinationsForm - Famous Locations IDs:', response.data.famousLocations?.map(loc => loc._id) || []);
          console.log('DestinationsForm - Pristine Beaches IDs:', response.data.pristineBeaches?.map(beach => beach._id) || []);
          
          setSectionDestinations({
            'famous-locations': response.data.famousLocations || [],
            'pristine-beaches': response.data.pristineBeaches || []
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching section destinations:', err);
        setError('Failed to load section destinations');
        setLoading(false);
      }
    };

    fetchSectionDestinations();
  }, [refreshKey]);

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setSelectedAttractions([]);
  };

  const handleAttractionSelect = (event) => {
    setSelectedAttractions(event.target.value);
  };

  const handleAddDestinations = async () => {
    if (!selectedAttractions.length) {
      setError('Please select at least one attraction');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get selected attraction details
      const attractionsToAdd = attractions.filter(attr => 
        selectedAttractions.includes(attr._id)
      );
      
      // Add to corresponding section
      const section = selectedSection === 'famous-locations' ? 'famousLocations' : 'pristineBeaches';
      
      const response = await api.post('/sections/update', {
        section,
        destinations: attractionsToAdd
      });
      
      if (response.data) {
        // Refresh the destinations data from server
        refreshDestinations();
        
        setSuccess(`Successfully added destinations to ${selectedSection === 'famous-locations' ? 'Famous Locations' : 'Pristine Beaches'}`);
        setTimeout(() => setSuccess(null), 3000);
        
        // Reset selection
        setSelectedAttractions([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error adding destinations:', err);
      setError('Failed to add destinations: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleRemoveDestination = async (attractionId) => {
    try {
      setLoading(true);
      
      const section = selectedSection === 'famous-locations' ? 'famousLocations' : 'pristineBeaches';
      
      const response = await api.post('/sections/remove', {
        section,
        destinationId: attractionId
      });
      
      if (response.data) {
        // Refresh the destinations data from server instead of manually updating state
        refreshDestinations();
        
        setSuccess('Destination removed successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error removing destination:', err);
      setError('Failed to remove destination: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Filter out attractions that are already in the selected section
  const availableAttractions = attractions.filter(attr => 
    !sectionDestinations[selectedSection].some(dest => dest._id === attr._id)
  );

  return (
    <Box sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1f1f2c' : 'white' }}>
        <Typography variant="h6" gutterBottom>
          Add Destinations to Sections
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                id="section"
                value={selectedSection}
                onChange={handleSectionChange}
                label="Section"
                disabled={loading}
              >
                <MenuItem value="famous-locations">Famous Locations</MenuItem>
                <MenuItem value="pristine-beaches">Pristine Beaches</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="attractions-label">Select Attractions</InputLabel>
              <Select
                labelId="attractions-label"
                id="attractions"
                multiple
                value={selectedAttractions}
                onChange={handleAttractionSelect}
                label="Select Attractions"
                disabled={loading || availableAttractions.length === 0}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const attraction = attractions.find(attr => attr._id === value);
                      return (
                        <Chip key={value} label={attraction?.name || value} />
                      );
                    })}
                  </Box>
                )}
              >
                {availableAttractions.map((attraction) => (
                  <MenuItem key={attraction._id} value={attraction._id}>
                    {attraction.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDestinations}
              disabled={loading || selectedAttractions.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              Add to {selectedSection === 'famous-locations' ? 'Famous Locations' : 'Pristine Beaches'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Current {selectedSection === 'famous-locations' ? 'Famous Locations' : 'Pristine Beaches'} Destinations
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {loading && !sectionDestinations[selectedSection].length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : sectionDestinations[selectedSection].length === 0 ? (
        <Alert severity="info">
          No destinations found in {selectedSection === 'famous-locations' ? 'Famous Locations' : 'Pristine Beaches'} section
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sectionDestinations[selectedSection].map((destination) => (
                <TableRow key={destination._id}>
                  <TableCell>{destination.name}</TableCell>
                  <TableCell>{destination.type}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveDestination(destination._id)}
                      disabled={loading}
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
    </Box>
  );
};

export default DestinationsForm; 