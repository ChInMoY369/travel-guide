# Travel Guide Application

A comprehensive travel guide application that helps users discover attractions, plan trips, and explore various destinations.

## Project Structure

The project is organized into two main folders:

### Frontend
Located in the `frontend/` directory:
- `client/`: Contains the React application built with Vite
  - `src/`: Contains components, pages, utils, and other frontend code

### Backend
Located in the `backend/` directory:
- `server/`: Contains the Express server, API routes, and database connections
  - `controllers/`: Backend controllers for handling business logic
  - `models/`: Database models
  - `routes/`: API routes
  - `services/`: Services for various functionalities
  - `middleware/`: Custom middleware
  - `utils/`: Utility functions
  - `config/`: Configuration files
  - `data/`: Data files and seeders

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd travel-guide
```

2. Install dependencies for the whole project:
```
npm run install-all
```

### Running the Application

#### Development Mode
To run both frontend and backend in development mode:
```
npm run dev
```

To run only the frontend:
```
npm run frontend
```

To run only the backend:
```
npm run backend
```

#### Production Mode
To build and start in production mode:
```
npm run build
npm start
```

## Documentation

- For frontend setup details, see [Frontend Setup Instructions](./frontend/SETUP_INSTRUCTIONS.md)
- For backend setup details, see [Backend Setup Instructions](./backend/SETUP_INSTRUCTIONS.md)
- For admin features, see [Admin Guide](./backend/ADMIN_GUIDE.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Features

- **AI-Powered Descriptions**: Detailed descriptions of attractions generated using Google's Gemini AI
- **Personalized Recommendations**: Get tailored recommendations based on your interests and preferences
- **Cultural Insights**: Learn about Odisha's rich cultural heritage, traditions, and customs
- **Attraction Directory**: Explore temples, museums, parks, and other attractions in Bhubaneswar
- **User Reviews**: Read and contribute reviews for attractions and restaurants
- **Interactive Maps**: Find attractions and navigate around the city
- **Event Calendar**: Stay updated on local events and festivals
- **Restaurant Recommendations**: Discover local cuisine and dining options

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Google Generative AI (Gemini)
- JWT Authentication

### Frontend
- React.js
- Material UI
- React Router
- Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Generative AI API Key

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/bhubaneswar-travel-guide.git
cd bhubaneswar-travel-guide
```

2. Install server dependencies
```
cd server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

5. Start the development server
```
# In the server directory
npm run dev
```

This will start both the backend server and the React frontend in development mode.

## Project Structure

```
travel-guide-app/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── assets/         # Images and static files
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
│
└── server/                 # Node.js backend
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── utils/              # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/favorites` - Add attraction to favorites
- `DELETE /api/users/favorites/:id` - Remove attraction from favorites

### Attractions
- `GET /api/attractions` - Get all attractions
- `GET /api/attractions/:id` - Get attraction by ID
- `POST /api/attractions` - Create new attraction (admin only)
- `PUT /api/attractions/:id` - Update attraction (admin only)
- `DELETE /api/attractions/:id` - Delete attraction (admin only)
- `POST /api/attractions/:id/reviews` - Add review to attraction
- `GET /api/attractions/nearby` - Get nearby attractions

### Recommendations
- `POST /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/cultural-insights/:topic` - Get cultural insights

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Generative AI for powering the AI descriptions and recommendations
- Material UI for the beautiful UI components
- The rich cultural heritage of Odisha for inspiration 