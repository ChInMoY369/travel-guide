import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  CalendarMonth, 
  LocationOn, 
  AccessTime, 
  Close, 
  Event, 
  Share, 
  Notifications, 
  NotificationsActive,
  ArrowForward
} from '@mui/icons-material';
import { setEventReminder, deleteEventReminder } from '../utils/api';

const upcomingEvents = [
  {
    id: '1',
    name: 'Rath Yatra 2025',
    description: 'The annual chariot festival of Lord Jagannath, one of the most important festivals in Odisha.',
    longDescription: 'Rath Yatra, also known as the Chariot Festival, is a grand Hindu festival associated with Lord Jagannath held at Puri in the state of Odisha. It is one of the oldest and grandest festivals celebrated in India with thousands of devotees congregating to see Lord Jagannath, Lord Balabhadra, and Devi Subhadra being brought out of the temple and placed in their respective chariots. The massive wooden chariots are pulled through the streets by devotees, symbolizing Lord Jagannath\'s annual visit to his birthplace and his aunt\'s temple. This festival is not just a religious event but also a cultural spectacle that attracts tourists from all over the world.',
    date: 'June 26, 2025',
    time: '8:00 AM - 8:00 PM',
    location: 'Puri, Odisha',
    venueDetails: 'Grand Road (Bada Danda), Puri, Odisha 752001',
    image: 'https://www.daiwikhotels.com/wp-content/uploads/2024/07/The-Rathyatra-2.jpeg',
    category: 'Festival',
    contact: 'Jagannath Temple Administration, Puri',
    phone: '+91-6752-223002',
    website: 'https://jagannath.nic.in',
    isFree: true,
    requiresRegistration: false
  },
  {
    id: '2',
    name: 'Konark Dance Festival',
    description: 'Annual classical dance festival showcasing various classical dance forms of India.',
    longDescription: 'The Konark Dance Festival is a five-day cultural extravaganza held annually against the backdrop of the magnificent Sun Temple in Konark. This festival celebrates classical Indian dance forms including Odissi, Bharatanatyam, Manipuri, Kathak, and Kathakali performed by renowned dancers and troupes from across India. The festival not only showcases the rich cultural heritage of India but also promotes tourism in Odisha. The open-air auditorium with the 13th-century temple as the backdrop creates a mesmerizing environment for the performances. The festival is organized by Odisha Tourism and Eastern Zonal Cultural Centre.',
    date: 'December 1-5, 2024',
    time: '6:00 PM - 9:00 PM',
    location: 'Konark Sun Temple, Odisha',
    venueDetails: 'Open Air Auditorium, Konark Sun Temple Complex, Konark, Odisha 752111',
    image: 'https://images.wanderon.in/blogs/new/2024/11/konark-dance-music-festival.jpg',
    category: 'Cultural',
    contact: 'Department of Tourism, Government of Odisha',
    phone: '+91-674-2432177',
    website: 'https://odishatourism.gov.in',
    isFree: false,
    requiresRegistration: true,
    ticketPrice: '₹500 - ₹2000'
  },
  {
    id: '3',
    name: 'Odisha State Handicrafts Exhibition',
    description: 'Exhibition showcasing the rich handicrafts tradition of Odisha.',
    longDescription: 'The Odisha State Handicrafts Exhibition is a major event that showcases the traditional handicrafts of Odisha. The exhibition features a wide range of handicrafts including Pattachitra paintings, stone carvings, brass and bell metal crafts, silver filigree work, bamboo crafts, and the famous Sambalpuri textiles. Artisans from across the state gather to display their craftsmanship and also conduct live demonstrations and workshops. This exhibition provides an excellent opportunity for visitors to appreciate the rich artistic heritage of Odisha and also purchase authentic handicrafts directly from the artisans.',
    date: 'August 15-30, 2024',
    time: '10:00 AM - 8:00 PM',
    location: 'Exhibition Ground, Bhubaneswar',
    venueDetails: 'Exhibition Ground, Unit-3, Bhubaneswar, Odisha 751001',
    image: 'https://www.thestatesman.com/wp-content/uploads/2022/11/odisha-1.jpg',
    category: 'Exhibition',
    contact: 'Odisha State Handicrafts Development Corporation',
    phone: '+91-674-2536193',
    website: 'https://odishacraft.com',
    isFree: true,
    requiresRegistration: false
  },
  {
    id: '4',
    name: 'International Sand Art Festival',
    description: 'Annual sand art festival featuring artists from around the world.',
    longDescription: 'The International Sand Art Festival is a unique event held at the Chandrabhaga Beach in Konark, coinciding with the Konark Dance Festival. This festival brings together sand artists from India and around the world to create stunning sculptures using just sand and water. The artworks typically reflect themes related to culture, mythology, social issues, and environmental awareness. The festival has grown in popularity over the years and has become a platform for sand artists to showcase their creativity and skill. Visitors can watch the artists at work and witness the transformation of simple sand into magnificent works of art.',
    date: 'December 1-5, 2024',
    time: 'All Day',
    location: 'Chandrabhaga Beach, Konark',
    venueDetails: 'Chandrabhaga Beach, Konark, Puri District, Odisha 752111',
    image: 'https://jollymiles.com/wp-content/uploads/2020/11/ab56f-img_3121a.jpg?w=1024',
    category: 'Art',
    contact: 'Department of Tourism, Government of Odisha',
    phone: '+91-674-2432177',
    website: 'https://odishatourism.gov.in',
    isFree: true,
    requiresRegistration: false
  }
];

