const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (cachedConnection) {
    console.log('Using existing MongoDB connection');
    return cachedConnection;
  }

  try {
    // Check if MongoDB URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not defined!');
      console.error('Please make sure your .env file contains the MongoDB connection string.');
      throw new Error('MongoDB URI is not defined');
    }
    
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string first few characters: ${process.env.MONGODB_URI.substring(0, 20)}...`);
    
    // Try to connect with increased timeouts for Render's environment
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
      connectTimeoutMS: 30000, // 30 seconds for connection timeout
      socketTimeoutMS: 45000, // 45 seconds for socket operations
      // These settings help with serverless environments
      bufferCommands: false, 
      maxPoolSize: 10
    });
    
    // Cache the connection
    cachedConnection = conn;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Connected to database: ${conn.connection.name}`);
    
    // Safely test connection with a simple query and better error handling
    try {
      // First check if db object exists
      if (!mongoose.connection || !mongoose.connection.db) {
        console.warn('Database object not available yet, skipping collection check');
        return conn;
      }
      
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`Available collections: ${collections.length}`);
      
      // Check if collections exist, if not log a helpful message
      if (collections.length === 0) {
        console.log('No collections found in the database. This may be expected if this is a new database.');
      } else {
        // Log collection names for debugging
        console.log('Collections:', collections.map(c => c.name).join(', '));
      }
    } catch (testQueryError) {
      console.error('Error running test query on database:', testQueryError.message);
      console.error('This error is non-fatal, continuing with connection');
      // Don't exit for test query errors, just log them
    }
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Check your connection string and ensure your MongoDB server is running.');
      console.error('If using Atlas, check your network connection and whitelist your IP address.');
      console.error('For Render deployments, you need to add the Render IP addresses to MongoDB Atlas Network Access list.');
    }
    
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format. Please check your MONGODB_URI in the .env file.');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.error('MongoDB authentication failed. Check your username and password in the connection string.');
    }
    
    // Return the error instead of exiting the process
    throw error;
  }
};

module.exports = connectDB; 