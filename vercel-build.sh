#!/bin/bash

# Print current directory and contents for debugging
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're already in the client directory
if [ -f "vite.config.js" ]; then
  echo "Already in client directory, building directly"
  npm install --legacy-peer-deps && npm run build
  exit $?
fi

# Check if client directory exists
if [ -d "client" ]; then
  echo "Found client directory, building there"
  cd client
  npm install --legacy-peer-deps && npm run build
  exit $?
else
  echo "ERROR: Could not find client directory or vite.config.js"
  echo "Listing all files and directories:"
  find . -type f -name "vite.config.js" -o -name "package.json"
  exit 1
fi 