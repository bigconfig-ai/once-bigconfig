// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import astroD2 from "astro-d2";

import tailwindcss from "@tailwindcss/vite";

const googleAnalyticsId = "G-4VKP1WY4QJ";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroD2(),
    starlight({
      plugins: [
        starlightBlog({
          authors: {
            amiorin: {
              name: "amiorin",
              title: "Alberto Miorin",
              picture: "/avatar.png", // Images in the `public` directory are supported.
              url: "https://albertomiorin.com",
            },
          },
        }),
      ],
      title: "BigConfig",
      customCss: [
        // Path to your Tailwind base styles:
        "./src/styles/global.css",
      ],
      head: [
        // Google Analytics
        {
          tag: "script",
          attrs: {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: "script",
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `,
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/amiorin/big-config",
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          autogenerate: { directory: "start-here" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
