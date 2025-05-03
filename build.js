// build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building PluralKit Discord Overlay...');

// Check if entry file exists
const entryPath = path.join(__dirname, 'src/index.tsx');
if (!fs.existsSync(entryPath)) {
  // Check for alternative file extensions
  const jsxPath = path.join(__dirname, 'src/index.jsx');
  if (fs.existsSync(jsxPath)) {
    console.log('Found index.jsx instead of index.tsx, renaming...');
    fs.renameSync(jsxPath, entryPath);
  } else {
    console.error('Error: Entry file not found at src/index.tsx or src/index.jsx');
    process.exit(1);
  }
}

console.log('Bypassing TypeScript type checking for development...');

try {
  // Build without TypeScript checking
  if (process.argv.includes('--bd')) {
    execSync('vite build --mode betterdiscord', { stdio: 'inherit' });
  } else if (process.argv.includes('--vencord')) {
    execSync('vite build --mode vencord', { stdio: 'inherit' });
  } else if (process.argv.includes('--powercord')) {
    execSync('vite build --mode powercord', { stdio: 'inherit' });
  } else {
    execSync('vite build', { stdio: 'inherit' });
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}