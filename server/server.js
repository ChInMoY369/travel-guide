const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Get allowed origins from environment variables with fallbacks
const frontendUrl = process.env.FRONTEND_URL || '*';
const allowedOrigins = frontendUrl === '*' ? '*' : [frontendUrl];

console.log('Allowed CORS origins:', allowedOrigins);

// Middleware
app.use(express.json());

// Configure CORS properly
if (allowedOrigins === '*') {
  app.use(cors());
} else {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
}

// Handle preflight requests for all routes
app.options('*', cors());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Database connection middleware that ensures connection on every request
app.use(async (req, res, next) => {
  try {
    // Only connect to database if we're not on an OPTIONS request
    if (req.method !== 'OPTIONS') {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: process.env.NODE_ENV === 'production' ? 'Server error' : error.message 
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import all models to ensure they're registered
try {
  const models = require('./models');
  // Import Attraction model from our models index
  const { Attraction } = models;

  // Import routes
  const userRoutes = require('./routes/userRoutes');
  const attractionRoutes = require('./routes/attractionRoutes');
  const recommendationRoutes = require('./routes/recommendationRoutes');
  const eventRoutes = require('./routes/eventRoutes');
  const culturalInsightRoutes = require('./routes/culturalInsightRoutes');
  const weatherRoutes = require('./routes/weatherRoutes');
  const imageRoutes = require('./routes/imageRoutes');
  const sectionsRoutes = require('./routes/sections');

  // Use routes
  app.use('/api/users', userRoutes);
  app.use('/api/attractions', attractionRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/cultural-insights', culturalInsightRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/sections', sectionsRoutes);

  // Add a diagnostic route for checking database connection
  app.get('/api/diagnostic', async (req, res) => {
    try {
      console.log('Diagnostic endpoint called');
      
      // Check MongoDB connection
      const dbStatus = mongoose.connection.readyState;
      const dbStatusText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      }[dbStatus] || 'unknown';
      
      console.log(`Database connection status: ${dbStatusText} (${dbStatus})`);
      
      // Count attractions in database
      const attractionCount = await Attraction.countDocuments();
      console.log(`Found ${attractionCount} attractions in database`);
      
      // Get a sample of attractions
      const attractions = await Attraction.find().limit(5).select('_id name type');
      console.log('Sample attractions:', attractions);
      
      // Return diagnostic information
      res.json({
        serverStatus: 'online',
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: dbStatusText,
          statusCode: dbStatus,
          connectionString: process.env.MONGODB_URI ? 
            process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:***@') : 
            'Not configured',
          name: mongoose.connection.name || 'Not connected'
        },
        collections: {
          attractions: {
            count: attractionCount,
            sample: attractions
          }
        }
      });
    } catch (error) {
      console.error('Diagnostic endpoint error:', error);
      res.status(500).json({
        serverStatus: 'error',
        error: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
      });
    }
  });
} catch (error) {
  console.error('Error setting up routes:', error);
  app.use('/api', (req, res) => {
    res.status(500).json({ error: 'API setup failed', details: error.message });
  });
}

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Define port
const PORT = process.env.PORT || 5000;

// For local development, start the server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Import the reminder scheduler
    try {
      const { startReminderScheduler } = require('./services/reminderScheduler');
      // Start the reminder scheduler (check every hour)
      const schedulerInterval = process.env.REMINDER_CHECK_INTERVAL 
        ? parseInt(process.env.REMINDER_CHECK_INTERVAL) * 1000
        : 60 * 60 * 1000; // Default: 1 hour in milliseconds
      
      startReminderScheduler(schedulerInterval);
    } catch (error) {
      console.error('Failed to start reminder scheduler:', error);
    }
  });
} else {
  // For Vercel environment, just log
  console.log('Running in Vercel environment');
}

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Server error', 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
  });
});

// Export the Express app for Vercel serverless deployment
module.exports = app; 