const EventReminder = require('../models/EventReminder');
const { sendEventReminder } = require('./emailService');

/**
 * Checks for reminders that are due to be sent and processes them
 */
const processReminders = async () => {
  try {
    console.log('Checking for event reminders to send...');
    
    // Find all reminders that haven't been sent yet and are due
    // We'll use the mongoose query directly rather than the virtual property
    // to optimize the database query
    const now = new Date();
    const reminders = await EventReminder.find({
      reminderSent: false,
      eventDate: { $gt: now } // Event date is in the future
    });
    
    // Filter for reminders that are due using the virtual property
    const dueReminders = reminders.filter(reminder => reminder.isDue);
    
    console.log(`Found ${dueReminders.length} reminders to send`);
    
    // Process each reminder
    for (const reminder of dueReminders) {
      try {
        console.log(`Sending reminder for event: ${reminder.eventName} to ${reminder.contactEmail}`);
        
        // Send email reminder
        if (reminder.reminderType === 'email' || reminder.reminderType === 'both') {
          await sendEventReminder({
            to: reminder.contactEmail,
            eventName: reminder.eventName,
            eventDate: reminder.eventDate,
            eventLocation: 'Event Location', // Add location to the model or fetch from events
            eventDescription: 'Event Description', // Add description to the model or fetch from events
          });
        }
        
        // TODO: Handle SMS notifications if needed
        if (reminder.reminderType === 'sms' || reminder.reminderType === 'both') {
          // This would integrate with an SMS service
          console.log(`SMS reminder would be sent to ${reminder.contactPhone}`);
        }
        
        // Mark the reminder as sent
        reminder.reminderSent = true;
        await reminder.save();
        
        console.log(`Reminder for event "${reminder.eventName}" sent successfully`);
      } catch (error) {
        console.error(`Failed to process reminder ${reminder._id} for event "${reminder.eventName}":`, error);
        // We don't rethrow the error here to allow other reminders to be processed
      }
    }
    
    return {
      success: true,
      processed: dueReminders.length
    };
  } catch (error) {
    console.error('Error processing reminders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Starts the reminder scheduler
 * @param {number} interval - Check interval in milliseconds (default: 1 hour)
 */
const startReminderScheduler = (interval = 60 * 60 * 1000) => {
  console.log(`Starting reminder scheduler with interval of ${interval / 1000} seconds`);
  
  // Process reminders immediately on startup
  processReminders().catch(err => console.error('Error in initial reminder processing:', err));
  
  // Schedule regular checks
  const schedulerId = setInterval(async () => {
    try {
      await processReminders();
    } catch (error) {
      console.error('Unhandled error in reminder scheduler:', error);
    }
  }, interval);
  
  return schedulerId;
};

/**
 * Stops the reminder scheduler
 * @param {number} schedulerId - ID returned by startReminderScheduler
 */
const stopReminderScheduler = (schedulerId) => {
  if (schedulerId) {
    clearInterval(schedulerId);
    console.log('Reminder scheduler stopped');
  }
};

module.exports = {
  processReminders,
  startReminderScheduler,
  stopReminderScheduler
}; 