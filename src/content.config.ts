import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs/blog" }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        date: z.coerce.date(),
        authors: z.union([z.string(), z.array(z.string())]).optional(),
        tags: z.array(z.string()).default([]),
        cover: z.object({
            alt: z.string().optional(),
            image: z.string().optional(),
        }).optional(),
        draft: z.boolean().optional(),
    }).passthrough(),
});

export const collections = {
    blog,
};
