import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  PaginationItem,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Snackbar,
  ImageList,
  ImageListItem,
  InputAdornment,
  CardActionArea,
  Fade,
  Zoom,
  Tooltip
} from '@mui/material';
import { 
  LocationOn, 
  AccessTime, 
  Search, 
  Share, 
  Favorite, 
  FavoriteBorder, 
  Close,
  DirectionsWalk,
  Info,
  ArrowForward,
  KeyboardArrowDown,
  ViewAgenda
} from '@mui/icons-material';
import { 
  getAttractions,
  fetchWikipediaImages,
  getHomepageImagesForAttractions
} from '../utils/api';
import { motion } from 'framer-motion';

// Import background image for hero section
import konarkTempleImage from '../assets/images/Attractions/LingarajTemple.webp';

// Default images for missing or error cases
const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Konark_Sun_Temple_Konark_Nov_2013.jpg'; // Default placeholder for attractions without images
const fallbackImage = 'https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=600&auto=format&fit=crop'; // Fallback for image load errors
const defaultAttractionImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Konark_Sun_Temple_Konark_Nov_2013.jpg'; // Default image for attractions

const AttractionsPage = () => {
  console.log('AttractionsPage component is being rendered');
  const { categoryId } = useParams();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem('attractionsPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [favoriteAttractions, setFavoriteAttractions] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    sort: 'name'
  });
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    attraction: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const [lastUsedFilter, setLastUsedFilter] = useState(null);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [homepageImagesMap, setHomepageImagesMap] = useState({});

  // Set hero animation complete after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80; // Offset for sticky header
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkMode(event.detail.darkMode);
      
      // Apply specific styles to attraction cards for dark mode
      const attractionCards = document.querySelectorAll('.attraction-card');
      attractionCards.forEach(card => {
        if (event.detail.darkMode) {
          card.style.backgroundColor = '#1e1e2d';
          card.style.color = '#e0e0e0';
          card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        } else {
          card.style.backgroundColor = '#ffffff';
          card.style.color = 'inherit';
          card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.05)';
        }
      });

      // Apply specific styles to all card content
      const cardContents = document.querySelectorAll('.MuiCardContent-root');
      cardContents.forEach(content => {
        if (event.detail.darkMode) {
          content.style.backgroundColor = '#1e1e2d';
        } else {
          content.style.backgroundColor = '#ffffff';
        }
      });

      // Update card media brightness in dark mode
      const cardImages = document.querySelectorAll('.MuiCardMedia-root');
      cardImages.forEach(image => {
        if (event.detail.darkMode) {
          image.style.filter = 'brightness(0.85)';
        } else {
          image.style.filter = 'none';
        }
      });
    };
    
    document.addEventListener('themeChange', handleThemeChange);
    
    // Initial styling based on current state
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, [darkMode]);
  
  // Fetch attractions on component mount - only if no filters are active
  useEffect(() => {
    console.log('Initial attractions data load on mount');
    // Only fetch on mount if we don't have an active search
    if (!filters.search && !filters.type) {
      fetchAttractions();
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update filter when categoryId changes from URL
  useEffect(() => {
    if (categoryId) {
      console.log('Category ID changed to:', categoryId);
      
      // Update the filter state with the category ID
      setFilters(prev => ({
        ...prev,
        type: categoryId,
        search: '' // Clear search when selecting a category from URL
      }));
      
      // Set type as the priority filter
      setLastUsedFilter('type');
      
      // Reset to page 1
      setPage(1);
      
      // Set loading state
      setLoading(true);
      
      // Fetch attractions with explicit type
      getAttractions({
        type: categoryId,
        page: 1,
        limit: itemsPerPage
      })
        .then(response => {
          if (response && response.data && response.data.attractions) {
            // Process results
            const quickDisplay = response.data.attractions.map(attraction => {
              if (homepageImagesMap[attraction.name]) {
                return {
                  ...attraction,
                  images: homepageImagesMap[attraction.name]
                };
              }
              
              if (!attraction.images || attraction.images.length === 0) {
                return {
                  ...attraction,
                  images: [placeholderImage]
                };
              }
              
              return attraction;
            });
            
            // Update state directly
            setAttractions(quickDisplay);
            
            // Update pages
            if (response.data.totalPages) {
              setTotalPages(response.data.totalPages);
            } else {
              setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            }
            
            setError(null);
          } else {
            // Handle empty response
            setAttractions([]);
            setTotalPages(0);
            setError('No attractions found for this category.');
          }
        })
        .catch(err => {
          console.error('Error fetching attractions by category:', err);
          setError('Failed to load attractions. Please try again later.');
          setAttractions([]);
          setTotalPages(0);
        })
        .finally(() => {
          setLoading(false);
        });
      
      // Ensure the page scrolls to top when changing categories
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);
  
  // Use a ref to prevent unnecessary API calls on mount
  const initialRender = useRef(true);
  
  // Fetch attractions when page or filters change, but not on component mount
  useEffect(() => {
    // Skip the first render when filters are initialized
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // This effect now only handles page changes
    if (page > 1) {
      console.log('Page changed, fetching attractions');
      fetchAttractions();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Update useEffect to include fetching and mapping images
  useEffect(() => {
    // Only fetch homepage images once on mount
    if (Object.keys(homepageImagesMap).length === 0) {
      setHomepageImagesMap(getHomepageImagesForAttractions());
    }
    
    // Only process URL parameters, don't fetch attractions automatically here
    // This prevents unwanted reloads
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    if (type) {
      // Update the type filter
      setFilters(prev => ({
        ...prev,
        type
      }));
      // Set type as priority filter
      setLastUsedFilter('type');
      // Reset to page 1
      setPage(1);
      // Only scroll to top, don't fetch
      window.scrollTo(0, 0);
    }
  }, [location.search]);

  const fetchAttractions = async (explicitType = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare query parameters based on filters
      const queryParams = {};
      
      // Apply type filter only if there's no active search or if type filter has priority
      if (lastUsedFilter === 'type' && (explicitType || filters.type)) {
        queryParams.type = explicitType || filters.type;
      } 
      // Apply search filter only if there's no active type filter or if search has priority
      else if (lastUsedFilter === 'search' && filters.search) {
        queryParams.name = filters.search;
      }
      // Handle case where neither has been explicitly set as last used
      else if (explicitType || filters.type) {
        queryParams.type = explicitType || filters.type;
      }
      
      // Apply pagination
      queryParams.page = page;
      queryParams.limit = itemsPerPage;
      
      console.log('Fetching attractions with params:', queryParams);
      
      // Get attractions from the database with filters
      const response = await getAttractions(queryParams);
      
      if (response && response.data && response.data.attractions) {
        let attractionsData = response.data.attractions;
        
        // First set the attractions with existing images to display quickly
        const quickDisplay = attractionsData.map(attraction => {
          // Check if this attraction has images from the homepage
          if (homepageImagesMap[attraction.name]) {
            return {
              ...attraction,
              images: homepageImagesMap[attraction.name]
            };
          }
          
          // Use placeholder for now if no images
          if (!attraction.images || attraction.images.length === 0) {
            return {
              ...attraction,
              images: [placeholderImage]
            };
          }
          
          return attraction;
        });
        
        // Set attractions immediately for quick display
        setAttractions(quickDisplay);
        setLoading(false);
        
        // Update total pages from the API response
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else {
          setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        }
      } else {
        // Handle empty data case
        setAttractions([]);
        setTotalPages(0);
        setError('No attractions found. Try a different search or filter.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching attractions:', err);
      setError('Failed to load attractions. Please try again later.');
      setAttractions([]);
      setTotalPages(0);
      setLoading(false);
    }
  };
  
  const handlePageChange = (event, value) => {
    // Scroll to top before changing page
    window.scrollTo(0, 0);
    setPage(value);
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    
    // Clear the current search term in ref to prevent race conditions with search
    currentSearchTermRef.current = '';
    
    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Scroll to top immediately before changing filters
    window.scrollTo(0, 0);
    
    // Set loading state
    setLoading(true);
    
    // If setting a type filter, clear the search
    if (name === 'type' && value) {
      // Update filter state
      setFilters({
        ...filters,
        [name]: value,
        search: '' // Clear the search when selecting a type
      });
      
      // Explicitly set this as the last used filter type
      setLastUsedFilter('type');
      
      // Reset to page 1 when changing filters
      setPage(1);
      
      // Directly fetch with the new type filter - pass the actual value, not from state
      // This ensures we use the most current value
      const queryParams = {
        page: 1,
        limit: itemsPerPage,
        type: value // Use the value directly from the event
      };
      
      console.log('Fetching with type filter:', queryParams);
      
      getAttractions(queryParams)
        .then(response => {
          if (response && response.data && response.data.attractions) {
            // Process results
            const quickDisplay = response.data.attractions.map(attraction => {
              if (homepageImagesMap[attraction.name]) {
                return {
                  ...attraction,
                  images: homepageImagesMap[attraction.name]
                };
              }
              
              if (!attraction.images || attraction.images.length === 0) {
                return {
                  ...attraction,
                  images: [placeholderImage]
                };
              }
              
              return attraction;
            });
            
            // Update state directly
            setAttractions(quickDisplay);
            
            // Update pages
            if (response.data.totalPages) {
              setTotalPages(response.data.totalPages);
            } else {
              setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            }
            
            setError(null);
          } else {
            // Handle empty response
            setAttractions([]);
            setTotalPages(0);
            setError('No attractions found for this type.');
          }
        })
        .catch(err => {
          console.error('Error fetching attractions:', err);
          setError('Failed to load attractions. Please try again later.');
          setAttractions([]);
          setTotalPages(0);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // For non-type filters or clearing a filter
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (name === 'type' && !value) {
        // If clearing the type filter
        setLastUsedFilter(null);
        setPage(1);
        
        // Fetch all attractions
        getAttractions({
          page: 1,
          limit: itemsPerPage
        })
          .then(response => {
            if (response && response.data && response.data.attractions) {
              // Process results
              const quickDisplay = response.data.attractions.map(attraction => {
                if (homepageImagesMap[attraction.name]) {
                  return {
                    ...attraction,
                    images: homepageImagesMap[attraction.name]
                  };
                }
                
                if (!attraction.images || attraction.images.length === 0) {
                  return {
                    ...attraction,
                    images: [placeholderImage]
                  };
                }
                
                return attraction;
              });
              
              // Update state directly
              setAttractions(quickDisplay);
              
              // Update pages
              if (response.data.totalPages) {
                setTotalPages(response.data.totalPages);
              } else {
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
              }
              
              setError(null);
            } else {
              // Handle empty response
              setAttractions([]);
              setTotalPages(0);
              setError('No attractions found.');
            }
          })
          .catch(err => {
            console.error('Error fetching attractions:', err);
            setError('Failed to load attractions. Please try again later.');
            setAttractions([]);
            setTotalPages(0);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  
  // Add a ref for the search timeout and current search term to handle debouncing
  const searchTimeoutRef = useRef(null);
  const currentSearchTermRef = useRef('');
  
  // Completely rewritten search function for immediate results
  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    
    // Store the current search term in ref to prevent race conditions
    currentSearchTermRef.current = searchValue;
    
    // Clear any pending timeouts to prevent race conditions
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Immediately update UI state regardless of API calls
    if (searchValue) {
      // Clear type filter immediately when searching
      if (filters.type) {
        setFilters({
          ...filters,
          search: searchValue,
          type: ''
        });
      } else {
        setFilters(prev => ({
          ...prev,
          search: searchValue
        }));
      }
      
      // Set search as active filter
      setLastUsedFilter('search');
    } else {
      // When clearing search
      setFilters(prev => ({
        ...prev,
        search: ''
      }));
      
      // Reset filter priority
      setLastUsedFilter(filters.type ? 'type' : null);
    }
    
    // Reset to first page when search changes
    setPage(1);
    
    // Perform the API call with minimal delay (just enough to let React update state)
    searchTimeoutRef.current = setTimeout(() => {
      // Only proceed if this is still the current search term
      if (currentSearchTermRef.current === searchValue) {
        console.log("Executing search for:", searchValue);
        // Call the API directly without going through fetchAttractions
        setLoading(true);
        
        const queryParams = {
          page: 1,
          limit: itemsPerPage
        };
        
        // Only add name param if we have a search value
        if (searchValue) {
          queryParams.name = searchValue;
        } else if (filters.type) {
          // Use type filter when search is cleared
          queryParams.type = filters.type;
        }
        
        // Call API directly
        getAttractions(queryParams)
          .then(response => {
            // Make sure this is still the current search term before updating state
            if (currentSearchTermRef.current !== searchValue) {
              console.log("Search term changed, ignoring results for:", searchValue);
              return;
            }
            
            if (response && response.data && response.data.attractions) {
              // Process the results directly
              const quickDisplay = response.data.attractions.map(attraction => {
                // Add images
                if (homepageImagesMap[attraction.name]) {
                  return {
                    ...attraction,
                    images: homepageImagesMap[attraction.name]
                  };
                }
                
                if (!attraction.images || attraction.images.length === 0) {
                  return {
                    ...attraction,
                    images: [placeholderImage]
                  };
                }
                
                return attraction;
              });
              
              // Update state directly
              setAttractions(quickDisplay);
              
              // Update pages
              if (response.data.totalPages) {
                setTotalPages(response.data.totalPages);
              } else {
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
              }
              
              setError(null);
            } else {
              // Handle empty response
              setAttractions([]);
              setTotalPages(0);
              setError('No attractions found matching your search.');
            }
          })
          .catch(err => {
            // Only update UI if this is still the current search
            if (currentSearchTermRef.current === searchValue) {
              console.error('Search error:', err);
              setError('Error searching attractions.');
              setAttractions([]);
              setTotalPages(0);
            }
          })
          .finally(() => {
            // Only update loading state if this is still the current search
            if (currentSearchTermRef.current === searchValue) {
              setLoading(false);
            }
          });
      }
    }, 100);
  };
  
  // Handle clearing the search separately from clearing all filters
  const handleClearSearch = () => {
    // Clear the current search term in ref
    currentSearchTermRef.current = '';
    
    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Clear search text immediately for UI
    setFilters(prev => ({...prev, search: ''}));
    
    // Reset filter priority
    if (filters.type) {
      setLastUsedFilter('type');
    } else {
      setLastUsedFilter(null);
    }
    
    // Reset to page 1
    setPage(1);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Set loading state
    setLoading(true);
    
    // Execute direct API call based on type if available
    const queryParams = {
      page: 1,
      limit: itemsPerPage
    };
    
    if (filters.type) {
      queryParams.type = filters.type;
    }
    
    getAttractions(queryParams)
      .then(response => {
        // Skip if a new search has started
        if (currentSearchTermRef.current !== '') {
          return;
        }
        
        if (response && response.data && response.data.attractions) {
          // Process results
          const quickDisplay = response.data.attractions.map(attraction => {
            if (homepageImagesMap[attraction.name]) {
              return {
                ...attraction,
                images: homepageImagesMap[attraction.name]
              };
            }
            
            if (!attraction.images || attraction.images.length === 0) {
              return {
                ...attraction,
                images: [placeholderImage]
              };
            }
            
            return attraction;
          });
          
          // Update state directly
          setAttractions(quickDisplay);
          
          // Update pages
          if (response.data.totalPages) {
            setTotalPages(response.data.totalPages);
          } else {
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
          }
          
          setError(null);
        } else {
          // Handle empty response
          setAttractions([]);
          setTotalPages(0);
          setError('No attractions found.');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Error loading attractions.');
        setAttractions([]);
        setTotalPages(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Update clear all filters to reset everything
  const handleClearAllFilters = () => {
    // Clear current search term in ref
    currentSearchTermRef.current = '';
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Reset all filters to defaults
    setFilters({
      type: '',
      search: '',
      sort: 'name'  // Keep default sort value for backward compatibility
    });
    
    // Clear priority
    setLastUsedFilter(null);
    
    // Reset to page 1
    setPage(1);
    
    // Set loading state
    setLoading(true);
    
    // Use direct API call with no filters
    getAttractions({
      page: 1,
      limit: itemsPerPage
    })
      .then(response => {
        // Skip if a new search has started
        if (currentSearchTermRef.current !== '') {
          return;
        }
        
        if (response && response.data && response.data.attractions) {
          // Process results
          const quickDisplay = response.data.attractions.map(attraction => {
            if (homepageImagesMap[attraction.name]) {
              return {
                ...attraction,
                images: homepageImagesMap[attraction.name]
              };
            }
            
            if (!attraction.images || attraction.images.length === 0) {
              return {
                ...attraction,
                images: [placeholderImage]
              };
            }
            
            return attraction;
          });
          
          // Update state directly
          setAttractions(quickDisplay);
          
          // Update pages
          if (response.data.totalPages) {
            setTotalPages(response.data.totalPages);
          } else {
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
          }
          
          setError(null);
        } else {
          // Handle empty response
          setAttractions([]);
          setTotalPages(0);
          setError('No attractions found.');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Error loading attractions.');
        setAttractions([]);
        setTotalPages(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Update useEffect cleanup to clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Update search key handler to match submit behavior exactly
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };
  
  // New handlers for interactive features
  
  const toggleFavorite = (attractionId) => {
    setFavoriteAttractions(prev => {
      const isCurrentlyFavorite = prev.includes(attractionId);
      
      if (isCurrentlyFavorite) {
        setSnackbar({
          open: true,
          message: 'Removed from favorites',
          severity: 'info'
        });
        return prev.filter(id => id !== attractionId);
      } else {
        setSnackbar({
          open: true,
          message: 'Added to favorites!',
          severity: 'success'
        });
        return [...prev, attractionId];
      }
    });
  };
  
  const handleViewDetails = (id, useDynamicTemplate = false) => {
    if (!id) return;
    
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    
    // Navigate to either the standard attraction page or the dynamic template page
    if (useDynamicTemplate) {
      navigate(`/destination/${id}`);
    } else {
      navigate(`/attractions/${id}`);
    }
  };
  
  const handleCloseDialog = () => {
    setDetailDialog({
      ...detailDialog,
      open: false
    });
  };
  
  const handleShare = (attraction) => {
    // In a real app, this would use the Web Share API or copy to clipboard
    navigator.clipboard.writeText(`Check out ${attraction.name} in Odisha! ${window.location.origin}/attractions/${attraction._id}`)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setSnackbar({
          open: true,
          message: 'Failed to copy link',
          severity: 'error'
        });
      });
  };
  
  const handleGetDirections = (address) => {
    // In a real app, this would integrate with maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    setSnackbar({
      open: true,
      message: 'Opening directions in Google Maps',
      severity: 'info'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Save current page to session storage when it changes
  useEffect(() => {
    sessionStorage.setItem('attractionsPage', page.toString());
  }, [page]);
  
  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    
    // If search field is empty, do nothing
    if (!filters.search.trim()) return;
    
    // Just trigger the search with the current search value
    handleSearchChange({ target: { value: filters.search } });
  };

  return (
    <Box sx={{ bgcolor: darkMode ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        id="hero" 
        sx={{ 
          color: darkMode ? '#e0e0e0' : '#ffffff',
          py: 12,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.55)), url("https://www.patratravels.com/wp-content/uploads/2022/10/important-tour-packages-in-odisha-to-explore-as-a-tourist.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          height: '75vh',
          display: 'flex',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '1px'
                }} 
                className="slide-in-left hero-title"
              >
                Explore Amazing
              </Typography>
              <Typography 
                variant="h2" 
                component="div" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '1px'
                }} 
                className="slide-in-right hero-title"
              >
                Attractions
              </Typography>
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1500} style={{ transitionDelay: '300ms' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                color: '#f0f0f0', 
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                maxWidth: '800px',
                mx: 'auto'
              }} 
              className="fade-in hero-subtitle"
            >
              Discover temples, beaches, parks, and cultural heritage sites in Odisha
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
                  boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                  transition: 'all 0.3s',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 25px rgba(255, 107, 107, 0.5)'
                  },
                  '&:focus': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.3)',
                    outline: 'none'
                  }
                }}
                onClick={() => scrollToSection('attractions-list')}
                className="slide-up hero-button"
              >
                Browse Attractions
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
            onClick={() => scrollToSection('attractions-list')}
          />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4 }} id="attractions-list">
        {/* Existing title and description */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              color: darkMode ? '#f0f0f0' : '#2c3e50',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Discover Attractions in Odisha
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              fontWeight: 400, 
              mb: 4,
              color: darkMode ? '#d0d0d0' : '#666',
              maxWidth: '800px',
              mx: 'auto',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.6
            }}
          >
            From ancient temples to pristine beaches, explore the best places to visit
          </Typography>
          
          {/* Existing search and filter options */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <TextField
              label="Search Attractions"
              placeholder="Enter attraction name..."
              size="small"
              value={filters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filters.search && (
                      <IconButton
                        size="small"
                        aria-label="clear search"
                        onClick={handleClearSearch}
                        edge="end"
                        sx={{ 
                          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#666'
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="search"
                      onClick={handleSearchSubmit}
                      edge={!filters.search ? "end" : false}
                      sx={{ 
                        color: darkMode ? '#ff8080' : '#ff6b6b'
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  height: '40px',
                  borderRadius: '4px',
                  backgroundColor: darkMode ? '#2a2a3c' : '#ffffff',
                  color: darkMode ? '#e0e0e0' : 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: filters.search 
                      ? '#ff6b6b' 
                      : darkMode ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
                    borderWidth: filters.search ? 2 : 1
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b6b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b6b'
                  }
                }
              }}
              InputLabelProps={{
                sx: {
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  '&.Mui-focused': {
                    color: '#ff6b6b'
                  }
                }
              }}
              sx={{ minWidth: '230px' }}
            />
            <FormControl size="small" sx={{ minWidth: '180px' }}>
              <InputLabel 
                id="attraction-type-label"
                sx={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  '&.Mui-focused': {
                    color: '#ff6b6b'
                  }
                }}
              >
                Attraction Type
              </InputLabel>
              <Select
                labelId="attraction-type-label"
                id="attraction-type"
                value={filters.type}
                label="Attraction Type"
                name="type"
                onChange={handleFilterChange}
                disabled={filters.search !== '' && lastUsedFilter === 'search'}
                sx={{
                  height: '40px',
                  borderRadius: '4px',
                  backgroundColor: darkMode ? '#2a2a3c' : '#ffffff',
                  color: darkMode ? '#e0e0e0' : 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: filters.type 
                      ? '#ff6b6b' 
                      : darkMode ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
                    borderWidth: filters.type ? 2 : 1
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b6b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b6b'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                      mt: 0.5,
                      bgcolor: darkMode ? '#2a2a3c' : '#ffffff',
                      color: darkMode ? '#e0e0e0' : 'inherit',
                      '& .MuiMenuItem-root': {
                        color: darkMode ? '#e0e0e0' : 'inherit',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="temple">Temples</MenuItem>
                <MenuItem value="museum">Museums</MenuItem>
                <MenuItem value="park">Parks & Gardens</MenuItem>
                <MenuItem value="monument">Monuments</MenuItem>
                <MenuItem value="lake">Lakes</MenuItem>
                <MenuItem value="market">Markets</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            {(filters.type !== '' || filters.search !== '') && (
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<Close />}
                onClick={handleClearAllFilters}
                size="small"
                sx={{ 
                  height: '40px',
                  borderRadius: '4px',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': {
                    borderColor: '#ff5252',
                    backgroundColor: darkMode ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.05)'
                  }
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Active Filters Section */}
        {(filters.type !== '' || filters.search !== '') && (
          <Box 
            sx={{ 
              mb: 2, 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.6,
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" sx={{ 
              mr: 0.75,
              fontWeight: 600,
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#444',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.75rem'
            }}>
              Active filters:
            </Typography>
            
            {/* Show type filter only if it's active and prioritized */}
            {filters.type && (!filters.search || lastUsedFilter === 'type') && (
              <Chip 
                label={`Type: ${filters.type === 'temple' ? 'Temples' : 
                            filters.type === 'museum' ? 'Museums' : 
                            filters.type === 'park' ? 'Parks & Gardens' : 
                            filters.type === 'monument' ? 'Monuments' : 
                            filters.type === 'lake' ? 'Lakes' : 
                            filters.type === 'market' ? 'Markets' : 
                            filters.type === 'other' ? 'Other' : 
                            filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}`} 
                onDelete={() => {
                  setFilters(prev => ({...prev, type: ''}));
                  setLastUsedFilter(filters.search ? 'search' : null);
                  fetchAttractions();
                }}
                size="small"
                sx={{ 
                  bgcolor: darkMode ? 'rgba(255, 107, 107, 0.8)' : '#ff6b6b',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                    width: '16px',
                    height: '16px'
                  },
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255, 82, 82, 0.9)' : '#ff5252'
                  }
                }}
              />
            )}
            
            {/* Show search filter only if it's active and prioritized */}
            {filters.search && (!filters.type || lastUsedFilter === 'search') && (
              <Chip 
                label={`Search: ${filters.search}`} 
                onDelete={() => {
                  setFilters(prev => ({...prev, search: ''}));
                  setLastUsedFilter(filters.type ? 'type' : null);
                  fetchAttractions();
                }}
                size="small"
                sx={{ 
                  bgcolor: darkMode ? 'rgba(255, 107, 107, 0.8)' : '#ff6b6b',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                    width: '16px',
                    height: '16px'
                  },
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255, 82, 82, 0.9)' : '#ff5252'
                  }
                }}
              />
            )}
          </Box>
        )}
        
        {/* Results Count */}
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 1.5, 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#555',
            fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.9rem'
          }}
        >
          Showing {attractions?.length || 0} {attractions?.length === 1 ? 'result' : 'results'}
          {filters.search ? 
            ` matching "${filters.search}"` : 
            (filters.type ? ` of type "${filters.type}"` : '')
          }
        </Typography>
        
        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#ff6b6b' }} />
          </Box>
        ) : (
          <>
            {/* Empty State */}
            {!attractions || attractions.length === 0 ? (
              <Box sx={{ 
                my: 6, 
                textAlign: 'center',
                p: { xs: 3, sm: 5 }, 
                borderRadius: '10px',
                bgcolor: darkMode ? '#1e1e2d' : 'white',
                boxShadow: darkMode ? '0px 2px 6px rgba(0, 0, 0, 0.2)' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: darkMode ? '#e0e0e0' : '#555',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    mb: 1.5
                  }} 
                >
                  No attractions found matching your criteria
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#777',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.95rem'
                  }}
                >
                  Try adjusting your filters or search terms
                </Typography>
              </Box>
            ) : (
              <>
                {/* Attractions Grid */}
                <Grid container spacing={{ xs: 3, sm: 4 }}>
                  {attractions.map((attraction) => (
                    <Grid item key={attraction._id || `attraction-${Math.random()}`} xs={12} sm={6} md={4} lg={3}>
                      <Card 
                        className="attraction-card"
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          backgroundColor: darkMode ? '#1e1e2d' : '#ffffff',
                          color: darkMode ? '#e0e0e0' : 'inherit',
                          boxShadow: darkMode ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          borderRadius: 2,
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: darkMode ? '0 14px 24px rgba(0, 0, 0, 0.4)' : '0 14px 24px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                        onClick={() => handleViewDetails(attraction._id)}
                      >
                        <CardMedia
                          component="img"
                          height="220"
                          image={attraction.images && attraction.images.length > 0 && attraction.images[0] 
                            ? attraction.images[0] 
                            : defaultAttractionImage}
                          alt={attraction.name}
                          onError={(e) => {
                            console.error(`Image load error for ${attraction.name}:`, e);
                            e.target.onerror = null;
                            e.target.src = defaultAttractionImage;
                          }}
                          sx={{ 
                            filter: darkMode ? 'brightness(0.85)' : 'none',
                            transition: 'all 0.3s ease'
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, backgroundColor: darkMode ? '#1e1e2d' : '#ffffff' }}>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="h2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: darkMode ? '#e0e0e0' : 'inherit',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {attraction.name || 'Unnamed Attraction'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {attraction.averageRating > 0 && (
                              <>
                                <Rating 
                                  value={attraction.averageRating} 
                                  precision={0.5} 
                                  size="small" 
                                  readOnly 
                                />
                                <Typography 
                                  variant="body2" 
                                  sx={{ ml: 0.5, color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                                >
                                  ({attraction.averageRating.toFixed(1)})
                                </Typography>
                              </>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <LocationOn 
                              fontSize="small" 
                              color="primary" 
                              sx={{ mr: 0.5, mt: 0.3, minWidth: 20 }} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? '#a0a0a0' : 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {attraction.location?.address || 'Location not available'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <AccessTime 
                              fontSize="small" 
                              color="primary" 
                              sx={{ mr: 0.5, mt: 0.3, minWidth: 20 }} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}
                            >
                              {attraction.bestTimeToVisit || '1-2 hours'}
                            </Typography>
                          </Box>
                          {/* Tags/Types */}
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {attraction.type && (
                              <Chip 
                                label={attraction.type} 
                                size="small" 
                                color="primary" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            )}
                            {attraction.tags && attraction.tags.slice(0, 2).map((tag, index) => (
                              <Chip 
                                key={index} 
                                label={tag} 
                                size="small" 
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.5,
                                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                  color: darkMode ? '#e0e0e0' : 'inherit'
                                }} 
                              />
                            ))}
                          </Box>
                        </CardContent>
                        <CardActions sx={{ 
                          justifyContent: 'flex-start', 
                          p: 2, 
                          pt: 0.5,
                          backgroundColor: darkMode ? '#1e1e2d' : '#ffffff'
                        }}>
                          <Button 
                            size="small" 
                            endIcon={<ArrowForward />}
                            sx={{ 
                              color: 'primary.main', 
                              fontSize: '0.8rem',
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 107, 107, 0.05)'
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, sm: 5 }, mb: 2 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#555',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.9rem',
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                      },
                      '& .Mui-selected': {
                        bgcolor: `${darkMode ? 'rgba(255, 107, 107, 0.8)' : '#ff6b6b'} !important`,
                        color: 'white !important'
                      },
                      '& .MuiPaginationItem-ellipsis': {
                        color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                      },
                      '& .MuiSvgIcon-root': { 
                        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#555'
                      }
                    }}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        sx={{
                          borderRadius: '8px',
                          margin: '0 2px',
                          '&:hover': {
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}
          </>
        )}
        
        {/* Attraction Detail Dialog */}
        <Dialog
          open={detailDialog.open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          scroll="paper"
          aria-labelledby="attraction-detail-title"
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#2a2a3c' : 'white',
              color: darkMode ? '#e0e0e0' : 'inherit',
            }
          }}
        >
          {detailDialog.attraction && (
            <>
              <DialogTitle id="attraction-detail-title" sx={{ 
                pr: 6,
                color: darkMode ? '#f0f0f0' : 'inherit',
              }}>
                {detailDialog.attraction.name}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: darkMode ? '#a0a0a0' : 'inherit',
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ 
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
              }}>
                <Box sx={{ mb: 3 }}>
                  {detailDialog.attraction.images && 
                   detailDialog.attraction.images.length > 0 && 
                   detailDialog.attraction.images.some(img => img && img.trim() !== '') ? (
                    <ImageList cols={detailDialog.attraction.images.filter(img => img && img.trim() !== '').length > 1 ? 2 : 1} rowHeight={300}>
                      {detailDialog.attraction.images
                        .filter(img => img && img.trim() !== '')
                        .map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              alt={`${detailDialog.attraction.name} - image ${index + 1}`}
                              loading="lazy"
                              style={{ objectFit: 'cover', height: '100%' }}
                              onError={(e) => {
                                if (e.target.src !== placeholderImage) {
                                  e.target.src = fallbackImage;
                                }
                              }}
                            />
                          </ImageListItem>
                        ))}
                    </ImageList>
                  ) : (
                    <Box 
                      component="img"
                      src={fallbackImage}
                      alt={detailDialog.attraction.name}
                      sx={{ width: '100%', height: 300, objectFit: 'cover' }}
                    />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={detailDialog.attraction.averageRating} precision={0.1} readOnly size="medium" />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {detailDialog.attraction.averageRating}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton 
                    color={favoriteAttractions.includes(detailDialog.attraction._id) ? "error" : "default"}
                    onClick={() => toggleFavorite(detailDialog.attraction._id)}
                  >
                    {favoriteAttractions.includes(detailDialog.attraction._id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton onClick={() => handleShare(detailDialog.attraction)}>
                    <Share />
                  </IconButton>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {detailDialog.attraction.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOn color="primary" sx={{ mr: 1, mt: 0.3 }} />
                  <Typography variant="body1">
                    {detailDialog.attraction.location?.address}
                  </Typography>
                </Box>
                
                <Button 
                  variant="outlined"
                  startIcon={<DirectionsWalk />} 
                  onClick={() => handleGetDirections(detailDialog.attraction.location?.address)}
                  sx={{ mb: 3 }}
                >
                  Get Directions
                </Button>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Best Time to Visit
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <AccessTime color="primary" sx={{ mr: 1, mt: 0.3 }} />
                  <Typography variant="body1">
                    {detailDialog.attraction.bestTimeToVisit}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={detailDialog.attraction.type} color="primary" />
                  {detailDialog.attraction.tags?.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" />
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AttractionsPage; 