#!/bin/bash
set -e

echo "Starting build process..."

# Navigate to client directory
echo "Changing to client directory..."
cd client

# Install dependencies
echo "Installing dependencies..."
npm install --no-audit --no-fund

# Explicitly install vite in the client directory
echo "Explicitly installing vite..."
npm install vite@5.1.6 @vitejs/plugin-react --no-audit --no-fund

# Run the build using npx to ensure we use the local version
echo "Running vite build with npx..."
npx vite build

echo "Build completed successfully!" 