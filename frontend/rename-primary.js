const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('components')];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/primary-50\b/g, 'brand-50')
                          .replace(/primary-100\b/g, 'brand-100')
                          .replace(/primary-200\b/g, 'brand-200')
                          .replace(/primary-300\b/g, 'brand-300')
                          .replace(/primary-400\b/g, 'brand-400')
                          .replace(/primary-500\b/g, 'brand-500')
                          .replace(/primary-600\b/g, 'brand-600')
                          .replace(/primary-700\b/g, 'brand-700')
                          .replace(/primary-800\b/g, 'brand-800')
                          .replace(/primary-900\b/g, 'brand-900')
                          .replace(/shadow-primary-/g, 'shadow-brand-');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
