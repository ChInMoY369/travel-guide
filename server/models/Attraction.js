const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['temple', 'museum', 'park', 'monument', 'lake', 'market', 'other']
  },
  description: {
    type: String,
    default: ''
  },
  aiDescription: {
    type: String,
    default: ''
  },
  overview: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [String],
  virtualTour: {
    available: {
      type: Boolean,
      default: false
    },
    tourUrl: String
  },
  culturalSignificance: String,
  bestTimeToVisit: String,
  entryFee: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  tags: [String],
  keySignificance: {
    type: [String],
    default: []
  },
  mainAttractions: {
    type: [String],
    default: []
  },
  famousFor: {
    type: [String],
    default: []
  },
  educationalValue: {
    type: [String],
    default: []
  },
  visitorTips: [{
    title: String,
    content: String,
    category: {
      type: String,
      enum: ['general', 'safety', 'best-practices', 'local-customs', 'photography', 'other'],
      default: 'general'
    }
  }],
  nearbyRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  nearbyHotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  nearbyAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction'
  }],
  layout: {
    type: Array,
    default: []
  },
  templateType: {
    type: String,
    enum: ['standard', 'tabbed'],
    default: 'standard'
  },
  facilities: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Calculate average rating when reviews are modified
attractionSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction; 