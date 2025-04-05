const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cuisine: {
    type: [String],
    required: true
  },
  specialties: [String],
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'expensive', 'luxury'],
    required: true
  },
  images: [String],
  contactInfo: {
    phone: String,
    email: String,
    website: String
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
  features: {
    vegetarianOptions: {
      type: Boolean,
      default: false
    },
    veganOptions: {
      type: Boolean,
      default: false
    },
    outdoorSeating: {
      type: Boolean,
      default: false
    },
    wifi: {
      type: Boolean,
      default: false
    },
    takeaway: {
      type: Boolean,
      default: false
    },
    delivery: {
      type: Boolean,
      default: false
    }
  },
  nearbyAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction'
  }]
}, {
  timestamps: true
});

// Calculate average rating when reviews are modified
restaurantSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant; 