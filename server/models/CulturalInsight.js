const mongoose = require('mongoose');

const culturalInsightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imageGallery: {
    type: [String],
    default: []
  },
  topic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  insight: {
    type: String,
    required: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving
culturalInsightSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CulturalInsight', culturalInsightSchema); 