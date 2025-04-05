const mongoose = require('mongoose');

const eventReminderSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  userId: {
    // If the user is logged in
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  contactPhone: {
    type: String,
    // Not making it required since users might prefer email only
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderType: {
    type: String,
    enum: ['email', 'sms', 'both'],
    default: 'email'
  },
  // When to send the reminder (1 day before, 2 days before, etc.)
  reminderAdvanceDays: {
    type: Number,
    default: 1,
    min: 0,
    max: 14 // Maximum 2 weeks in advance
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate the date when reminder should be sent
eventReminderSchema.virtual('reminderDate').get(function() {
  const reminderDate = new Date(this.eventDate);
  reminderDate.setDate(reminderDate.getDate() - this.reminderAdvanceDays);
  return reminderDate;
});

// Check if reminder is due to be sent
eventReminderSchema.virtual('isDue').get(function() {
  const now = new Date();
  const reminderDate = this.reminderDate;
  
  // The reminder is due if:
  // 1. It hasn't been sent yet
  // 2. The reminder date is today or has passed
  // 3. The event date is in the future (don't send reminders for past events)
  return (
    !this.reminderSent &&
    reminderDate <= now &&
    this.eventDate > now
  );
});

// Enable virtuals in JSON
eventReminderSchema.set('toJSON', { virtuals: true });
eventReminderSchema.set('toObject', { virtuals: true });

const EventReminder = mongoose.model('EventReminder', eventReminderSchema);

module.exports = EventReminder; 