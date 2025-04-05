const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Check if API key is available
const API_KEY = process.env.OPENWEATHER_API_KEY;
console.log('OpenWeather API Key:', API_KEY ? 'Available ✅' : 'Missing ❌');

// Fixed mock data to use as fallback if API call fails
const mockWeatherData = {
  city: 'Bhubaneswar',
  temperature: 32,
  feelsLike: 30,
  condition: 'Clear',
  description: 'clear sky',
  humidity: 65,
  windSpeed: 12,
  icon: '01d',
  precipitation: 0,
  airQuality: 'Good',
  alert: null,
  timestamp: new Date().toISOString()
};

const mockForecastData = [
  { day: 'Today', date: new Date().toISOString().split('T')[0], temp: 32, condition: 'Clear', description: 'clear sky', icon: '01d' },
  { day: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temp: 31, condition: 'Clouds', description: 'few clouds', icon: '02d' },
  { day: 'Wed', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], temp: 30, condition: 'Clouds', description: 'scattered clouds', icon: '03d' }
];

/**
 * @desc    Get current weather for a location
 * @route   GET /api/weather/current
 * @access  Public
 */
const getCurrentWeather = async (req, res) => {
  const { city = 'Bhubaneswar' } = req.query;
  console.log(`Request received for current weather: ${city}`);
  
  // Check if API key is missing or invalid format (should be 32 chars hexadecimal)
  if (!API_KEY || !/^[a-f0-9]{32}$/.test(API_KEY)) {
    console.error('OpenWeather API key is missing or invalid, using mock data');
    return res.json(mockWeatherData);
  }
  
  try {
    // Call OpenWeather API for current weather
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    
    console.log('Weather API response received successfully');
    
    // Calculate precipitation value (OpenWeather API returns rain in mm if available)
    let precipitation = 0;
    if (response.data.rain) {
      // Convert mm of rain to precipitation percentage (rough estimate for display)
      // 1mm = ~10% chance, capped at 100%
      precipitation = Math.min(Math.round((response.data.rain['1h'] || 0) * 10), 100);
    } else if (response.data.snow) {
      // Similar treatment for snow
      precipitation = Math.min(Math.round((response.data.snow['1h'] || 0) * 10), 100);
    } else if (response.data.weather[0].main.toLowerCase().includes('rain') || 
               response.data.weather[0].main.toLowerCase().includes('drizzle')) {
      // If weather condition mentions rain but no rain data, set a default value
      precipitation = 70;
    } else if (response.data.weather[0].main.toLowerCase().includes('shower')) {
      precipitation = 90;
    } else if (response.data.clouds && response.data.clouds.all > 60) {
      // If cloudy (>60% cloud cover), set some precipitation chance
      precipitation = 20;
    }
    
    // Transform the response to our format
    const weatherData = {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to kph
      icon: response.data.weather[0].icon,
      precipitation: precipitation,
      airQuality: 'Good', // Would need another API for actual air quality
      alert: null,
      timestamp: new Date().toISOString()
    };
    
    console.log('Processed weather data:', weatherData);
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    if (error.response && error.response.status === 401) {
      console.error('API key is unauthorized. Please check your OpenWeather API key.');
    }
    
    // Use mock data as fallback
    console.log('Using mock weather data as fallback');
    return res.json(mockWeatherData);
  }
};

/**
 * @desc    Get weather forecast for a location
 * @route   GET /api/weather/forecast
 * @access  Public
 */
const getWeatherForecast = async (req, res) => {
  const { city = 'Bhubaneswar' } = req.query;
  console.log(`Request received for forecast: ${city}`);
  
  // Check if API key is missing or invalid format (should be 32 chars hexadecimal)
  if (!API_KEY || !/^[a-f0-9]{32}$/.test(API_KEY)) {
    console.error('OpenWeather API key is missing or invalid, using mock data');
    return res.json(mockForecastData);
  }
  
  try {
    // Call OpenWeather API for forecast
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        cnt: 24 // Limit to 24 data points (3-hour intervals for 3 days)
      }
    });
    
    console.log('Forecast API response received successfully');
    
    // Process the forecast data (one entry per day)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    
    // Group forecast by day and calculate average
    const forecastByDay = {};
    
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      
      if (!forecastByDay[date]) {
        forecastByDay[date] = {
          temps: [],
          conditions: {},
          icons: {},
          descriptions: {},
          date: date
        };
      }
      
      forecastByDay[date].temps.push(item.main.temp);
      
      // Count occurrences of conditions, icons, and descriptions
      const condition = item.weather[0].main;
      const icon = item.weather[0].icon;
      const description = item.weather[0].description;
      
      forecastByDay[date].conditions[condition] = (forecastByDay[date].conditions[condition] || 0) + 1;
      forecastByDay[date].icons[icon] = (forecastByDay[date].icons[icon] || 0) + 1;
      forecastByDay[date].descriptions[description] = (forecastByDay[date].descriptions[description] || 0) + 1;
    });
    
    // Convert to our forecast format
    const forecast = Object.keys(forecastByDay).map((date, index) => {
      const dayData = forecastByDay[date];
      
      // Calculate average temperature
      const avgTemp = dayData.temps.reduce((sum, temp) => sum + temp, 0) / dayData.temps.length;
      
      // Get most common condition and icon
      let mostCommonCondition = '';
      let maxConditionCount = 0;
      
      Object.entries(dayData.conditions).forEach(([condition, count]) => {
        if (count > maxConditionCount) {
          mostCommonCondition = condition;
          maxConditionCount = count;
        }
      });
      
      let mostCommonIcon = '';
      let maxIconCount = 0;
      
      Object.entries(dayData.icons).forEach(([icon, count]) => {
        if (count > maxIconCount) {
          mostCommonIcon = icon;
          maxIconCount = count;
        }
      });
      
      let mostCommonDescription = '';
      let maxDescriptionCount = 0;
      
      Object.entries(dayData.descriptions).forEach(([description, count]) => {
        if (count > maxDescriptionCount) {
          mostCommonDescription = description;
          maxDescriptionCount = count;
        }
      });
      
      // Determine day name
      let dayName;
      if (index === 0) {
        dayName = 'Today';
      } else if (index === 1) {
        dayName = 'Tomorrow';
      } else {
        const futureDay = (today + index) % 7;
        dayName = dayNames[futureDay].substring(0, 3); // First 3 letters
      }
      
      return {
        day: dayName,
        date: date,
        temp: Math.round(avgTemp),
        condition: mostCommonCondition,
        description: mostCommonDescription,
        icon: mostCommonIcon
      };
    });
    
    const sortedForecast = forecast
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3); // Return first 3 days
      
    console.log('Processed forecast data:', sortedForecast);
    return res.json(sortedForecast);
  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    if (error.response && error.response.status === 401) {
      console.error('API key is unauthorized. Please check your OpenWeather API key.');
    }
    
    // Use mock data as fallback
    console.log('Using mock forecast data as fallback');
    return res.json(mockForecastData);
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast
}; 