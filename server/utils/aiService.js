const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with the API key
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

// Only initialize if API key exists
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Google Generative AI initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Generative AI:', error);
  }
} else {
  console.warn('GEMINI_API_KEY not found in environment variables. AI features will be disabled.');
}

/**
 * Generate AI-powered descriptions for attractions
 * @param {string} attractionName - Name of the attraction
 * @param {string} attractionType - Type of attraction (temple, museum, etc.)
 * @returns {Promise<string>} - AI-generated description
 */
const generateAttractionDescription = async (attractionName, attractionType) => {
  // Check if the API is configured
  if (!genAI) {
    console.warn('AI service not available. Using fallback description.');
    return `${attractionName} is a beautiful ${attractionType} in Bhubaneswar, Odisha. Visit to experience its unique charm and cultural significance.`;
  }
  
  try {
    const prompt = `Act as a knowledgeable travel guide for Bhubaneswar, Odisha, India. 
    Provide a detailed and engaging description of ${attractionName}, which is a ${attractionType} in Bhubaneswar.
    Include its historical significance, cultural importance, architectural features, and why tourists should visit.
    The description should be informative, engaging, and approximately 200-250 words.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI description:', error);
    return `${attractionName} is a notable ${attractionType} in Bhubaneswar. Description will be updated soon.`;
  }
};

/**
 * Generate recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise<Array>} - AI-generated recommendations
 */
const generateRecommendations = async (preferences) => {
  // Check if the API is configured
  if (!genAI) {
    console.warn('AI service not available. Using empty recommendations.');
    return [];
  }

  try {
    const { interests, duration, travelStyle } = preferences;
    
    const prompt = `Act as a travel recommendation system for Bhubaneswar, Odisha, India.
    Based on the following preferences, suggest 5 attractions or activities that would be most suitable:
    
    Interests: ${interests.join(', ')}
    Duration of stay: ${duration} days
    Travel style: ${travelStyle}
    
    For each recommendation, provide:
    1. Name of the attraction/activity
    2. Brief description (30-40 words)
    3. Why it matches their preferences
    4. Best time to visit
    
    Format the response as a JSON array with objects containing these fields.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      return JSON.parse(response.text());
    } catch (parseError) {
      console.error('Error parsing AI recommendations:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
};

/**
 * Generate cultural insights about Odisha
 * @param {string} topic - Specific cultural topic
 * @returns {Promise<string>} - AI-generated cultural insight
 */
const generateCulturalInsight = async (topic) => {
  // Check if the API is configured
  if (!genAI) {
    console.warn('AI service not available. Using fallback cultural insight.');
    return `Information about ${topic} in Odisha culture will be available soon.`;
  }

  try {
    const prompt = `Act as a cultural expert on Odisha, India.
    Provide an insightful and educational explanation about ${topic} in Odisha culture.
    Include historical context, significance in modern times, and interesting facts that tourists would appreciate.
    The insight should be approximately 150-200 words and written in an engaging style.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating cultural insight:', error);
    return `Cultural insight about ${topic} is currently unavailable. Please try again later.`;
  }
};

module.exports = {
  generateAttractionDescription,
  generateRecommendations,
  generateCulturalInsight
}; 