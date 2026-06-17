const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ASUS/Desktop/absurtyemek/frontend/src/app';

const replaceColors = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Tailwind class names
  content = content.replace(/orange-/g, 'indigo-');
  content = content.replace(/amber-/g, 'violet-');
  content = content.replace(/yellow-/g, 'fuchsia-');
  
  // Replace specific RGBA values for shadows
  // orange-500: 249,115,22 -> indigo-500: 99,102,241
  content = content.replace(/249,115,22/g, '99,102,241');
  
  fs.writeFileSync(filePath, content, 'utf8');
};

const walkSync = (d) => {
  const files = fs.readdirSync(d);
  files.forEach(file => {
    const p = path.join(d, file);
    if (fs.statSync(p).isDirectory()) {
      walkSync(p);
    } else if (p.endsWith('.tsx')) {
      replaceColors(p);
    }
  });
};

walkSync(dir);
console.log('Colors replaced successfully!');
