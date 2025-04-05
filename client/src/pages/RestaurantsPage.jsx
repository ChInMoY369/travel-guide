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
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import { Search, LocationOn, Phone, AttachMoney, People, AccessTime, ArrowForward } from '@mui/icons-material';
import { DarkModeContext } from '../contexts/DarkModeContext';

const restaurants = [
  {
    id: '1',
    name: 'Dalma',
    cuisine: 'Odia',
    description: 'Authentic Odia cuisine in a traditional setting.',
    address: 'Saheed Nagar, Bhubaneswar',
    phone: '+91 674 123 4567',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1627662168223-7df99068099a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG9kaWElMjBmb29kfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60',
    tags: ['Odia', 'Traditional', 'Vegetarian-Friendly'],
    basePrice: 500, // Price per person in INR
    menuItems: [
      { name: 'Dalma', price: 120 },
      { name: 'Fish Curry', price: 180 },
      { name: 'Odia Thali', price: 250 },
      { name: 'Chhena Poda', price: 80 }
    ]
  },
  {
    id: '2',
    name: 'Mayfair Lagoon',
    cuisine: 'Multi-cuisine',
    description: 'Luxury dining experience with a variety of cuisines.',
    address: 'Jaydev Vihar, Bhubaneswar',
    phone: '+91 674 234 5678',
    priceRange: '$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGx1eHVyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
    tags: ['Fine Dining', 'Multi-cuisine', 'Bar'],
    basePrice: 1200, // Price per person in INR
    menuItems: [
      { name: 'Butter Chicken', price: 350 },
      { name: 'Seafood Platter', price: 850 },
      { name: 'Mutton Biryani', price: 420 },
      { name: 'Tandoori Platter', price: 750 }
    ]
  },
  {
    id: '3',
    name: 'Odisha Hotel',
    cuisine: 'Odia',
    description: 'Simple, authentic Odia thali and local specialties.',
    address: 'Old Town, Bhubaneswar',
    phone: '+91 674 345 6789',
    priceRange: '$',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwdGhhbGl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60',
    tags: ['Budget', 'Local', 'Thali'],
    basePrice: 300, // Price per person in INR
    menuItems: [
      { name: 'Odia Thali', price: 150 },
      { name: 'Pakhala', price: 120 },
      { name: 'Chhena Poda', price: 60 },
      { name: 'Rasagola', price: 30 }
    ]
  },
  {
    id: '4',
    name: 'Mainland China',
    cuisine: 'Chinese',
    description: 'Authentic Chinese cuisine with a modern twist.',
    address: 'Nayapalli, Bhubaneswar',
    phone: '+91 674 456 7890',
    priceRange: '$$$',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60',
    tags: ['Chinese', 'Asian', 'Fine Dining'],
    basePrice: 900, // Price per person in INR
    menuItems: [
      { name: 'Dim Sum Platter', price: 350 },
      { name: 'Kung Pao Chicken', price: 380 },
      { name: 'Schezwan Noodles', price: 280 },
      { name: 'Chinese Greens', price: 260 }
    ]
  },
  {
    id: '5',
    name: 'Tandoor',
    cuisine: 'North Indian',
    description: 'Delicious North Indian cuisine with a focus on tandoor items.',
    address: 'Chandrasekharpur, Bhubaneswar',
    phone: '+91 674 567 8901',
    priceRange: '$$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGFuZG9vcmklMjBjaGlja2VufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60',
    tags: ['North Indian', 'Tandoor', 'Family'],
    basePrice: 650, // Price per person in INR
    menuItems: [
      { name: 'Butter Naan', price: 60 },
      { name: 'Paneer Tikka', price: 280 },
      { name: 'Dal Makhani', price: 250 },
      { name: 'Tandoori Chicken', price: 350 }
    ]
  },
  {
    id: '6',
    name: 'Cafe Coffee Day',
    cuisine: 'Cafe',
    description: 'Popular cafe chain serving coffee, beverages, and light snacks.',
    address: 'Patia, Bhubaneswar',
    phone: '+91 674 678 9012',
    priceRange: '$$',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1523942839745-7848c839b661?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FmZSUyMGNvZmZlZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
    tags: ['Cafe', 'Coffee', 'Snacks'],
    basePrice: 400, // Price per person in INR
    menuItems: [
      { name: 'Cappuccino', price: 140 },
      { name: 'Cold Coffee', price: 180 },
      { name: 'Chocolate Brownie', price: 120 },
      { name: 'Sandwich', price: 200 }
    ]
  },
  {
    id: '7',
    name: 'Priya Restaurant',
    cuisine: 'South Indian',
    description: 'Authentic South Indian cuisine with a variety of dosas and idlis.',
    address: 'Master Canteen, Bhubaneswar',
    phone: '+91 674 789 0123',
    priceRange: '$',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvc2F8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60',
    tags: ['South Indian', 'Vegetarian', 'Budget'],
    basePrice: 350, // Price per person in INR
    menuItems: [
      { name: 'Masala Dosa', price: 120 },
      { name: 'Idli Sambhar', price: 80 },
      { name: 'Vada', price: 60 },
      { name: 'South Indian Thali', price: 180 }
    ]
  },
  {
    id: '8',
    name: 'Biryani Box',
    cuisine: 'Biryani',
    description: 'Specializing in various types of biryanis and kebabs.',
    address: 'Saheed Nagar, Bhubaneswar',
    phone: '+91 674 890 1234',
    priceRange: '$$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    tags: ['Biryani', 'Non-Vegetarian', 'Takeaway'],
    basePrice: 550, // Price per person in INR
    menuItems: [
      { name: 'Chicken Biryani', price: 250 },
      { name: 'Mutton Biryani', price: 320 },
      { name: 'Hyderabadi Biryani', price: 280 },
      { name: 'Kebab Platter', price: 350 }
    ]
  }
];

