import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getCulturalInsights, createCulturalInsight, updateCulturalInsight, deleteCulturalInsight } from '../../utils/api';

const CulturalInsightsForm = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageGallery: ['', '', ''],
    topic: '',
    tags: []
  });

  // Common tag options
  const tagOptions = [
    'Art', 'Craft', 'Dance', 'Music', 'Festival',
    'Cuisine', 'Architecture', 'Religion', 'Tradition',
    'Heritage', 'Culture', 'History', 'Custom',
    'Ritual', 'Performance', 'Textile', 'Handicraft'
  ];

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    if (!Array.isArray(formData.imageGallery) || formData.imageGallery.length !== 3) {
      setFormData(prev => ({
        ...prev,
        imageGallery: Array.isArray(prev.imageGallery) 
          ? [...prev.imageGallery, ...Array(3 - (prev.imageGallery?.length || 0)).fill('')].slice(0, 3)
          : ['', '', '']
      }));
    }
  }, [formData.imageGallery]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data } = await getCulturalInsights();
      setInsights(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cultural insights:', error);
      setError('Failed to load cultural insights');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryImageChange = (index, value) => {
    const newGallery = [...formData.imageGallery];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      imageGallery: newGallery
    }));
  };

  const handleTagsChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      tags: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Filter out empty image URLs from gallery
      const filteredGallery = formData.imageGallery.filter(url => url.trim() !== '');

      const dataToSubmit = {
        ...formData,
        imageGallery: filteredGallery
      };

      if (isEditing) {
        // Update existing insight
        await updateCulturalInsight(formData.topic, dataToSubmit);
        setSuccess('Cultural insight updated successfully');
      } else {
        // Create new insight
        await createCulturalInsight(dataToSubmit);
        setSuccess('Cultural insight created successfully');
      }

      // Reset form and refresh insights
      setFormData({
        title: '',
        description: '',
        image: '',
        imageGallery: ['', '', ''],
        topic: '',
        tags: []
      });
      setIsEditing(false);
      fetchInsights();
    } catch (error) {
      console.error('Error saving cultural insight:', error);
      setError('Failed to save cultural insight');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topic) => {
    if (!window.confirm('Are you sure you want to delete this cultural insight?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await deleteCulturalInsight(topic);
      setSuccess('Cultural insight deleted successfully');
      fetchInsights();
    } catch (error) {
      console.error('Error deleting cultural insight:', error);
      setError('Failed to delete cultural insight');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (insight) => {
    // Ensure the image gallery array is properly populated
    const imageGallery = insight.imageGallery || [];
    
    // Create a new array with 3 elements, filling in empty strings for missing gallery images
    const formattedGallery = [
      imageGallery[0] || '',
      imageGallery[1] || '',
      imageGallery[2] || ''
    ];
    
    // Set form data with all fields including the formatted gallery
    setFormData({
      ...insight,
      imageGallery: formattedGallery
    });
    
    setIsEditing(true);
  };

  if (loading && !insights.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Cultural Insight' : 'Add New Cultural Insight'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Main Image URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Gallery Images (Optional)
              </Typography>
              <Grid container spacing={2}>
                {formData.imageGallery.map((url, index) => (
                  <Grid item xs={12} md={4} key={`gallery-${index}`}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Gallery Image {index + 1}
                      </Typography>
                      {url && (
                        <Box sx={{ 
                          width: '100%', 
                          height: 120, 
                          mb: 1, 
                          borderRadius: 1, 
                          overflow: 'hidden',
                          border: '1px solid #ddd'
                        }}>
                          <img 
                            src={url} 
                            alt={`Gallery preview ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Enter URL for gallery image ${index + 1}`}
                      value={url}
                      onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={formData.tags}
                  onChange={handleTagsChange}
                  input={<OutlinedInput label="Tags" />}
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
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              >
                {isEditing ? 'Update Insight' : 'Add Insight'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Cultural Insights
        </Typography>
        <List>
          {insights.map((insight) => (
            <ListItem 
              key={insight._id || insight.topic} 
              sx={{ 
                mb: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <ListItemText 
                  primary={insight.title} 
                  secondary={`Topic: ${insight.topic}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEdit(insight)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(insight.topic)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </Box>
              
              {/* Image preview section */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2, overflow: 'auto', width: '100%' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 1, 
                  overflow: 'hidden',
                  border: '1px solid #eee'
                }}>
                  <img 
                    src={insight.image} 
                    alt={insight.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                
                {insight.imageGallery?.map((img, idx) => (
                  img && <Box key={idx} sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 1, 
                    overflow: 'hidden',
                    border: '1px solid #eee'
                  }}>
                    <img 
                      src={img} 
                      alt={`${insight.title} gallery ${idx+1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CulturalInsightsForm; 