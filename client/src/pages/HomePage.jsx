import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Rating,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Fade,
  Slide,
  Zoom,
  Alert,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Tooltip,
  AlertTitle
} from '@mui/material';
import { LocationOn, AccessTime, ArrowForward, WbSunny, KeyboardArrowDown, Cloud, Grain, AcUnit, Thunderstorm, Thermostat, FiberManualRecord, InfoOutlined, DarkMode, LightMode, PlayArrow } from '@mui/icons-material';
import api, { getAttractions, getCurrentWeather, getWeatherForecast, API_URL } from '../utils/api';
import { saveHomeScrollPosition, restoreHomeScrollPosition } from '../utils/scrollPosition';
import { motion } from 'framer-motion';
import { initAnimations, initScrollReveal } from '../script';
import { useScrollPosition } from '../utils/scrollPosition';
import { debugLog, logScrollEvent, initScrollDebugger } from '../utils/debug';
import { DarkModeContext } from '../contexts/DarkModeContext';

// Import images
import lingarajTempleImage from '../assets/images/Attractions/LingarajTemple.webp';
import jagannathTempleImage from '../assets/images/Attractions/JagannathTemple.png';
import nandankanZooParkImage from '../assets/images/Attractions/NandankanZoologicalPark.webp';
import udayagiriCavesImage from '../assets/images/Attractions/UdayagiriKhandagiriCaves.webp';

// Cultural heritage images
import odissiDanceImage from '../assets/images/Cultural Heritage/OdissiDance.jpg';
import pattachitraPaintingImage from '../assets/images/Cultural Heritage/PattachitraPainting.jpg';
import pipiliAppliqueWorkImage from '../assets/images/Cultural Heritage/PipiliAppliqueWork.jpg';
import sambalpuriSareesImage from '../assets/images/Cultural Heritage/SambalpuriSarees.jpeg';

// Cuisine images
import dalmaImage from '../assets/images/Cuisine/Dalma.jpg';
import chhenaPodaImage from '../assets/images/Cuisine/ChhenaPoda.webp';
import pakhalaBhataImage from '../assets/images/Cuisine/PakhalaBhata.webp';
import rasagolaImage from '../assets/images/Cuisine/Rasagola.webp';

// Placeholder image for attractions without images
const placeholderImage = lingarajTempleImage;

