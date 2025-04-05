import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon,
  Edit as EditIcon,
  ColorLens as ColorIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Available section types with their configuration options
const sectionTypes = [
  { 
    id: 'heroSection', 
    label: 'Hero Section',
    description: 'A full-width image with title and optional call-to-action button',
    defaultData: {
      title: 'Destination Title',
      subtitle: 'Explore this amazing destination',
      backgroundImage: '',
      showButton: true,
      buttonText: 'Discover More',
      buttonColor: '#1976d2',
      buttonHoverColor: '#1565c0'
    }
  },
  { 
    id: 'twoColumnSection', 
    label: 'Two Column Section',
    description: 'Text and image side by side',
    defaultData: {
      title: 'About This Destination',
      content: 'Write a detailed description about this destination here.',
      image: '',
      imageAlt: 'Destination image',
      backgroundColor: '#ffffff',
      showButton: false,
      buttonText: 'Learn More',
      buttonColor: '#1976d2',
      buttonHoverColor: '#1565c0'
    }
  },
  { 
    id: 'blueishPhotoBox', 
    label: 'Blueish Photo Box',
    description: 'Similar to Odisha State Museum design',
    defaultData: {
      title: 'Featured Destination',
      content: 'Describe the special features of this destination.',
      image: '',
      imageAlt: 'Featured image',
      backgroundColor: '#0a2351',
      highlights: ['Highlight 1', 'Highlight 2', 'Highlight 3']
    }
  },
  { 
    id: 'gallerySection', 
    label: 'Gallery Section',
    description: 'Image carousel/gallery',
    defaultData: {
      title: 'Photo Gallery',
      images: [''],
      captions: [''],
      backgroundColor: '#ffffff'
    }
  },
  { 
    id: 'cardGridSection', 
    label: 'Card Grid Section',
    description: 'Grid of cards, good for features/highlights',
    defaultData: {
      title: 'Things to Explore',
      description: 'Discover the variety of experiences this destination has to offer.',
      backgroundColor: '#ffffff',
      cards: [
        { 
          title: 'Feature 1', 
          description: 'Description of feature 1', 
          image: '' 
        },
        { 
          title: 'Feature 2', 
          description: 'Description of feature 2', 
          image: '' 
        },
        { 
          title: 'Feature 3', 
          description: 'Description of feature 3', 
          image: '' 
        }
      ]
    }
  },
  { 
    id: 'tabbedContentSection', 
    label: 'Tabbed Content Section',
    description: 'Tabs for Overview, Nearby Places, Tips, etc.',
    defaultData: {}
  }
];

// Available template types
const templateTypes = [
  {
    id: 'standard',
    label: 'Standard Layout',
    description: 'Default layout with sections stacked vertically'
  },
  {
    id: 'tabbed',
    label: 'Tabbed Layout',
    description: 'Layout with tabs and sidebar like the Ananta Vasudeva Temple page'
  }
];

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

