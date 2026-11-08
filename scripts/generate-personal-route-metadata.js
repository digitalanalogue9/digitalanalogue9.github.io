import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(scriptDirectory, '..', 'dist');
const baseUrl = (process.env.VITE_SITE_URL || 'https://core-values.me').replace(/\/$/, '');

const pageMetadata = {
  about: {
title: 'About Core Values · A borrowed deck of cards',
description: 'A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose.',
  },
  howtouse: {
title: 'How Core Values works',
description: 'See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups.',
  },
  contact: {
title: 'Contact · Core Values',
description: 'Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests.',
  },
  privacy: {
title: 'Privacy · Core Values',
description: 'Understand what Core Values saves in your browser, how backups work and how to allow or reject optional Google Analytics.',
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
