const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    console.log('Register endpoint hit with body:', req.body);
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine if this should be an admin user
    const role = email === 'chinmoypubg8011@gmail.com' ? 'admin' : 'user';
    if (role === 'admin') {
      console.log('Creating new admin user for email:', email);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      preferences: {
        interests: [],
        favoriteAttractions: [],
        mockFavorites: []
      }
    });

    if (user) {
      console.log('User created successfully:', user._id.toString());
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    console.log('Login endpoint hit with body:', req.body);
    
    if (!req.body.email || !req.body.password) {
      console.log('Missing required fields in login request');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? `Found user with ID ${user._id}` : 'No user found with email ' + email);

    if (!user) {
      console.log('Authentication failed: User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password field exists in user document
    if (!user.password) {
      console.error('User has no password field!', user);
      return res.status(500).json({ message: 'User account is not properly configured' });
    }

    // Check password
    try {
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        console.log('Authentication failed: Password incorrect');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // For specific email, ensure admin role is set
      if (email === 'chinmoypubg8011@gmail.com' && user.role !== 'admin') {
        console.log('Setting admin role for designated admin email:', email);
        user.role = 'admin';
        await user.save();
      }

      // Generate token
      const token = generateToken(user._id);
      if (!token) {
        console.error('Failed to generate authentication token');
        return res.status(500).json({ message: 'Failed to create authentication token' });
      }
      
      console.log('Generated token for user:', user._id.toString());
      
      // Send the response
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      });
    } catch (passwordError) {
      console.error('Error comparing password:', passwordError);
      return res.status(500).json({ message: 'Error validating credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        preferences: user.preferences,
        profilePicture: user.profilePicture
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Only update profilePicture if it's provided in the request
      if (req.body.profilePicture) {
        user.profilePicture = req.body.profilePicture;
      }
      // Update bio if provided
      user.bio = req.body.bio || user.bio;
      
      // Update preferences if provided
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences
        };
      }

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        role: updatedUser.role,
        preferences: updatedUser.preferences,
        profilePicture: updatedUser.profilePicture, // Include profile picture in the response
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add attraction to favorites
 * @route   POST /api/users/favorites
 * @access  Private
 */
const addFavoriteAttraction = async (req, res) => {
  try {
    console.log('Adding to favorites:', req.body);
    const { attractionId, isMockId } = req.body;
    
    if (!attractionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Attraction ID is required' 
      });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {};
    }
    
    // Check where to store the ID based on the flag or ObjectId validation
    const shouldUseMockStorage = isMockId || !/^[0-9a-fA-F]{24}$/.test(attractionId);
    
    if (shouldUseMockStorage) {
      // Use mockFavorites for non-ObjectId values
      console.log(`Using mockFavorites storage for ID: ${attractionId}`);
      
      // Initialize mockFavorites array if it doesn't exist
      if (!user.preferences.mockFavorites) {
        user.preferences.mockFavorites = [];
      }
      
      // Check if already in mock favorites
      if (user.preferences.mockFavorites.includes(attractionId)) {
        return res.status(400).json({ 
          success: false,
          message: 'Attraction already in favorites' 
        });
      }
      
      // Add to mock favorites
      user.preferences.mockFavorites.push(attractionId);
    } else {
      // Using regular favorites for valid ObjectId values
      console.log(`Using regular favorites storage for ID: ${attractionId}`);
      
      // Initialize favoriteAttractions array if it doesn't exist
      if (!user.preferences.favoriteAttractions) {
        user.preferences.favoriteAttractions = [];
      }
      
      // Check if attraction is already in favorites
      const isAlreadyFavorite = user.preferences.favoriteAttractions.some(id => 
        id.toString() === attractionId.toString()
      );
      
      if (isAlreadyFavorite) {
        return res.status(400).json({ 
          success: false,
          message: 'Attraction already in favorites' 
        });
      }
      
      // Add to regular favorites
      user.preferences.favoriteAttractions.push(attractionId);
    }
    
    await user.save();

    console.log(`Added attraction ${attractionId} to favorites for user ${user._id}`);
    
    res.status(200).json({ 
      success: true,
      message: 'Attraction added to favorites', 
      favoriteCount: (user.preferences.favoriteAttractions?.length || 0) + 
                    (user.preferences.mockFavorites?.length || 0)
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error adding to favorites',
      error: error.message
    });
  }
};

/**
 * @desc    Remove attraction from favorites
 * @route   DELETE /api/users/favorites/:id
 * @access  Private
 */
