const fs = require('fs');
const path = require('path');

// Function to recursively list directory contents
function listDirectoryContents(dirPath, depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return;
  
  console.log(`\nContents of: ${dirPath}`);
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const prefix = '  '.repeat(depth);
    console.log(`${prefix}${item.isDirectory() ? 'DIR: ' : 'FILE: '}${item.name}`);
    
    if (item.isDirectory() && item.name !== 'node_modules' && depth < maxDepth) {
      try {
        listDirectoryContents(path.join(dirPath, item.name), depth + 1, maxDepth);
      } catch (err) {
        console.log(`${prefix}  [Error reading directory: ${err.message}]`);
      }
    }
  }
}

// Print environment information
console.log('=== VERCEL DEPLOYMENT DEBUG INFO ===');
console.log('Current working directory:', process.cwd());
console.log('Path separator:', path.sep);
console.log('HOME:', process.env.HOME);
console.log('VERCEL:', process.env.VERCEL);
console.log('Environment variables:', Object.keys(process.env).filter(key => key.startsWith('VERCEL_')));

// List contents of current directory and parent
try {
  listDirectoryContents(process.cwd());
} catch (err) {
  console.error('Error listing directory contents:', err);
}

// Check for client directory explicitly
const clientPath = path.join(process.cwd(), 'client');
console.log('\nChecking for client directory at:', clientPath);
if (fs.existsSync(clientPath)) {
  console.log('✅ Client directory exists');
  // List client directory contents
  listDirectoryContents(clientPath, 0, 1);
} else {
  console.log('❌ Client directory does not exist');
  // Look for it elsewhere
  console.log('\nSearching for client directory or vite.config.js:');
  try {
    const findCommand = `find ${process.cwd()} -type d -name "client" -o -name "vite.config.js" | grep -v "node_modules"`;
    const execSync = require('child_process').execSync;
    const result = execSync(findCommand, { encoding: 'utf8' });
    console.log(result);
  } catch (err) {
    console.log('Error searching for client directory:', err.message);
  }
} 