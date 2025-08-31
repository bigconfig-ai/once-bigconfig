// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";

const googleAnalyticsId = "G-4VKP1WY4QJ";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightBlog({
          authors: {
            amiorin: {
              name: "amiorin",
              title: "Alberto Miorin",
              picture: "/avatar.jpg", // Images in the `public` directory are supported.
              url: "https://albertomiorin.com",
            },
          },
        }),
      ],
      title: "big-config",
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
      ],
    }),
  ],
});