// Mock data for featured attractions
const mockFeaturedAttractions = [
  {
    _id: '1',
    name: 'Lingaraj Temple',
    type: 'temple',
    description: 'The Lingaraj Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar, the capital of the Indian state of Odisha.',
    images: [lingarajTempleImage],
    location: {
      address: 'Lingaraj Road, Old Town, Bhubaneswar, Odisha 751002'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Temple', 'Heritage', 'Religious', 'Architecture'],
    averageRating: 4.7,
    reviews: []
  },
  {
    _id: '2',
    name: 'Nandankanan Zoological Park',
    type: 'park',
    description: 'Nandankanan Zoological Park is a 400-hectare zoo and botanical garden near Bhubaneswar, Odisha, India.',
    images: [nandankanZooParkImage],
    location: {
      address: 'Nandankanan Road, Barang, Bhubaneswar, Odisha 754005'
    },
    bestTimeToVisit: 'November to February',
    tags: ['Wildlife', 'Nature', 'Family', 'Zoo'],
    averageRating: 4.5,
    reviews: []
  },
  {
    _id: '3',
    name: 'Udayagiri and Khandagiri Caves',
    type: 'monument',
    description: 'Udayagiri and Khandagiri Caves are partly natural and partly artificial caves of archaeological, historical and religious importance.',
    images: [udayagiriCavesImage],
    location: {
      address: 'Khandagiri, Bhubaneswar, Odisha 751030'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Historical', 'Caves', 'Architecture', 'Jain'],
    averageRating: 4.3,
    reviews: []
  },
  {
    _id: '4',
    name: 'Dhauli Shanti Stupa',
    type: 'monument',
    description: 'Dhauli Shanti Stupa is a Buddhist structure built during the 1970s atop the Dhauli hills.',
    images: [lingarajTempleImage], // Using another image as fallback
    location: {
      address: 'Dhauli Hills, Bhubaneswar, Odisha 752002'
    },
    bestTimeToVisit: 'October to March',
    tags: ['Buddhist', 'Peace Pagoda', 'Historical', 'Monument'],
    averageRating: 4.6,
    reviews: []
  }
];

// Beach images
import gopalpurBeachImage from '../assets/images/Beaches/GopalpurBeach.jpg';
import chillikaLakeImage from '../assets/images/Beaches/ChilikaLake.jpeg';
import puriBeachImage from '../assets/images/Beaches/PuriBeach.jpg';
import chandrabhaghBeachImage from '../assets/images/Beaches/ChandrabhaghBeach.webp';

// Mock data for beaches
const beachesData = [
  {
    id: '101',
    name: 'Gopalpur Beach',
    description: 'A tranquil beach town with colonial charm, perfect for a peaceful getaway.',
    image: gopalpurBeachImage,
    path: '/destination-page/gopalpur-beach'
  },
  {
    id: '102',
    name: 'Chilika Lake',
    description: 'Asia\'s largest brackish water lagoon, home to migratory birds and Irrawaddy dolphins.',
    image: chillikaLakeImage,
    path: '/destination-page/chilika-lake'
  },
  {
    id: 'puri-beach',
    name: 'Puri Beach',
    description: 'One of the most popular beaches on the eastern coast of India, known for its golden sands, religious significance, and captivating sunrises.',
    image: puriBeachImage,
    path: '/destination-page/puri-beach'
  },
  {
    id: 'chandrabhaga-beach',
    name: 'Chandrabhaga Beach',
    description: 'A serene and pristine beach located near the world-famous Konark Sun Temple. Known for its stunning sunrise views.',
    image: chandrabhaghBeachImage,
    path: '/destination-page/chandrabhaga-beach'
  }
];

// Mock data for cultural heritage
const culturalHeritageData = [
  {
    id: '201',
    name: 'Odissi Dance',
    description: 'One of the oldest classical dance forms of India, characterized by sensuousness and lyricism.',
    image: odissiDanceImage,
    path: '/cultural-insights/odissi'
  },
  {
    id: '202',
    name: 'Pattachitra Painting',
    description: 'Traditional cloth-based scroll painting with intricate details and vibrant colors.',
    image: pattachitraPaintingImage,
    path: '/cultural-insights/pattachitra'
  },
  {
    id: '203',
    name: 'Pipili Applique Work',
    description: 'Colorful patchwork textile that showcases the artistic heritage of Odisha.',
    image: pipiliAppliqueWorkImage,
    path: '/cultural-insights/pipili'
  },
  {
    id: '204',
    name: 'Sambalpuri Sarees',
    description: 'Traditional handloom sarees known for their unique ikat patterns and designs.',
    image: sambalpuriSareesImage,
    path: '/cultural-insights/sambalpuri'
  }
];

// Mock data for cuisine
const cuisineData = [
  {
    id: '301',
    name: 'Dalma',
    description: 'A traditional dish made with lentils and vegetables, served with rice.',
    image: dalmaImage
  },
  {
    id: '302',
    name: 'Chhena Poda',
    description: 'A sweet delicacy made from cottage cheese, sugar, and cardamom.',
    image: chhenaPodaImage
  },
  {
    id: '303',
    name: 'Pakhala Bhata',
    description: 'Fermented rice with water, served with fried fish, vegetables, and curd.',
    image: pakhalaBhataImage
  },
  {
    id: '304',
    name: 'Rasagola',
    description: 'Soft, spongy cheese balls soaked in sugar syrup, a famous Odia sweet.',
    image: rasagolaImage
  }
];

// Mock data for festivals
const festivalsData = [
  {
    id: '1',
    name: 'Rath Yatra 2025',
    description: 'The famous chariot festival of Lord Jagannath held annually in Puri.',
    image: 'https://www.daiwikhotels.com/wp-content/uploads/2024/07/The-Rathyatra-2.jpeg',
    date: 'June-July (Annual)',
    link: '/events/rath-yatra'
  },
  {
    id: '2',
    name: 'Konark Dance Festival',
    description: 'A five-day classical dance festival held against the backdrop of the Sun Temple.',
    image: 'https://images.wanderon.in/blogs/new/2024/11/konark-dance-music-festival.jpg',
    date: 'December (Annual)',
    link: '/events/konark-dance-festival'
  },
  {
    id: '3',
    name: 'International Sand Art Festival',
    description: 'Showcasing mesmerizing sand sculptures by artists from around the world on Chandrabhaga Beach.',
    image: 'https://jollymiles.com/wp-content/uploads/2020/11/ab56f-img_3121a.jpg?w=1024',
    date: 'December (Annual)',
    link: '/events/sand-art-festival'
  }
];

// Virtual tours data
const virtualToursData = [
  { 
    id: '1', 
    name: 'Lingaraj Temple', 
    image: lingarajTempleImage, 
    video: 'https://www.youtube.com/embed/ECjPVsPnLnE?autoplay=1',
    description: 'Experience the majestic Lingaraj Temple, one of the oldest in Bhubaneswar.',
    link: '/destination-page/lingaraj-temple' 
  },
  { 
    id: '2', 
    name: 'Sun Temple', 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg", 
    video: 'https://www.youtube.com/embed/ldQYHkfGq0k?autoplay=1',
    description: 'Explore the architectural marvel of Konark Sun Temple, a UNESCO World Heritage site.',
    link: '/destination-page/konark-sun-temple' 
  },
  { 
    id: '3', 
    name: 'Jagannath Temple', 
    image: jagannathTempleImage, 
    video: 'https://www.youtube.com/embed/TK8TkDG056I?autoplay=1',
    description: 'Visit the sacred Jagannath Temple, one of the most revered sites in India.',
    link: '/destination-page/jagannath-temple' 
  },
  { 
    id: '4', 
    name: 'Nandankanan Zoo', 
    image: nandankanZooParkImage, 
    video: 'https://www.youtube.com/embed/LIhe5AzsI48?autoplay=1',
    description: 'Walk through the diverse wildlife at Nandankanan Zoological Park.',
    link: '/destination-page/nandankanan-zoological-park' 
  }
];

// Mock attractions for initial display
const mockAttractions = [
  {
    id: 'lingaraj-temple',
    name: 'Lingaraj Temple',
    type: 'Temple',
    location: 'Bhubaneswar',
    description: 'One of the oldest and largest temples in Bhubaneswar, dedicated to Lord Shiva.',
    images: [lingarajTempleImage],
    rating: 4.7
  },
  {
    id: 'nandankanan',
    name: 'Nandankanan Zoological Park',
    type: 'Wildlife',
    location: 'Bhubaneswar',
    description: 'A premier zoological park known for its conservation programs and white tigers.',
    images: [nandankanZooParkImage],
    rating: 4.5
  },
  {
    id: 'udayagiri-khandagiri',
    name: 'Udayagiri and Khandagiri Caves',
    type: 'Historical',
    location: 'Bhubaneswar',
    description: 'Ancient caves with historical importance, featuring Jain sculptures and rock-cut architecture.',
    images: [udayagiriCavesImage],
    rating: 4.3
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    type: 'UNESCO Site',
    location: 'Konark',
    description: 'A 13th-century Sun temple known for its exquisite stone carvings and architectural grandeur.',
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg"], // Using Wikipedia image
    rating: 4.9
  },
  {
    id: 'brahmeswara-temple',
    name: 'Brahmeswara Temple',
    type: 'Temple',
    location: 'Bhubaneswar',
    description: 'A 9th-century temple dedicated to Lord Shiva, known for its intricate sculpture work and detailed carvings representing the mature phase of Kalinga architecture.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/c/c0/Bhubaneswar_Brahmeswara_Temple_%282%29.jpg'],
    rating: 4.4
  }
];

const HomePage = () => {
  const [featuredAttractions, setFeaturedAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');
  const [activeTour, setActiveTour] = useState(null);
  const [lastTabChange, setLastTabChange] = useState(Date.now());
  const tabDebounceTime = 250; // ms to prevent rapid tab switching
  const [loadingWeather, setLoadingWeather] = useState(true);
  
  // Refs for scrolling to sections
  const popularDestinationsRef = useRef(null);
  const beachesRef = useRef(null);
  const virtualToursRef = useRef(null);
  const culturalHeritageRef = useRef(null);
  const cuisineRef = useRef(null);
  const eventsRef = useRef(null);
  // Remove contact ref
  const weatherRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateWithScrollPosition } = useScrollPosition();
  
  // Replace the local darkMode state with the one from context
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Add to state variables in the HomePage component
  const [famousLocations, setFamousLocations] = useState([]);
  const [pristineBeaches, setPristineBeaches] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  
  // Add fallback weather data for when API calls fail
  const fallbackWeatherData = {
    temperature: 32,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    icon: '01d',
    forecast: [
      { day: 'Today', temp: 32, condition: 'Sunny', icon: '01d' },
      { day: 'Tomorrow', temp: 30, condition: 'Partly Cloudy', icon: '02d' },
      { day: 'Day 3', temp: 29, condition: 'Cloudy', icon: '03d' }
    ]
  };

  // Initialize only once after component mounts
  useEffect(() => {
    // Initialize animations only once - no scroll handlers needed here
    initAnimations();
    
    // Fetch data needed for the page
    const fetchFeaturedAttractions = async () => {
      try {
        setLoading(true);
        
        // Use mock data instead of API call
        console.log('Using mock data for featured attractions');
        setTimeout(() => {
          setFeaturedAttractions(mockFeaturedAttractions);
          setLoading(false);
          setError(null); // Clear any previous errors
        }, 500);
      } catch (error) {
        console.error('Error fetching attractions:', error);
        setError('Failed to load attractions. Please try again later.');
        
        // Use mock data if API call fails
        setFeaturedAttractions(mockFeaturedAttractions);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeatherData = async () => {
      try {
        setWeatherLoading(true);
        
        console.log('Attempting to fetch weather data...');
        // Fetch both current weather and forecast in parallel
        const [currentWeatherRes, forecastRes] = await Promise.all([
          getCurrentWeather('Bhubaneswar'),
          getWeatherForecast('Bhubaneswar')
        ]);
        
        // Update state with current weather data
        setWeatherData({
          ...currentWeatherRes.data,
          forecast: forecastRes.data // Add forecast data to weather object
        });
        setWeatherError(null);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError('Unable to load weather data. Using fallback data.');
        
        // Use fallback data when API fails
        setWeatherData(fallbackWeatherData);
      } finally {
        setWeatherLoading(false);
      }
    };
    
    // Handle scroll position and animations
    const handlePageSetup = () => {
      // Start hero animation after a short delay
      setTimeout(() => {
        setHeroAnimationComplete(true);
      }, 300);
      
      // Check if this is a page refresh
      const isPageRefresh = window.performance && 
        window.performance.navigation && 
        window.performance.navigation.type === 1;
      
      // Handle scrolling to sections based on URL hash
      if (location.hash) {
        setTimeout(() => {
          const hash = location.hash.substring(1);
          scrollToSection(hash);
        }, 500);
      } else if (isPageRefresh) {
        // If it's a refresh, always scroll to top
        window.scrollTo(0, 0);
        // Clear the saved position on refresh
        localStorage.removeItem('homePageScrollPosition');
      }
    };
    
    // Fetch section destinations
    fetchSectionDestinations();
    fetchFeaturedAttractions();
    fetchWeatherData();
    handlePageSetup();
    
    // Store scroll position on navigation away from the page
    const handleBeforeUnload = () => {
      localStorage.setItem('homePageScrollPosition', window.scrollY.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);
  
  // Function to handle scroll animations and track active section - simplified, only for manual scroll
  const handleScroll = useCallback(() => {
    // Tracking section visibility is now handled by IntersectionObserver only
    // This is just kept as a fallback and for direct programmatic scrolling
  }, []);
  
  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    const sectionRefs = {
      'weather': weatherRef,
      'destinations': popularDestinationsRef,
      'beaches': beachesRef,
      'virtual-tours': virtualToursRef,
      'cultural-heritage': culturalHeritageRef,
      'cuisine': cuisineRef,
      'events': eventsRef,
    };
    
    // First update the active tab
    setActiveTab(sectionId);
    
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      // Set a small timeout to ensure DOM updates
      setTimeout(() => {
        const yOffset = -70; // Adjust offset to account for fixed header
        const element = ref.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        
        console.log(`Scrolling to section: ${sectionId} at position ${y}`);
      }, 10);
    }
  };

  // Add useEffect for IntersectionObserver to track sections in view (primary method)
  useEffect(() => {
    // Only setup if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) return;
    
    // Options for the observer
    const options = {
      root: null, // viewport
      rootMargin: '-10% 0px -10% 0px', // Add margin to adjust when sections are considered visible
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5] // observe at these visibility thresholds
    };
    
    // Create intersection observer for section tracking
    const sectionObserver = new IntersectionObserver((entries) => {
      // Get entries with highest intersection ratio
      let bestEntry = null;
      let bestRatio = 0;
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      });
      
      // If we have a best entry, update the active tab with debouncing
      if (bestEntry && bestRatio > 0.1) {
        const newActiveTab = bestEntry.target.id;
        const now = Date.now();
        if (now - lastTabChange >= tabDebounceTime) {
          setActiveTab(newActiveTab);
          setLastTabChange(now);
        }
      }
    }, options);
    
    // Create another IntersectionObserver for animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animation is triggered, no need to observe anymore
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    // Get all section elements and observe them for section tracking
    const sections = [
      document.getElementById('weather'),
      document.getElementById('destinations'),
      document.getElementById('beaches'),
      document.getElementById('virtual-tours'),
      document.getElementById('cultural-heritage'),
      document.getElementById('cuisine'),
      document.getElementById('events'),
    ];
    
    sections.forEach(section => {
      if (section) {
        sectionObserver.observe(section);
      }
    });
    
    // Observe all reveal elements for animations
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
      animationObserver.observe(element);
    });
    
    // Cleanup
    return () => {
      sections.forEach(section => {
        if (section) {
          sectionObserver.unobserve(section);
        }
      });
      
      reveals.forEach(element => {
        animationObserver.unobserve(element);
      });
    };
  }, [lastTabChange, tabDebounceTime]);

  // Section title with underline style
  const SectionTitle = ({ title, subtitle }) => (
    <Box sx={{ textAlign: 'center', mb: 4 }} className="reveal fade-bottom">
      <Typography variant="h3" component="h2" gutterBottom sx={{ color: darkMode ? '#f0f0f0' : '#000000' }}>
        {title}
      </Typography>
      <Divider sx={{ 
        width: '60px', 
        mx: 'auto', 
        borderColor: 'secondary.main', 
        borderWidth: 3,
        mb: 2
      }} />
      {subtitle && (
        <Typography variant="subtitle1" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  // Separate useEffect for scroll position restoration
  useEffect(() => {
    // The scroll position is now handled by the useScrollPosition hook
    // This is just a placeholder for any future home page specific logic
  }, [location]);

  // Function to handle navigation to other pages
  const handleNavigation = (path) => {
    console.log(`Navigation triggered to: ${path}`);
    
    // Save the current scroll position before navigating
    const scrollY = window.scrollY;
    console.log(`Saving current scroll position: ${scrollY}`);
    localStorage.setItem('homePageScrollPosition', scrollY.toString());
    
    // Navigate using standard navigate function
    navigate(path);
  };

  // Force scroll restoration when component mounts and improve section tracking
  useEffect(() => {
    // Initialize section tracking after a short delay to ensure all sections are rendered
    setTimeout(() => {
      handleScroll(); // Initial check for active section
    }, 500);

    // Add event listener for scroll events with a throttled approach to improve performance
    let isScrolling;
    const scrollListener = () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);
      
      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(() => {
        handleScroll();
      }, 50); // Small delay for better performance
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    
    // Also handle scroll on resize which can change section visibility
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(isScrolling);
    };
  }, [handleScroll]);

  // Weather section content
  const getWeatherIcon = (condition) => {
    if (!condition) return <WbSunny sx={{ fontSize: 48, mr: 2, color: '#f59e0b' }} />;
    
    const condition_lower = condition.toLowerCase();
    
    if (condition_lower === 'clear' || condition_lower.includes('sunny')) {
      return <WbSunny sx={{ fontSize: 48, mr: 2, color: '#f59e0b' }} />;
    } else if (condition_lower === 'clouds' || condition_lower.includes('cloud') || condition_lower.includes('overcast')) {
      return <Cloud sx={{ fontSize: 48, mr: 2, color: '#94a3b8' }} />;
    } else if (condition_lower === 'rain' || condition_lower.includes('rain') || condition_lower.includes('drizzle') || condition_lower.includes('shower')) {
      return <Grain sx={{ fontSize: 48, mr: 2, color: '#0ea5e9' }} />;
    } else if (condition_lower === 'snow' || condition_lower.includes('snow') || condition_lower.includes('sleet') || condition_lower.includes('hail')) {
      return <AcUnit sx={{ fontSize: 48, mr: 2, color: '#e2e8f0' }} />;
    } else if (condition_lower === 'thunderstorm' || condition_lower.includes('storm') || condition_lower.includes('thunder')) {
      return <Thunderstorm sx={{ fontSize: 48, mr: 2, color: '#6b21a8' }} />;
    } else if (condition_lower === 'mist' || condition_lower === 'fog' || condition_lower === 'haze' || condition_lower.includes('mist') || condition_lower.includes('fog') || condition_lower.includes('haze')) {
      return <Cloud sx={{ fontSize: 48, mr: 2, color: '#cbd5e1' }} />;
    } else if (condition_lower === 'dust' || condition_lower === 'sand' || condition_lower === 'ash' || condition_lower.includes('dust') || condition_lower.includes('sand')) {
      return <Cloud sx={{ fontSize: 48, mr: 2, color: '#d97706' }} />; // Orange-ish for dust/sand
    } else if (condition_lower === 'squall' || condition_lower === 'tornado') {
      return <Thunderstorm sx={{ fontSize: 48, mr: 2, color: '#7c3aed' }} />; // Purple for severe weather
    } else {
      // Default icon for unknown conditions
      console.log('Unknown weather condition:', condition);
      return <WbSunny sx={{ fontSize: 48, mr: 2, color: '#f59e0b' }} />;
    }
  };
  
  const getWeatherTip = (condition, temp) => {
    if (!condition) return 'Check the current weather for outdoor planning.';
    
    const condition_lower = condition.toLowerCase();
    const temperature = temp || 0;
    
    if (condition_lower === 'thunderstorm' || condition_lower.includes('thunder') || condition_lower.includes('storm')) {
      return 'Thunderstorm warning! Stay indoors and avoid open areas. Plan for indoor attractions today.';
    } else if (condition_lower === 'drizzle' || condition_lower.includes('drizzle')) {
      return 'Light rain expected. Carry a light raincoat or umbrella for your sightseeing today.';
    } else if (condition_lower === 'rain' || condition_lower.includes('rain') || condition_lower.includes('shower')) {
      return 'Rainy weather today. Carry an umbrella and plan for indoor attractions or museums.';
    } else if (condition_lower === 'snow' || condition_lower.includes('snow')) {
      return 'Snowy conditions! Dress warmly in layers and be cautious while traveling.';
    } else if (condition_lower === 'mist' || condition_lower === 'fog' || condition_lower.includes('mist') || condition_lower.includes('fog')) {
      return 'Foggy conditions. Drive carefully and allow extra time for travel between attractions.';
    } else if (condition_lower === 'clear' && temperature > 30) {
      return 'It\'s hot and sunny today! Stay hydrated, wear light clothing, and don\'t forget sunscreen for outdoor sightseeing.';
    } else if (condition_lower === 'clear' && temperature < 15) {
      return 'Clear but cool weather. Carry a jacket for comfort, especially in the evening.';
    } else if (condition_lower === 'clear') {
      return 'Perfect clear weather for sightseeing! Enjoy the beautiful attractions of Bhubaneswar.';
    } else if (condition_lower === 'clouds' || condition_lower.includes('cloud')) {
      return 'Cloudy but comfortable weather. Great for outdoor sightseeing without harsh sun.';
    } else if (condition_lower.includes('dust') || condition_lower.includes('sand')) {
      return 'Dusty conditions today. Consider wearing a mask and sunglasses if spending time outdoors.';
    } else if (temperature > 35) {
      return 'Extreme heat alert! Stay hydrated, seek shade often, and consider indoor activities during peak hours.';
    } else if (temperature < 10) {
      return 'Cold weather today. Bundle up with warm clothing for comfortable sightseeing.';
    } else {
      return 'Enjoy exploring the attractions of Bhubaneswar today!';
    }
  };

  // Create a theme context effect to apply theme to the entire page
  useEffect(() => {
    // Apply dark mode styles to the body
    if (darkMode) {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#e0e0e0';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    return () => {
      // Cleanup when component unmounts
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, [darkMode]);

  // Add this function to fetch section destinations
  const fetchSectionDestinations = async () => {
    try {
      setSectionsLoading(true);
      
      console.log('Fetching sections from API...');
      // Make sure we're using the API client that has the baseURL configured
      // The API client should add the /api prefix from the baseURL
      const response = await api.get('/sections');
      
      // Log the full request URL for debugging
      console.log(`Sections API URL: ${API_URL}/sections`);
      
      if (response.data) {
        console.log('HomePage - Fetched section destinations:', response.data);
        
        if (response.data.famousLocations) {
          console.log('HomePage - Famous location destination links:');
          response.data.famousLocations.forEach(loc => {
            console.log(`Location: ${loc.name}, ID: ${loc._id}, Link: /destination/${loc._id}`);
          });
        }
        
        if (response.data.pristineBeaches) {
          console.log('HomePage - Pristine beaches destination links:');
          response.data.pristineBeaches.forEach(beach => {
            console.log(`Beach: ${beach.name}, ID: ${beach._id}, Link: /destination/${beach._id}`);
          });
        }
        
        // Make sure we store the complete destination objects
        setFamousLocations(response.data.famousLocations || []);
        setPristineBeaches(response.data.pristineBeaches || []);
      }
      
      setSectionsLoading(false);
    } catch (err) {
      console.error('Error fetching section destinations:', err);
      console.error('API URL used:', `${API_URL}/sections`);
      setSectionsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {/* Hero Section */}
        <Box 
          id="hero" 
          sx={{ 
            color: darkMode ? '#e0e0e0' : '#ffffff',
            py: 12,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.55)), url("https://i.pinimg.com/originals/c2/6e/05/c26e0515284a987a1dc63d2b59d79be6.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            height: '90vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }} 
                  className="slide-in-left hero-title"
                >
                  Discover the Magic of
                </Typography>
                <Typography 
                  variant="h2" 
                  component="div" 
                  gutterBottom 
                  sx={{ fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }} 
                  className="slide-in-right hero-title"
                >
                  Bhubaneswar
                </Typography>
              </Box>
            </Fade>
            
            <Fade in={true} timeout={1500} style={{ transitionDelay: '300ms' }}>
              <Typography 
                variant="h5" 
                sx={{ mb: 4, color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }} 
                className="fade-in hero-subtitle"
              >
                Explore ancient temples, pristine beaches, and rich cultural heritage
              </Typography>
            </Fade>
            
            <Zoom in={heroAnimationComplete} timeout={800} style={{ transitionDelay: '600ms' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                  onClick={() => scrollToSection('destinations')}
                  className="slide-up hero-button"
                >
                  Explore Now
                </Button>
              </Box>
            </Zoom>
          </Container>
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 40, 
              left: '50%', 
              transform: 'translateX(-50%)',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateX(-50%) translateY(0)'
                },
                '40%': {
                  transform: 'translateX(-50%) translateY(-20px)'
                },
                '60%': {
                  transform: 'translateX(-50%) translateY(-10px)'
                }
              }
            }}
          >
            <KeyboardArrowDown 
              sx={{ 
                fontSize: 40, 
                cursor: 'pointer',
                color: 'white'
              }} 
              onClick={() => scrollToSection('destinations')}
            />
          </Box>
        </Box>

        {/* Navigation Tabs for Smooth Scrolling */}
        <Box 
          sx={{ 
            bgcolor: darkMode ? '#121212' : 'white', 
            color: darkMode ? 'white' : 'inherit',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1050, // Higher z-index to ensure it stays on top
            py: 1.5,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={1} justifyContent="center" alignItems="center">
              <Grid item sx={{ position: 'absolute', left: { xs: 16, sm: 24 } }}>
                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                  <IconButton 
                    onClick={toggleDarkMode} 
                    color="primary"
                    sx={{ 
                      p: 1,
                      bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      '&:hover': { 
                        bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    {darkMode ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('weather')}
                  className="weather-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'weather' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'weather' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  <WbSunny sx={{ mr: 0.5, fontSize: '1rem' }} />
                  Weather
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('destinations')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'destinations' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'destinations' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  Destinations
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('beaches')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'beaches' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'beaches' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  Beaches
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('virtual-tours')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'virtual-tours' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'virtual-tours' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  AR/VR Tours
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('cultural-heritage')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'cultural-heritage' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'cultural-heritage' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  Culture
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('cuisine')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'cuisine' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'cuisine' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  Cuisine
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  onClick={() => scrollToSection('events')}
                  className="destination-tab"
                  sx={{ 
                    mx: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                    color: activeTab === 'events' ? 'primary.main' : (darkMode ? 'white' : 'inherit'),
                    borderBottom: activeTab === 'events' ? '2px solid #ff6b6b' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      color: 'primary.main'
                    },
                    '&:focus': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                      outline: 'none'
                    }
                  }}
                >
                  Events
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Weather Section - Moved to top */}
        <Box 
          ref={weatherRef} 
          id="weather"
          sx={{ 
            bgcolor: darkMode ? '#232333' : '#f0f4f8', 
            py: 6, 
            borderTop: '1px solid #e1e8ed', 
            borderBottom: '1px solid #e1e8ed',
            scrollMarginTop: '70px' // adjusted for better scrolling with AppBar
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Weather Forecast" 
              subtitle="Real-time weather information for Bhubaneswar" 
            />
            
            {weatherLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress color={darkMode ? "secondary" : "primary"} />
              </Box>
            ) : weatherError ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {weatherError}
              </Alert>
            ) : weatherData && (
              <Box>
                {weatherError && (
                  <Alert severity="info" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AlertTitle>Weather Information</AlertTitle>
                    {weatherError} We're showing fallback data which may not reflect current conditions.
                  </Alert>
                )}
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    background: darkMode 
                      ? 'linear-gradient(135deg, #2a2a3c 0%, #1a1a2e 100%)'
                      : 'linear-gradient(135deg, #f6f8fb 0%, #e9f0f8 100%)',
                    border: darkMode ? '1px solid #333344' : '1px solid #e0e7ef',
                    boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                    maxWidth: 1000,
                    mx: 'auto',
                    color: darkMode ? '#e0e0e0' : 'inherit'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ 
                      mr: { sm: 4 }, 
                      mb: { xs: 2, sm: 0 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      flexDirection: 'column',
                      position: 'relative',
                      p: 2,
                      bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                      borderRadius: 2,
                      minWidth: 120,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h2" component="h2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {weatherData.temperature}°
                      </Typography>
                      <Typography variant="body1" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 1 }}>
                        Feels like {weatherData.feelsLike}°
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                        width: 60,
                        height: 60,
                        boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
                      }}>
                        {getWeatherIcon(weatherData.condition)}
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {weatherData.alert && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f44336', 
                          color: 'white', 
                          p: 1, 
                          mb: 2, 
                          borderRadius: 1,
                          width: 'fit-content',
                          maxWidth: '200px'
                        }}>
                          <Thermostat sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {weatherData.alert.type}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 2,
                        p: 2,
                        bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                        borderRadius: 1
                      }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          {weatherData.icon ? (
                            <img 
                              src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`} 
                              alt={weatherData.condition} 
                              style={{ 
                                marginRight: '8px',
                                width: '32px',
                                height: '32px',
                                filter: darkMode ? 'brightness(1.2)' : 'none' 
                              }}
                              onError={(e) => {
                                console.log('Failed to load weather icon, using fallback');
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {getWeatherIcon(weatherData.condition)}
                          {weatherData.condition}
                          {weatherData.description && weatherData.description !== weatherData.condition.toLowerCase() && (
                            <Typography variant="body2" component="span" sx={{ ml: 1, color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                              ({weatherData.description})
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="h6">
                          Precip: {weatherData.precipitation || 0}%
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }}>
                            <Typography variant="body2" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>Humidity</Typography>
                            <Typography variant="h6" sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>{weatherData.humidity}%</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }}>
                            <Typography variant="body2" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>Wind</Typography>
                            <Typography variant="h6" sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>{weatherData.windSpeed} kph</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }}>
                            <Typography variant="body2" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>Air Quality</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>{weatherData.airQuality}</Typography>
                              <FiberManualRecord sx={{ 
                                color: weatherData.airQuality === 'Good' ? 'green' : 
                                       weatherData.airQuality === 'Poor' ? 'orange' :
                                       weatherData.airQuality === 'Very Poor' ? 'red' :
                                       weatherData.airQuality === 'Moderate' ? 'yellow' : 'lightgreen', 
                                fontSize: 12, 
                                ml: 1 
                              }} />
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }}>
                            <Typography variant="body2" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>UV Index</Typography>
                            <Typography variant="h6" sx={{ color: darkMode ? '#f0f0f0' : 'inherit' }}>High</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, p: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                          <InfoOutlined sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                          {getWeatherTip(weatherData.condition, weatherData.temperature)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Weather Forecast Section */}
                  {weatherData.forecast && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: darkMode ? '#f0f0f0' : '#333' }}>
                        3-Day Forecast
                      </Typography>
                      <Grid container spacing={2}>
                        {weatherData.forecast.map((day, index) => (
                          <Grid item xs={12} sm={4} key={index}>
                            <Paper 
                              sx={{ 
                                p: 2, 
                                display: 'flex', 
                                alignItems: 'center', 
                                backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                                height: '100%',
                                borderRadius: 2
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Box sx={{ mr: 2, minWidth: '60px', textAlign: 'center' }}>
                                  {day.icon ? (
                                    <img 
                                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                                      alt={day.condition} 
                                      width="60" 
                                      height="60"
                                      style={{ filter: darkMode ? 'brightness(1.2)' : 'none' }}
                                      onError={(e) => {
                                        console.log('Failed to load forecast icon, using fallback');
                                        e.target.style.display = 'none';
                                        // This will make the fallback icon show
                                        const iconContainer = e.target.parentNode;
                                        if (iconContainer) {
                                          const fallbackIcon = document.createElement('div');
                                          fallbackIcon.className = 'fallback-icon';
                                          iconContainer.appendChild(fallbackIcon);
                                        }
                                      }}
                                    />
                                  ) : (
                                    getWeatherIcon(day.condition)
                                  )}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: darkMode ? '#f0f0f0' : '#333' }}>
                                    {day.day}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                                    {day.condition}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right', minWidth: '60px' }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? '#f0f0f0' : '#333' }}>
                                    {day.temp}°
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </Container>
        </Box>

        {/* Popular Destinations Section */}
        <Box 
          ref={popularDestinationsRef} 
          id="destinations"
          data-section="destinations"
          sx={{ 
            py: 6, 
            bgcolor: darkMode ? '#232333' : '#f0f4f8',
            color: darkMode ? '#e0e0e0' : 'inherit',
            scrollMarginTop: '70px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Popular Destinations" 
              subtitle="Explore the best tourist attractions in and around Bhubaneswar" 
            />

            <Box sx={{ mb: 6 }} className="reveal fade-bottom">
              <Typography variant="h4" component="h3" gutterBottom sx={{ 
                borderLeft: '4px solid #ff6b6b', 
                pl: 2,
                fontWeight: 'bold',
                color: darkMode ? '#f0f0f0' : '#000000'
              }}>
                Famous Locations
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : (
              <>
                <Box sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: darkMode ? 'rgba(42, 42, 60, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 2,
                  border: `1px dashed ${darkMode ? '#4a4a6a' : '#cccccc'}`
                }}>
                  {sectionsLoading ? (
                    <CircularProgress size={40} color="primary" />
                  ) : famousLocations.length === 0 ? (
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: darkMode ? '#a0a0a0' : '#666666' }}>
                      Famous locations content will be dynamically loaded from the database.
                    </Typography>
                  ) : (
                    <Grid container spacing={3}>
                      {famousLocations.map((location) => (
                        <Grid item xs={12} sm={6} md={4} key={location._id}>
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 2,
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-10px)',
                                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                              },
                              bgcolor: darkMode ? '#2a2a3c' : 'white',
                              color: darkMode ? '#e0e0e0' : 'inherit'
                            }}
                          >
                            <CardMedia
                              component="img"
                              height={220}
                              image={location.images && location.images[0] ? location.images[0] : placeholderImage}
                              alt={location.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', color: darkMode ? '#f0f0f0' : '#333333' }}>
                                {location.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: darkMode ? '#a0a0a0' : '#5a5a5a' }}>
                                {location.overview ? (location.overview.substring(0, 120) + '...') : 'No description available.'}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                              <Button 
                                size="small" 
                                color="primary" 
                                component={Link} 
                                to={`/attraction/${location._id}`}
                                endIcon={<ArrowForward />}
                              >
                                Explore
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} className="reveal fade-bottom">
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={() => {
                      const path = "/attractions";
                      console.log(`Navigating to: ${path}`);
                      handleNavigation(path);
                    }}
                    endIcon={<ArrowForward />}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: 50,
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: 4,
                        bgcolor: 'secondary.dark'
                      },
                      '&:focus': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                        outline: 'none'
                      }
                    }}
                  >
                    More Attractions
                  </Button>
                </Box>
              </>
            )}
          </Container>
        </Box>

        {/* Pristine Beaches Section */}
        <Box 
          id="beaches" 
          ref={beachesRef}
          sx={{ 
            py: 8,
            bgcolor: darkMode ? '#232333' : '#f0f4f8',
            color: darkMode ? '#e0e0e0' : 'inherit',
            scrollMarginTop: '70px'
          }}
        >
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ 
                borderLeft: '4px solid #ff6b6b', 
                pl: 2,
                fontWeight: 'bold',
                color: darkMode ? '#f0f0f0' : '#000000'
              }}>
                Pristine Beaches
              </Typography>
            </Box>

            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: darkMode ? 'rgba(42, 42, 60, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: 2,
              border: `1px dashed ${darkMode ? '#4a4a6a' : '#cccccc'}`
            }}>
              {sectionsLoading ? (
                <CircularProgress size={40} color="primary" />
              ) : pristineBeaches.length === 0 ? (
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: darkMode ? '#a0a0a0' : '#666666' }}>
                  Beach content will be dynamically loaded from the database.
                </Typography>
              ) : (
                <Grid container spacing={4}>
                  {pristineBeaches.map((beach) => (
                    <Grid item key={beach._id} xs={12} sm={6}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        bgcolor: darkMode ? '#2a2a3c' : 'white',
                        color: darkMode ? '#e0e0e0' : 'inherit',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.4)' : 6
                        }
                      }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={beach.images && beach.images[0] ? beach.images[0] : placeholderImage}
                          alt={beach.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h3" sx={{ color: darkMode ? '#f0f0f0' : '#333333' }}>
                            {beach.name}
                          </Typography>
                          <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5a5a5a'} paragraph>
                            {beach.overview ? (beach.overview.substring(0, 150) + '...') : 'No description available.'}
                          </Typography>
                          <Button 
                            variant="contained" 
                            color="secondary"
                            component={Link}
                            to={`/attraction/${beach._id}`}
                            sx={{ 
                              borderRadius: 50,
                              transition: 'all 0.3s',
                              '&:hover': {
                                transform: 'translateX(5px)',
                                bgcolor: 'secondary.dark'
                              },
                              '&:focus': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                                outline: 'none'
                              }
                            }}
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="secondary"
                component="a"
                href="/attractions?category=beach"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Navigating to: /attractions?category=beach");
                  handleNavigation("/attractions?category=beach");
                }}
                endIcon={<ArrowForward />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 50,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                    bgcolor: 'secondary.dark'
                  },
                  '&:focus': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 2px rgba(255, 107, 107, 0.2)',
                    outline: 'none'
                  }
                }}
              >
                More Beaches & Waterways
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Virtual Tours Section */}
        <Box 
          id="virtual-tours" 
          ref={virtualToursRef}
          sx={{ 
            py: 8,
            bgcolor: darkMode ? '#121212' : '#ffffff',
            color: darkMode ? '#e0e0e0' : 'inherit',
            scrollMarginTop: '70px'
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Virtual Tours" 
              subtitle="Experience Bhubaneswar's attractions through immersive AR/VR tours" 
            />
            
            <Box className="virtual-tour-container" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              {/* Tour Options Panel */}
              <Box 
                className="tour-options-panel" 
                sx={{ 
                  width: { xs: '100%', md: '30%' },
                  bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  p: 2
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#f0f0f0' : '#333', mb: 2, borderBottom: '2px solid #ff6b6b', pb: 1, display: 'inline-block' }}>
                  Select a Tour
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {virtualToursData.map((tour, index) => (
                    <Box 
                      key={tour.id}
                      className={`tour-option ${activeTourIndex === index ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTourIndex(index);
                        setIsVideoPlaying(false);
                        setVideoError(false);
                      }}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        bgcolor: activeTourIndex === index 
                          ? (darkMode ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)')
                          : 'transparent',
                        border: activeTourIndex === index 
                          ? '1px solid #ff6b6b' 
                          : darkMode 
                            ? '1px solid rgba(255,255,255,0.1)' 
                            : '1px solid rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255,107,107,0.15)' : 'rgba(255,107,107,0.07)',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img 
                          src={tour.image} 
                          alt={tour.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            filter: darkMode ? 'brightness(0.85)' : 'none' 
                          }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: darkMode ? '#f0f0f0' : '#333', fontWeight: 'medium' }}>
                          {tour.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                          {tour.description.split('.')[0]}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Tour Preview Area */}
              <Box 
                className="tour-preview-container" 
                sx={{ 
                  width: { xs: '100%', md: '70%' },
                  position: 'relative',
                  bgcolor: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: { xs: 300, sm: 400, md: 450 }
                }}
              >
                {isVideoPlaying ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <iframe
                      src={virtualToursData[activeTourIndex].video}
                      title={virtualToursData[activeTourIndex].name}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={() => setVideoError(true)}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    ></iframe>
                    
                    {videoError && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white'
                        }}
                      >
                        <Typography variant="body1">
                          Video could not be loaded. Please try again later.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img 
                      className="tour-preview"
                      src={virtualToursData[activeTourIndex].image} 
                      alt={virtualToursData[activeTourIndex].name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: darkMode ? 'brightness(0.85)' : 'none'
                      }} 
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.6)'
                        }
                      }}
                    >
                      <IconButton 
                        sx={{ 
                          color: 'white', 
                          bgcolor: 'rgba(255,107,107,0.8)', 
                          '&:hover': { bgcolor: 'rgba(255,107,107,1)' },
                          width: 64,
                          height: 64
                        }}
                        onClick={() => {
                          setIsVideoPlaying(true);
                          setVideoError(false);
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 32 }} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%',
                    p: 2,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {virtualToursData[activeTourIndex].name}
                    </Typography>
                    <Typography variant="body2" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {virtualToursData[activeTourIndex].description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Cultural Heritage Section */}
        <Box 
          id="cultural-heritage" 
          ref={culturalHeritageRef}
          sx={{ 
            py: 8,
            bgcolor: darkMode ? '#121212' : '#ffffff',
            color: darkMode ? '#e0e0e0' : 'inherit',
            scrollMarginTop: '70px'
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Cultural Heritage" 
              subtitle="Explore the rich cultural traditions and art forms of Odisha" 
            />
            
            <Grid container spacing={4}>
              {culturalHeritageData.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={3} className="reveal fade-bottom">
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    bgcolor: darkMode ? '#2a2a3c' : 'white',
                    color: darkMode ? '#e0e0e0' : 'inherit',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.4)' : 6
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ color: darkMode ? '#f0f0f0' : '#333333' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5a5a5a'} paragraph>
                        {item.description}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        component={Link}
                        to={item.path}
                        sx={{ 
                          borderRadius: 50,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            bgcolor: 'secondary.dark'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} className="reveal fade-bottom">
              <Button 
                variant="contained" 
                color="secondary"
                component={Link}
                to="/cultural-insights"
                endIcon={<ArrowForward />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 50,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Explore Cultural Heritage
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Local Cuisine Section */}
        <Box 
          id="cuisine" 
          ref={cuisineRef} 
          sx={{ 
            bgcolor: darkMode ? '#232333' : 'grey.100', 
            color: darkMode ? '#e0e0e0' : 'inherit',
            py: 8,
            scrollMarginTop: '70px'
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Local Cuisine" 
              subtitle="Savor the authentic flavors of Odisha" 
            />
            
            <Grid container spacing={4}>
              {cuisineData.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={3} className="reveal fade-bottom">
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    bgcolor: darkMode ? '#2a2a3c' : 'white',
                    color: darkMode ? '#e0e0e0' : 'inherit',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.4)' : 6
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ color: darkMode ? '#f0f0f0' : '#333333' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5a5a5a'} paragraph>
                        {item.description}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => {
                          const cuisinePath = `/cuisine/${item.id}`;
                          console.log(`Navigating to cuisine: ${cuisinePath}`);
                          handleNavigation(cuisinePath);
                        }}
                        sx={{ 
                          borderRadius: 50,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            bgcolor: 'secondary.dark'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} className="reveal fade-bottom">
              <Button 
                variant="contained" 
                color="secondary"
                component="a"
                href="/restaurants"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Navigating to: /restaurants");
                  handleNavigation("/restaurants");
                }}
                endIcon={<ArrowForward />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 50,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Explore Local Cuisine
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Festivals & Events Section */}
        <Box 
          id="events" 
          ref={eventsRef}
          sx={{ 
            py: 8,
            bgcolor: darkMode ? '#121212' : '#ffffff',
            color: darkMode ? '#e0e0e0' : 'inherit',
            scrollMarginTop: '70px'
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle 
              title="Festivals & Events" 
              subtitle="Experience the vibrant culture and festivities of Odisha" 
            />
            
            <Grid container spacing={4} justifyContent="center">
              {festivalsData.map((event) => (
                <Grid item key={event.id} xs={12} sm={6} md={4} className="reveal fade-bottom">
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    bgcolor: darkMode ? '#2a2a3c' : 'white',
                    color: darkMode ? '#e0e0e0' : 'inherit',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.4)' : 6
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={event.image}
                      alt={event.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ color: darkMode ? '#f0f0f0' : '#333333' }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : '#5a5a5a'} paragraph>
                        {event.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTime sx={{ fontSize: 20, mr: 1, color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }} />
                        <Typography variant="body2" color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>
                          {event.date}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        component={Link}
                        to={event.link}
                        sx={{ 
                          borderRadius: 50,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            bgcolor: 'secondary.dark'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </motion.div>
  );
};

export default HomePage; 
