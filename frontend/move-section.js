const fs = require('fs');

const filePath = 'app/(shop)/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The markers
const marker1 = '{/* 4. INTERACTIVE SERVICES GRID */}';
const marker2 = '{/* NEW CONSOLIDATION SECTION */}';
const marker3 = '{/* 5. WHY CHOOSE US (INTERACTIVE TABS) */}';

// Find indices
const idx1 = content.indexOf(marker1);
const idx2 = content.indexOf(marker2);
const idx3 = content.indexOf(marker3);

if (idx1 !== -1 && idx2 !== -1 && idx3 !== -1 && idx1 < idx2 && idx2 < idx3) {
  const before = content.substring(0, idx1);
  const section1 = content.substring(idx1, idx2);
  const section2 = content.substring(idx2, idx3);
  const after = content.substring(idx3);

  // Swap section1 and section2
  // Let's trim whitespace to avoid huge gaps
  const newContent = before + section2.trim() + '\n\n      ' + section1.trim() + '\n\n      ' + after;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully swapped sections.');
} else {
  console.log('Could not find markers or they are out of expected order.', { idx1, idx2, idx3 });
}
