// Import and register all models in one place
// This ensures that all models are properly initialized before being used

const Attraction = require('./Attraction');
const Restaurant = require('./Restaurant');
const User = require('./User');
const EventReminder = require('./EventReminder');
const Hotel = require('./Hotel');
const CulturalInsight = require('./CulturalInsight');

// Export all models
module.exports = {
  Attraction,
  Restaurant,
  User,
  EventReminder,
  Hotel,
  CulturalInsight
}; 