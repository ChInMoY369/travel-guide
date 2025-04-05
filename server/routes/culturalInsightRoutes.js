const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllCulturalInsights,
  getCulturalInsightByTopic,
  createCulturalInsight,
  updateCulturalInsight,
  deleteCulturalInsight
} = require('../controllers/culturalInsightController');

// Public routes
router.get('/', getAllCulturalInsights);
router.get('/:topic', getCulturalInsightByTopic);

// Protected routes (admin only)
router.post('/', protect, createCulturalInsight);
router.put('/:topic', protect, updateCulturalInsight);
router.delete('/:topic', protect, deleteCulturalInsight);

module.exports = router; 