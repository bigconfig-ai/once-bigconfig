# BigConfig Website

Static Astro site for `https://www.bigconfig.ai`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Structure

- `src/pages/` contains first-party site pages.
- `src/content/docs/blog/` contains MDX blog posts.
- `src/components/` contains local Astro components used by pages and posts.
- `src/pages/manual.html` is the manual page replacing the removed docs section.
- `public/` contains static assets.

The site uses Astro, MDX, Tailwind CSS v4, and `astro-d2`.
