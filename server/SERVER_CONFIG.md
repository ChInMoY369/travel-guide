# Server Configuration

This document explains how to configure the server for different environments.

## Environment Variables

The server uses the following key environment variables:

### Server Configuration
- `NODE_ENV`: The environment mode (`development` or `production`)
- `PORT`: The port the server will run on (default: 5000)

### Frontend URLs
- `FRONTEND_URL`: Primary frontend URL (default: http://localhost:5173)
- `FRONTEND_DEV_URL`: Secondary frontend URL (default: http://localhost:3000)

### Database Configuration
- `MONGODB_URI`: MongoDB connection string

### Authentication
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: JWT token expiration period (e.g., "30d" for 30 days)

### Email Configuration
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_SECURE`: Whether to use SSL/TLS (true/false)
- `REMINDER_CHECK_INTERVAL`: How often to check for reminders (in seconds)

### API Keys
- `GEMINI_API_KEY`: Google's Gemini AI API key
- `OPENWEATHER_API_KEY`: OpenWeather API key

## Environment Files

### Development (.env)
For local development, the `.env` file contains development settings with localhost URLs.

### Production (.env.production)
For production deployment, create a `.env.production` file with your production settings.

## CORS Configuration

The server is configured to allow requests only from the URLs specified in the `FRONTEND_URL` and `FRONTEND_DEV_URL` environment variables. This is a security measure to prevent unauthorized access to your API.

```javascript
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_DEV_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

## Static File Serving in Production

In production mode, the server will serve static files from the frontend build directory:

```javascript
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../frontend/client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}
```

## Deployment Considerations

1. Set `NODE_ENV=production` in your production environment
2. Update `FRONTEND_URL` to your production frontend URL
3. Ensure all API keys and secrets are properly set for production
4. Make sure your MongoDB connection string points to your production database
5. If deploying behind a proxy (like Nginx), make sure it's properly configured to forward requests to your Node.js server 