// Component to configure a section
const SectionConfigurator = ({ section, onUpdate, onDelete, sectionIndex }) => {
  const sectionType = sectionTypes.find(type => type.id === section.type);
  if (!sectionType) return null;

  // Find configurator for this section type or use a default
  const renderConfigurator = () => {
    switch (section.type) {
      case 'heroSection':
        return (
          <>
            <TextField
              fullWidth
              label="Title"
              value={section.data.title}
              onChange={e => handleDataChange('title', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={section.data.subtitle}
              onChange={e => handleDataChange('subtitle', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Background Image URL"
              value={section.data.backgroundImage}
              onChange={e => handleDataChange('backgroundImage', e.target.value)}
              margin="normal"
              helperText="Enter a URL for the background image"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={section.data.showButton}
                  onChange={e => handleDataChange('showButton', e.target.checked)}
                  color="primary"
                />
              }
              label="Show Button"
            />
            {section.data.showButton && (
              <>
                <TextField
                  fullWidth
                  label="Button Text"
                  value={section.data.buttonText}
                  onChange={e => handleDataChange('buttonText', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Button Color"
                  value={section.data.buttonColor}
                  onChange={e => handleDataChange('buttonColor', e.target.value)}
                  margin="normal"
                  placeholder="#1976d2"
                />
              </>
            )}
          </>
        );
      
      case 'twoColumnSection':
        return (
          <>
            <TextField
              fullWidth
              label="Title"
              value={section.data.title}
              onChange={e => handleDataChange('title', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              value={section.data.content}
              onChange={e => handleDataChange('content', e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={section.data.image}
              onChange={e => handleDataChange('image', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image Alt Text"
              value={section.data.imageAlt}
              onChange={e => handleDataChange('imageAlt', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Background Color"
              value={section.data.backgroundColor}
              onChange={e => handleDataChange('backgroundColor', e.target.value)}
              margin="normal"
              placeholder="#ffffff"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!section.imageOnLeft}
                  onChange={e => onUpdate({
                    ...section,
                    imageOnLeft: e.target.checked
                  })}
                  color="primary"
                />
              }
              label="Image on Left Side"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={section.data.showButton}
                  onChange={e => handleDataChange('showButton', e.target.checked)}
                  color="primary"
                />
              }
              label="Show Button"
            />
            {section.data.showButton && (
              <TextField
                fullWidth
                label="Button Text"
                value={section.data.buttonText}
                onChange={e => handleDataChange('buttonText', e.target.value)}
                margin="normal"
              />
            )}
          </>
        );
      
      case 'blueishPhotoBox':
        return (
          <>
            <TextField
              fullWidth
              label="Title"
              value={section.data.title}
              onChange={e => handleDataChange('title', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              value={section.data.content}
              onChange={e => handleDataChange('content', e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={section.data.image}
              onChange={e => handleDataChange('image', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Background Color"
              value={section.data.backgroundColor}
              onChange={e => handleDataChange('backgroundColor', e.target.value)}
              margin="normal"
              placeholder="#0a2351"
              helperText="Use a dark color for best results"
            />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Highlights
            </Typography>
            {section.data.highlights && section.data.highlights.map((highlight, idx) => (
              <Box key={idx} sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Highlight ${idx + 1}`}
                  value={highlight}
                  onChange={e => {
                    const newHighlights = [...section.data.highlights];
                    newHighlights[idx] = e.target.value;
                    handleDataChange('highlights', newHighlights);
                  }}
                  size="small"
                />
                <IconButton 
                  color="error" 
                  onClick={() => {
                    const newHighlights = section.data.highlights.filter((_, i) => i !== idx);
                    handleDataChange('highlights', newHighlights);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button 
              startIcon={<AddIcon />} 
              onClick={() => {
                const newHighlights = [...(section.data.highlights || []), ''];
                handleDataChange('highlights', newHighlights);
              }}
              sx={{ mt: 1 }}
              size="small"
            >
              Add Highlight
            </Button>
          </>
        );
        
      case 'gallerySection':
        return (
          <>
            <TextField
              fullWidth
              label="Section Title"
              value={section.data.title}
              onChange={e => handleDataChange('title', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Background Color"
              value={section.data.backgroundColor}
              onChange={e => handleDataChange('backgroundColor', e.target.value)}
              margin="normal"
              placeholder="#ffffff"
            />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Gallery Images
            </Typography>
            {section.data.images && section.data.images.map((image, idx) => (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Image ${idx + 1} URL`}
                    value={image}
                    onChange={e => {
                      const newImages = [...section.data.images];
                      newImages[idx] = e.target.value;
                      handleDataChange('images', newImages);
                    }}
                    size="small"
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      const newImages = section.data.images.filter((_, i) => i !== idx);
                      const newCaptions = section.data.captions.filter((_, i) => i !== idx);
                      handleDataChange('images', newImages);
                      handleDataChange('captions', newCaptions);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label={`Caption ${idx + 1}`}
                  value={section.data.captions?.[idx] || ''}
                  onChange={e => {
                    const newCaptions = [...(section.data.captions || [])];
                    newCaptions[idx] = e.target.value;
                    handleDataChange('captions', newCaptions);
                  }}
                  size="small"
                />
              </Box>
            ))}
            <Button 
              startIcon={<AddIcon />} 
              onClick={() => {
                const newImages = [...(section.data.images || []), ''];
                const newCaptions = [...(section.data.captions || []), ''];
                handleDataChange('images', newImages);
                handleDataChange('captions', newCaptions);
              }}
              sx={{ mt: 1 }}
              size="small"
            >
              Add Image
            </Button>
          </>
        );
        
      case 'cardGridSection':
        return (
          <>
            <TextField
              fullWidth
              label="Section Title"
              value={section.data.title}
              onChange={e => handleDataChange('title', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Section Description"
              value={section.data.description}
              onChange={e => handleDataChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Background Color"
              value={section.data.backgroundColor}
              onChange={e => handleDataChange('backgroundColor', e.target.value)}
              margin="normal"
              placeholder="#ffffff"
            />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Cards
            </Typography>
            {section.data.cards && section.data.cards.map((card, idx) => (
              <Accordion key={idx} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{card.title || `Card ${idx + 1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Card Title"
                    value={card.title}
                    onChange={e => {
                      const newCards = [...section.data.cards];
                      newCards[idx] = { ...card, title: e.target.value };
                      handleDataChange('cards', newCards);
                    }}
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Card Description"
                    value={card.description}
                    onChange={e => {
                      const newCards = [...section.data.cards];
                      newCards[idx] = { ...card, description: e.target.value };
                      handleDataChange('cards', newCards);
                    }}
                    margin="normal"
                    size="small"
                    multiline
                    rows={2}
                  />
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={card.image}
                    onChange={e => {
                      const newCards = [...section.data.cards];
                      newCards[idx] = { ...card, image: e.target.value };
                      handleDataChange('cards', newCards);
                    }}
                    margin="normal"
                    size="small"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      color="error" 
                      size="small" 
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        const newCards = section.data.cards.filter((_, i) => i !== idx);
                        handleDataChange('cards', newCards);
                      }}
                    >
                      Remove Card
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            <Button 
              startIcon={<AddIcon />} 
              onClick={() => {
                const newCards = [...(section.data.cards || []), { 
                  title: `New Card ${section.data.cards?.length + 1 || 1}`, 
                  description: 'Card description here', 
                  image: '' 
                }];
                handleDataChange('cards', newCards);
              }}
              sx={{ mt: 1 }}
              size="small"
            >
              Add Card
            </Button>
          </>
        );
      
      case 'tabbedContentSection':
        return (
          <Typography>
            This section will display the attraction's data in a tabbed interface.
            No additional configuration is needed.
          </Typography>
        );
        
      default:
        return (
          <Typography color="error">
            Configuration for this section type is not available.
          </Typography>
        );
    }
  };

  const handleDataChange = (field, value) => {
    // Sanitize text input if it's a string
    const sanitizedValue = typeof value === 'string' ? preventMarkdownFormatting(value) : value;
    
    const updatedSection = {
      ...section,
      data: {
        ...section.data,
        [field]: sanitizedValue
      }
    };
    
    onUpdate(updatedSection);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {sectionType.label}
          </Typography>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => onDelete(sectionIndex)}
            title="Delete section"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {renderConfigurator()}
      </CardContent>
    </Card>
  );
};

// Main layout designer component
const LayoutDesigner = ({ 
  initialLayout = [], 
  onSave,
  attractionData = null, // Optional attraction data for preview
  initialTemplateType = 'standard'
}) => {
  const [layout, setLayout] = useState(initialLayout);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [templateType, setTemplateType] = useState(initialTemplateType);

  // Handle template type change
  const handleTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(layout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLayout(items);
  };

  // Add a new section
  const handleAddSection = (sectionTypeId) => {
    const sectionType = sectionTypes.find(type => type.id === sectionTypeId);
    if (!sectionType) return;
    
    setLayout([
      ...layout,
      {
        type: sectionTypeId,
        data: { ...sectionType.defaultData },
        imageOnLeft: true
      }
    ]);
    
    setAddSectionOpen(false);
  };

  // Update a section
  const handleUpdateSection = (updatedSection, index) => {
    const newLayout = [...layout];
    newLayout[index] = updatedSection;
    setLayout(newLayout);
  };

  // Delete a section
  const handleDeleteSection = (index) => {
    setLayout(layout.filter((_, i) => i !== index));
  };

  // Save the layout
  const handleSave = () => {
    if (onSave) {
      // Include the templateType with the layout
      onSave(layout, templateType);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Page Layout Designer</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PreviewIcon />} 
            onClick={() => setIsPreviewOpen(true)}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            onClick={handleSave}
            color="primary"
          >
            Save Layout
          </Button>
        </Box>
      </Box>
      
      {/* Template Type Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Page Template
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          Choose how your page content will be presented to visitors
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="template-type-label">Template Type</InputLabel>
          <Select
            labelId="template-type-label"
            id="template-type"
            value={templateType}
            label="Template Type"
            onChange={handleTemplateTypeChange}
          >
            {templateTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {templateType === 'standard' 
              ? 'The standard layout displays content in vertical sections, with each section taking the full width of the page.'
              : 'The tabbed layout organizes content into tabs with a sidebar for quick information and facilities, similar to the Ananta Vasudeva Temple page.'}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Drag and drop sections to reorder them. Click "Add Section" to add new content to your page.
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={() => setAddSectionOpen(true)}
          sx={{ mb: 3 }}
        >
          Add Section
        </Button>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {layout.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography color="text.secondary">
                      Your page is empty. Add sections to create your layout.
                    </Typography>
                  </Paper>
                ) : (
                  layout.map((section, index) => (
                    <Draggable key={index} draggableId={`section-${index}`} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SectionConfigurator 
                            section={section}
                            onUpdate={(updatedSection) => handleUpdateSection(updatedSection, index)}
                            onDelete={() => handleDeleteSection(index)}
                            sectionIndex={index}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>

      {/* Add Section Dialog */}
      <Dialog open={addSectionOpen} onClose={() => setAddSectionOpen(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <List>
            {sectionTypes.map((type) => (
              <ListItem 
                button 
                key={type.id} 
                onClick={() => handleAddSection(type.id)}
              >
                <ListItemText 
                  primary={type.label} 
                  secondary={type.description} 
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSectionOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog (would integrate with the DestinationTemplate) */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fullScreen
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Layout Preview</Typography>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            This is where you would see a live preview of your page layout.
            {templateType === 'tabbed' 
              ? ' Using the Tabbed Layout template with tabs and sidebar.' 
              : ' Using the Standard Layout template with vertical sections.'}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LayoutDesigner; 