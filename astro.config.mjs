// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lead-generation-landing-page.pages.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  server: {
    host: true,
  },
});
