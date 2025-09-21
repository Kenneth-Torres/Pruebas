// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 4321,
      allowedHosts: [
        'vscode-d8e0f94b-fa03-41cd-b3d8-0a20ab296848.preview.emergentagent.com'
      ]
    }
  }
});
