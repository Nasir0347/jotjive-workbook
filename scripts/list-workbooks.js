// Script to list all workbook IDs for cover matching
// Run: node scripts/list-workbooks.js

const fs = require('fs');
const path = require('path');

const workbooksDir = path.join(__dirname, '../public/workbooks');

// Get all PDF files recursively
function getAllPDFs(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllPDFs(filePath, fileList);
    } else if (file.endsWith('.pdf')) {
      const id = file.replace('.pdf', '');
      fileList.push(id);
    }
  });

  return fileList;
}

const workbookIds = getAllPDFs(workbooksDir).sort();

console.log('='.repeat(60));
console.log('ALL WORKBOOK IDs (Total:', workbookIds.length + ')');
console.log('='.repeat(60));
console.log('\nYou have 72 cover images in public/covers/');
console.log('They are all named: JJ05SC02C (1).png, JJ05SC02C (2).png, etc.\n');
console.log('You need to rename them to match these workbook IDs:\n');

workbookIds.forEach((id, index) => {
  console.log(`${(index + 1).toString().padStart(3, ' ')}. ${id}C.png  <-- Rename from: JJ05SC02C (${index + 1}).png`);
});

console.log('\n' + '='.repeat(60));
console.log('INSTRUCTIONS:');
console.log('='.repeat(60));
console.log('1. The first 72 workbooks above need covers');
console.log('2. Rename JJ05SC02C (1).png to the first ID + C.png');
console.log('3. Rename JJ05SC02C (2).png to the second ID + C.png');
console.log('4. And so on...');
console.log('\nExample:');
console.log('  JJ05SC02C (1).png  →  JJ01LA01C.png');
console.log('  JJ05SC02C (2).png  →  JJ01LA02C.png');
console.log('  JJ05SC02C (3).png  →  JJ01LA03C.png');
console.log('='.repeat(60));
