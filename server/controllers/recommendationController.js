const { generateRecommendations, generateCulturalInsight } = require('../utils/aiService');

/**
 * @desc    Get personalized recommendations based on user preferences
 * @route   POST /api/recommendations
 * @access  Private
 */
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { interests, duration, travelStyle } = req.body;
    
    if (!interests || !duration || !travelStyle) {
      return res.status(400).json({ message: 'Please provide all required preferences' });
    }
    
    const recommendations = await generateRecommendations({
      interests,
      duration,
      travelStyle
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
};

/**
 * @desc    Get cultural insights about a specific topic
 * @route   GET /api/recommendations/cultural-insights/:topic
 * @access  Public
 */
const getCulturalInsight = async (req, res) => {
  try {
    const { topic } = req.params;
    
    if (!topic) {
      return res.status(400).json({ message: 'Please provide a topic' });
    }
    
    const insight = await generateCulturalInsight(topic);
    
    res.json({ topic, insight });
  } catch (error) {
    console.error('Error generating cultural insight:', error);
    res.status(500).json({ message: 'Error generating cultural insight' });
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getCulturalInsight
}; 