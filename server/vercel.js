// Special entry point for Vercel serverless deployment
const app = require('./server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.production' });

// Log deployment settings
console.log('Vercel serverless deployment initiated');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
console.log(`MongoDB URI configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);

// Export the serverless function
module.exports = app; 