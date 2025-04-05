const EventReminder = require('../models/EventReminder');
const { sendEventReminder } = require('../services/emailService');

/**
 * Create a new event reminder
 * @route POST /api/events/reminders
 * @access Public
 */
const createEventReminder = async (req, res) => {
  try {
    const { 
      eventId, 
      eventName, 
      eventDate, 
      contactEmail, 
      contactPhone, 
      reminderType, 
      reminderAdvanceDays 
    } = req.body;
    
    // Validate required fields
    if (!eventId || !eventName || !eventDate || !contactEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields for event reminder' 
      });
    }
    
    // Check if an email reminder already exists for this event and email
    const existingReminder = await EventReminder.findOne({
      eventId,
      contactEmail,
      reminderSent: false
    });
    
    if (existingReminder) {
      return res.status(400).json({
        success: false,
        message: 'A reminder for this event is already set for this email address'
      });
    }
    
    // Create a new reminder
    const reminder = new EventReminder({
      eventId,
      eventName,
      eventDate: new Date(eventDate),
      contactEmail,
      contactPhone: contactPhone || '',
      reminderType: reminderType || 'email',
      reminderAdvanceDays: reminderAdvanceDays || 1,
      // If user is authenticated, associate the reminder with their account
      ...(req.user?._id && { userId: req.user._id })
    });
    
    // Save the reminder
    await reminder.save();
    
    // Send a confirmation email
    try {
      await sendEventReminder({
        to: contactEmail,
        subject: 'Event Reminder Confirmation',
        eventName,
        eventDate: new Date(eventDate),
        eventLocation: 'Event Location', // This would come from the event data
        eventDescription: `You've set up a reminder for this event. You'll receive another notification ${reminder.reminderAdvanceDays} day(s) before the event.`
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // We don't fail the request if just the confirmation email fails
    }
    
    res.status(201).json({
      success: true,
      data: reminder,
      message: 'Event reminder set successfully'
    });
  } catch (error) {
    console.error('Error creating event reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set event reminder',
      error: error.message
    });
  }
};

/**
 * Get reminders for a user (if authenticated)
 * @route GET /api/events/reminders
 * @access Private
 */
const getUserReminders = async (req, res) => {
  try {
    // This route should be protected by auth middleware
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const reminders = await EventReminder.find({ userId: req.user._id }).sort({ eventDate: 1 });
    
    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reminders',
      error: error.message
    });
  }
};

/**
 * Get reminders for a specific event by email (public access)
 * @route GET /api/events/:eventId/reminders
 * @access Public
 */
const getEventReminders = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.query;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }
    
    // If email is provided, get reminders for that email only
    // Otherwise, get all reminders for the event (for admin purposes)
    const query = { eventId };
    if (email) {
      query.contactEmail = email;
    } else if (!req.user?.isAdmin) {
      // If not admin and no email provided, require authentication
      return res.status(401).json({
        success: false,
        message: 'Email parameter is required or authentication as admin'
      });
    }
    
    const reminders = await EventReminder.find(query);
    
    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching event reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event reminders',
      error: error.message
    });
  }
};

/**
 * Delete a reminder
 * @route DELETE /api/events/reminders/:id
 * @access Private
 */
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await EventReminder.findById(id);
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }
    
    // Check if the user owns this reminder or is an admin
    if (reminder.userId && reminder.userId.toString() !== req.user?._id.toString() && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reminder'
      });
    }
    
    await reminder.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reminder',
      error: error.message
    });
  }
};

module.exports = {
  createEventReminder,
  getUserReminders,
  getEventReminders,
  deleteReminder
}; 