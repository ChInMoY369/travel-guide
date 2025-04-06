import axios from 'axios';

// Check for environment variables in multiple locations
// 1. Vite's import.meta.env (build-time)
// 2. window.env (runtime injection in HTML)
// 3. Fallback to relative path
const API_URL = import.meta.env.VITE_APP_API_URL || 
                (window.env && window.env.VITE_APP_API_URL) || 
                'https://travel-guide-9n2b.onrender.com/api';

// Add more detailed logging to diagnose the issue
console.log('Environment variables available:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('API URL from Vite env:', import.meta.env.VITE_APP_API_URL);
console.log('API URL from window.env:', window.env && window.env.VITE_APP_API_URL);
console.log('Final API URL configured:', API_URL);

// Add global axios request interceptor to debug all requests
axios.interceptors.request.use(
  config => {
    console.log('🔍 AXIOS REQUEST:', {
      fullUrl: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
      baseURL: config.baseURL || 'none',
      url: config.url,
      method: config.method,
      params: config.params
    });
    return config;
  },
  error => {
    console.error('❌ AXIOS REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = (userData) => api.post('/users/register', userData);

export const loginUser = (credentials) => {
  console.log('loginUser called with:', { email: credentials.email, passwordLength: credentials.password?.length });
  
  // Make sure credentials are properly formatted
  if (!credentials.email || !credentials.password) {
    console.error('Missing email or password in credentials');
    return Promise.reject(new Error('Email and password are required'));
  }
  
  // Return a clean POST request
  return api.post('/users/login', {
    email: credentials.email,
    password: credentials.password
  });
};

export const getUserProfile = () => api.get('/users/profile');

export const updateUserProfile = (userData) => {
  console.log('Updating user profile with data:', {
    ...userData,
    profilePicture: userData.profilePicture ? 'has profile picture' : 'no profile picture'
  });
  
  return api.put('/users/profile', userData)
    .then(response => {
      // Log the response data
      console.log('Profile update response:', {
        ...response.data,
        profilePicture: response.data.profilePicture || 'not returned'
      });
      
      // Ensure the profile picture is preserved in the response if not returned by the server
      if (!response.data.profilePicture && userData.profilePicture) {
        console.log('Preserving profile picture in response');
        response.data.profilePicture = userData.profilePicture;
      }
      
      return response;
    });
};

// Upload profile image
export const uploadProfileImage = (formData) => {
  console.log('Uploading profile image...');
  // Make sure the token is available
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found for image upload');
    return Promise.reject(new Error('Authentication token is missing'));
  }
  
  // Create a custom instance for this request with multipart/form-data
  const formConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  };
  
  // Log the form data to help with debugging
  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value instanceof File ? `${value.name} (${value.type}, ${value.size} bytes)` : value}`);
  }

  const uploadEndpoint = `${API_URL}/images/profile`;
  console.log(`Making API request to: ${uploadEndpoint}`);
  console.log('Request config:', formConfig);
  
  return axios.post(uploadEndpoint, formData, formConfig)
    .then(response => {
      console.log('Image upload success:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Image upload error details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response from server',
        request: error.request ? 'Request was made but no response received' : 'Request setup error'
      });
      throw error;
    });
};

// Attractions API calls
export const getAttractions = (params) => {
  // Add debugging for API calls
  console.log('Calling getAttractions API with params:', params);
  
  return api.get('/attractions', { params })
    .then(response => {
      console.log('getAttractions response data:', response.data);
      return response;
    })
    .catch(error => {
      console.error('getAttractions error:', error);
      throw error;
    });
};

/**
 * Get a specific attraction by ID
 * @param {string} id - The attraction ID
 * @returns {Promise} - API response with attraction data
 */
export const getAttractionById = (id) => {
  console.log(`Fetching attraction with ID: ${id}`);
  return api.get(`/attractions/${id}`)
    .then(response => {
      console.log('Attraction details received:', response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error fetching attraction ${id}:`, error);
      throw error;
    });
};

