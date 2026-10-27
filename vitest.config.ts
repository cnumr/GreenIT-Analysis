import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [
    WxtVitest(),
    legacy(),
  ],
  test: {
    dir: 'tests/unit',
    setupFiles: ['./vitest.setup.ts'],
  }
});
