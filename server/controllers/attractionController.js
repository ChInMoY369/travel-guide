const Attraction = require('../models/Attraction');
const Restaurant = require('../models/Restaurant');
const { generateAttractionDescription } = require('../utils/aiService');

/**
 * Helper function to remove unwanted Markdown formatting
 */
const sanitizeMarkdown = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/(\n|^)#+\s/g, '$1') // Remove heading markers
    .replace(/(\s|^)\*\*\*(.+?)\*\*\*(\s|$)/g, '$1$2$3') // Remove bold+italic markers
    .replace(/(\s|^)\*\*(.+?)\*\*(\s|$)/g, '$1$2$3') // Remove bold markers
    .replace(/(\s|^)_(.+?)_(\s|$)/g, '$1$2$3') // Remove italic markers
    .replace(/(\s|^)~~(.+?)~~(\s|$)/g, '$1$2$3') // Remove strikethrough
    .replace(/(\s|^)`(.+?)`(\s|$)/g, '$1$2$3'); // Remove inline code
};

/**
 * Helper function to sanitize a full attraction object recursively
 */
const sanitizeAttractionData = (data) => {
  if (!data) return data;
  
  // Create a copy of the data to avoid modifying the original
  const sanitized = { ...data };
  
  // Sanitize text fields
  if (sanitized.name) sanitized.name = sanitizeMarkdown(sanitized.name);
  if (sanitized.description) sanitized.description = sanitizeMarkdown(sanitized.description);
  if (sanitized.aiDescription) sanitized.aiDescription = sanitizeMarkdown(sanitized.aiDescription);
  if (sanitized.overview) sanitized.overview = sanitizeMarkdown(sanitized.overview);
  if (sanitized.culturalSignificance) sanitized.culturalSignificance = sanitizeMarkdown(sanitized.culturalSignificance);
  if (sanitized.bestTimeToVisit) sanitized.bestTimeToVisit = sanitizeMarkdown(sanitized.bestTimeToVisit);
  
  // Sanitize location address
  if (sanitized.location && sanitized.location.address) {
    sanitized.location.address = sanitizeMarkdown(sanitized.location.address);
  }
  
  // Sanitize visitor tips
  if (sanitized.visitorTips && Array.isArray(sanitized.visitorTips)) {
    sanitized.visitorTips = sanitized.visitorTips.map(tip => ({
      ...tip,
      title: sanitizeMarkdown(tip.title),
      content: sanitizeMarkdown(tip.content)
    }));
  }
  
  // Sanitize layout sections
  if (sanitized.layout && Array.isArray(sanitized.layout)) {
    sanitized.layout = sanitized.layout.map(section => {
      if (!section.data) return section;
      
      // Create a copy of the section data
      const sanitizedData = { ...section.data };
      
      // Sanitize common text fields in section data
      Object.keys(sanitizedData).forEach(key => {
        if (typeof sanitizedData[key] === 'string') {
          sanitizedData[key] = sanitizeMarkdown(sanitizedData[key]);
        } else if (Array.isArray(sanitizedData[key])) {
          // Handle arrays (like highlights or cards)
          sanitizedData[key] = sanitizedData[key].map(item => {
            if (typeof item === 'string') {
              return sanitizeMarkdown(item);
            } else if (typeof item === 'object' && item !== null) {
              // For objects like cards with title/description
              const sanitizedItem = { ...item };
              Object.keys(sanitizedItem).forEach(itemKey => {
                if (typeof sanitizedItem[itemKey] === 'string') {
                  sanitizedItem[itemKey] = sanitizeMarkdown(sanitizedItem[itemKey]);
                }
              });
              return sanitizedItem;
            }
            return item;
          });
        }
      });
      
      return { ...section, data: sanitizedData };
    });
  }
  
  return sanitized;
};

/**
 * @desc    Get all attractions
 * @route   GET /api/attractions
 * @access  Public
 */
