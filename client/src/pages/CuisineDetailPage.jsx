import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useScrollPosition } from '../utils/scrollPosition';

// Mock data for cuisine details
const cuisineDetails = {
  '301': {
    name: 'Dalma',
    description: 'Dalma is a traditional Odia dish made with lentils (usually toor dal) and vegetables. It is a staple in Odia households and is typically served with rice.',
    image: '/uploads/cuisine/dalma.jpg'
  },
  '302': {
    name: 'Chhena Poda',
    description: 'Chhena Poda is a sweet delicacy from Odisha made from cottage cheese, sugar, and cardamom. The name literally means "burnt cheese" in Odia.',
    image: '/uploads/cuisine/chhena-poda.webp'
  },
  '303': {
    name: 'Pakhala Bhata',
    description: 'Pakhala Bhata is a traditional Odia dish made from cooked rice fermented in water. It is especially popular during the summer months for its cooling properties.',
    image: '/uploads/cuisine/pakhala-bhata.webp'
  },
  '304': {
    name: 'Rasagola',
    description: 'Rasagola is a syrupy dessert made from ball-shaped dumplings of chhena (cottage cheese) dough, cooked in light sugar syrup. It is one of the most famous sweets from Odisha.',
    image: '/uploads/cuisine/rasagola.webp'
  }
};

const CuisineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { navigateWithScrollPosition } = useScrollPosition();
  
  // Get cuisine details based on ID
  const cuisine = cuisineDetails[id] || {
    name: 'Cuisine Not Found',
    description: 'The requested cuisine information is not available.',
    image: 'https://source.unsplash.com/random/800x600/?food'
  };
  
  // Function to handle navigation back to home page
  const handleBackToHome = () => {
    // Get the saved scroll position
    const savedPosition = localStorage.getItem('homePageScrollPosition');
    console.log('Navigation back to home with saved position:', savedPosition);
    
    // Navigate back to home page
    navigate('/', { replace: true });
  };

  // Function to handle navigation back to cuisine section
  const handleBackToCuisine = () => {
    // Navigate to cuisine section
    navigate('/#cuisine', { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleBackToHome}
              sx={{ cursor: 'pointer' }}
            >
              Home
            </Link>
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleBackToCuisine}
              sx={{ cursor: 'pointer' }}
            >
              Local Cuisine
            </Link>
            <Typography color="text.primary">{cuisine.name}</Typography>
          </Breadcrumbs>
          
          {/* Back Button */}
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBackToHome}
            sx={{ mb: 3 }}
          >
            Back to Home
          </Button>
          
          {/* Main Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {cuisine.name}
            </Typography>
            
            <Box
              component="img"
              src={cuisine.image}
              alt={cuisine.name}
              sx={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3
              }}
            />
            
            <Typography variant="body1" paragraph>
              {cuisine.description}
            </Typography>
            
            <Typography variant="body1" paragraph>
              This is a placeholder page for {cuisine.name}. In a complete implementation, this page would contain more detailed information about the dish, including its history, ingredients, preparation method, and cultural significance.
            </Typography>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

export default CuisineDetailPage; 