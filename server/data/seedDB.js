const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const attractionsData = require('./attractionsData');
const Attraction = require('../models/Attraction');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odisha-tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'.cyan.underline))
.catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`.red.bold);
  process.exit(1);
});

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await Attraction.deleteMany({});
    
    console.log('Existing attraction data cleared'.yellow);
    
    // Insert new data
    const createdAttractions = await Attraction.insertMany(attractionsData);
    
    console.log(`${createdAttractions.length} attractions imported`.green.inverse);
    
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    // Clear data
    await Attraction.deleteMany({});
    
    console.log('All attraction data destroyed'.red.inverse);
    
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 