const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
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
  let newContent = content.replace(/brand-500/g, '[#ff3f39]')
                          .replace(/brand-600/g, '[#e62c26]')
                          .replace(/brand-400/g, '[#ff6861]')
                          .replace(/brand-300/g, '[#ff9b96]')
                          .replace(/brand-200/g, '[#ffc9c6]')
                          .replace(/brand-100/g, '[#ffe4e2]')
                          .replace(/brand-50/g, '[#fff0ef]')
                          .replace(/brand-900/g, '[#7e1d19]')
                          .replace(/shadow-brand-900\/50/g, 'shadow-[#7e1d19]/50')
                          .replace(/shadow-brand-600\/40/g, 'shadow-[#e62c26]/40');
                          
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
