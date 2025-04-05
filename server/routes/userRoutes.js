const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  addFavoriteAttraction,
  removeFavoriteAttraction,
  getUserFavorites,
  getUserVisitHistory,
  addVisitRecord,
  getUserVisits,
  checkAdminStatus
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Test database connection route
router.get('/test-db', async (req, res) => {
  try {
    // Attempt to count users in the database
    const count = await User.countDocuments();
    res.json({ 
      success: true, 
      message: 'Database connection successful', 
      userCount: count,
      databaseHost: process.env.MONGODB_URI.split('@')[1]
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/favorites')
  .get(protect, getUserFavorites)
  .post(protect, addFavoriteAttraction);

router.route('/favorites/:id')
  .delete(protect, removeFavoriteAttraction);

router.route('/visits')
  .get(protect, getUserVisitHistory)
  .post(protect, addVisitRecord);

router.get('/check-admin', protect, checkAdminStatus);

module.exports = router; 