const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to execute commands with better error handling
function runCommand(command, cwd = process.cwd()) {
  console.log(`Running command: ${command}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Debugging: Show current directory and files
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync(process.cwd()));

// Check if we're in client directory already or need to find it
let clientDir = process.cwd();
if (!fs.existsSync(path.join(clientDir, 'vite.config.js'))) {
  // We're not in the client directory yet, so try to find it
  const possibleClientDir = path.join(process.cwd(), 'client');
  if (fs.existsSync(possibleClientDir)) {
    clientDir = possibleClientDir;
  } else {
    // Special case for Vercel deployments where the structure might be different
    console.log('Looking for client files in current directory...');
    // If we find key client files here, we'll assume we're in the right place
    const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
    const hasIndexHtml = fs.existsSync(path.join(process.cwd(), 'index.html'));
    if (hasPackageJson && hasIndexHtml) {
      console.log('Found client files in current directory, proceeding with build');
    } else {
      console.error('Could not locate the client directory!');
      process.exit(1);
    }
  }
}

console.log('Using client directory:', clientDir);
console.log('Client directory contents:', fs.readdirSync(clientDir));

// Install dependencies
if (!runCommand('npm install --legacy-peer-deps', clientDir)) {
  process.exit(1);
}

// Build the client application using its own build script
if (!runCommand('npm run build', clientDir)) {
  console.log('Trying alternative build command...');
  if (!runCommand('npx vite build', clientDir)) {
    process.exit(1);
  }
}

console.log('Build completed successfully!'); 