const EventsPage = () => {
  const [eventDialog, setEventDialog] = useState({
    open: false,
    event: null
  });
  
  const [registerDialog, setRegisterDialog] = useState({
    open: false,
    event: null
  });
  
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    numTickets: 1
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const [remindedEvents, setRemindedEvents] = useState([]);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeEmailError, setSubscribeEmailError] = useState('');
  
  const [reminderDialog, setReminderDialog] = useState({
    open: false,
    event: null
  });
  
  const [reminderForm, setReminderForm] = useState({
    email: '',
    phone: '',
    advanceDays: 1,
    notificationType: 'email' // 'email', 'sms', or 'both'
  });
  
  const [reminderFormErrors, setReminderFormErrors] = useState({});
  
  const handleViewEvent = (event) => {
    setEventDialog({
      open: true,
      event: event
    });
  };
  
  const handleCloseEventDialog = () => {
    setEventDialog({
      ...eventDialog,
      open: false
    });
  };
  
  const handleRegisterEvent = (event) => {
    setRegisterDialog({
      open: true,
      event: event
    });
    setEventDialog({
      ...eventDialog,
      open: false
    });
    
    // Reset form
    setRegistrationForm({
      name: '',
      email: '',
      phone: '',
      numTickets: 1
    });
    setFormErrors({});
  };
  
  const handleCloseRegisterDialog = () => {
    setRegisterDialog({
      ...registerDialog,
      open: false
    });
  };
  
  const handleRegistrationInput = (e) => {
    const { name, value } = e.target;
    setRegistrationForm({
      ...registrationForm,
      [name]: value
    });
    
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!registrationForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!registrationForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (registrationForm.phone && !/^\d{10}$/.test(registrationForm.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitRegistration = () => {
    if (validateForm()) {
      // In a real app, this would submit to a server
      console.log('Registration submitted:', {
        event: registerDialog.event?.name,
        ...registrationForm
      });
      
      handleCloseRegisterDialog();
      
      setSnackbar({
        open: true,
        message: `Registration successful for ${registerDialog.event?.name}!`,
        severity: 'success'
      });
    }
  };
  
  const handleOpenReminderDialog = (event) => {
    setReminderDialog({
      open: true,
      event: event
    });
    
    // Reset form
    setReminderForm({
      email: '',
      phone: '',
      advanceDays: 1,
      notificationType: 'email'
    });
    setReminderFormErrors({});
  };
  
  const handleCloseReminderDialog = () => {
    setReminderDialog({
      ...reminderDialog,
      open: false
    });
  };
  
  const handleReminderInput = (e) => {
    const { name, value } = e.target;
    setReminderForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (reminderFormErrors[name]) {
      setReminderFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateReminderForm = () => {
    const errors = {};
    
    if (!reminderForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(reminderForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (reminderForm.notificationType === 'sms' || reminderForm.notificationType === 'both') {
      if (!reminderForm.phone.trim()) {
        errors.phone = 'Phone number is required for SMS notifications';
      }
    }
    
    setReminderFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitReminder = async () => {
    if (validateReminderForm()) {
      try {
        const reminderData = {
          eventId: reminderDialog.event.id,
          eventName: reminderDialog.event.name,
          eventDate: reminderDialog.event.date,
          contactEmail: reminderForm.email,
          contactPhone: reminderForm.phone,
          reminderType: reminderForm.notificationType,
          reminderAdvanceDays: reminderForm.advanceDays
        };
        
        await setEventReminder(reminderData);
        
        // Add to local state for immediate UI update
        setRemindedEvents(prev => [...prev, reminderDialog.event.id]);
        
        handleCloseReminderDialog();
        
        setSnackbar({
          open: true,
          message: `Reminder set for ${reminderDialog.event.name}! We'll notify you before the event.`,
          severity: 'success'
        });
      } catch (error) {
        console.error('Error setting reminder:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to set reminder',
          severity: 'error'
        });
      }
    }
  };
  
  const toggleReminder = async (eventId) => {
    // If the event is already in remindedEvents, we need to remove it
    if (remindedEvents.includes(eventId)) {
      try {
        // In a real app, we would need to fetch the reminder ID first
        // For now, we'll just assume the toggle works on the client side
        // await deleteEventReminder(reminderId);
        
        setRemindedEvents(prev => prev.filter(id => id !== eventId));
        
        setSnackbar({
          open: true,
          message: 'Event reminder removed',
          severity: 'info'
        });
      } catch (error) {
        console.error('Error removing reminder:', error);
        setSnackbar({
          open: true,
          message: 'Failed to remove reminder',
          severity: 'error'
        });
      }
    } else {
      // Open the reminder dialog to collect email and preferences
      const event = upcomingEvents.find(e => e.id === eventId);
      if (event) {
        handleOpenReminderDialog(event);
      }
    }
  };
  
  const handleShare = (event) => {
    // In a real app, this would use the Web Share API or copy to clipboard
    navigator.clipboard.writeText(`Check out ${event.name} in Odisha on ${event.date}! ${window.location.origin}/events/${event.id}`)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Event link copied to clipboard!',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setSnackbar({
          open: true,
          message: 'Failed to copy event link',
          severity: 'error'
        });
      });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const handleOpenSubscribeDialog = () => {
    setSubscribeDialogOpen(true);
  };
  
  const handleCloseSubscribeDialog = () => {
    setSubscribeDialogOpen(false);
    setSubscribeEmail('');
    setSubscribeEmailError('');
  };
  
  const handleSubscribeEmailChange = (e) => {
    setSubscribeEmail(e.target.value);
    setSubscribeEmailError('');
  };
  
  const validateSubscribeEmail = () => {
    if (!subscribeEmail.trim()) {
      setSubscribeEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(subscribeEmail)) {
      setSubscribeEmailError('Email address is invalid');
      return false;
    }
    return true;
  };
  
  const handleSubscribeSubmit = () => {
    if (validateSubscribeEmail()) {
      // In a real app, this would submit to a server
      console.log('Newsletter subscription:', subscribeEmail);
      
      handleCloseSubscribeDialog();
      
      setSnackbar({
        open: true,
        message: 'Successfully subscribed to our newsletter!',
        severity: 'success'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Events & Festivals
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Discover upcoming events, festivals, and cultural celebrations in Bhubaneswar and around Odisha.
      </Typography>
      
      <Box sx={{ mb: 6, mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://www.daiwikhotels.com/wp-content/uploads/2024/07/The-Rathyatra-2.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            borderRadius: 2,
            position: 'relative',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography variant="h4" gutterBottom>
            Rath Yatra 2025
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            The Grand Chariot Festival of Lord Jagannath
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonth sx={{ mr: 1 }} />
              <Typography>June 26, 2025</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography>Puri, Odisha</Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => handleViewEvent(upcomingEvents[0])}
            sx={{ 
              mt: 2,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 4
              }
            }}
            endIcon={<ArrowForward />}
          >
            Learn More
          </Button>
        </Paper>
      </Box>
      
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Upcoming Events
      </Typography>
      
      <Grid container spacing={4}>
        {upcomingEvents.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardMedia
                component="img"
                height="160"
                image={event.image}
                alt={event.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Chip 
                    label={event.category} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 1 }} 
                  />
                  <IconButton 
                    size="small" 
                    color={remindedEvents.includes(event.id) ? "primary" : "default"}
                    onClick={() => toggleReminder(event.id)}
                    aria-label={remindedEvents.includes(event.id) ? "Remove reminder" : "Set reminder"}
                  >
                    {remindedEvents.includes(event.id) ? <NotificationsActive fontSize="small" /> : <Notifications fontSize="small" />}
                  </IconButton>
                </Box>
                <Typography gutterBottom variant="h6" component="h3">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonth fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.time}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  onClick={() => handleViewEvent(event)}
                  startIcon={<Event />}
                >
                  Details
                </Button>
                <IconButton 
                  size="small" 
                  onClick={() => handleShare(event)}
                  aria-label="Share event"
                >
                  <Share fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 8, textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Don't Miss Any Events!
        </Typography>
        <Typography variant="body1" paragraph>
          Subscribe to our newsletter to stay updated on upcoming events and festivals.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleOpenSubscribeDialog}
          sx={{ 
            mt: 2,
            px: 4,
            py: 1,
            borderRadius: 50,
            fontWeight: 'bold',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: 4
            }
          }}
        >
          Subscribe Now
        </Button>
      </Box>
      
      {/* Subscribe Dialog */}
      <Dialog
        open={subscribeDialogOpen}
        onClose={handleCloseSubscribeDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="subscribe-dialog-title"
      >
        <DialogTitle id="subscribe-dialog-title">
          Subscribe to Our Newsletter
          <IconButton
            aria-label="close"
            onClick={handleCloseSubscribeDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Enter your email address to receive updates about upcoming events and festivals in Odisha.
          </Typography>
          <TextField
            required
            fullWidth
            id="subscribe-email"
            label="Email Address"
            type="email"
            margin="normal"
            value={subscribeEmail}
            onChange={handleSubscribeEmailChange}
            error={!!subscribeEmailError}
            helperText={subscribeEmailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubscribeDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubscribeSubmit}
          >
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Event Detail Dialog */}
      <Dialog
        open={eventDialog.open}
        onClose={handleCloseEventDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        aria-labelledby="event-detail-title"
      >
        {eventDialog.event && (
          <>
            <DialogTitle id="event-detail-title" sx={{ pr: 6 }}>
              {eventDialog.event.name}
              <IconButton
                aria-label="close"
                onClick={handleCloseEventDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img"
                    src={eventDialog.event.image}
                    alt={eventDialog.event.name}
                    sx={{ 
                      width: '100%', 
                      borderRadius: 1,
                      mb: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Chip 
                    label={eventDialog.event.category} 
                    color="primary" 
                    sx={{ mb: 2 }} 
                  />
                  
                  <Typography variant="body1" paragraph>
                    {eventDialog.event.longDescription || eventDialog.event.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Event Details
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CalendarMonth color="primary" sx={{ mr: 1, mt: 0.3 }} />
                      <Box>
                        <Typography variant="subtitle2">Date</Typography>
                        <Typography variant="body2">{eventDialog.event.date}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <AccessTime color="primary" sx={{ mr: 1, mt: 0.3 }} />
                      <Box>
                        <Typography variant="subtitle2">Time</Typography>
                        <Typography variant="body2">{eventDialog.event.time}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn color="primary" sx={{ mr: 1, mt: 0.3 }} />
                      <Box>
                        <Typography variant="subtitle2">Venue</Typography>
                        <Typography variant="body2">{eventDialog.event.venueDetails || eventDialog.event.location}</Typography>
                      </Box>
                    </Box>
                    
                    {eventDialog.event.requiresRegistration && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="primary">
                          Registration Required
                        </Typography>
                        {eventDialog.event.ticketPrice && (
                          <Typography variant="body2">
                            Ticket Price: {eventDialog.event.ticketPrice}
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {eventDialog.event.isFree && (
                      <Typography variant="subtitle2" color="success.main">
                        Free Entry
                      </Typography>
                    )}
                  </Stack>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {eventDialog.event.contact}
                  </Typography>
                  
                  {eventDialog.event.phone && (
                    <Typography variant="body2" paragraph>
                      Phone: {eventDialog.event.phone}
                    </Typography>
                  )}
                  
                  {eventDialog.event.website && (
                    <Typography variant="body2" paragraph>
                      Website: <Link href={eventDialog.event.website} target="_blank" rel="noopener noreferrer">{eventDialog.event.website}</Link>
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', mt: 3, gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => toggleReminder(eventDialog.event.id)}
                      startIcon={remindedEvents.includes(eventDialog.event.id) ? <NotificationsActive /> : <Notifications />}
                    >
                      {remindedEvents.includes(eventDialog.event.id) ? 'Remove Reminder' : 'Set Reminder'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => handleShare(eventDialog.event)}
                      startIcon={<Share />}
                    >
                      Share Event
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEventDialog}>Close</Button>
              {eventDialog.event.requiresRegistration && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleRegisterEvent(eventDialog.event)}
                >
                  Register Now
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Registration Dialog */}
      <Dialog
        open={registerDialog.open}
        onClose={handleCloseRegisterDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="registration-title"
      >
        {registerDialog.event && (
          <>
            <DialogTitle id="registration-title">
              Register for {registerDialog.event.name}
              <IconButton
                aria-label="close"
                onClick={handleCloseRegisterDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" paragraph>
                Please complete the form below to register for this event.
                {registerDialog.event.ticketPrice && (
                  <> Ticket Price: {registerDialog.event.ticketPrice}</>
                )}
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      value={registrationForm.name}
                      onChange={handleRegistrationInput}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={registrationForm.email}
                      onChange={handleRegistrationInput}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={registrationForm.phone}
                      onChange={handleRegistrationInput}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="tickets-label">Number of Tickets</InputLabel>
                      <Select
                        labelId="tickets-label"
                        id="numTickets"
                        name="numTickets"
                        value={registrationForm.numTickets}
                        label="Number of Tickets"
                        onChange={handleRegistrationInput}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <MenuItem key={num} value={num}>{num}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {registerDialog.event.ticketPrice && 
                          `Total: ₹${parseInt(registerDialog.event.ticketPrice.replace(/[^0-9]/g, '')) * registrationForm.numTickets}`
                        }
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRegisterDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmitRegistration}
              >
                Complete Registration
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Reminder Dialog */}
      <Dialog
        open={reminderDialog.open}
        onClose={handleCloseReminderDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Set Reminder for {reminderDialog.event?.name}
          <IconButton
            aria-label="close"
            onClick={handleCloseReminderDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            We'll send you a reminder before the event. Please provide your contact information below.
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={reminderForm.email}
              onChange={handleReminderInput}
              error={!!reminderFormErrors.email}
              helperText={reminderFormErrors.email}
              autoFocus
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number (for SMS)"
              name="phone"
              autoComplete="tel"
              value={reminderForm.phone}
              onChange={handleReminderInput}
              error={!!reminderFormErrors.phone}
              helperText={reminderFormErrors.phone}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="notification-type-label">Notification Type</InputLabel>
              <Select
                labelId="notification-type-label"
                id="notificationType"
                name="notificationType"
                value={reminderForm.notificationType}
                label="Notification Type"
                onChange={handleReminderInput}
              >
                <MenuItem value="email">Email Only</MenuItem>
                <MenuItem value="sms">SMS Only</MenuItem>
                <MenuItem value="both">Both Email and SMS</MenuItem>
              </Select>
              <FormHelperText>How would you like to be notified?</FormHelperText>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="advance-days-label">Remind Me</InputLabel>
              <Select
                labelId="advance-days-label"
                id="advanceDays"
                name="advanceDays"
                value={reminderForm.advanceDays}
                label="Remind Me"
                onChange={handleReminderInput}
              >
                <MenuItem value={0}>On the day of the event</MenuItem>
                <MenuItem value={1}>1 day before</MenuItem>
                <MenuItem value={2}>2 days before</MenuItem>
                <MenuItem value={3}>3 days before</MenuItem>
                <MenuItem value={7}>1 week before</MenuItem>
                <MenuItem value={14}>2 weeks before</MenuItem>
              </Select>
              <FormHelperText>When would you like to receive the reminder?</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReminderDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitReminder} 
            variant="contained" 
            color="primary"
            startIcon={<NotificationsActive />}
          >
            Set Reminder
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventsPage; 