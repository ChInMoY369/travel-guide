const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/authMiddleware');

// Define a schema for the sections
const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction'
  }]
});

// Create the model if it doesn't exist
let Section;
try {
  Section = mongoose.model('Section');
} catch (error) {
  Section = mongoose.model('Section', SectionSchema);
}

// Initialize sections if they don't exist
const initializeSections = async () => {
  try {
    const famousLocationsCount = await Section.countDocuments({ name: 'famousLocations' });
    if (famousLocationsCount === 0) {
      await Section.create({ name: 'famousLocations', destinations: [] });
      console.log('Created famousLocations section');
    }

    const pristineBeachesCount = await Section.countDocuments({ name: 'pristineBeaches' });
    if (pristineBeachesCount === 0) {
      await Section.create({ name: 'pristineBeaches', destinations: [] });
      console.log('Created pristineBeaches section');
    }
  } catch (error) {
    console.error('Error initializing sections:', error);
  }
};

// Initialize sections on startup
initializeSections();

// Get all sections
router.get('/', async (req, res) => {
  try {
    // Find the sections and populate the destinations
    const famousLocations = await Section.findOne({ name: 'famousLocations' }).populate('destinations');
    const pristineBeaches = await Section.findOne({ name: 'pristineBeaches' }).populate('destinations');

    res.json({
      famousLocations: famousLocations ? famousLocations.destinations : [],
      pristineBeaches: pristineBeaches ? pristineBeaches.destinations : []
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Error fetching sections', error: error.message });
  }
});

// Update a section with destinations
router.post('/update', protect, admin, async (req, res) => {
  try {
    const { section, destinations } = req.body;

    if (!section || !destinations || !Array.isArray(destinations)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Validate section name
    if (!['famousLocations', 'pristineBeaches'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section name' });
    }

    // Get the existing section
    let sectionDoc = await Section.findOne({ name: section });
    
    if (!sectionDoc) {
      sectionDoc = new Section({ name: section, destinations: [] });
    }

    // Extract destination IDs
    const destinationIds = destinations.map(dest => dest._id || dest);

    // Update the section with new destinations
    sectionDoc.destinations = destinationIds;
    await sectionDoc.save();

    res.json({ message: 'Section updated successfully', section: sectionDoc });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Error updating section', error: error.message });
  }
});

// Remove a destination from a section
router.post('/remove', protect, admin, async (req, res) => {
  try {
    const { section, destinationId } = req.body;

    if (!section || !destinationId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Validate section name
    if (!['famousLocations', 'pristineBeaches'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section name' });
    }

    // Get the existing section
    const sectionDoc = await Section.findOne({ name: section });
    
    if (!sectionDoc) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Remove the destination
    sectionDoc.destinations = sectionDoc.destinations.filter(
      dest => dest.toString() !== destinationId
    );
    
    await sectionDoc.save();

    res.json({ message: 'Destination removed successfully', section: sectionDoc });
  } catch (error) {
    console.error('Error removing destination:', error);
    res.status(500).json({ message: 'Error removing destination', error: error.message });
  }
});

module.exports = router; 