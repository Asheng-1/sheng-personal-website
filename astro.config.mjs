// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages ? "https://asheng-1.github.io" : undefined,
  base: isGitHubPages ? "/sheng-personal-website" : "/",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
      },
    },
  },
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  server: {
    port: 4321,
  },
});
