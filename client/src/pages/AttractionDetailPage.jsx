import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Rating,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Avatar,
  Snackbar,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  LocationOn,
  Directions,
  AttachMoney,
  Language,
  Phone,
  Star,
  Share,
  Comment,
  Send,
  Thermostat,
  FiberManualRecord,
  WbSunny,
  Cloud,
  Grain,
  DateRange,
  ArrowForward,
  Lightbulb as LightbulbIcon,
  ArrowBack
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import BackToAttractionsButton from '../components/BackToAttractionsButton';
import { 
  getAttractionById, 
  addFavoriteAttraction, 
  removeFavoriteAttraction,
  addAttractionReview,
  getUserFavorites,
  fetchWikipediaImages,
  getHomepageImagesForAttractions
} from '../utils/api';
import { mockAttractions } from './AttractionsPage';
import Carousel from 'react-material-ui-carousel';
import { amber } from '@mui/material/colors';

// Placeholder image for attractions without images
const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Konark_Sun_Temple_Konark_Nov_2013.jpg';
const fallbackImage = 'https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=600&auto=format&fit=crop'; // Fallback for image load errors

// Mock data for attractions
// Only use if import fails
const fallbackAttractions = [
  {
    _id: '1',
    name: 'Lingaraj Temple',
    type: 'temple',
    description: 'The Lingaraj Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar, the capital of the Indian state of Odisha.',
    longDescription: 'The Lingaraj Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar, the capital of the Indian state of Odisha. The temple is the most prominent landmark of Bhubaneswar and one of the major tourist attractions of the state. The temple is believed to be built by the kings from the Somavamsi dynasty, with later additions from the Ganga rulers. The temple is built in the Kalinga style of architecture. The temple complex has 50 other shrines and is enclosed by a large compound wall. Lingaraj means the king of Lingam, the iconic form of Shiva. The temple is more than 1100 years old, dating back in its present form to the last decade of the eleventh century, though there is evidence that parts of the temple have been there since the sixth century CE as the temple has been emphasized in some of the seventh century Sanskrit texts.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg/1200px-Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg',
      'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=800&h=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&h=500&auto=format&fit=crop'
    ],
    location: {
      address: 'Lingaraj Road, Old Town, Bhubaneswar, Odisha 751002'
    },
    coordinates: {
      latitude: 20.2359,
      longitude: 85.8346
    },
    rating: 4.7,
    reviewCount: 1250,
    averageRating: 4.7,
    openingHours: {
      monday: '6:00 AM - 9:00 PM',
      tuesday: '6:00 AM - 9:00 PM',
      wednesday: '6:00 AM - 9:00 PM',
      thursday: '6:00 AM - 9:00 PM',
      friday: '6:00 AM - 9:00 PM',
      saturday: '6:00 AM - 9:00 PM',
      sunday: '6:00 AM - 9:00 PM'
    },
    entryFee: {
      indian: 'Free',
      foreign: 'Free'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Temple', 'Heritage', 'Religious', 'Architecture'],
    website: 'https://tourism.gov.in/lingaraj-temple',
    phone: '+91 674 123 4567',
    facilities: ['Parking', 'Restrooms', 'Shoe Storage', 'Guides Available'],
    nearbyAttractions: [
      'Mukteshwar Temple',
      'Rajarani Temple',
      'Parasurameswara Temple'
    ],
    tips: [
      'Non-Hindus are not allowed inside the main temple',
      'Photography is not allowed inside the temple',
      'Dress modestly when visiting',
      'Remove shoes before entering the temple'
    ]
  },
  {
    _id: '2',
    name: 'Nandankanan Zoological Park',
    type: 'park',
    description: 'Nandankanan Zoological Park is a 400-hectare zoo and botanical garden near Bhubaneswar, Odisha, India.',
    longDescription: 'Nandankanan Zoological Park is a 400-hectare zoo and botanical garden near Bhubaneswar, Odisha, India. Established in 1960, it was opened to the public in 1979 and became the first zoo in India to join the World Association of Zoos and Aquariums in 2009. It also contains a botanical garden and part of it has been declared a sanctuary. Nandankanan, literally meaning "The Garden of Heaven", is located in the environs of the Chandaka forest, and includes the 134-acre Kanjia lake. The park is a major tourist attraction famous for its white tigers, and also as a breeding center for Indian crocodiles and gharials.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg/1200px-White_Tiger_in_Nandankanan_Zoological_Park.jpg',
      'https://images.unsplash.com/photo-1598458255717-96e5a22b2c96?q=80&w=800&h=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551525844-6b2a5b12e03d?q=80&w=800&h=500&auto=format&fit=crop'
    ],
    location: {
      address: 'Nandankanan Road, Barang, Bhubaneswar, Odisha 754005'
    },
    coordinates: {
      latitude: 20.3978,
      longitude: 85.8248
    },
    rating: 4.5,
    reviewCount: 980,
    averageRating: 4.5,
    openingHours: {
      monday: 'Closed',
      tuesday: '7:30 AM - 5:30 PM',
      wednesday: '7:30 AM - 5:30 PM',
      thursday: '7:30 AM - 5:30 PM',
      friday: '7:30 AM - 5:30 PM',
      saturday: '7:30 AM - 5:30 PM',
      sunday: '7:30 AM - 5:30 PM'
    },
    entryFee: {
      indian: '₹50',
      foreign: '₹100'
    },
    bestTimeToVisit: 'November to February',
    tags: ['Wildlife', 'Nature', 'Family', 'Zoo'],
    website: 'https://nandankanan.org',
    phone: '+91 674 246 1150',
    facilities: ['Parking', 'Restrooms', 'Food Court', 'Battery Operated Vehicles', 'Souvenir Shop'],
    nearbyAttractions: [
      'State Botanical Garden',
      'Kanjia Lake',
      'Chandaka Wildlife Sanctuary'
    ],
    tips: [
      'Visit early in the morning to see more active animals',
      'Plan for a full day to explore the entire zoo',
      'Safari rides need to be booked in advance',
      'Carry water and snacks'
    ]
  },
  {
    _id: '3',
    name: 'Udayagiri and Khandagiri Caves',
    type: 'monument',
    description: 'Udayagiri and Khandagiri Caves are partly natural and partly artificial caves of archaeological, historical and religious importance.',
    longDescription: 'Udayagiri and Khandagiri Caves are partly natural and partly artificial caves of archaeological, historical and religious importance. The caves are situated on two adjacent hills, Udayagiri and Khandagiri, mentioned as Kumari Parvat in the Hathigumpha inscription. They have a number of finely and ornately carved caves. It is believed that most of these caves were carved out as residential blocks for Jain monks during the reign of King Kharavela. Udayagiri means "Sunrise Hill" and has 18 caves while Khandagiri has 15 caves. The caves of Udayagiri and Khandagiri, called lena or leṇa in the inscriptions, were dug out mostly during the reign of Kharavela for the abode of Jaina ascetics.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Udayagiri_Caves_Bhubaneswar_Odisha_India.jpg/1200px-Udayagiri_Caves_Bhubaneswar_Odisha_India.jpg',
      'https://images.unsplash.com/photo-1626621475679-6822efc92c3d?q=80&w=800&h=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598649999298-3812df10c9c4?q=80&w=800&h=500&auto=format&fit=crop'
    ],
    location: {
      address: 'Khandagiri, Bhubaneswar, Odisha 751030'
    },
    coordinates: {
      latitude: 20.2566,
      longitude: 85.7788
    },
    rating: 4.3,
    reviewCount: 750,
    averageRating: 4.3,
    openingHours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '8:00 AM - 5:00 PM',
      sunday: '8:00 AM - 5:00 PM'
    },
    entryFee: {
      indian: '₹25',
      foreign: '₹300'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Historical', 'Caves', 'Architecture', 'Jain'],
    website: 'https://tourism.gov.in/udayagiri-and-khandagiri-caves',
    phone: '+91 674 123 4568',
    facilities: ['Parking', 'Guides Available'],
    nearbyAttractions: [
      'Jain Temple',
      'Dhauli Hill',
      'State Museum'
    ],
    tips: [
      'Wear comfortable shoes for climbing',
      'Start with Udayagiri as it has more caves',
      'Hire a guide to understand the historical significance',
      'Visit early to avoid the midday heat'
    ]
  },
  {
    _id: '4',
    name: 'Dhauli Shanti Stupa',
    type: 'monument',
    description: 'Dhauli Shanti Stupa is a Buddhist structure built during the 1970s atop the Dhauli hills.',
    longDescription: 'Dhauli Shanti Stupa is a Buddhist structure built during the 1970s atop the Dhauli hills, where the Kalinga War was fought. The Shanti Stupa or the peace pagoda was built through a collaboration between the Japan Buddha Sangha and the Kalinga Nippon Buddha Sangha in 1972. Statues of Buddha in various poses can be found in the stupa. Dhauli hill is presumed to be the area where the Kalinga War was fought. Ashoka had invaded Kalinga during this war. The Dhauli hills are located on the banks of the river Daya, 8 km south of Bhubaneswar. The rock edicts of Ashoka are located here, and the white peace pagoda is built on the top of the hill.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dhauli_Giri_Shanti_Stupa.jpg/1200px-Dhauli_Giri_Shanti_Stupa.jpg',
      'https://images.unsplash.com/photo-1614082242765-7c98ca0f3a2f?q=80&w=800&h=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612266706835-0df1af92dd57?q=80&w=800&h=500&auto=format&fit=crop'
    ],
    location: {
      address: 'Dhauli Hills, Bhubaneswar, Odisha 752002'
    },
    coordinates: {
      latitude: 20.1918,
      longitude: 85.8366
    },
    rating: 4.6,
    reviewCount: 820,
    averageRating: 4.6,
    openingHours: {
      monday: '7:00 AM - 7:00 PM',
      tuesday: '7:00 AM - 7:00 PM',
      wednesday: '7:00 AM - 7:00 PM',
      thursday: '7:00 AM - 7:00 PM',
      friday: '7:00 AM - 7:00 PM',
      saturday: '7:00 AM - 7:00 PM',
      sunday: '7:00 AM - 7:00 PM'
    },
    entryFee: {
      indian: 'Free',
      foreign: 'Free'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Buddhist', 'Peace Pagoda', 'Historical', 'Monument'],
    website: 'https://tourism.gov.in/dhauli-shanti-stupa',
    phone: '+91 674 123 4569',
    facilities: ['Parking', 'Viewpoint', 'Meditation Space'],
    nearbyAttractions: [
      'Ashokan Rock Edicts',
      'Daya River',
      'Buddhist Temple'
    ],
    tips: [
      'Visit during sunrise or sunset for spectacular views',
      'The site has historical significance related to Emperor Ashoka',
      'Peaceful place for meditation',
      'Combine with a visit to the nearby Ashokan rock edicts'
    ]
  }
];

const AttractionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [similarAttractions, setSimilarAttractions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [homepageImagesMap, setHomepageImagesMap] = useState({});

  useEffect(() => {
    console.log("Attraction ID from URL:", id);
    
    setHomepageImagesMap(getHomepageImagesForAttractions());
    fetchAttractionDetails();
    fetchReviews();
    checkIfFavorite();
    fetchWeatherData();
    
    if (user) {
      checkIfFavorite();
    }
    
    // Store mockAttractions in window object for access from anywhere
    if (mockAttractions && mockAttractions.length > 0) {
      window.mockAttractions = mockAttractions;
    }
    
    // Cleanup function
    return () => {
      // Cancel any pending requests if needed
    };
  }, [id, user]);
  
  // Separate useEffect for similar attractions that depends on the attraction
  useEffect(() => {
    if (attraction) {
      fetchSimilarAttractions();
    }
  }, [attraction]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkMode(event.detail.darkMode);
    };
    
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Update attraction with default properties if they don't exist
  const ensureAttractionProperties = (attractionData) => {
    if (!attractionData) return null;
    
    return {
      ...attractionData,
      tags: attractionData.tags || [],
      facilities: attractionData.facilities || [],
      nearbyAttractions: attractionData.nearbyAttractions || [],
      tips: attractionData.tips || [],
      images: attractionData.images || [],
      reviews: attractionData.reviews || [],
      history: attractionData.history || [],
      openingHours: attractionData.openingHours || {
        monday: 'Not available',
        tuesday: 'Not available',
        wednesday: 'Not available',
        thursday: 'Not available',
        friday: 'Not available',
        saturday: 'Not available',
        sunday: 'Not available'
      },
      entryFee: attractionData.entryFee || {
        indian: 'Not available',
        foreign: 'Not available'
      }
    };
  };

  const fetchAttractionDetails = async () => {
    setLoading(true);
    
    try {
      let attractionData;
      
      try {
        const response = await getAttractionById(id);
        attractionData = response.data;
      } catch (apiError) {
        console.error("API error, trying mock data:", apiError);
        
        // Look for mock data based on the ID
        attractionData = mockAttractions.find(a => a._id === id);
        
        if (!attractionData) {
          attractionData = fallbackAttractions.find(a => a._id === id);
        }
        
        if (!attractionData) {
          throw new Error("Attraction not found");
        }
      }
      
      // Ensure necessary properties exist
      attractionData = ensureAttractionProperties(attractionData);
      
      // Check if this attraction has images from the homepage
      if (homepageImagesMap[attractionData.name]) {
        attractionData.images = homepageImagesMap[attractionData.name];
      } 
      // If we don't have images or need better ones, try Wikipedia
      else if (!attractionData.images || attractionData.images.length === 0) {
        const wikiImages = await fetchWikipediaImages(attractionData.name);
        
        if (wikiImages.length > 0) {
          attractionData.images = wikiImages;
        }
      }
      
      setAttraction(attractionData);
      
      // Fetch similar attractions
      fetchSimilarAttractions(attractionData.type);
    } catch (error) {
      console.error("Error fetching attraction details:", error);
      setError("Failed to load attraction details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Use mock data directly without API call
      const mockReviews = [
        {
          id: '1',
          user: {
            id: '101',
            name: 'Rahul Sharma',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&auto=format&fit=crop'
          },
          rating: 5,
          text: 'One of the most beautiful temples I have ever visited. The architecture is stunning and the atmosphere is very peaceful.',
          date: '2023-11-15'
        },
        {
          id: '2',
          user: {
            id: '102',
            name: 'Priya Patel',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop'
          },
          rating: 4,
          text: 'Great historical site with amazing architecture. The temple complex is well maintained. Highly recommended for history enthusiasts.',
          date: '2023-10-22'
        },
        {
          id: '3',
          user: {
            id: '103',
            name: 'Michael Johnson',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&auto=format&fit=crop'
          },
          rating: 5,
          text: 'Incredible place with rich history. The carvings on the temple walls are exquisite. A must-visit when in Bhubaneswar.',
          date: '2023-09-05'
        }
      ];
      
      setReviews(mockReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchSimilarAttractions = async () => {
    try {
      // Wait for the current attraction to be loaded
      if (!attraction) return;
      
      // Use the same source for attractions data as fetchAttractionDetails
      let attractionsData = mockAttractions;
      
      // If import failed or is empty, try window.mockAttractions or fallback
      if (!attractionsData || attractionsData.length === 0) {
        attractionsData = window.mockAttractions || fallbackAttractions;
      }
      
      // Find similar attractions based on type or tags
      const similar = attractionsData.filter(attr => 
        // Don't include the current attraction
        attr._id !== id &&
        // Match by type or tags
        (attr.type === attraction.type || 
         attraction.tags.some(tag => attr.tags.includes(tag)))
      ).slice(0, 3); // Get only up to 3 similar attractions
      
      // Format the similar attractions for display
      const formattedSimilar = similar.map(attr => ({
        id: attr._id,
        name: attr.name,
        image: attr.images[0],
        rating: attr.averageRating || attr.rating
      }));
      
      setSimilarAttractions(formattedSimilar);
    } catch (err) {
      console.error('Error fetching similar attractions:', err);
      // Fallback to empty array if error
      setSimilarAttractions([]);
    }
  };

  const getWeatherIconUrl = (condition) => {
    switch(condition.toLowerCase()) {
      case 'sunny':
        return 'https://cdn-icons-png.flaticon.com/128/869/869869.png'; // Sun icon
      case 'partly cloudy':
        return 'https://cdn-icons-png.flaticon.com/128/1146/1146869.png'; // Partly cloudy icon
      case 'cloudy':
        return 'https://cdn-icons-png.flaticon.com/128/414/414927.png'; // Cloud icon
      case 'rainy':
        return 'https://cdn-icons-png.flaticon.com/128/3351/3351979.png'; // Rain icon
      default:
        return 'https://cdn-icons-png.flaticon.com/128/869/869869.png'; // Default sun icon
    }
  };

  const fetchWeatherData = async () => {
    try {
      // Use mock weather data instead of API calls
      const mockWeatherData = {
        temperature: 32,
        condition: 'Sunny',
        description: 'Clear sky',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 34,
        precipitation: 0,
        airQuality: 'Good',
        icon: '01d',
        forecast: [
          { day: 'Today', temp: 32, condition: 'Sunny', icon: '01d' },
          { day: 'Tomorrow', temp: 30, condition: 'Partly Cloudy', icon: '02d' },
          { day: 'Day 3', temp: 29, condition: 'Cloudy', icon: '03d' }
        ]
      };
      
      setWeatherData(mockWeatherData);
    } catch (err) {
      console.error('Error setting weather data:', err);
      
      // Fallback to basic mock data if above fails
      const fallbackWeatherData = {
        temperature: 32,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: 'Today', temp: 32, condition: 'Sunny' },
          { day: 'Tomorrow', temp: 30, condition: 'Partly Cloudy' },
          { day: 'Day 3', temp: 29, condition: 'Cloudy' }
        ]
      };
      
      setWeatherData(fallbackWeatherData);
    }
  };

  const checkIfFavorite = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data } = await getUserFavorites();
      const isCurrentAttractionFavorite = data.some(fav => fav.id === id);
      setIsFavorite(isCurrentAttractionFavorite);
    } catch (err) {
      console.error('Error checking if attraction is favorite:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isFavorite) {
        // Remove from favorites
        await removeFavoriteAttraction(id);
        setSnackbar({
          open: true,
          message: 'Removed from favorites',
          severity: 'info'
        });
      } else {
        // Add to favorites
        console.log('Sending attraction ID to favorite:', id);
        
        // For better debugging, log the type of ID
        console.log('ID type:', typeof id, 'ID value:', id);
        
        const response = await addFavoriteAttraction(id);
        console.log('Add favorite response:', response);
        
        setSnackbar({
          open: true,
          message: 'Added to favorites',
          severity: 'success'
        });
      }
      
      // Toggle the favorite state
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorites:', err);
      
      // Show a more specific error message for non-ObjectId errors
      let errorMessage = 'Failed to update favorites. Please try again.';
      
      // Check for specific error patterns
      if (err.response?.data?.error && err.response.data.error.includes('ObjectId')) {
        errorMessage = 'This attraction cannot be added to favorites (invalid ID format)';
        console.error('ObjectId error detected:', err.response.data.error);
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!reviewText.trim()) {
      return;
    }
    
    try {
      // Replace with actual API call
      const response = await fetch(`/api/attractions/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: reviewRating,
          text: reviewText
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      // For demo purposes, add the review anyway
      const newReview = {
        id: Date.now().toString(),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.profileImage || 'https://via.placeholder.com/40'
        },
        rating: reviewRating,
        text: reviewText,
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setReviewRating(5);
    }
  };

  const handleShare = () => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: attraction?.name,
        text: `Check out ${attraction?.name} in Odisha!`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleGetDirections = () => {
    if (attraction?.location?.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.location.address)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !attraction) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: darkMode ? '#232333' : '#f0f4f8',
      color: darkMode ? '#e0e0e0' : 'inherit',
      pt: 4, 
      pb: 8 
    }}>
      <Container maxWidth="lg">
        {/* Back button */}
        <BackToAttractionsButton />
        
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            position: 'relative', 
            mb: 6, 
            overflow: 'hidden',
            bgcolor: darkMode ? '#1f1f2c' : 'white',
            borderRadius: 2
          }}
        >
          <Box
            component="img"
            src={attraction.images && attraction.images.length > 0 && attraction.images[0] ? attraction.images[0] : placeholderImage}
            alt={attraction.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              if (e.target.src !== placeholderImage) {
                e.target.src = fallbackImage;
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              p: 3
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: darkMode ? '#f0f0f0' : '#333' }}>
              {attraction.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={attraction.averageRating || attraction.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {attraction.averageRating || attraction.rating} ({attraction.reviewCount} reviews)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{attraction.location.address}</Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
              <Button 
                variant={isFavorite ? "contained" : "outlined"} 
                color={isFavorite ? "primary" : "inherit"}
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Directions />}
                onClick={handleGetDirections}
              >
                Get Directions
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Share />}
                onClick={handleShare}
              >
                Share
              </Button>
            </Box>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              {attraction.tags && attraction.tags.length > 0 ? (
                attraction.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    sx={{ mr: 1, mb: 1 }} 
                    onClick={() => navigate(`/attractions?tag=${tag}`)}
                  />
                ))
              ) : (
                <Chip 
                  label="General" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              )}
            </Box>

            {/* Main Content Section */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                mb: 4,
                bgcolor: darkMode ? '#2a2a3c' : 'white',
                color: darkMode ? '#e0e0e0' : 'inherit'
              }}
            >
              {/* Tabs */}
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="attraction tabs">
                    <Tab label="Overview" id="tab-0" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />
                    <Tab label="Weather" id="tab-1" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />
                    <Tab label="Reviews" id="tab-2" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />
                    <Tab label="Photos" id="tab-3" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />
                    <Tab label="Tips" id="tab-4" sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />
                  </Tabs>
                </Box>
                
                {/* Overview Tab */}
                <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ pt: 3 }}>
                  <Typography variant="body1" paragraph sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                    {attraction.longDescription}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, color: darkMode ? '#f0f0f0' : '#333' }}>
                    Facilities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {attraction.facilities && attraction.facilities.length > 0 ? (
                      attraction.facilities.map((facility, index) => (
                        <Chip key={index} label={facility} variant="outlined" sx={{ borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }} />
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                        No specific facilities information available.
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, color: darkMode ? '#f0f0f0' : '#333' }}>
                    Nearby Attractions
                  </Typography>
                  {attraction.nearbyAttractions && attraction.nearbyAttractions.length > 0 ? (
                    <List>
                      {attraction.nearbyAttractions.map((item, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <LocationOn color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                      No nearby attraction information available.
                    </Typography>
                  )}
                </Box>
                
                {/* Weather Tab */}
                <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ pt: 3 }}>
                  {weatherData ? (
                    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                      <Paper elevation={3} sx={{ 
                        p: 3, 
                        mb: 4, 
                        borderRadius: 2,
                        background: darkMode 
                          ? 'linear-gradient(135deg, #2a2a3c 0%, #1a1a2e 100%)'
                          : 'linear-gradient(135deg, #f6f8fb 0%, #e9f0f8 100%)',
                        border: darkMode ? '1px solid #333344' : '1px solid #e0e7ef',
                        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                        color: darkMode ? '#e0e0e0' : 'inherit'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, color: 'primary.main', fontSize: '1.2rem' }} />
                          Weather in Bhubaneswar
                          <Chip 
                            label="Real-time" 
                            size="small" 
                            color="success" 
                            sx={{ ml: 2, height: 20, fontSize: '0.7rem' }}
                          />
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 3 }}>
                          <Box sx={{ 
                            mr: { sm: 4 }, 
                            mb: { xs: 3, sm: 0 }, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            p: 2,
                            bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                            borderRadius: 2,
                            minWidth: 140,
                            textAlign: 'center'
                          }}>
                            <Typography variant="h1" sx={{ mb: 0, fontWeight: 'bold', fontSize: '4rem' }}>
                              {weatherData.temperature}°
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                              Feels like {weatherData.feelsLike || (weatherData.temperature + 4)}°
                            </Typography>
                            {weatherData.icon && (
                              <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                width: 70,
                                height: 70,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }}>
                                <img 
                                  src={getWeatherIconUrl(weatherData.condition)} 
                                  alt={weatherData.condition} 
                                  width="60"
                                  height="60"
                                />
                              </Box>
                            )}
                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            {weatherData.alert && (
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                bgcolor: '#f44336', 
                                color: 'white', 
                                p: 1.5, 
                                borderRadius: 1,
                                mb: 3,
                                width: 'fit-content',
                                maxWidth: '230px'
                              }}>
                                <Thermostat sx={{ mr: 1, fontSize: '1.1rem' }} />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {weatherData.alert?.type || 'Excessive Heat'}
                                </Typography>
                              </Box>
                            )}
                            
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mb: 3,
                              p: 2,
                              bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                              borderRadius: 2
                            }}>
                              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                {weatherData.condition === 'Sunny' && <WbSunny sx={{ mr: 1, color: '#f59e0b' }} />}
                                {weatherData.condition === 'Cloudy' && <Cloud sx={{ mr: 1, color: '#94a3b8' }} />}
                                {weatherData.condition === 'Rainy' && <Grain sx={{ mr: 1, color: '#0ea5e9' }} />}
                                {weatherData.condition}
                              </Typography>
                              <Typography variant="h6">
                                Precip: {weatherData.precipitation || 0}%
                              </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ 
                                  p: 2.5, 
                                  textAlign: 'center', 
                                  bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', 
                                  height: '100%',
                                  color: darkMode ? '#e0e0e0' : 'inherit' 
                                }}>
                                  <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>Humidity</Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 1 }}>{weatherData.humidity}%</Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2.5, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', height: '100%' }}>
                                  <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>Wind</Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 1 }}>{weatherData.windSpeed} kph</Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2.5, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', height: '100%' }}>
                                  <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>Air Quality</Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>{weatherData.airQuality || 'Satisfactory'}</Typography>
                                    <FiberManualRecord 
                                      sx={{ 
                                        color: weatherData.airQuality === 'Good' ? 'green' : 
                                               weatherData.airQuality === 'Poor' ? 'orange' :
                                               weatherData.airQuality === 'Very Poor' ? 'red' :
                                               weatherData.airQuality === 'Moderate' ? 'yellow' : 'lightgreen', 
                                        fontSize: 12, 
                                        ml: 1 
                                      }} 
                                    />
                                  </Box>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2.5, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', height: '100%' }}>
                                  <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>UV Index</Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 1 }}>High</Typography>
                                </Paper>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'medium', 
                          mt: 3, 
                          mb: 2, 
                          display: 'flex', 
                          alignItems: 'center',
                          pb: 1,
                          borderBottom: '1px solid rgba(0,0,0,0.1)'
                        }}>
                          <DateRange sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
                          3-Day Forecast
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {weatherData.forecast?.map((day, index) => (
                            <Grid item xs={4} key={index}>
                              <Paper sx={{ 
                                p: 2, 
                                textAlign: 'center', 
                                bgcolor: 'rgba(255,255,255,0.6)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                                  {day.day}
                                </Typography>
                                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                                  {day.temp}°
                                </Typography>
                                {day.icon ? (
                                  <img 
                                    src={getWeatherIconUrl(day.condition)} 
                                    alt={day.condition} 
                                    width="60"
                                    height="60"
                                  />
                                ) : (
                                  <Typography variant="body1">{day.condition}</Typography>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
                
                {/* Reviews Tab */}
                <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" sx={{ pt: 3 }}>
                  {user && (
                    <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="h6" gutterBottom>
                        Write a Review
                      </Typography>
                      <Box component="form" onSubmit={handleSubmitReview}>
                        <Box sx={{ mb: 2 }}>
                          <Typography component="legend">Your Rating</Typography>
                          <Rating
                            name="review-rating"
                            value={reviewRating}
                            onChange={(event, newValue) => {
                              setReviewRating(newValue);
                            }}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="Share your experience..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : null,
                            },
                            '& .MuiInputBase-input': {
                              color: darkMode ? '#e0e0e0' : 'inherit',
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <Button 
                                variant="contained" 
                                color="primary" 
                                disabled={!reviewText.trim()} 
                                type="submit"
                                endIcon={<Send />}
                              >
                                Submit
                              </Button>
                            )
                          }}
                        />
                      </Box>
                    </Paper>
                  )}
                  
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Paper 
                        key={review.id} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          borderRadius: 2,
                          bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                          color: darkMode ? '#e0e0e0' : 'inherit'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar src={review.user.avatar} alt={review.user.name} sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: darkMode ? '#f0f0f0' : 'inherit' }}>
                              {review.user.name}
                            </Typography>
                            <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ ml: 'auto' }}>
                            <Rating value={review.rating} readOnly size="small" />
                          </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, color: darkMode ? '#e0e0e0' : 'inherit' }}>
                          {review.text}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews yet. Be the first to review this attraction!
                    </Typography>
                  )}
                </Box>
                
                {/* Photos Tab */}
                <Box role="tabpanel" hidden={tabValue !== 3} id="tabpanel-3" sx={{ pt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>
                    Photo Gallery
                  </Typography>
                  {attraction.images && 
                   attraction.images.length > 0 && 
                   attraction.images.some(img => img && img.trim() !== '') ? (
                    <ImageList cols={2} gap={16}>
                      {attraction.images
                        .filter(img => img && img.trim() !== '')
                        .map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              alt={`${attraction.name} - image ${index + 1}`}
                              loading="lazy"
                              style={{ objectFit: 'cover', height: '200px', borderRadius: '4px' }}
                            />
                          </ImageListItem>
                        ))}
                    </ImageList>
                  ) : (
                    <Typography variant="body1" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                      No additional photos available.
                    </Typography>
                  )}
                </Box>
                
                {/* Tips Tab */}
                <Box role="tabpanel" hidden={tabValue !== 4} id="tabpanel-4" sx={{ pt: 3 }}>
                  {attraction.tips && attraction.tips.length > 0 ? (
                    <List>
                      {attraction.tips.map((tip, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <Star color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                      No visitor tips available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Info Card */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: darkMode ? '#2a2a3c' : 'white', color: darkMode ? '#e0e0e0' : 'inherit' }}>
              <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>
                Essential Information
              </Typography>
              <Divider sx={{ mb: 2, borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)' }} />
              
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AccessTime fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Opening Hours" 
                    secondary={attraction.openingHours?.monday || attraction.openingHours || 'Not available'} 
                    secondaryTypographyProps={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AttachMoney fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Entry Fee" 
                    secondary={
                      attraction.entryFee ? 
                        `Indians: ${attraction.entryFee.indian || 'Not available'}, Foreigners: ${attraction.entryFee.foreign || 'Not available'}` : 
                        'Not available'
                    } 
                    secondaryTypographyProps={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <WbSunny fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Best Time to Visit" 
                    secondary={attraction.bestTimeToVisit || 'Not available'} 
                    secondaryTypographyProps={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                  />
                </ListItem>
                
                {attraction.website && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Language fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Website" 
                      secondary={
                        <a 
                          href={attraction.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: darkMode ? '#8ab4f8' : '#1976d2' }}
                        >
                          {attraction.website}
                        </a>
                      } 
                    />
                  </ListItem>
                )}
                
                {attraction.phone && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Phone fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={attraction.phone}
                      secondaryTypographyProps={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
            
            {/* Similar Attractions */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: darkMode ? '#f0f0f0' : '#333' }}>
                Similar Attractions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                {similarAttractions.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4}>
                    <Card sx={{ 
                      display: 'flex', 
                      height: '100%',
                      bgcolor: darkMode ? '#2a2a3c' : 'white',
                      color: darkMode ? '#e0e0e0' : 'inherit',
                      borderRadius: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 5
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image || placeholderImage}
                        alt={item.name}
                        onError={(e) => {
                          if (e.target.src !== placeholderImage) {
                            e.target.src = fallbackImage;
                          }
                        }}
                      />
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={item.rating} size="small" precision={0.1} readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {item.rating}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Tips Section */}
            {(attraction.tips && attraction.tips.length > 0) && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: darkMode ? '#2a2a3c' : 'white', color: darkMode ? '#e0e0e0' : 'inherit' }}>
                <Typography variant="h6" gutterBottom>
                  Travel Tips
                </Typography>
                <List>
                  {attraction.tips.map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LightbulbIcon sx={{ color: darkMode ? amber[500] : amber[700] }} />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* Image Gallery */}
            {(attraction.images && attraction.images.length > 0) && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: darkMode ? '#2a2a3c' : 'white', color: darkMode ? '#e0e0e0' : 'inherit' }}>
                <Typography variant="h6" gutterBottom>
                  Photo Gallery
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Carousel
                    animation="slide"
                    navButtonsAlwaysVisible
                    indicators={true}
                    autoPlay={false}
                    navButtonsProps={{
                      style: {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                        color: darkMode ? '#000' : '#fff'
                      }
                    }}
                  >
                    {attraction.images.map((image, index) => (
                      <Box 
                        key={index}
                        component="img"
                        src={image || placeholderImage}
                        alt={`${attraction.name} - Image ${index + 1}`}
                        sx={{ 
                          width: '100%', 
                          height: { xs: 250, sm: 350, md: 450 },
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                        onError={(e) => {
                          if (e.target.src !== placeholderImage) {
                            e.target.src = fallbackImage;
                          }
                        }}
                      />
                    ))}
                  </Carousel>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AttractionDetailPage; 