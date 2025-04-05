#!/bin/bash
set -e

echo "Starting build process..."

# Navigate to client directory
echo "Changing to client directory..."
cd client

# Install dependencies
echo "Installing dependencies..."
npm install --no-audit --no-fund

# Check if vite exists in node_modules
if [ -f "./node_modules/.bin/vite" ]; then
  echo "Using local vite from node_modules..."
  ./node_modules/.bin/vite build
else
  echo "Installing vite globally..."
  npm install -g vite
  echo "Running vite build..."
  vite build
fi

echo "Build completed successfully!" 