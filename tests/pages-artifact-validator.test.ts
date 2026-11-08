import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validatePagesArtifact } from '../scripts/pages-artifact-validator.js';

const artifactPaths: string[] = [];

function createPagesArtifact() {
  const directory = mkdtempSync(join(tmpdir(), 'core-values-pages-'));
  artifactPaths.push(directory);
  const write = (path: string, contents: string) => {
    const filePath = join(directory, path);
    mkdirSync(join(filePath, '..'), { recursive: true });
    writeFileSync(filePath, contents);
  };

  const pageMetadata = {
    about: {
      title: 'About Core Values · A borrowed deck of cards',
      description:
        'A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose.',
    },
    contact: {
      title: 'Contact · Core Values',
      description:
        'Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests.',
    },
    howtouse: {
      title: 'How Core Values works',
      description:
        'See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups.',
    },
    privacy: {
      title: 'Privacy · Core Values',
      description:
        'Understand what Core Values saves in your browser, how backups work and how to allow or reject optional Google Analytics.',
    },
  };
  const routes = [
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

  write(
    'index.html',
    '<html><head><link rel="canonical" href="https://core-values.me/" /></head><body><div id="root"></div></body></html>'
  );
  write('404.html', '<html><body><div id="root"></div></body></html>');
  write('CNAME', 'core-values.me\n');
  write('googlebfe6ddd34d4e4f70.html', 'google-site-verification: googlebfe6ddd34d4e4f70.html');
  write('robots.txt', 'Sitemap: https://core-values.me/sitemap.xml');
  write('sitemap.xml', '<loc>https://core-values.me/about</loc>');
  write('manifest.webmanifest', JSON.stringify({ start_url: 'https://core-values.me/', scope: 'https://core-values.me/' }));
  write('.nojekyll', '');
  write('sw.js', 'self.addEventListener("fetch", () => {});');
  for (const route of routes) {
    const metadata = pageMetadata[route as keyof typeof pageMetadata];
    const routeMetadata = metadata
      ? `<head><title>${metadata.title}</title><meta name="description" content="${metadata.description}" /><meta property="og:title" content="${metadata.title}" /><meta property="og:description" content="${metadata.description}" /><meta property="og:url" content="https://core-values.me/${route}" /><link rel="canonical" href="https://core-values.me/${route}" /></head>`
      : '';
    write(`${route}/index.html`, `<html>${routeMetadata}<div id="root"></div></html>`);
  }
  return directory;
}

afterEach(() => {
  for (const directory of artifactPaths.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('GitHub Pages artifact validation', () => {
  it('accepts the custom domain, route entries, PWA files, and crawl metadata', () => {
    expect(validatePagesArtifact(createPagesArtifact())).toEqual([]);
  });

  it('reports missing direct-route and service-worker files', () => {
    const directory = createPagesArtifact();
    rmSync(join(directory, 'history'), { recursive: true, force: true });
    rmSync(join(directory, 'sw.js'));

    expect(validatePagesArtifact(directory)).toEqual(
      expect.arrayContaining(['Missing static route entry: history/index.html', 'Missing service worker: sw.js'])
    );
  });

  it('rejects localhost URLs in deployed crawl metadata', () => {
    const directory = createPagesArtifact();
    writeFileSync(join(directory, 'robots.txt'), 'Sitemap: http://localhost:5173/sitemap.xml');

    expect(validatePagesArtifact(directory)).toContain('robots.txt must not include localhost URLs');
  });

  it('rejects stale metadata on public static route entries', () => {
    const directory = createPagesArtifact();
    writeFileSync(
      join(directory, 'about/index.html'),
      '<html><head><title>About Core Values</title><meta name="description" content="Old copy." /></head></html>'
    );

    expect(validatePagesArtifact(directory)).toEqual(
      expect.arrayContaining([
        'about/index.html must publish the approved title',
        'about/index.html must publish the approved name="description" metadata',
        'about/index.html must publish the approved property="og:title" metadata',
        'about/index.html must publish the approved property="og:description" metadata',
        'about/index.html must publish the canonical URL',
      ])
    );
  });
});
