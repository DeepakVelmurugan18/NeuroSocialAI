const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const { regex, replacement } of replacements) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
};

const walk = (dir, replacements, extensions) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.next', '.git'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, replacements, extensions);
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      replaceInFile(fullPath, replacements);
    }
  }
};

// Client replacements
const clientReplacements = [
  { regex: /http:\/\/\$\{window\.location\.hostname\}:5000/g, replacement: 'https://neurosocialai.onrender.com' },
  { regex: /http:\/\/localhost:5000/g, replacement: 'https://neurosocialai.onrender.com' }
];
walk(path.join(__dirname, 'client'), clientReplacements, ['.tsx', '.ts', '.js']);

// Server index.js replacement
const serverIndexPath = path.join(__dirname, 'server', 'index.js');
const serverReplacements = [
  { regex: /http:\/\/localhost:5000/g, replacement: 'https://neurosocialai.onrender.com' }
];
replaceInFile(serverIndexPath, serverReplacements);

console.log("URL replacement complete.");
