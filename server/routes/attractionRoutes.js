const express = require('express');
const router = express.Router();
const {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  createAttractionReview,
  getNearbyAttractions
} = require('../controllers/attractionController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getAttractions)
  .post(protect, admin, createAttraction);

router.get('/nearby', getNearbyAttractions);

router.route('/:id')
  .get(getAttractionById)
  .put(protect, admin, updateAttraction)
  .delete(protect, admin, deleteAttraction);

router.route('/:id/reviews')
  .post(protect, createAttractionReview);

module.exports = router; 