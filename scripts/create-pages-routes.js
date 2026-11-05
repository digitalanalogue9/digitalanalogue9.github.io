import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
const outputDirectory = resolve('dist');
const indexFile = resolve(outputDirectory, 'index.html');

for (const route of routes) {
  const routeDirectory = resolve(outputDirectory, route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(indexFile, resolve(routeDirectory, 'index.html'));
}

await copyFile(indexFile, resolve(outputDirectory, '404.html'));
await writeFile(resolve(outputDirectory, '.nojekyll'), '');
