// Special entry point for Vercel serverless deployment
const app = require('./server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (try both default and production)
try {
  // First try loading from .env.production
  dotenv.config({ path: '.env.production' });
} catch (error) {
  console.log('No .env.production file found, falling back to default .env');
  // If that fails, try the default .env file
  dotenv.config();
}

// Vercel already has environment variables set from vercel.json
console.log('Vercel serverless deployment initiated');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}`);
console.log(`MongoDB URI configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);

// Log additional debugging information
console.log('Available environment variables:', Object.keys(process.env).filter(key => 
  !key.includes('TOKEN') && 
  !key.includes('SECRET') && 
  !key.includes('PASSWORD') && 
  !key.includes('PASS')
).join(', '));

// Export the serverless function
module.exports = app; 