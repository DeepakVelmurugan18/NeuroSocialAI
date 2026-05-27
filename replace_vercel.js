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

const serverIndexPath = path.join(__dirname, 'server', 'index.js');
const serverReplacements = [
  { regex: /http:\/\/localhost:3000/g, replacement: 'https://client-seven-woad-29.vercel.app' }
];

replaceInFile(serverIndexPath, serverReplacements);
console.log("Vercel URL replacement complete.");
