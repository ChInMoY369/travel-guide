const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not defined!');
      console.error('Please make sure your .env file contains the MongoDB connection string.');
      process.exit(1);
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      connectTimeoutMS: 10000 // 10 seconds for connection timeout
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Connected to database: ${conn.connection.name}`);
    
    // Test connection with a simple query
    try {
      const collectionsCount = await mongoose.connection.db.listCollections().toArray();
      console.log(`Available collections: ${collectionsCount.length}`);
      
      // Check if collections exist, if not log a helpful message
      if (collectionsCount.length === 0) {
        console.log('No collections found in the database. This may be expected if this is a new database.');
      }
    } catch (testQueryError) {
      console.error('Error running test query on database:', testQueryError.message);
      // Don't exit process for test query errors, but log them
    }
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Check your connection string and ensure your MongoDB server is running.');
      console.error('If using Atlas, check your network connection and whitelist your IP address.');
    }
    
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format. Please check your MONGODB_URI in the .env file.');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.error('MongoDB authentication failed. Check your username and password in the connection string.');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 