/**
 * Add a review to an attraction
 * @param {string} id - The attraction ID
 * @param {Object} reviewData - The review data (rating, comment)
 * @returns {Promise} - API response
 */
export const addAttractionReview = (id, reviewData) => api.post(`/attractions/${id}/reviews`, reviewData);

/**
 * Get nearby attractions based on location
 * @param {Object} params - Parameters with latitude, longitude, and distance
 * @returns {Promise} - API response with nearby attractions
 */
export const getNearbyAttractions = (params) => api.get('/attractions/nearby', { params });

/**
 * Get attractions by type
 * @param {string} type - The attraction type (temple, museum, park, etc.)
 * @returns {Promise} - API response with attractions of the specified type
 */
export const getAttractionsByType = (type) => {
  return getAttractions({ type });
};

/**
 * Get top-rated attractions
 * @param {number} limit - Maximum number of attractions to return
 * @returns {Promise} - API response with top-rated attractions
 */
export const getTopAttractions = (limit = 5) => {
  return getAttractions({ sort: 'rating', limit });
};

// Weather API calls
export const getCurrentWeather = async (city = 'Bhubaneswar') => {
  console.log('Fetching current weather for:', city);
  console.log('Using API URL:', API_URL);
  try {
    // Make sure we're using the api client with baseURL configured
    // The full URL should be API_URL + '/weather/current'
    const response = await api.get('/weather/current', { params: { city } });
    
    console.log('Full weather request URL:', `${API_URL}/weather/current?city=${encodeURIComponent(city)}`);
    
    if (!response.data) {
      throw new Error('Empty response received from weather API');
    }
    console.log('Weather data received:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching current weather:', error.response?.data || error.message);
    console.error('Request URL that failed:', `${API_URL}/weather/current?city=${encodeURIComponent(city)}`);
    // Return a rejected promise to be handled by the component
    return Promise.reject({ 
      message: 'Failed to fetch weather data', 
      error: error.response?.data || error.message
    });
  }
};

export const getWeatherForecast = async (city = 'Bhubaneswar') => {
  console.log('Fetching weather forecast for:', city);
  console.log('Using API URL:', API_URL);
  try {
    // Make sure we're using the api client with baseURL configured
    // The full URL should be API_URL + '/weather/forecast'
    const response = await api.get('/weather/forecast', { params: { city } });
    
    console.log('Full forecast request URL:', `${API_URL}/weather/forecast?city=${encodeURIComponent(city)}`);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid forecast data received from API');
    }
    console.log('Forecast data received:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching weather forecast:', error.response?.data || error.message);
    // Return a rejected promise to be handled by the component
    return Promise.reject({ 
      message: 'Failed to fetch weather forecast', 
      error: error.response?.data || error.message
    });
  }
};

// Favorites API calls
export const addFavoriteAttraction = (attractionId) => {
  console.log('Adding attraction to favorites:', attractionId);
  
  // Determine if this is a MongoDB ObjectId or a custom ID
  // MongoDB ObjectId: 24 hexadecimal characters
  // Custom ID: typically a slug like 'lingaraj-temple'
  const isCustomId = typeof attractionId === 'string' && 
    (!/^[0-9a-fA-F]{24}$/.test(attractionId) || attractionId.includes('-'));
  
  console.log(`ID type detected: ${isCustomId ? 'Custom ID' : 'MongoDB ObjectId'}`);
  
  return api.post('/users/favorites', { 
    attractionId,
    isMockId: isCustomId // Flag to tell server how to handle this ID
  })
  .then(response => {
    console.log('Add to favorites success:', response.data);
    return response;
  })
  .catch(error => {
    console.error('Add to favorites error:', error.response?.data || error.message);
    throw error;
  });
};
export const removeFavoriteAttraction = (attractionId) => {
  console.log(`Removing attraction from favorites: ${attractionId}`);
  
  return api.delete(`/users/favorites/${attractionId}`)
    .then(response => {
      console.log('Remove favorite success:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Remove favorite error:', error.response?.data || error.message);
      throw error;
    });
};
export const getUserFavorites = () => api.get('/users/favorites');

