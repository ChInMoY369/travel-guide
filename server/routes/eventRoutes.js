const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const eventReminderController = require('../controllers/eventReminderController');

// Event Reminder Routes
router.post('/reminders', eventReminderController.createEventReminder);
router.get('/reminders', protect, eventReminderController.getUserReminders);
router.get('/:eventId/reminders', eventReminderController.getEventReminders);
router.delete('/reminders/:id', protect, eventReminderController.deleteReminder);

// TODO: Add routes for future CRUD operations on events themselves

module.exports = router; 