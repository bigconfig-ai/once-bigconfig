// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import astroD2 from "astro-d2";

import tailwindcss from "@tailwindcss/vite";

const docsRedirects = {
  "/api/core": "/manual",
  "/api/lock": "/manual",
  "/api/package": "/manual",
  "/api/pluggable": "/manual",
  "/api/render": "/manual",
  "/api/step": "/manual",
  "/api/system": "/manual",
  "/api/tools": "/manual",
  "/api/workflow": "/manual",
  "/libraries/control-plane": "/manual",
  "/libraries/system": "/manual",
  "/libraries/terraform": "/manual",
  "/references/template": "/manual",
  "/start-here/getting-started": "/manual",
  "/templates/package": "/manual",
};

// https://astro.build/config
export default defineConfig({
  site: "https://www.bigconfig.ai",
  redirects: {
    "/packages/walter": "/walter",
    "/packages/once": "/once",
    ...docsRedirects,
  },
  integrations: [
    astroD2(),
    mdx(),
  ],

  server: {
    allowedHosts: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
