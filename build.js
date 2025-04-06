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

const clientDir = path.join(process.cwd(), 'client');

if (fs.existsSync(clientDir)) {
  console.log('Client directory found at:', clientDir);
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
} else {
  console.error('Client directory not found!');
  console.error('Expected at:', clientDir);
  process.exit(1);
} 