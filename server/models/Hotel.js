const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
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
  priceRange: {
    type: String,
    enum: ['budget', 'economy', 'mid-range', 'luxury', 'ultra-luxury'],
    required: true
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'pool', 'gym', 'restaurant', 
      'room-service', 'spa', 'air-conditioning', 'bar',
      'conference-room', 'laundry', 'pet-friendly'
    ]
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
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
  nearbyAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction'
  }]
}, {
  timestamps: true
});

// Calculate average rating when reviews are modified
hotelSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 