const RestaurantsPage = () => {
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    search: '',
    familySize: 1
  });

  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();

  // Success message state retained for potential future use
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

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Calculate total price based on family size
  const calculateTotalPrice = (basePrice, familySize) => {
    // Apply slight discount for families
    let discountFactor = 1;
    if (familySize >= 4) discountFactor = 0.9; // 10% discount for 4+ people
    else if (familySize >= 2) discountFactor = 0.95; // 5% discount for 2-3 people
    
    const totalPrice = basePrice * familySize * discountFactor;
    return Math.round(totalPrice);
  };

  // Filter restaurants based on current filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by cuisine
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
      return false;
    }
    
    // Filter by price range
    if (filters.priceRange && restaurant.priceRange !== filters.priceRange) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ 
      py: 8,
      backgroundColor: darkMode ? '#121212' : 'inherit',
      color: darkMode ? '#e0e0e0' : 'inherit'
    }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Restaurants & Dining
      </Typography>
      <Typography variant="subtitle1" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }} paragraph>
        Explore the culinary delights of Bhubaneswar and Puri, from traditional Odia cuisine to international flavors.
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 6, mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              label="Search Restaurants"
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
          <Grid item xs={12} sm={6} md={3}>
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
              <InputLabel id="cuisine-label">Cuisine Type</InputLabel>
              <Select
                labelId="cuisine-label"
                id="cuisine"
                name="cuisine"
                value={filters.cuisine}
                label="Cuisine Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Cuisines</MenuItem>
                <MenuItem value="Odia">Odia</MenuItem>
                <MenuItem value="North Indian">North Indian</MenuItem>
                <MenuItem value="South Indian">South Indian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Multi-cuisine">Multi-cuisine</MenuItem>
                <MenuItem value="Cafe">Cafe</MenuItem>
                <MenuItem value="Biryani">Biryani</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                <MenuItem value="$$$">Expensive ($$$)</MenuItem>
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
              <InputLabel id="family-size-label">Family Size</InputLabel>
              <Select
                labelId="family-size-label"
                id="familySize"
                name="familySize"
                value={filters.familySize}
                label="Family Size"
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <People />
                  </InputAdornment>
                }
              >
                <MenuItem value={1}>1 Person</MenuItem>
                <MenuItem value={2}>2 People</MenuItem>
                <MenuItem value={3}>3 People</MenuItem>
                <MenuItem value={4}>4 People</MenuItem>
                <MenuItem value={5}>5 People</MenuItem>
                <MenuItem value={6}>6 People</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ mb: 4, borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
      
      {/* Restaurant Grid */}
      <Grid container spacing={4}>
        {filteredRestaurants.map((restaurant) => (
          <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
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
                image={restaurant.image}
                alt={restaurant.name}
                sx={{ filter: darkMode ? 'brightness(0.85)' : 'none' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                  {restaurant.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {restaurant.rating}
                  </Typography>
                </Box>
                
                {/* Price Information */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {restaurant.priceRange} · ₹{restaurant.basePrice}/person (base)
                  </Typography>
                </Box>
                
                {/* Price Calculation */}
                <Box sx={{ mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    <People fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> 
                    {filters.familySize} {filters.familySize === 1 ? 'Person' : 'People'}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                    ₹{calculateTotalPrice(restaurant.basePrice, filters.familySize)}
                    {filters.familySize >= 2 && 
                      <Tooltip title={filters.familySize >= 4 ? "10% family discount" : "5% couple/family discount"}>
                        <Chip label="Discount" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                      </Tooltip>
                    }
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                  {restaurant.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {restaurant.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Phone fontSize="small" color="primary" sx={{ mr: 0.5, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                    {restaurant.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip label={restaurant.cuisine} size="small" color="primary" />
                  {restaurant.tags.map((tag, index) => (
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
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Success Snackbar */}
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

export default RestaurantsPage; 