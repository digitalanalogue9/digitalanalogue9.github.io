import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const routes = ['about', 'behaviour', 'completed', 'exercise', 'history', 'howtouse', 'privacy', 'reasoning', 'replay'];
const indexFile = resolve('dist/index.html');

for (const route of routes) {
  const routeDirectory = resolve('dist', route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(indexFile, resolve(routeDirectory, 'index.html'));
}
