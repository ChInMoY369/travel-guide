const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configure email transporter
// For production, you would use real SMTP credentials
// For development, we'll use ethereal.email (fake SMTP service)
let transporter;

const setupTransporter = async () => {
  // If we already have a transporter, return it
  if (transporter) return transporter;
  
  // Check if we have SMTP credentials in environment variables
  if (
    process.env.SMTP_HOST && 
    process.env.SMTP_PORT && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS
  ) {
    // Create a transporter with real SMTP credentials
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('Email service configured with SMTP credentials');
    return transporter;
  } else {
    // Create a test account on ethereal.email for development
    console.log('No SMTP credentials found. Creating test account on ethereal.email...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Test email account created successfully');
      console.log('Email preview URL will be provided after sending');
      
      return transporter;
    } catch (error) {
      console.error('Failed to create test email account:', error);
      throw error;
    }
  }
};

/**
 * Send email reminder for an event
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.eventName - Name of the event
 * @param {Date} options.eventDate - Date of the event
 * @param {string} options.eventLocation - Location of the event
 * @param {string} options.eventDescription - Description of the event
 * @returns {Promise<Object>} - Nodemailer send response
 */
const sendEventReminder = async (options) => {
  try {
    await setupTransporter();
    
    const { to, subject, eventName, eventDate, eventLocation, eventDescription } = options;
    
    // Format the date nicely
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Format the time nicely
    const formattedTime = new Date(eventDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Create email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Event Reminder: ${eventName}</h2>
        <p>This is a friendly reminder that you've set a reminder for the following event:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #333;">${eventName}</h3>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
          <p><strong>Description:</strong> ${eventDescription}</p>
        </div>
        
        <p>We look forward to seeing you at the event!</p>
        <p>Regards,<br>Odisha Tourism</p>
        
        <div style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          <p>This is an automated reminder email. Please do not reply to this message.</p>
        </div>
      </div>
    `;
    
    // Send the email
    const info = await transporter.sendMail({
      from: '"Odisha Tourism" <events@odishatourism.com>',
      to,
      subject: subject || `Reminder: ${eventName} on ${formattedDate}`,
      html,
    });
    
    console.log('Event reminder email sent:', info.messageId);
    
    // If using ethereal.email, log the URL where the email can be previewed
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Failed to send event reminder email:', error);
    throw error;
  }
};

module.exports = {
  sendEventReminder,
}; 