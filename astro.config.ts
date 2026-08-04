import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://id3-editor.alexis-gousseau.com/",
  compressHTML: true,
  integrations: [react(), sitemap()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    preview: {
      allowedHosts: true,
    },
  },
});