const getAttractions = async (req, res) => {
  try {
    const { type, sort, limit = 10, page = 1, name, tag } = req.query;
    
    // Build query
    const query = {};
    if (type) {
      query.type = type;
    }
    
    // Add name filter if provided
    if (name) {
      // Use regex for case insensitive search by name
      query.name = { $regex: new RegExp(name, 'i') };
    }
    
    // Add tag filter if provided
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort) {
      // Handle sort prefixed with minus sign for descending order
      if (sort.startsWith('-')) {
        const field = sort.substring(1);
        sortOptions[field] = -1;
      } else {
        sortOptions[sort] = 1;
      }
    } else {
      // Default sort by name
      sortOptions = { name: 1 };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const attractions = await Attraction.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get total count for pagination
    const total = await Attraction.countDocuments(query);
    
    // Log for debugging
    console.log(`Found ${attractions.length} attractions matching query:`, query);
    
    res.json({
      attractions,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    console.error('Error in getAttractions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get attraction by ID
 * @route   GET /api/attractions/:id
 * @access  Public
 */
const getAttractionById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`[getAttractionById] Received request for attraction ID: ${id}`);
    
    // Check if ID is valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log(`[getAttractionById] Invalid MongoDB ObjectId format: ${id}`);
      return res.status(400).json({ 
        message: 'Invalid attraction ID format', 
        details: 'The provided ID is not a valid MongoDB ObjectId',
        id 
      });
    }
    
    console.log(`[getAttractionById] Attempting to find attraction with ID: ${id}`);
    const attraction = await Attraction.findById(id)
      .populate('reviews.user', 'name profilePicture')
      .populate('nearbyRestaurants', 'name cuisine priceRange averageRating images')
      .populate('nearbyHotels', 'name priceRange starRating averageRating images')
      .populate('nearbyAttractions', 'name type averageRating images');
    
    if (attraction) {
      console.log(`[getAttractionById] Found attraction: ${attraction.name}`);
      return res.json(attraction);
    } else {
      console.log(`[getAttractionById] No attraction found with ID: ${id}`);
      return res.status(404).json({ 
        message: 'Attraction not found',
        details: `No attraction exists with the ID: ${id}`
      });
    }
  } catch (error) {
    console.error(`[getAttractionById] Error:`, error);
    console.error(`[getAttractionById] Stack trace:`, error.stack);
    
    // Handle specific Mongoose/MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid attraction ID format',
        details: error.message,
        error: error.name
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error while fetching attraction',
      details: error.message,
      error: error.name
    });
  }
};

/**
 * @desc    Create a new attraction
 * @route   POST /api/attractions
 * @access  Private/Admin
 */
