const path = require('path');
const fs = require('fs');
const User = require('../models/User');

/**
 * @desc    Upload user profile image
 * @route   POST /api/images/profile
 * @access  Private
 */
const uploadProfileImage = async (req, res) => {
  try {
    // File is available in req.file due to the multer middleware
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if it exists (to save space)
    if (user.profilePicture && user.profilePicture.includes('uploads/profile/')) {
      const oldImagePath = path.join(__dirname, '..', user.profilePicture);
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error('Error deleting old profile image:', err);
      }
    }

    // Create URL for the uploaded file - use path.basename to get just the filename
    const filename = req.file.filename;
    // Store the image URL with /api prefix to match client expectations
    const imageUrl = `/api/images/profile/${filename}`;

    // Update user profile with new image url
    user.profilePicture = imageUrl;
    await user.save();

    console.log('Profile image updated successfully:', imageUrl);

    // Return success response with image url
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profilePicture: imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error uploading image',
      error: error.message 
    });
  }
};

/**
 * @desc    Get images
 * @route   GET /api/images/:filename
 * @access  Public
 */
const getImage = (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('Requested image filename:', filename);
    
    // Try to find in profile directory first
    let imagePath = path.join(__dirname, '../uploads/profile', filename);
    console.log('Looking for image at:', imagePath);
    
    // If not found, try other directories
    if (!fs.existsSync(imagePath)) {
      imagePath = path.join(__dirname, '../uploads', filename);
      console.log('Image not found in profile dir, trying:', imagePath);
      
      // If still not found, try other subdirectories
      if (!fs.existsSync(imagePath)) {
        const subdirs = ['attractions', 'cuisine', 'culture'];
        
        for (const subdir of subdirs) {
          const subPath = path.join(__dirname, '../uploads', subdir, filename);
          if (fs.existsSync(subPath)) {
            imagePath = subPath;
            console.log('Image found in subdir:', subPath);
            break;
          }
        }
      }
    }
    
    // Check if file exists after all attempts
    if (fs.existsSync(imagePath)) {
      console.log('Image found, serving from:', imagePath);
      return res.sendFile(imagePath);
    } else {
      console.log('Image not found after all attempts');
      return res.status(404).json({ 
        success: false,
        message: 'Image not found' 
      });
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error retrieving image',
      error: error.message 
    });
  }
};

module.exports = {
  uploadProfileImage,
  getImage
}; 