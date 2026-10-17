const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

// Ensure www exists
if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (child.endsWith('.apk') || child.endsWith('.zip') || child.endsWith('.map')) continue;
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    if (src.endsWith('.apk') || src.endsWith('.zip') || src.endsWith('.map')) return;
    fs.copyFileSync(src, dest);
  }
}

// Copy essential files to www
const filesToCopy = [
  'index.html',
  'manifest.json',
  'sw.js',
  'serve.js',
  'version.json'
];

for (const file of filesToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(wwwDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// Copy directories
copyRecursive(path.join(rootDir, 'dist'), path.join(wwwDir, 'dist'));
copyRecursive(path.join(rootDir, 'assets'), path.join(wwwDir, 'assets'));
copyRecursive(path.join(rootDir, 'src'), path.join(wwwDir, 'src'));

console.log('✓ Successfully prepared www directory for Android build!');
