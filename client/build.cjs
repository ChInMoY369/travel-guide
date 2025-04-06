// This file is a simple bridge to run the correct build command
// Using CommonJS syntax for compatibility

const { execSync } = require('child_process');

try {
  console.log('Starting Vite build process...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:');
  console.error(error.message);
  process.exit(1);
} 