const removeFavoriteAttraction = async (req, res) => {
  try {
    const attractionId = req.params.id;
    console.log(`Removing attraction ${attractionId} from favorites`);
    
    if (!attractionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Attraction ID is required' 
      });
    }
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if user has preferences
    if (!user.preferences) {
      return res.status(404).json({ 
        success: false,
        message: 'No favorites found for user' 
      });
    }
    
    let removed = false;
    const isCustomId = attractionId.includes('-') || !/^[0-9a-fA-F]{24}$/.test(attractionId);
    
    // Check if it's in regular favorites (MongoDB ObjectIds)
    if (!isCustomId && user.preferences.favoriteAttractions && user.preferences.favoriteAttractions.length > 0) {
      console.log('Checking regular favorites for ObjectId:', attractionId);
      const initialLength = user.preferences.favoriteAttractions.length;
      
      // Remove from regular favorites
      user.preferences.favoriteAttractions = user.preferences.favoriteAttractions.filter(
        id => id.toString() !== attractionId
      );
      
      if (user.preferences.favoriteAttractions.length < initialLength) {
        console.log('Removed from regular favorites');
        removed = true;
      }
    }
    
    // Check if it's in mock favorites (custom IDs or strings)
    if (!removed && user.preferences.mockFavorites && user.preferences.mockFavorites.length > 0) {
      console.log('Checking mock favorites for ID:', attractionId);
      const initialLength = user.preferences.mockFavorites.length;
      
      // Remove from mock favorites (exact match)
      user.preferences.mockFavorites = user.preferences.mockFavorites.filter(
        id => id.toString() !== attractionId
      );
      
      if (user.preferences.mockFavorites.length < initialLength) {
        console.log('Removed from mock favorites');
        removed = true;
      }
    }
    
    // If nothing was removed from either array
    if (!removed) {
      console.log('Attraction not found in favorites');
      return res.status(404).json({ 
        success: false,
        message: 'Attraction not found in favorites' 
      });
    }
    
    await user.save();
    console.log(`Successfully removed attraction ${attractionId} from favorites`);

    // Calculate total favorites count
    const totalFavorites = 
      (user.preferences.favoriteAttractions?.length || 0) + 
      (user.preferences.mockFavorites?.length || 0);

    res.status(200).json({ 
      success: true,
      message: 'Attraction removed from favorites', 
      favoriteCount: totalFavorites
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error removing from favorites',
      error: error.message 
    });
  }
};

/**
 * @desc    Get user favorites
 * @route   GET /api/users/favorites
 * @access  Private
 */
