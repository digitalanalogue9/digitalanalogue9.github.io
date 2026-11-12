import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const fromRepository = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('personal Pages metadata artifacts', () => {
  it('publishes the custom domain and Search Console verification file', () => {
    expect(fromRepository('CNAME').trim()).toBe('core-values.me');
    expect(fromRepository('public/CNAME').trim()).toBe('core-values.me');
    expect(fromRepository('public/googlebfe6ddd34d4e4f70.html')).toContain('google-site-verification:');
  });

  it('uses canonical URLs in the document, robots policy, and sitemap', () => {
    const index = fromRepository('index.html');
    const robots = fromRepository('public/robots.txt');
    const sitemap = fromRepository('public/sitemap.xml');

    expect(index).toContain('<link rel="canonical" href="https://core-values.me/" />');
    expect(index).toContain('https://core-values.me/icons/icon-192x192.png');
    expect(index).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
    expect(robots).toContain('Sitemap: https://core-values.me/sitemap.xml');
    expect(sitemap).toContain('<loc>https://core-values.me/about/</loc>');
    expect(sitemap).toContain('<loc>https://core-values.me/howtouse/</loc>');
    expect(sitemap).toContain('<loc>https://core-values.me/contact/</loc>');
    expect(sitemap).not.toContain('<loc>https://core-values.me/about</loc>');
    expect(`${robots}\n${sitemap}`).not.toContain('localhost');
  });
});
