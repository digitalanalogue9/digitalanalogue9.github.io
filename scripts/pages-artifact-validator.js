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

const expectedEditorialMetadata = {
  about: {
    title: 'About Core Values · A borrowed deck of cards',
    description: 'A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose.',
  },
  howtouse: {
    title: 'How Core Values works',
    description: 'See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups.',
  },
  privacy: {
    title: 'Privacy · Core Values',
    description: 'Understand what Core Values saves in your browser, how backups work and how to allow or reject optional Google Analytics.',
  },
  contact: {
    title: 'Contact · Core Values',
    description: 'Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests.',
  },
};

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
  for (const route of requiredRoutes) requireFile(`${route}/index.html`, `static route entry`);

  if (read('CNAME').trim() !== 'core-values.me') errors.push('CNAME must contain core-values.me');
  if (!read('index.html').includes('https://core-values.me/')) {
    errors.push('Root app entry must include canonical personal domain');
  }
  if (!read('robots.txt').includes('Sitemap: https://core-values.me/sitemap.xml')) {
    errors.push('robots.txt must reference personal domain sitemap');
  }
  if (!read('sitemap.xml').includes('https://core-values.me/')) {
    errors.push('sitemap.xml must include canonical personal domain URLs');
  }
  for (const relativePath of ['index.html', 'sitemap.xml', 'robots.txt']) {
    if (/localhost/i.test(read(relativePath))) errors.push(`${relativePath} must not include localhost URLs`);
  }
  if (!read('404.html').includes('<div id="root"></div>')) {
    errors.push('404.html must load app shell for unknown Pages paths');
  }
  try {
    const manifest = JSON.parse(read('manifest.webmanifest'));
    if (manifest.start_url !== 'https://core-values.me/' || manifest.scope !== 'https://core-values.me/') {
      errors.push('PWA manifest must use personal domain start_url and scope');
    }
  } catch {
    errors.push('PWA manifest must be valid JSON');
  }

  for (const [route, metadata] of Object.entries(expectedEditorialMetadata)) {
    const html = read(`${route}/index.html`);
    const title = html.match(/<title>\s*([^<]*?)\s*<\/title>/)?.[1];
    if (title !== metadata.title) errors.push(`${route}/index.html must publish the approved title`);
    for (const [attribute, value] of [
      ['name="description"', metadata.description],
      ['property="og:title"', metadata.title],
      ['property="og:description"', metadata.description],
      ['property="og:url"', `https://core-values.me/${route}`],
    ]) {
      if (!html.includes(`<meta ${attribute} content="${value}" />`)) {
        errors.push(`${route}/index.html must publish the approved ${attribute} metadata`);
      }
    }
    if (!html.includes(`<link rel="canonical" href="https://core-values.me/${route}" />`)) {
      errors.push(`${route}/index.html must publish the canonical URL`);
    }
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
