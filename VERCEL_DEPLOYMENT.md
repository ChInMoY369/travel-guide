# Vercel Deployment Guide

This guide explains how to deploy the Travel Guide application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Git repository with your code
3. MongoDB Atlas account (or other MongoDB provider)
4. Node.js and npm installed locally

## Environment Variables

You need to set up the following environment variables in Vercel:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `JWT_EXPIRE`: JWT token expiration (e.g., "30d")
- `FRONTEND_URL`: URL of your deployed frontend (for CORS)
- `NODE_ENV`: Set to "production"
- `VERCEL`: Set to "true"
- `GEMINI_API_KEY`: Your Google Gemini API key
- `OPENWEATHER_API_KEY`: Your OpenWeather API key

Email configuration:
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_SECURE`: Set to "true" or "false"
- `REMINDER_CHECK_INTERVAL`: Interval in seconds for checking reminders

Frontend variables are automatically set in the vercel.json, but you can override if needed:
- `VITE_APP_API_URL`: Set to "/api" for production
- `VITE_APP_NAME`: "Travel Guide"
- `VITE_APP_VERSION`: "1.0.0"

## Deployment Steps

1. **Push your code to a Git repository**
   - Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
   - Ensure the unified `vercel.json` file is in the root directory

2. **Connect your repository to Vercel**
   - Log in to your Vercel account
   - Click "Import Project"
   - Select your Git repository

3. **Configure your project**
   - Project Name: Choose a name for your deployment
   - Framework Preset: Auto-detected from vercel.json
   - Root Directory: Leave as is (the root of your repository)
   - Build Command: Auto-detected from vercel.json
   - Output Directory: Auto-detected from vercel.json

4. **Set Environment Variables**
   - Expand the "Environment Variables" section
   - Add all required environment variables listed above
   - Click "Add" for each variable
   - Note: Some variables are set in vercel.json with placeholder values like `${MONGODB_URI}` - make sure to define these in Vercel's dashboard

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a deployment URL

## Important Configuration Notes

The `vercel.json` has been configured to:
- Use Vite as the frontend framework with `client/dist` as the output directory
- Resolve conflicts between `routes` and `rewrites` by using the proper Vercel syntax
- Set up proper header configurations for API routes and static assets
- Configure environment variables with placeholder values
- Set up proper routing for the API, uploads, and client app

## Troubleshooting

If you encounter deployment issues:

1. **Check Logs**
   - Go to your project on Vercel
   - Click on the latest deployment
   - Click "View Logs" to see detailed build and runtime logs

2. **Output Directory Errors**
   - If you see "No Output Directory named 'build' found after the Build completed", make sure the `outputDirectory` in vercel.json matches what your build tool generates
   - For Vite projects, the correct output directory is `client/dist` (not `client/build`)
   - For Create React App projects, the output directory would be `client/build`

3. **Database Connection Issues**
   - Verify your `MONGODB_URI` is correct
   - Ensure your MongoDB Atlas cluster has the correct network access rules (whitelist 0.0.0.0/0 for Vercel's dynamic IPs)
   - Check that your database user has the proper permissions
   - If using MongoDB Atlas, make sure your connection string includes the correct database name

4. **API Errors**
   - Test the `/api/health` endpoint to check API status
   - Use the `/api/diagnostic` endpoint for detailed database connection info
   - Verify CORS settings if the frontend can't connect to the API

5. **Static File Issues**
   - Check that uploads directory permissions are correct
   - Verify the static file routes in vercel.json are properly configured

6. **Path Parameter Errors**
   - If you see errors like "Rewrite at index X has segment ':path' in destination property but not in source or has property", make sure that any named path parameters (like `:path*`) used in a `destination` are also present in the `source` or `has` property
   - For uploads, use `/uploads/:path*` in both source and destination
   - For static files, use `/:path*.extension` instead of `/(.*).extension`
   - Keep the pattern consistent between `rewrites` and `headers` sections

## Server Connection Issues

If your server is not connecting properly in the Vercel deployment:

1. **Check Environment Variables**
   - Verify all environment variables are correctly set in Vercel's dashboard
   - Make sure `MONGODB_URI` is set correctly with no special characters or encoding issues
   - Ensure `NODE_ENV` is set to "production" and `VERCEL` is set to "true"

2. **MongoDB Connection Issues**
   - In MongoDB Atlas, go to "Network Access" and add 0.0.0.0/0 to whitelist all IPs
   - Create a dedicated database user for the Vercel deployment
   - Use the latest MongoDB driver version (should be handled automatically)

3. **Debugging Steps**
   - Navigate to `/api/health` to verify the server is running
   - Navigate to `/api/diagnostic` to check database connection status
   - Review Vercel logs for any errors during serverless function execution
   - Look for database timeout or connection errors in the logs

4. **Serverless Function Limitations**
   - Be aware that serverless functions have cold starts and connection timeouts
   - Consider using MongoDB Atlas connection pooling for better performance
   - Set appropriate timeouts in mongoose connection options (already configured)

## Project Structure

```
/
├── client/              # React frontend
├── server/              # Express backend
├── vercel.json          # Unified deployment configuration
└── VERCEL_DEPLOYMENT.md # This deployment guide
```

## Notes on Serverless Functions

- The backend is deployed as serverless functions
- Database connections are managed efficiently with connection pooling
- The server has been optimized for the serverless environment by:
  - Removing process.exit() calls
  - Using connection caching
  - Implementing proper error handling
  - Adding health check endpoints

## After Deployment

1. Front-end will automatically use the correct API URL (/api)
2. Test all features to ensure they work in the production environment
3. Set up monitoring and logging if needed 