// Visit history API calls
export const addVisitRecord = (attractionId) => api.post('/users/visits', { attractionId });

// Recommendations API calls
export const getRecommendedAttractions = (interests = []) => {
  console.log('Fetching recommended attractions based on interests:', interests);
  
  if (!interests || interests.length === 0) {
    console.log('No interests provided, returning empty recommendations');
    return Promise.resolve({ data: [] });
  }
  
  return api.get('/recommendations/attractions', { params: { interests: interests.join(',') } })
    .then(response => {
      console.log('Recommended attractions response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error fetching recommended attractions:', error.response?.data || error.message);
      
      // For development/demo, return mock data if the API fails
      const mockData = [
        {
          id: 'lingaraj-temple',
          name: 'Lingaraj Temple', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg',
          rating: 4.8,
          description: 'Ancient Hindu temple dedicated to Shiva',
          tags: ['Temple', 'Heritage', 'Religious', 'Architecture']
        },
        {
          id: 'konark-sun-temple',
          name: 'Konark Sun Temple', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
          rating: 4.9,
          description: 'UNESCO World Heritage site known for its architectural grandeur',
          tags: ['Temple', 'Heritage', 'UNESCO', 'Architecture']
        },
        {
          id: 'nandankanan-zoo',
          name: 'Nandankanan Zoological Park', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg',
          rating: 4.5,
          description: 'Famous zoo and botanical garden near Bhubaneswar',
          tags: ['Wildlife', 'Nature', 'Family', 'Zoo']
        },
        {
          id: 'puri-beach',
          name: 'Puri Beach', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Puri_Beach_Front%2C_Odisha.jpg',
          rating: 4.6,
          description: 'Popular beach destination on the coast of Odisha',
          tags: ['Beach', 'Sea', 'Nature', 'Relaxation']
        },
        {
          id: 'chilika-lake',
          name: 'Chilika Lake', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Chilika_Lake_Sunset.jpg',
          rating: 4.7,
          description: 'Asia\'s largest brackish water lagoon and home to migratory birds',
          tags: ['Lake', 'Nature', 'Wildlife', 'Boating']
        },
        {
          id: 'udayagiri-khandagiri-caves',
          name: 'Udayagiri and Khandagiri Caves', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Udayagiri_and_Khandagiri_Caves.jpg',
          rating: 4.4,
          description: 'Ancient Jain rock-cut caves dating back to the 2nd century BCE',
          tags: ['Caves', 'Heritage', 'Historical', 'Architecture']
        },
        {
          id: 'biju-patnaik-park',
          name: 'Biju Patnaik Park (Forest Park)', 
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Biju_Patnaik_Park.jpg/1024px-Biju_Patnaik_Park.jpg',
          rating: 4.2,
          description: 'A great spot for morning walks and relaxation in the heart of the city. The park features jogging tracks, landscaped gardens, and recreational areas.',
          tags: ['Park', 'Nature', 'Recreation', 'Family', 'Fitness']
        }
      ];
      
      // Create a comprehensive mapping of interests to related tags for better matching
      const interestTagMap = {
        'beach': ['beach', 'sea', 'coastal', 'ocean', 'relaxation'],
        'temple': ['temple', 'religious', 'spiritual', 'worship', 'architecture'],
        'heritage': ['heritage', 'historical', 'ancient', 'architecture', 'cultural'],
        'nature': ['nature', 'wildlife', 'park', 'lake', 'garden', 'forest', 'zoo'],
        'wildlife': ['wildlife', 'zoo', 'animal', 'bird', 'sanctuary', 'nature'],
        'architecture': ['architecture', 'temple', 'heritage', 'historical', 'monument'],
        'history': ['historical', 'heritage', 'ancient', 'monument', 'archaeology'],
        'family': ['family', 'park', 'zoo', 'entertainment', 'fun', 'beach']
      };
      
      // Filter mock data based on interests with expanded tag matching
      const lowercaseInterests = interests.map(i => i.toLowerCase());
      
      // Build a complete set of tags to match against based on the provided interests
      const expandedTags = new Set();
      lowercaseInterests.forEach(interest => {
        expandedTags.add(interest);
        if (interestTagMap[interest]) {
          interestTagMap[interest].forEach(tag => expandedTags.add(tag));
        }
      });
      
      console.log('Expanded tags for matching:', [...expandedTags]);
      
      // Filter attractions based on expanded tags
      const filteredRecommendations = mockData.filter(attraction => {
        const attractionTags = attraction.tags.map(t => t.toLowerCase());
        return attractionTags.some(tag => expandedTags.has(tag));
      });
      
      console.log('Filtered recommendations based on interests:', filteredRecommendations);
      
      // If no matches, return a subset of mock data as fallback
      const result = filteredRecommendations.length > 0 ? 
        filteredRecommendations : 
        mockData.slice(0, 3); // Return first 3 as default
      
      // Force random order to simulate dynamic recommendations
      const shuffled = [...result].sort(() => 0.5 - Math.random());
      
      console.log('Final recommendations after processing:', shuffled);
      return { data: shuffled };
    });
};

