import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const requiredRoutes = [
  'about',
  'behaviour',
  'completed',
  'contact',
  'exercise',
  'history',
  'howtouse',
  'privacy',
  'reasoning',
  'replay',
];

export function validatePagesArtifact(directory) {
  const errors = [];
  const requireFile = (relativePath, description = relativePath) => {
    if (!existsSync(path.join(directory, relativePath))) errors.push(`Missing ${description}: ${relativePath}`);
  };
  const read = (relativePath) => {
    const filePath = path.join(directory, relativePath);
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  };

  requireFile('index.html', 'root app entry');
  requireFile('404.html', 'Pages SPA fallback');
  requireFile('CNAME', 'custom domain file');
  requireFile('googlebfe6ddd34d4e4f70.html', 'Search Console verification file');
  requireFile('manifest.webmanifest', 'PWA manifest');
  requireFile('.nojekyll', 'Pages Jekyll bypass file');
  requireFile('sw.js', 'service worker');

  for (const route of requiredRoutes) {
    requireFile(`${route}/index.html`, `static route entry`);
  }

  if (read('CNAME').trim() !== 'core-values.me') errors.push('CNAME must contain core-values.me');
  if (!read('index.html').includes('https://core-values.me/')) {
    errors.push('Root app entry must include the canonical personal domain');
  }
  if (!read('robots.txt').includes('Sitemap: https://core-values.me/sitemap.xml')) {
    errors.push('robots.txt must reference the personal domain sitemap');
  }
  if (!read('sitemap.xml').includes('https://core-values.me/')) {
    errors.push('sitemap.xml must include canonical personal domain URLs');
  }
  for (const relativePath of ['index.html', 'sitemap.xml', 'robots.txt']) {
    if (/localhost/i.test(read(relativePath))) errors.push(`${relativePath} must not include localhost URLs`);
  }
  if (!read('404.html').includes('<div id="root"></div>')) {
    errors.push('404.html must load the app shell for unknown Pages paths');
  }

  try {
    const manifest = JSON.parse(read('manifest.webmanifest'));
    if (manifest.start_url !== 'https://core-values.me/' || manifest.scope !== 'https://core-values.me/') {
      errors.push('PWA manifest must use the personal domain for start_url and scope');
    }
  } catch {
    errors.push('PWA manifest must be valid JSON');
  }

  return errors;
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const directory = path.resolve(process.argv[2] || 'dist');
  const errors = validatePagesArtifact(directory);
  if (errors.length) {
    console.error(`GitHub Pages artifact validation failed for ${directory}:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`GitHub Pages artifact validated: ${directory}`);
  }
}
