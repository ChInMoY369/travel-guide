const express = require('express');
const router = express.Router();
const { getCurrentWeather, getWeatherForecast } = require('../controllers/weatherController');

// @route   GET /api/weather/current
// @desc    Get current weather for a location
// @access  Public
router.get('/current', getCurrentWeather);

// @route   GET /api/weather/forecast
// @desc    Get weather forecast for a location
// @access  Public
router.get('/forecast', getWeatherForecast);

module.exports = router; 