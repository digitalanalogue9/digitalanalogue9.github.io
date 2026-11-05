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

  write(
    'index.html',
    '<html><head><link rel="canonical" href="https://core-values.me/" /></head><body><div id="root"></div></body></html>'
  );
  write('404.html', '<html><body><div id="root"></div></body></html>');
  write('CNAME', 'core-values.me\n');
  write('googlebfe6ddd34d4e4f70.html', 'google-site-verification: googlebfe6ddd34d4e4f70.html');
  write('robots.txt', 'Sitemap: https://core-values.me/sitemap.xml');
  write('sitemap.xml', '<loc>https://core-values.me/about</loc>');
  write(
    'manifest.webmanifest',
    JSON.stringify({ start_url: 'https://core-values.me/', scope: 'https://core-values.me/' })
  );
  write('.nojekyll', '');
  write('sw.js', 'self.addEventListener("fetch", () => {});');
  for (const route of [
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
  ]) {
    write(`${route}/index.html`, '<html><div id="root"></div></html>');
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
});
