const CulturalInsight = require('../models/CulturalInsight');

// Get all cultural insights
const getAllCulturalInsights = async (req, res) => {
  try {
    const insights = await CulturalInsight.find().sort({ createdAt: -1 });
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error fetching cultural insights:', error);
    res.status(500).json({ message: 'Failed to fetch cultural insights' });
  }
};

// Get a cultural insight by topic
const getCulturalInsightByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const insight = await CulturalInsight.findOne({ topic });
    
    if (!insight) {
      return res.status(404).json({ message: 'Cultural insight not found' });
    }
    
    res.status(200).json(insight);
  } catch (error) {
    console.error('Error fetching cultural insight:', error);
    res.status(500).json({ message: 'Failed to fetch cultural insight' });
  }
};

// Create a new cultural insight
const createCulturalInsight = async (req, res) => {
  try {
    const { title, description, image, topic, tags, imageGallery } = req.body;
    
    // Check if insight with this topic already exists
    const existingInsight = await CulturalInsight.findOne({ topic });
    if (existingInsight) {
      return res.status(400).json({ message: 'A cultural insight with this topic already exists' });
    }
    
    // Generate AI content for insight if not provided
    let insight = req.body.insight || '';
    
    if (!insight) {
      // Default insight content based on title and description
      insight = `${title} is an important cultural aspect of Odisha. ${description} This cultural element has significant historical importance and continues to be a vital part of Odisha's rich heritage.`;
    }
    
    const newInsight = await CulturalInsight.create({
      title,
      description,
      image,
      imageGallery: imageGallery || [],
      topic,
      insight,
      tags
    });
    
    res.status(201).json(newInsight);
  } catch (error) {
    console.error('Error creating cultural insight:', error);
    res.status(500).json({ message: 'Failed to create cultural insight' });
  }
};

// Update a cultural insight
const updateCulturalInsight = async (req, res) => {
  try {
    const { topic } = req.params;
    const { title, description, image, tags, imageGallery } = req.body;
    
    const insight = await CulturalInsight.findOne({ topic });
    
    if (!insight) {
      return res.status(404).json({ message: 'Cultural insight not found' });
    }
    
    // Keep existing insight content if not provided
    const updatedInsight = await CulturalInsight.findOneAndUpdate(
      { topic },
      { 
        title, 
        description, 
        image, 
        imageGallery: imageGallery || insight.imageGallery,
        tags,
        insight: req.body.insight || insight.insight
      },
      { new: true }
    );
    
    res.status(200).json(updatedInsight);
  } catch (error) {
    console.error('Error updating cultural insight:', error);
    res.status(500).json({ message: 'Failed to update cultural insight' });
  }
};

// Delete a cultural insight
const deleteCulturalInsight = async (req, res) => {
  try {
    const { topic } = req.params;
    
    const insight = await CulturalInsight.findOne({ topic });
    
    if (!insight) {
      return res.status(404).json({ message: 'Cultural insight not found' });
    }
    
    await CulturalInsight.findOneAndDelete({ topic });
    
    res.status(200).json({ message: 'Cultural insight deleted successfully' });
  } catch (error) {
    console.error('Error deleting cultural insight:', error);
    res.status(500).json({ message: 'Failed to delete cultural insight' });
  }
};

module.exports = {
  getAllCulturalInsights,
  getCulturalInsightByTopic,
  createCulturalInsight,
  updateCulturalInsight,
  deleteCulturalInsight
}; 