import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = (process.env.VITE_SITE_URL || 'https://core-values.me').replace(/\/$/, '');
const publicDirectory = path.join(scriptDirectory, '..', 'public');

const routes = ['/', '/about', '/howtouse', '/contact', '/privacy'];
const lastmod = process.env.LASTMOD_DATE || new Date().toISOString();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route === '/' ? '' : route}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;
const robots = `# Allow all web crawlers
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDirectory, 'robots.txt'), robots);
console.log('Generated sitemap.xml and robots.txt');
