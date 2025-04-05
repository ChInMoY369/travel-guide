const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import all models to ensure they're registered
const models = require('./models');

// Initialize express
const app = express();

// Get allowed origins from environment variables with fallbacks
const frontendUrl = process.env.FRONTEND_URL ;
const allowedOrigins = [frontendUrl];

console.log('Allowed CORS origins:', allowedOrigins);

// Middleware
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const userRoutes = require('./routes/userRoutes');
const attractionRoutes = require('./routes/attractionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const culturalInsightRoutes = require('./routes/culturalInsightRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const imageRoutes = require('./routes/imageRoutes');
const sectionsRoutes = require('./routes/sections');

// Import the reminder scheduler
const { startReminderScheduler } = require('./services/reminderScheduler');

// Import Attraction model from our models index
const { Attraction } = models;

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/cultural-insights', culturalInsightRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/sections', sectionsRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder - adjust path based on your deployment structure
  // For deployment where frontend/client/build or frontend/client/dist is relative to the server
  const clientBuildPath = path.resolve(__dirname, '../../frontend/client/dist');
  console.log('Serving static files from:', clientBuildPath);
  
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

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

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the reminder scheduler (check every hour)
  // In production, you might want to use a more robust scheduling
  // solution like node-cron, agenda, or bull
  const schedulerInterval = process.env.REMINDER_CHECK_INTERVAL 
    ? parseInt(process.env.REMINDER_CHECK_INTERVAL) * 1000
    : 60 * 60 * 1000; // Default: 1 hour in milliseconds
  
  startReminderScheduler(schedulerInterval);
}); 