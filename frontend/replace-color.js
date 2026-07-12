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
  let newContent = content.replace(/blue-50/g, 'primary-50')
                          .replace(/blue-100/g, 'primary-100')
                          .replace(/blue-200/g, 'primary-200')
                          .replace(/blue-300/g, 'primary-300')
                          .replace(/blue-400/g, 'primary-400')
                          .replace(/blue-500/g, 'primary-500')
                          .replace(/blue-600/g, 'primary-600')
                          .replace(/blue-700/g, 'primary-700')
                          .replace(/blue-800/g, 'primary-800')
                          .replace(/blue-900/g, 'primary-900')
                          .replace(/shadow-blue-/g, 'shadow-primary-');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
