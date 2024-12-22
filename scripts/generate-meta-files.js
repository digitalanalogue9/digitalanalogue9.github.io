const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const lastmodDate = process.env.LASTMOD_DATE || new Date().toISOString();
  const routes = [
    '',
    '/about',
    '/history',
    '/exercise'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastmodDate}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
}

function generateRobots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const robots = `# Allow all web crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Disallow any temporary or development paths
Disallow: /api/
Disallow: /debug/
Disallow: /temp/
`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
}

// Generate both files
generateSitemap();
generateRobots();

console.log('Generated sitemap.xml and robots.txt');
