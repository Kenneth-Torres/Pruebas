// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: [
    '.preview.emergentagent.com' // permite todos los subdominios
  ]
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 4321,
      allowedHosts: ['all']
    }
  }
});