const createAttraction = async (req, res) => {
  try {
    console.log('Creating new attraction with data:', req.body);
    
    // Validate required fields
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ message: 'Attraction name is required' });
    }

    // Ensure we have at least one valid image
    const images = Array.isArray(req.body.images) 
      ? req.body.images.filter(img => img && img.trim() !== '')
      : [];
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one valid image URL is required' });
    }
    
    // Handle structured content fields that might come as JSON strings
    let keySignificance = req.body.keySignificance || [];
    let mainAttractions = req.body.mainAttractions || [];
    let famousFor = req.body.famousFor || [];
    let educationalValue = req.body.educationalValue || [];
    let facilities = req.body.facilities || [];
    
    // Parse JSON strings if needed
    if (typeof keySignificance === 'string') {
      try {
        keySignificance = JSON.parse(keySignificance);
      } catch (e) {
        console.error('Error parsing keySignificance:', e);
        keySignificance = [];
      }
    }
    
    if (typeof mainAttractions === 'string') {
      try {
        mainAttractions = JSON.parse(mainAttractions);
      } catch (e) {
        console.error('Error parsing mainAttractions:', e);
        mainAttractions = [];
      }
    }
    
    if (typeof famousFor === 'string') {
      try {
        famousFor = JSON.parse(famousFor);
      } catch (e) {
        console.error('Error parsing famousFor:', e);
        famousFor = [];
      }
    }
    
    if (typeof educationalValue === 'string') {
      try {
        educationalValue = JSON.parse(educationalValue);
      } catch (e) {
        console.error('Error parsing educationalValue:', e);
        educationalValue = [];
      }
    }
    
    if (typeof facilities === 'string') {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        console.error('Error parsing facilities:', e);
        facilities = [];
      }
    }
    
    // Sanitize input data to remove unwanted Markdown formatting
    const sanitizedData = sanitizeAttractionData(req.body);
    
    const {
      name,
      type,
      location,
      virtualTour,
      culturalSignificance,
      bestTimeToVisit,
      entryFee,
      openingHours,
      tags,
      layout,
      templateType
    } = sanitizedData;

    // Create new attraction
    const attraction = await Attraction.create({
      name,
      type,
      overview: sanitizedData.overview || '',
      location,
      images,
      virtualTour: virtualTour || { available: false },
      culturalSignificance,
      bestTimeToVisit,
      entryFee,
      openingHours,
      tags: tags || [],
      layout: layout || [],
      templateType: templateType || 'standard',
      keySignificance,
      mainAttractions,
      famousFor,
      educationalValue,
      facilities
    });

    // Generate AI description in the background - don't wait for this to complete
    try {
      generateAttractionDescription(name, type)
        .then(async (aiDescription) => {
          if (aiDescription) {
            attraction.aiDescription = aiDescription;
            await attraction.save().catch(err => {
              console.error('Error saving AI description:', err);
              // Don't reject the promise, just log the error
            });
          }
        })
        .catch(error => {
          console.error('Error generating AI description:', error);
          // Don't let this error affect the main flow
        });
    } catch (aiError) {
      // Log but don't let AI description errors stop the process
      console.error('AI description generation failed:', aiError);
    }

    res.status(201).json(attraction);
  } catch (error) {
    console.error('Error creating attraction:', error);
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        message: 'Validation Error', 
        details: error.message,
        validationErrors
      });
    } else if (error.code === 11000) {
      // Handle duplicate key error (e.g., unique name constraint)
      return res.status(400).json({ 
        message: 'Duplicate Error', 
        details: 'An attraction with this name already exists'
      });
    }
    
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/**
 * @desc    Update an attraction
 * @route   PUT /api/attractions/:id
 * @access  Private/Admin
 */