export const getPersonalizedRecommendations = (preferences) => api.post('/recommendations', preferences);
export const getCulturalInsight = (topic) => api.get(`/recommendations/cultural-insights/${topic}`);

// Event API calls
export const setEventReminder = (reminderData) => {
  return api.post('/events/reminders', reminderData);
};

export const getUserEventReminders = () => {
  return api.get('/events/reminders');
};

export const getEventReminders = (eventId, email) => {
  return api.get(`/events/${eventId}/reminders${email ? `?email=${email}` : ''}`);
};

export const deleteEventReminder = (reminderId) => {
  return api.delete(`/events/reminders/${reminderId}`);
};

// Function to fetch photos from Wikipedia for attractions
export const fetchWikipediaImages = async (attractionName) => {
  try {
    console.log(`Starting Wikipedia image fetch for: ${attractionName}`);
    
    // First, search for the Wikipedia page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(attractionName)}&format=json&origin=*`;
    console.log(`Search URL: ${searchUrl}`);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    console.log(`Wikipedia search results for "${attractionName}":`, searchData.query.search.length > 0 ? 'Found results' : 'No results');
    
    if (!searchData.query?.search || searchData.query.search.length === 0) {
      console.error(`No Wikipedia page found for ${attractionName}`);
      return [getDefaultImageForAttraction(attractionName)];
    }
    
    // Get the page ID of the first result
    const pageId = searchData.query.search[0].pageid;
    console.log(`Selected Wikipedia page ID: ${pageId}`);
    
    // Fetch images from the page
    const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=images&pageids=${pageId}&format=json&origin=*`;
    console.log(`Images URL: ${imagesUrl}`);
    
    const imagesResponse = await fetch(imagesUrl);
    const imagesData = await imagesResponse.json();
    
    if (!imagesData.query?.pages?.[pageId]?.images) {
      console.error(`No images found on Wikipedia page for ${attractionName}`);
      return [getDefaultImageForAttraction(attractionName)];
    }
    
    const imageList = imagesData.query.pages[pageId].images || [];
    console.log(`Number of images found: ${imageList.length}`);
    
    // Filter out non-image files and get image details
    const imageNames = imageList
      .map(img => img.title)
      .filter(title => 
        !title.includes('Icon') && 
        !title.includes('Logo') && 
        !title.includes('Map') &&
        !title.includes('Symbol') &&
        (
          title.endsWith('.jpg') || 
          title.endsWith('.jpeg') || 
          title.endsWith('.png') || 
          title.endsWith('.webp')
        )
      )
      .slice(0, 5); // Get up to 5 images
    
    console.log(`Filtered image names: ${imageNames.length}`);
    
    if (imageNames.length === 0) {
      console.error(`No suitable images found for ${attractionName}`);
      return [getDefaultImageForAttraction(attractionName)];
    }
    
    // Get the image URLs
    const imageUrls = [];
    for (const imageName of imageNames) {
      const imageInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
      console.log(`Fetching info for image: ${imageName}`);
      
      const imageInfoResponse = await fetch(imageInfoUrl);
      const imageInfoData = await imageInfoResponse.json();
      
      const pages = imageInfoData.query?.pages || {};
      const pageKey = Object.keys(pages)[0];
      
      if (pageKey && pages[pageKey]?.imageinfo && pages[pageKey].imageinfo.length > 0) {
        const imageUrl = pages[pageKey].imageinfo[0].url;
        console.log(`Found image URL: ${imageUrl}`);
        imageUrls.push(imageUrl);
      }
    }
    
    console.log(`Total valid image URLs found: ${imageUrls.length}`);
    
    if (imageUrls.length === 0) {
      return [getDefaultImageForAttraction(attractionName)];
    }
    
    return imageUrls;
  } catch (error) {
    console.error(`Error fetching Wikipedia images for ${attractionName}:`, error);
    return [getDefaultImageForAttraction(attractionName)];
  }
};

// Helper function to get a default image for an attraction if Wikipedia fails
function getDefaultImageForAttraction(attractionName) {
  // Map some common attractions to fallback images
  const fallbackImages = {
    'temple': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg',
    'beach': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Sunrise_at_Puri_beach.jpg',
    'park': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg',
    'monument': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Udayagiri_and_Khandagiri_Caves.jpg',
    'museum': 'https://upload.wikimedia.org/wikipedia/commons/4/47/State_Museum%2C_Bhubaneswar.jpg',
    'lake': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Chilika_Lake_Sunset.jpg',
    'garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Biju_Patnaik_Park.jpg/1024px-Biju_Patnaik_Park.jpg',
    'default': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Konark_Sun_Temple_Konark_Nov_2013.jpg'
  };
  
  // Check if the attraction name contains any of the keys
  for (const [key, url] of Object.entries(fallbackImages)) {
    if (attractionName.toLowerCase().includes(key)) {
      return url;
    }
  }
  
  // Return the default image if no match is found
  return fallbackImages.default;
}

// Function to map homepage images to attraction pages for specific attractions
export const getHomepageImagesForAttractions = () => {
  // Map of attraction names to their images from the homepage using absolute URLs
  return {
    'Lingaraj Temple': ['https://upload.wikimedia.org/wikipedia/commons/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg'],
    'Jagannath Temple': ['https://upload.wikimedia.org/wikipedia/commons/6/63/Sri_Jagannatha_Temple%2C_Puri.jpg'],
    'Konark Sun Temple': ['https://upload.wikimedia.org/wikipedia/commons/a/ab/Konark_Sun_Temple_Konark_Nov_2013.jpg'],
    'Udayagiri and Khandagiri Caves': ['https://upload.wikimedia.org/wikipedia/commons/f/f3/Udayagiri_and_Khandagiri_Caves.jpg'],
    'Nandankanan Zoological Park': ['https://upload.wikimedia.org/wikipedia/commons/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg'],
    'Gopalpur Beach': ['https://upload.wikimedia.org/wikipedia/commons/5/5d/Gopalpur_Beach.jpg'],
    'Chilika Lake': ['https://upload.wikimedia.org/wikipedia/commons/0/07/Chilika_Lake_Sunset.jpg'],
    'Puri Beach': ['https://upload.wikimedia.org/wikipedia/commons/8/8d/Sunrise_at_Puri_beach.jpg'],
    'Chandrabhaga Beach': ['https://upload.wikimedia.org/wikipedia/commons/6/65/Chandrabhaga_Beach.jpg']
  };
};

// Cultural Insights API
export const getCulturalInsights = () => api.get('/cultural-insights');
export const getCulturalInsightByTopic = (topic) => api.get(`/cultural-insights/${topic}`);
export const createCulturalInsight = (data) => api.post('/cultural-insights', data);
export const updateCulturalInsight = (topic, data) => api.put(`/cultural-insights/${topic}`, data);
export const deleteCulturalInsight = (topic) => api.delete(`/cultural-insights/${topic}`);

export default api; 