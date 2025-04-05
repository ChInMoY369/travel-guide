const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['festival', 'cultural', 'workshop', 'exhibition', 'performance', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    venue: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [String],
  entryFee: {
    isFree: {
      type: Boolean,
      default: false
    },
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  organizer: {
    name: String,
    contact: String,
    website: String
  },
  culturalSignificance: String,
  tags: [String],
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.startDate;
});

// Virtual for checking if event is ongoing
eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Enable virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 