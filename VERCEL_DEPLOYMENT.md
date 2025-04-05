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
- `FRONTEND_URL`: URL of your deployed frontend (for CORS)
- `NODE_ENV`: Set to "production"
- `VERCEL`: Set to "true"

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

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a deployment URL

## Troubleshooting

If you encounter deployment issues:

1. **Check Logs**
   - Go to your project on Vercel
   - Click on the latest deployment
   - Click "View Logs" to see detailed build and runtime logs

2. **Database Connection Issues**
   - Verify your `MONGODB_URI` is correct
   - Ensure your MongoDB Atlas cluster has the correct network access rules
   - Check that your database user has the proper permissions

3. **API Errors**
   - Test the `/api/health` endpoint to check API status
   - Use the `/api/diagnostic` endpoint for detailed database connection info
   - Verify CORS settings if the frontend can't connect to the API

4. **Static File Issues**
   - Check that uploads directory permissions are correct
   - Verify the static file routes in vercel.json are properly configured

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

1. Update your client-side API URL to point to your Vercel deployment
2. Test all features to ensure they work in the production environment
3. Set up monitoring and logging if needed 