const updateAttraction = async (req, res) => {
  try {
    console.log('Updating attraction with ID:', req.params.id);
    
    // Validate required fields
    if (req.body.name !== undefined && (!req.body.name || !req.body.name.trim())) {
      return res.status(400).json({ message: 'Attraction name cannot be empty' });
    }

    // Validate images if provided
    if (req.body.images) {
      const validatedImages = Array.isArray(req.body.images) 
        ? req.body.images.filter(img => img && img.trim() !== '')
        : [];
      
      if (validatedImages.length === 0) {
        return res.status(400).json({ message: 'At least one valid image URL is required' });
      }
      
      // Replace images with validated images
      req.body.images = validatedImages;
    }
    
    // Handle structured content fields that might come as JSON strings
    if (req.body.keySignificance && typeof req.body.keySignificance === 'string') {
      try {
        req.body.keySignificance = JSON.parse(req.body.keySignificance);
      } catch (e) {
        console.error('Error parsing keySignificance:', e);
      }
    }
    
    if (req.body.mainAttractions && typeof req.body.mainAttractions === 'string') {
      try {
        req.body.mainAttractions = JSON.parse(req.body.mainAttractions);
      } catch (e) {
        console.error('Error parsing mainAttractions:', e);
      }
    }
    
    if (req.body.famousFor && typeof req.body.famousFor === 'string') {
      try {
        req.body.famousFor = JSON.parse(req.body.famousFor);
      } catch (e) {
        console.error('Error parsing famousFor:', e);
      }
    }
    
    if (req.body.educationalValue && typeof req.body.educationalValue === 'string') {
      try {
        req.body.educationalValue = JSON.parse(req.body.educationalValue);
      } catch (e) {
        console.error('Error parsing educationalValue:', e);
      }
    }
    
    if (req.body.facilities && typeof req.body.facilities === 'string') {
      try {
        req.body.facilities = JSON.parse(req.body.facilities);
      } catch (e) {
        console.error('Error parsing facilities:', e);
      }
    }
    
    // Sanitize input data to remove unwanted Markdown formatting
    const sanitizedData = sanitizeAttractionData(req.body);
    console.log('Sanitized update data:', JSON.stringify(sanitizedData, null, 2));
    
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    // Update fields - directly use the sanitized values
    Object.keys(sanitizedData).forEach(key => {
      attraction[key] = sanitizedData[key];
    });

    // If name or type changed, regenerate AI description
    if (sanitizedData.name || sanitizedData.type) {
      try {
        const aiDescription = await generateAttractionDescription(
          attraction.name,
          attraction.type
        );
        attraction.aiDescription = aiDescription;
      } catch (error) {
        console.error('Error regenerating AI description:', error);
      }
    }

    const updatedAttraction = await attraction.save();
    console.log('Attraction updated successfully:', updatedAttraction.name);
    res.json(updatedAttraction);
  } catch (error) {
    console.error('Error updating attraction:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/**
 * @desc    Delete an attraction
 * @route   DELETE /api/attractions/:id
 * @access  Private/Admin
 */
const deleteAttraction = async (req, res) => {
  try {
    console.log(`[deleteAttraction] Attempting to delete attraction with ID: ${req.params.id}`);
    
    const result = await Attraction.findByIdAndDelete(req.params.id);

    if (!result) {
      console.log(`[deleteAttraction] Attraction not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Attraction not found' });
    }

    console.log(`[deleteAttraction] Successfully deleted attraction: ${result.name}`);
    res.json({ message: 'Attraction removed successfully', data: { id: req.params.id } });
  } catch (error) {
    console.error(`[deleteAttraction] Error:`, error);
    console.error(`[deleteAttraction] Stack trace:`, error.stack);
    res.status(500).json({ 
      message: 'Server error while deleting attraction',
      details: error.message,
      error: error.name
    });
  }
};

/**
 * @desc    Create a review for an attraction
 * @route   POST /api/attractions/:id/reviews
 * @access  Private
 */
const createAttractionReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = attraction.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Attraction already reviewed' });
    }

    // Create review
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    attraction.reviews.push(review);
    
    // Update average rating
    attraction.averageRating = attraction.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      attraction.reviews.length;

    await attraction.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get nearby attractions
 * @route   GET /api/attractions/nearby
 * @access  Public
 */
const getNearbyAttractions = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5 } = req.query; // distance in km
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Find attractions within the specified distance
    // This is a simplified approach - in a real app, you'd use geospatial queries
    const attractions = await Attraction.find({});
    
    // Filter attractions based on distance (simplified calculation)
    const nearbyAttractions = attractions.filter(attraction => {
      if (!attraction.location?.coordinates?.latitude || !attraction.location?.coordinates?.longitude) {
        return false;
      }
      
      // Simple distance calculation (not accurate for long distances)
      const latDiff = Math.abs(attraction.location.coordinates.latitude - parseFloat(latitude));
      const lonDiff = Math.abs(attraction.location.coordinates.longitude - parseFloat(longitude));
      
      // Rough approximation: 0.01 degree is about 1.11 km
      const approxDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111;
      
      return approxDistance <= parseFloat(distance);
    });

    res.json(nearbyAttractions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  createAttractionReview,
  getNearbyAttractions
}; 