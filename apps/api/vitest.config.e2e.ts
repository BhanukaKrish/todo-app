import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    // mongodb-memory-server may need to download/boot a mongod binary on first run.
    hookTimeout: 120_000,
  },
});
