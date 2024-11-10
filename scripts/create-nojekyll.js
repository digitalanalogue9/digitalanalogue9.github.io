const fs = require('fs');
const path = require('path');

const nojekyllPath = path.join(process.cwd(), 'out', '.nojekyll');

try {
  fs.writeFileSync(nojekyllPath, '');
  console.log('.nojekyll file created successfully');
} catch (err) {
  console.error('Error creating .nojekyll file:', err);
  process.exit(1);
}
