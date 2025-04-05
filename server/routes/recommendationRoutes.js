const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getCulturalInsight
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// Get personalized recommendations
router.post('/', protect, getPersonalizedRecommendations);

// Get cultural insights
router.get('/cultural-insights/:topic', getCulturalInsight);

module.exports = router; 