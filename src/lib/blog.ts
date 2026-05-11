import { getCollection, type CollectionEntry } from "astro:content";

export const SITE_URL = "https://www.bigconfig.ai";
export const POSTS_PER_PAGE = 10;

export const authors = {
  amiorin: {
    name: "amiorin",
    title: "Alberto Miorin",
    picture: "/avatar.png",
    url: "https://albertomiorin.com",
  },
};

export type BlogPost = CollectionEntry<"blog"> & {
  slug: string;
  url: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeAssetPath(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("/")) return path;
  return path.replace(/^public\//, "/");
}

export function normalizeAuthors(value: BlogPost["data"]["authors"]) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return ["amiorin"];
}

export function getPostExcerpt(post: BlogPost) {
  return post.data.excerpt ?? "";
}

export function getPostTags(post: BlogPost) {
  return post.data.tags ?? [];
}

export function getPostCover(post: BlogPost) {
  return {
    alt: post.data.cover?.alt ?? post.data.title,
    image: normalizeAssetPath(post.data.cover?.image),
  };
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getSlugFromId(id: string) {
  const fileName = id.split("/").pop() ?? id;
  return slugify(fileName.replace(/\.mdx?$/, ""));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("blog", ({ data }) => data.draft !== true);
  return entries
    .map((entry) => {
      const slug = getSlugFromId(entry.id);
      return {
        ...entry,
        slug,
        url: `/blog/${slug}/`,
      };
    })
    .sort((a, b) => {
      const byDate = b.data.date.getTime() - a.data.date.getTime();
      return byDate || a.data.title.localeCompare(b.data.title);
    });
}

export function paginate(posts: BlogPost[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    page,
    totalPages,
    posts: posts.slice(start, start + POSTS_PER_PAGE),
  };
}

export function getTags(posts: BlogPost[]) {
  const tags = new Map<string, { slug: string; label: string; count: number }>();

  for (const post of posts) {
    for (const label of getPostTags(post)) {
      const slug = slugify(label);
      const item = tags.get(slug);
      if (item) {
        item.count += 1;
      } else {
        tags.set(slug, { slug, label, count: 1 });
      }
    }
  }

  return Array.from(tags.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function getAuthors(posts: BlogPost[]) {
  const ids = new Set<string>();
  for (const post of posts) {
    for (const id of normalizeAuthors(post.data.authors)) {
      ids.add(id);
    }
  }
  return Array.from(ids).sort();
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
