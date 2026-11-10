/** @type {import('@stryker-mutator/api/core').StrykerOptions} */
export default {
  testRunner: 'vitest',
  plugins: ['@stryker-mutator/vitest-runner'],
  mutate: ['src/app/replay/replayTimeline.ts'],
  reporters: ['clear-text', 'html', 'progress'],
  coverageAnalysis: 'perTest',
  ignoreStatic: true,
  concurrency: 2,
};
