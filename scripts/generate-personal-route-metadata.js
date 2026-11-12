import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { editorialRouteMetadata } from './editorial-route-metadata.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(scriptDirectory, '..', 'dist');
const baseUrl = (process.env.VITE_SITE_URL || 'https://core-values.me').replace(/\/$/, '');

for (const [route, metadata] of Object.entries(editorialRouteMetadata)) {
  const routeDirectory = path.join(outputDirectory, route);
  const routeIndex = path.join(routeDirectory, 'index.html');
  fs.mkdirSync(routeDirectory, { recursive: true });
  let html = fs.existsSync(routeIndex)
    ? fs.readFileSync(routeIndex, 'utf8')
    : fs.readFileSync(path.join(outputDirectory, 'index.html'), 'utf8');
  const canonicalUrl = `${baseUrl}/${route}/`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${metadata.description}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${metadata.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${metadata.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

  fs.writeFileSync(routeIndex, html);
}
