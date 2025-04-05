const express = require('express');
const router = express.Router();
const { uploadProfileImage, getImage } = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Upload profile image - Protected route
router.post('/profile', protect, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message || err 
      });
    }
    // Call the controller after successful upload
    uploadProfileImage(req, res);
  });
});

// Get profile image - Public route
router.get('/profile/:filename', (req, res) => {
  req.params.filename = req.params.filename;
  getImage(req, res);
});

// Get image - Public route (generic, for all other images)
router.get('/:filename', getImage);

module.exports = router; 