const getUserFavorites = async (req, res) => {
  try {
    console.log('Fetching favorites for user:', req.user._id);
    
    // Get user with populated favorite attractions
    const user = await User.findById(req.user._id)
      .populate({
        path: 'preferences.favoriteAttractions',
        select: 'name description images rating reviewCount' 
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize favorites array
    let favorites = [];
    
    // Process regular MongoDB ObjectId favorites
    if (user.preferences?.favoriteAttractions?.length > 0) {
      // Transform regular favorites
      const dbFavorites = user.preferences.favoriteAttractions.map(attraction => {
        // Get the first image or use a placeholder
        const image = attraction.images && attraction.images.length > 0 
          ? attraction.images[0] 
          : 'https://via.placeholder.com/100';
          
        return {
          id: attraction._id,
          name: attraction.name,
          image: image,
          rating: attraction.rating || 4.5,
          reviewCount: attraction.reviewCount || 0,
          type: 'db' // Flag to indicate source
        };
      });
      
      favorites = [...dbFavorites];
    }
    
    // For mock attractions (non-ObjectId favorites)
    if (user.preferences?.mockFavorites?.length > 0) {
      console.log(`User has ${user.preferences.mockFavorites.length} mock favorites`);
      
      try {
        // Import the mock data from the server's data directory
        const mockAttractions = require('../data/mockAttractions');
        console.log(`Loaded ${mockAttractions.length} mock attractions from file`);
        
        // Match favorites IDs with mock attractions data
        const mockFavorites = user.preferences.mockFavorites.map(mockId => {
          // Find the matching attraction
          const matchedAttraction = mockAttractions.find(
            attr => attr._id.toString() === mockId.toString()
          );
          
          if (matchedAttraction) {
            console.log(`Found matching mock attraction: ${matchedAttraction.name}`);
            return {
              id: matchedAttraction._id,
              name: matchedAttraction.name,
              image: matchedAttraction.images?.[0] || 'https://via.placeholder.com/100',
              rating: matchedAttraction.rating || 4.5,
              reviewCount: matchedAttraction.reviewCount || 0,
              type: 'mock' // Flag to indicate source
            };
          } else {
            console.log(`No matching mock attraction found for ID: ${mockId}`);
            
            // Handle specific known IDs that might be short or numeric
            const knownAttractions = {
              '1': 'Lingaraj Temple',
              '2': 'Konark Sun Temple',
              '3': 'Nandankanan Zoological Park',
              '4': 'Udayagiri and Khandagiri Caves',
              '5': 'Dhauli Shanti Stupa',
              '6': 'Puri Beach'
            };
            
            // Check if this is a known ID with a proper name
            if (knownAttractions[mockId]) {
              return {
                id: mockId,
                name: knownAttractions[mockId],
                image: 'https://via.placeholder.com/100',
                rating: 4.5,
                reviewCount: 100,
                type: 'mock'
              };
            }
            
            // For IDs that don't match our predefined mockAttractions,
            // Extract just the name part by removing "Attraction" prefix
            // Convert dash-case to readable text (e.g., "ananta-vasudeva-temple" → "Ananta Vasudeva Temple")
            let cleanName = mockId;
            
            // If the ID starts with "Attraction", remove it
            if (mockId.startsWith('Attraction ')) {
              cleanName = mockId.substring(11);
            }
            
            // If it's dash-separated, convert to title case with spaces
            if (cleanName.includes('-')) {
              cleanName = cleanName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
            
            return {
              id: mockId,
              name: cleanName,
              image: 'https://via.placeholder.com/100',
              rating: 4.5,
              reviewCount: 100,
              type: 'mock' // Flag to indicate source
            };
          }
        }).filter(item => item !== null); // Remove null items (not found)
        
        // Add valid mock favorites to the main favorites array
        favorites = [...favorites, ...mockFavorites];
      } catch (err) {
        console.error('Error processing mock favorites:', err);
        
        // Fallback approach for mock favorites
        const mockFavorites = user.preferences.mockFavorites.map(id => {
          // Handle specific known IDs that might be short or numeric
          const knownAttractions = {
            '1': 'Lingaraj Temple',
            '2': 'Konark Sun Temple',
            '3': 'Nandankanan Zoological Park',
            '4': 'Udayagiri and Khandagiri Caves',
            '5': 'Dhauli Shanti Stupa',
            '6': 'Puri Beach'
          };
          
          // Check if this is a known ID with a proper name
          if (knownAttractions[id]) {
            return {
              id: id,
              name: knownAttractions[id],
              image: 'https://via.placeholder.com/100',
              rating: 4.5,
              reviewCount: 100,
              type: 'mock'
            };
          }
          
          // Clean up attraction name by removing "Attraction" prefix
          // and converting dash-case to readable text
          let cleanName = id;
          
          // If the ID starts with "Attraction", remove it
          if (id.startsWith('Attraction ')) {
            cleanName = id.substring(11);
          }
          
          // If it's dash-separated, convert to title case with spaces
          if (cleanName.includes('-')) {
            cleanName = cleanName.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
          
          return {
            id: id,
            name: cleanName,
            image: 'https://via.placeholder.com/100',
            rating: 4.5,
            reviewCount: 100,
            type: 'mock' // Flag to indicate source
          };
        });
        
        favorites = [...favorites, ...mockFavorites];
      }
    }
    
    console.log(`Returning ${favorites.length} favorites`);
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching favorites',
      error: error.message
    });
  }
};

/**
 * @desc    Get user visit history
 * @route   GET /api/users/visits
 * @access  Private
 */
const getUserVisitHistory = async (req, res) => {
  try {
    // Assuming we have a Visit model or similar
    // If no Visit model exists, this is a placeholder for future implementation
    const visits = [];
    
    res.status(200).json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a visit record
 * @route   POST /api/users/visits
 * @access  Private
 */
const addVisitRecord = async (req, res) => {
  try {
    const { attractionId } = req.body;
    
    // Placeholder for future implementation
    // Would create a new visit record in the database
    
    res.status(201).json({ message: 'Visit recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Check if the logged-in user has admin privileges
 * @route   GET /api/users/check-admin
 * @access  Private
 */
const checkAdminStatus = async (req, res) => {
  try {
    // The user is available from the auth middleware (req.user)
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has admin role
    const isAdmin = user.role === 'admin';
    
    res.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addFavoriteAttraction,
  removeFavoriteAttraction,
  getUserFavorites,
  getUserVisitHistory,
  addVisitRecord,
  checkAdminStatus
}; 