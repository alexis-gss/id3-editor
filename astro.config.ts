import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';

export default defineConfig({
  compressHTML: true,
  integrations: [react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    preview: {
      allowedHosts: true,
    },
  },
});