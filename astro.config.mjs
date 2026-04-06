import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://janvitu.com",
  output: "static",
  adapter: netlify(),
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "cs"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
