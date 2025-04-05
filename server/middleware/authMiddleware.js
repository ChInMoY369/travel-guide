const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware to check if user is an admin
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found' });
  }

  // Only allow admin access for specific email
  if (req.user.email === 'chinmoypubg8011@gmail.com') {
    console.log('Admin access granted to:', req.user.email);
    next();
    return;
  }

  // Check if user has admin role as fallback
  if (req.user.role === 'admin') {
    console.log('Admin access granted to user with admin role:', req.user.email);
    next();
    return;
  }

  // Deny access for all other users
  console.log('Admin access denied for:', req.user.email);
  res.status(403).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, admin }; 