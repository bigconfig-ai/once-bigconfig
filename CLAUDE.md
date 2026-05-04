# CLAUDE.md — AI Assistant Guide for albertomiorin.com

## Project Overview

This is the documentation and blog website for **BigConfig**, a Clojure-based infrastructure package manager. It is a static site built with **Astro 5** + **Starlight** (documentation framework), hosted at `https://www.bigconfig.ai`.

The repository contains no application logic — it is a **content site**. Work here primarily means writing or editing MDX content files, adjusting Astro configuration, or adding/modifying Astro components.

---

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Site generator | Astro | ^5.6.1 |
| Docs framework | @astrojs/starlight | ^0.35.2 |
| Blog plugin | starlight-blog | ^0.24.1 |
| Diagrams | astro-d2 | ^0.8.0 |
| CSS | Tailwind CSS v4 | ^4.1.13 |
| Tailwind integration | @tailwindcss/vite | ^4.1.13 |
| Package manager | pnpm | v10 (pinned to 10.33.2 via `packageManager`) |
| Language | TypeScript (strict) | via `astro/tsconfigs/strict` |
| Image processing | sharp | ^0.34.2 |

---

## Repository Structure

```
albertomiorin.com/
├── astro.config.mjs          # Main config: integrations, sidebar, analytics
├── tsconfig.json             # Strict TS, path aliases ~ → src/
├── package.json              # Scripts: dev, build, preview
├── pnpm-lock.yaml            # Lockfile — always commit this
├── public/                   # Static assets (copied verbatim to dist/)
│   ├── blog/                 # Blog post cover images (PNG/JPG)
│   ├── d2/                   # D2 diagram SVG outputs
│   ├── pdf/                  # PDF resources
│   ├── avatar.png            # Author avatar (used in blog plugin config)
│   └── favicon.svg
├── src/
│   ├── assets/               # Logo SVGs (light/dark/full)
│   ├── components/           # Reusable Astro components
│   │   ├── YouTube.astro     # Responsive YouTube embed
│   │   └── ExternalLink.astro# External link with icon + rel=noopener
│   ├── content/
│   │   └── docs/             # All site content (MDX)
│   │       ├── index.mdx     # Landing page (template: splash)
│   │       ├── start-here/   # Getting started guides
│   │       ├── api/          # API reference (core, workflow, step, pluggable, render, system, tools, lock)
│   │       ├── packages/     # Package docs (alice, walter, once)
│   │       ├── libraries/    # Library docs (system, terraform, control-plane)
│   │       ├── templates/    # Template docs
│   │       ├── references/   # Reference docs
│   │       └── blog/         # Blog articles (21 published posts)
│   └── styles/
│       └── global.css        # Tailwind + Starlight layer imports
└── attic/                    # Deprecated/archived content — do not publish
```

---

## Development Commands

```bash
pnpm dev        # Start dev server at http://localhost:4321
pnpm build      # Build production site to ./dist/
pnpm preview    # Preview built site locally
pnpm astro      # Direct Astro CLI access
```

Always use `pnpm` — not `npm` or `yarn`.

---

## Content Authoring

### File Format

All content files use **MDX** (`.mdx`). Markdown with JSX component support.

### Frontmatter Schemas

**Documentation pages:**
```yaml
---
title: Page Title
description: Short description for SEO
sidebar:
  order: 3          # Controls position in auto-generated sidebar
---
```

**Blog posts:**
```yaml
---
title: "Post Title"
date: 2026-04-01    # ISO date
excerpt: |-
  Multi-line excerpt shown in blog listing.
authors: amiorin    # Must match key in astro.config.mjs starlightBlog.authors
tags:
  - bigconfig
  - clojure
cover:
  alt: Alt text for cover image
  image: public/blog/blog-image.png   # Relative to repo root
---
```

### Path Aliases

Use `~/` as an alias for `src/` in imports:

```mdx
import YouTube from '~/components/YouTube.astro'
import ExternalLink from '~/components/ExternalLink.astro'
```

### Available Starlight Components

Import from `@astrojs/starlight/components`:

```mdx
import { LinkCard, CardGrid, Card, Tabs, TabItem, Steps, Icon } from '@astrojs/starlight/components'
```

### Custom Components

| Component | Usage |
|---|---|
| `<YouTube id="..." si="..."/>` | Embed responsive YouTube video (16:9) |
| `<ExternalLink href="...">text</ExternalLink>` | External link with icon + security attrs |

---

## Sidebar Configuration

Sidebar sections are **auto-generated** from directories in `astro.config.mjs`. To add a new section, add a directory under `src/content/docs/` and register it:

```js
// astro.config.mjs
sidebar: [
  { label: "Section Name", autogenerate: { directory: "section-dir" } },
]
```

Sidebar ordering within a section is controlled by the `sidebar.order` frontmatter field.

---

## Blog Post Conventions

- Files go in `src/content/docs/blog/`
- Filename becomes the URL slug: `my-post-title.mdx` → `/blog/my-post-title/`
- Cover images go in `public/blog/` — use descriptive names (`blog-my-post.png`)
- Author must be `amiorin` (the only configured author)
- The blog plugin shows 10 posts per page (`postCount: 10`)
- Use `ExternalLink` component for all outbound links in blog posts

---

## Diagrams (D2)

The `astro-d2` integration supports D2 diagram syntax embedded in MDX. D2 diagram SVG outputs are stored in `public/d2/`.

---

## Styling

- Tailwind CSS v4 is used via the Vite plugin (no `tailwind.config.*` file needed)
- Starlight provides base styles; Tailwind extends/overrides them
- Layer order: `base, starlight, theme, components, utilities`
- Custom global styles in `src/styles/global.css`
- Avoid writing raw CSS — prefer Tailwind utility classes in component files

---

## Git Workflow

- **Default branch:** `big-config`
- **Feature branches:** `claude/<description>-<id>` (e.g., `claude/add-claude-documentation-gH82z`)
- Always develop on the designated feature branch
- Push with: `git push -u origin <branch-name>`
- No CI/CD pipelines configured (no `.github/` directory)

### Commit Message Conventions

From recent commit history:
- `docs:` — documentation content changes
- `feat:` — new features or blog posts
- `bump:` — updates to existing docs/pages
- `fix:` — corrections

---

## What NOT to Do

- **Do not edit `attic/`** — this is archived content, not published
- **Do not add a `tailwind.config.*` file** — Tailwind v4 uses the Vite plugin, no config file needed
- **Do not use `npm` or `yarn`** — only `pnpm`
- **Do not commit `dist/`** — it is gitignored and built at deploy time
- **Do not commit `.env*` files** — gitignored by default
- **Do not modify `pnpm-lock.yaml` manually** — always let pnpm manage it
- **Do not add test files** — there is no test infrastructure in this project

---

## Key Configuration Details

- **Site URL:** `https://www.bigconfig.ai`
- **Google Analytics:** `G-4VKP1WY4QJ` (configured in `astro.config.mjs`)
- **Author slug:** `amiorin` (blog posts must use this)
- **Author avatar:** `public/avatar.png`
- **Logo:** Light/dark SVG variants in `src/assets/`
- **GitHub link:** `https://github.com/amiorin/big-config` (shown in Starlight social bar)

---

## TypeScript Path Aliases

```json
{
  "~/*": ["./src/*"],
  "public/*": ["./public/*"]
}
```

Use `~/` prefix in imports to reference anything under `src/`.
