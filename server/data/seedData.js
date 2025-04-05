const mongoose = require('mongoose');
const Attraction = require('../models/Attraction');
const User = require('../models/User');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample attractions data
const attractions = [
  {
    name: 'Lingaraj Temple',
    type: 'temple',
    description: 'The Lingaraj Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar, the capital of the Indian state of Odisha.',
    aiDescription: 'Lingaraj Temple is an ancient Hindu temple dedicated to Lord Shiva, located in Bhubaneswar, Odisha. Built in the 11th century, it is one of the most prominent landmarks of the city and showcases the Kalinga style of architecture.',
    location: {
      address: 'Lingaraj Road, Old Town, Bhubaneswar, Odisha 751002',
      coordinates: {
        latitude: 20.2359,
        longitude: 85.8346
      }
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg/1200px-Lingaraja_Temple_Bhubaneswar_Odisha_India_March_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lingaraj_Temple_Bhubaneswar_Odisha_India_March_2020_2.jpg/1200px-Lingaraj_Temple_Bhubaneswar_Odisha_India_March_2020_2.jpg'
    ],
    culturalSignificance: 'The Lingaraj Temple is of great cultural and religious significance in Odisha. It represents the Kalinga style of temple architecture and is a testament to the rich cultural heritage of the region.',
    bestTimeToVisit: 'October to March',
    entryFee: {
      amount: 0,
      currency: 'INR'
    },
    openingHours: {
      monday: { open: '06:00', close: '21:00' },
      tuesday: { open: '06:00', close: '21:00' },
      wednesday: { open: '06:00', close: '21:00' },
      thursday: { open: '06:00', close: '21:00' },
      friday: { open: '06:00', close: '21:00' },
      saturday: { open: '06:00', close: '21:00' },
      sunday: { open: '06:00', close: '21:00' }
    },
    tags: ['Temple', 'Heritage', 'Religious', 'Architecture'],
    averageRating: 4.7
  },
  {
    name: 'Nandankanan Zoological Park',
    type: 'park',
    description: 'Nandankanan Zoological Park is a 400-hectare zoo and botanical garden near Bhubaneswar, Odisha, India.',
    aiDescription: 'Nandankanan Zoological Park, established in 1960, is a premier zoo and botanical garden spanning 400 hectares near Bhubaneswar, Odisha. It is renowned for its conservation efforts, particularly for white tigers.',
    location: {
      address: 'Nandankanan Road, Barang, Bhubaneswar, Odisha 754005',
      coordinates: {
        latitude: 20.3993,
        longitude: 85.8168
      }
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/White_Tiger_in_Nandankanan_Zoological_Park.jpg/1200px-White_Tiger_in_Nandankanan_Zoological_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nandankanan_Zoological_Park_Entrance.jpg/1200px-Nandankanan_Zoological_Park_Entrance.jpg'
    ],
    culturalSignificance: 'Nandankanan is famous for being the first zoo in India to join the World Association of Zoos and Aquariums. It is also known for its conservation breeding programs for endangered species.',
    bestTimeToVisit: 'November to February',
    entryFee: {
      amount: 50,
      currency: 'INR'
    },
    openingHours: {
      monday: { open: 'Closed', close: 'Closed' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' }
    },
    tags: ['Wildlife', 'Nature', 'Family', 'Zoo'],
    averageRating: 4.5
  },
  {
    name: 'Udayagiri and Khandagiri Caves',
    type: 'monument',
    description: 'Udayagiri and Khandagiri Caves are partly natural and partly artificial caves of archaeological, historical and religious importance.',
    aiDescription: 'The Udayagiri and Khandagiri Caves are ancient Jain rock-cut shelters located near Bhubaneswar, Odisha. Dating back to the 1st-2nd century BCE, these caves were carved out during the reign of King Kharavela.',
    location: {
      address: 'Khandagiri, Bhubaneswar, Odisha 751030',
      coordinates: {
        latitude: 20.2566,
        longitude: 85.7788
      }
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Udayagiri_Caves_Bhubaneswar_Odisha_India.jpg/1200px-Udayagiri_Caves_Bhubaneswar_Odisha_India.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Khandagiri_Caves_Bhubaneswar_Odisha_India.jpg/1200px-Khandagiri_Caves_Bhubaneswar_Odisha_India.jpg'
    ],
    culturalSignificance: 'These caves are important examples of ancient Jain rock-cut architecture and contain inscriptions that provide valuable information about the history of Kalinga (ancient Odisha).',
    bestTimeToVisit: 'October to March',
    entryFee: {
      amount: 25,
      currency: 'INR'
    },
    openingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' }
    },
    tags: ['Historical', 'Caves', 'Architecture', 'Jain'],
    averageRating: 4.3
  },
  {
    name: 'Dhauli Shanti Stupa',
    type: 'monument',
    description: 'Dhauli Shanti Stupa is a Buddhist structure built during the 1970s atop the Dhauli hills.',
    aiDescription: 'Dhauli Shanti Stupa (Peace Pagoda) is a significant Buddhist monument located atop Dhauli Hill near Bhubaneswar, Odisha. Built in the 1970s through Indo-Japanese collaboration.',
    location: {
      address: 'Dhauli Hills, Bhubaneswar, Odisha 752002',
      coordinates: {
        latitude: 20.1923,
        longitude: 85.8401
      }
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dhauli_Giri_Shanti_Stupa.jpg/1200px-Dhauli_Giri_Shanti_Stupa.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Dhauli_hill_Bhubaneswar.jpg/1200px-Dhauli_hill_Bhubaneswar.jpg'
    ],
    culturalSignificance: 'Dhauli is historically significant as it is believed to be the site of the Kalinga War, after which Emperor Ashoka embraced Buddhism. The peace pagoda symbolizes peace and non-violence.',
    bestTimeToVisit: 'October to March',
    entryFee: {
      amount: 20,
      currency: 'INR'
    },
    openingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    tags: ['Buddhist', 'Peace Pagoda', 'Historical', 'Monument'],
    averageRating: 4.6
  }
];

// Function to seed data
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Attraction.deleteMany({});
    console.log('Existing attractions data cleared');
    
    // Insert new data
    await Attraction.insertMany(attractions);
    console.log('Attractions data seeded successfully');
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 