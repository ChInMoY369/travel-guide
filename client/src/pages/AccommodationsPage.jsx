import React, { useState, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  Rating, 
  TextField, 
  InputAdornment, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Divider,
  Button,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  Phone, 
  AttachMoney, 
  People, 
  Hotel, 
  Wifi, 
  AcUnit, 
  Restaurant,
  DirectionsCar, 
  Pool,
  CalendarToday,
  ArrowForward,
  DateRange,
  Close
} from '@mui/icons-material';
import { DarkModeContext } from '../contexts/DarkModeContext';

const hotels = [
  {
    id: '1',
    name: 'Mayfair Lagoon',
    type: 'Luxury',
    description: 'A 5-star luxury resort with world-class amenities and multiple dining options.',
    address: 'Jaydev Vihar, Bhubaneswar',
    phone: '+91 674 666 0101',
    priceRange: '$$$',
    rating: 4.8,
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/591419845.jpg?k=c37cfeb20bf7e43a86ba8f5b990a2d3792499eb73b4f74476c12f4976f765e96&o=&hp=1',
    tags: ['Luxury', '5-Star', 'Resort'],
    basePrice: 7500, // Price per night in INR
    amenities: ['Swimming Pool', 'Spa', 'Multiple Restaurants', 'Gym', 'Free Wifi', 'Conference Facilities'],
    roomTypes: [
      { name: 'Deluxe Room', price: 7500 },
      { name: 'Premium Room', price: 9000 },
      { name: 'Executive Suite', price: 12000 },
      { name: 'Presidential Suite', price: 25000 }
    ]
  },
  {
    id: '2',
    name: 'Trident Hotel',
    type: 'Luxury',
    description: 'A 5-star hotel offering elegant rooms, fine dining, and business facilities.',
    address: 'Nayapalli, Bhubaneswar',
    phone: '+91 674 233 1010',
    priceRange: '$$$',
    rating: 4.7,
    image: 'https://www.tridenthotels.com/-/media/trident-hotel/hotel-in-bhubneshwar/Bhubneswar-Overview/Banner/banner_1920x1080-1.jpg',
    tags: ['Luxury', '5-Star', 'Business'],
    basePrice: 8000, // Price per night in INR
    amenities: ['Outdoor Pool', 'Spa & Wellness Center', 'Restaurant', 'Bar', 'Free Wifi', 'Business Center'],
    roomTypes: [
      { name: 'Deluxe Room', price: 8000 },
      { name: 'Deluxe Garden View', price: 9500 },
      { name: 'Executive Suite', price: 15000 },
      { name: 'Deluxe Suite', price: 18000 }
    ]
  },
  {
    id: '3',
    name: 'Swosti Premium',
    type: 'Business',
    description: 'A 4-star business hotel with modern amenities and central location.',
    address: 'Jaydev Vihar, Bhubaneswar',
    phone: '+91 674 301 3000',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/13520336.jpg?k=90e4920de5765ae38e32098650a056288f166aefaee92ae083f0d77b6bde817b&o=',
    tags: ['Business', '4-Star', 'Central'],
    basePrice: 4500, // Price per night in INR
    amenities: ['Restaurant', 'Bar', 'Fitness Center', 'Free Wifi', 'Business Center', 'Conference Rooms'],
    roomTypes: [
      { name: 'Superior Room', price: 4500 },
      { name: 'Premium Room', price: 5500 },
      { name: 'Suite', price: 7500 },
      { name: 'Executive Suite', price: 9000 }
    ]
  },
  {
    id: '4',
    name: 'Ginger Hotel',
    type: 'Budget',
    description: 'Smart, stylish accommodation with essential amenities at affordable prices.',
    address: 'Shankarpur, Bhubaneswar',
    phone: '+91 674 666 3333',
    priceRange: '$',
    rating: 4.0,
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/3d/48/3a/ginger-bhubaneshwar-facade.jpg?w=900&h=-1&s=1',
    tags: ['Budget', 'Smart', 'Business'],
    basePrice: 2500, // Price per night in INR
    amenities: ['Restaurant', 'Fitness Center', 'Free Wifi', 'Meeting Rooms', 'Self Check-in'],
    roomTypes: [
      { name: 'Standard Room', price: 2500 },
      { name: 'Superior Room', price: 3000 },
      { name: 'Twin Room', price: 3200 },
      { name: 'Suite', price: 4000 }
    ]
  },
  {
    id: '5',
    name: 'Hotel Empires',
    type: 'Mid-range',
    description: 'Comfortable 3-star hotel featuring modern amenities and good location.',
    address: 'Saheed Nagar, Bhubaneswar',
    phone: '+91 674 254 0990',
    priceRange: '$$',
    rating: 4.2,
    image: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201606041255452768-a27a16f4762611ee8b030a58a9feac02.jpg',
    tags: ['Mid-range', '3-Star', 'Family'],
    basePrice: 3500, // Price per night in INR
    amenities: ['Restaurant', 'Room Service', 'Free Wifi', 'Parking', 'Laundry Service'],
    roomTypes: [
      { name: 'Standard Room', price: 3500 },
      { name: 'Deluxe Room', price: 4200 },
      { name: 'Family Room', price: 5000 },
      { name: 'Executive Room', price: 5500 }
    ]
  },
  {
    id: '6',
    name: 'Pal Heights',
    type: 'Business',
    description: 'A 4-star business hotel with excellent dining options and conference facilities.',
    address: 'Lewis Road, Bhubaneswar',
    phone: '+91 674 301 9999',
    priceRange: '$$',
    rating: 4.3,
    image: 'https://www.palheights.com/wp-content/uploads/2024/08/pal-heights-mantra-with-trip-advisor-logo-reduced.jpg',
    tags: ['Business', '4-Star', 'Conference'],
    basePrice: 4800, // Price per night in INR
    amenities: ['Multiple Restaurants', 'Bar', 'Fitness Center', 'Free Wifi', 'Conference Hall', 'Business Center'],
    roomTypes: [
      { name: 'Deluxe Room', price: 4800 },
      { name: 'Executive Room', price: 5800 },
      { name: 'Premier Suite', price: 7800 },
      { name: 'Presidential Suite', price: 12000 }
    ]
  },
  {
    id: '7',
    name: 'Hotel Hindusthan International',
    type: 'Luxury',
    description: 'A 4-star luxury hotel offering elegant accommodation and fine dining experiences.',
    address: 'Janpath, Bhubaneswar',
    phone: '+91 674 253 0360',
    priceRange: '$$$',
    rating: 4.5,
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/f7/fc/ec/caption.jpg?w=900&h=500&s=1',
    tags: ['Luxury', '4-Star', 'Fine Dining'],
    basePrice: 6000, // Price per night in INR
    amenities: ['Outdoor Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Fitness Center', 'Free Wifi'],
    roomTypes: [
      { name: 'Deluxe Room', price: 6000 },
      { name: 'Executive Room', price: 7000 },
      { name: 'Club Room', price: 8500 },
      { name: 'Suite', price: 12000 }
    ]
  },
  {
    id: '8',
    name: 'Toshali Sands',
    type: 'Resort',
    description: 'An eco-resort with cottages, offering a blend of nature and luxury near Puri beach.',
    address: 'Puri-Konark Marine Drive, Puri',
    phone: '+91 674 667 2121',
    priceRange: '$$',
    rating: 4.4,
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/1c/d4/48/94/toshali-sands-nature.jpg',
    tags: ['Resort', 'Beach', 'Eco-friendly'],
    basePrice: 5000, // Price per night in INR
    amenities: ['Swimming Pool', 'Restaurant', 'Spa', 'Beach Access', 'Garden', 'Free Wifi'],
    roomTypes: [
      { name: 'Standard Cottage', price: 5000 },
      { name: 'Deluxe Cottage', price: 6000 },
      { name: 'Premium Cottage', price: 7000 },
      { name: 'Executive Cottage', price: 8500 }
    ]
  }
];

const AccommodationsPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    search: '',
    guestCount: 2,
    nights: 3
  });
  
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();
  
  // New state for booking dialog
  const [bookingDialog, setBookingDialog] = useState({
    open: false,
    hotel: null,
    roomType: null
  });
  
  // New state for room selection dialog
  const [roomDialog, setRoomDialog] = useState({
    open: false,
    hotel: null
  });
  
  // New state for success message
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Handle opening room selection dialog
  const handleBookNow = (hotel) => {
    setRoomDialog({
      open: true,
      hotel: hotel
    });
  };
  
  // Handle selecting room and opening booking dialog
  const handleSelectRoom = (hotel, roomType) => {
    setRoomDialog({
      ...roomDialog,
      open: false
    });
    
    setBookingDialog({
      open: true,
      hotel: hotel,
      roomType: roomType
    });
  };

  // Handle closing room dialog
  const handleCloseRoomDialog = () => {
    setRoomDialog({
      ...roomDialog,
      open: false
    });
  };
  
  // Handle closing booking dialog
  const handleCloseBookingDialog = () => {
    setBookingDialog({
      ...bookingDialog,
      open: false
    });
  };

  // Handle completing booking
  const handleCompleteBooking = () => {
    // In a real app, this would send data to a backend
    handleCloseBookingDialog();
    setSnackbar({
      open: true,
      message: `Booking confirmed at ${bookingDialog.hotel.name} (${bookingDialog.roomType.name}) for ${filters.guestCount} guests and ${filters.nights} nights!`,
      severity: 'success'
    });
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Calculate total price based on guests and nights
  const calculateTotalPrice = (basePrice, guests, nights) => {
    // Apply slight discount for longer stays
    let discountFactor = 1;
    if (nights >= 7) discountFactor = 0.85; // 15% discount for week or longer
    else if (nights >= 4) discountFactor = 0.9; // 10% discount for 4-6 nights
    
    // Extra guest fee calculation
    let extraGuestFee = 0;
    if (guests > 2) {
      extraGuestFee = (guests - 2) * (basePrice * 0.2); // Extra guests cost 20% of base price per person
    }
    
    const totalPrice = (basePrice + extraGuestFee) * nights * discountFactor;
    return Math.round(totalPrice);
  };

  // Apply filters to hotels
  const filteredHotels = hotels.filter(hotel => {
    // Filter by type
    if (filters.type && hotel.type !== filters.type) {
      return false;
    }
    
    // Filter by price range
    if (filters.priceRange && hotel.priceRange !== filters.priceRange) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        hotel.name.toLowerCase().includes(searchTerm) ||
        hotel.description.toLowerCase().includes(searchTerm) ||
        hotel.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return true;
  });

  // Get hotel amenity icon
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi fontSize="small" />;
    if (amenityLower.includes('pool')) return <Pool fontSize="small" />;
    if (amenityLower.includes('restaurant')) return <Restaurant fontSize="small" />;
    if (amenityLower.includes('air conditioning') || amenityLower.includes('ac')) return <AcUnit fontSize="small" />;
    if (amenityLower.includes('parking')) return <DirectionsCar fontSize="small" />;
    return <Hotel fontSize="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ 
      py: 8,
      backgroundColor: darkMode ? '#121212' : 'inherit',
      color: darkMode ? '#e0e0e0' : 'inherit'
    }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Hotels & Accommodations
      </Typography>
      <Typography variant="subtitle1" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }} paragraph>
        Find the perfect place to stay in Bhubaneswar and Puri, from luxury hotels to budget-friendly options.
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 6, mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              label="Search Hotels"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#a0a0a0' : 'inherit'
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e0e0e0' : 'inherit'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                }
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#a0a0a0' : 'inherit'
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#e0e0e0' : 'inherit'
              }
            }}>
              <InputLabel id="hotel-type-label">Hotel Type</InputLabel>
              <Select
                labelId="hotel-type-label"
                id="type"
                name="type"
                value={filters.type}
                label="Hotel Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Mid-range">Mid-range</MenuItem>
                <MenuItem value="Budget">Budget</MenuItem>
                <MenuItem value="Resort">Resort</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                }
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#a0a0a0' : 'inherit'
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#e0e0e0' : 'inherit'
              }
            }}>
              <InputLabel id="price-label">Price Range</InputLabel>
              <Select
                labelId="price-label"
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                label="Price Range"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="$">Budget ($)</MenuItem>
                <MenuItem value="$$">Moderate ($$)</MenuItem>
                <MenuItem value="$$$">Luxury ($$$)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                }
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#a0a0a0' : 'inherit'
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#e0e0e0' : 'inherit'
              }
            }}>
              <InputLabel id="guests-label">Guests</InputLabel>
              <Select
                labelId="guests-label"
                id="guestCount"
                name="guestCount"
                value={filters.guestCount}
                label="Guests"
                onChange={handleFilterChange}
              >
                <MenuItem value={1}>1 Guest</MenuItem>
                <MenuItem value={2}>2 Guests</MenuItem>
                <MenuItem value={3}>3 Guests</MenuItem>
                <MenuItem value={4}>4 Guests</MenuItem>
                <MenuItem value={5}>5 Guests</MenuItem>
                <MenuItem value={6}>6+ Guests</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                }
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#a0a0a0' : 'inherit'
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#e0e0e0' : 'inherit'
              }
            }}>
              <InputLabel id="nights-label">Nights</InputLabel>
              <Select
                labelId="nights-label"
                id="nights"
                name="nights"
                value={filters.nights}
                label="Nights"
                onChange={handleFilterChange}
              >
                <MenuItem value={1}>1 Night</MenuItem>
                <MenuItem value={2}>2 Nights</MenuItem>
                <MenuItem value={3}>3 Nights</MenuItem>
                <MenuItem value={4}>4 Nights</MenuItem>
                <MenuItem value={5}>5 Nights</MenuItem>
                <MenuItem value={7}>7 Nights</MenuItem>
                <MenuItem value={10}>10+ Nights</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ mb: 4, borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
      
      {/* Hotel Grid */}
      <Grid container spacing={4}>
        {filteredHotels.map((hotel) => (
          <Grid item key={hotel.id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              backgroundColor: darkMode ? '#1e1e2d' : '#ffffff',
              color: darkMode ? '#e0e0e0' : 'inherit',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 8px 16px rgba(255,255,255,0.07)' : '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={hotel.image}
                alt={hotel.name}
                sx={{ filter: darkMode ? 'brightness(0.85)' : 'none' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                  {hotel.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {hotel.rating}
                  </Typography>
                </Box>
                
                {/* Price Information */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {hotel.priceRange} · ₹{hotel.basePrice}/night (base)
                  </Typography>
                </Box>
                
                {/* Booking Price Calculation */}
                <Box sx={{ mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    <People fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> 
                    {filters.guestCount} {filters.guestCount === 1 ? 'Guest' : 'Guests'} · {filters.nights} {filters.nights === 1 ? 'Night' : 'Nights'}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                    ₹{calculateTotalPrice(hotel.basePrice, filters.guestCount, filters.nights)}
                    {((filters.nights >= 4 && filters.nights < 7) || filters.guestCount > 2) && 
                      <Tooltip title={filters.nights >= 7 ? "15% long stay discount" : filters.nights >= 4 ? "10% discount for 4+ nights" : ""}>
                        <Chip label="Discount" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                      </Tooltip>
                    }
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {filters.guestCount > 2 && 
                      `Includes extra guest charges for ${filters.guestCount - 2} guest${filters.guestCount - 2 > 1 ? 's' : ''}`}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {hotel.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Phone fontSize="small" color="primary" sx={{ mr: 0.5, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {hotel.phone}
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                  {hotel.description}
                </Typography>
                
                {/* Room Types */}
                <Typography variant="subtitle2" color="primary" sx={{ mt: 1, mb: 0.5 }}>
                  Available Room Types:
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  {hotel.roomTypes.slice(0, 2).map((room, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>{room.name}</Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>₹{room.price}/night</Typography>
                    </Box>
                  ))}
                </Box>
                
                {/* Amenities */}
                <Typography variant="subtitle2" color="primary" sx={{ mt: 1, mb: 0.5 }}>
                  Top Amenities:
                </Typography>
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                  {hotel.amenities.slice(0, 6).map((amenity, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getAmenityIcon(amenity)}
                        <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.8rem', color: darkMode ? '#a0a0a0' : 'inherit' }}>
                          {amenity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  <Chip label={hotel.type} size="small" color="primary" />
                  {hotel.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        borderColor: darkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                        color: darkMode ? '#e0e0e0' : 'inherit'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  size="medium" 
                  color="primary"
                  onClick={() => handleBookNow(hotel)}
                  startIcon={<DateRange />}
                  fullWidth
                >
                  View Booking Options
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredHotels.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, color: darkMode ? '#e0e0e0' : 'inherit' }}>
          <Typography variant="h6">No hotels found matching your criteria.</Typography>
          <Typography variant="body1">Try adjusting your filters or search term.</Typography>
        </Box>
      )}
      
      {/* Room Selection Dialog */}
      <Dialog 
        open={roomDialog.open} 
        onClose={handleCloseRoomDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: darkMode ? '#1e1e2d' : '#ffffff',
            color: darkMode ? '#e0e0e0' : 'inherit'
          }
        }}
      >
        <DialogTitle sx={{ color: darkMode ? '#e0e0e0' : 'inherit', position: 'relative' }}>
          Booking Options at {roomDialog.hotel?.name}
          <IconButton
            aria-label="close"
            onClick={handleCloseRoomDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: darkMode ? '#a0a0a0' : 'grey.500',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }} paragraph>
            Available room options for {filters.guestCount} {filters.guestCount === 1 ? 'guest' : 'guests'} for {filters.nights} {filters.nights === 1 ? 'night' : 'nights'}:
          </DialogContentText>
          <List>
            {roomDialog.hotel?.roomTypes.map((room, index) => (
              <ListItem 
                key={index} 
                button 
                divider={index < roomDialog.hotel.roomTypes.length - 1}
                onClick={() => handleSelectRoom(roomDialog.hotel, room)}
                sx={{ 
                  borderRadius: 1, 
                  transition: 'all 0.2s',
                  color: darkMode ? '#e0e0e0' : 'inherit',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.08)' }
                }}
              >
                <ListItemText 
                  primary={room.name} 
                  secondary={`Base price: ₹${room.price}/night`}
                  primaryTypographyProps={{ color: darkMode ? '#e0e0e0' : 'inherit' }}
                  secondaryTypographyProps={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                />
                <Typography variant="body1" fontWeight="bold" color="primary">
                  ₹{calculateTotalPrice(room.price, filters.guestCount, filters.nights)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      
      {/* Booking Confirmation Dialog */}
      <Dialog 
        open={bookingDialog.open} 
        onClose={handleCloseBookingDialog}
        PaperProps={{
          style: {
            backgroundColor: darkMode ? '#1e1e2d' : '#ffffff',
            color: darkMode ? '#e0e0e0' : 'inherit'
          }
        }}
      >
        <DialogTitle sx={{ color: darkMode ? '#e0e0e0' : 'inherit', position: 'relative' }}>
          Confirm Booking
          <IconButton
            aria-label="close"
            onClick={handleCloseBookingDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: darkMode ? '#a0a0a0' : 'grey.500',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }} paragraph>
            Please confirm your booking details:
          </DialogContentText>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
              {bookingDialog.hotel?.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Hotel sx={{ mr: 1, color: darkMode ? '#a0a0a0' : 'inherit' }} />
              <Typography variant="body1" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                {bookingDialog.roomType?.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <People sx={{ mr: 1, color: darkMode ? '#a0a0a0' : 'inherit' }} />
              <Typography variant="body1" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                {filters.guestCount} {filters.guestCount === 1 ? 'Guest' : 'Guests'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CalendarToday sx={{ mr: 1, color: darkMode ? '#a0a0a0' : 'inherit' }} />
              <Typography variant="body1" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                {filters.nights} {filters.nights === 1 ? 'Night' : 'Nights'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <AttachMoney sx={{ mr: 1, color: darkMode ? '#a0a0a0' : 'inherit' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                Total: ₹{bookingDialog.roomType ? calculateTotalPrice(bookingDialog.roomType.price, filters.guestCount, filters.nights) : 0}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Success/Info Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccommodationsPage; 