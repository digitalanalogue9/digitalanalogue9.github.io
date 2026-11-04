import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(scriptDirectory, '..', 'dist');
const baseUrl = (process.env.VITE_SITE_URL || 'https://core-values.me').replace(/\/$/, '');

const pageMetadata = {
  about: {
    title: 'About Core Values',
    description: 'Why Core Values was created and how identifying your values can support personal growth.',
  },
  howtouse: {
    title: 'How to use Core Values',
    description: 'Learn how to choose, prioritise, and reflect on your personal core values.',
  },
  contact: {
    title: 'Contact Core Values',
    description: 'Contact the Core Values site owner with questions, feedback, or privacy requests.',
  },
  privacy: {
    title: 'Core Values Privacy Policy',
    description: 'Learn how Core Values stores local data and uses analytics only with your consent.',
  },
};

for (const [route, metadata] of Object.entries(pageMetadata)) {
  const routeDirectory = path.join(outputDirectory, route);
  const routeIndex = path.join(routeDirectory, 'index.html');
  fs.mkdirSync(routeDirectory, { recursive: true });
  let html = fs.existsSync(routeIndex)
    ? fs.readFileSync(routeIndex, 'utf8')
    : fs.readFileSync(path.join(outputDirectory, 'index.html'), 'utf8');
  const canonicalUrl = `${baseUrl}/${route}`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${metadata.description}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${metadata.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${metadata.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

  fs.writeFileSync(routeIndex, html);
}
