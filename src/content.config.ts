import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const pages = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
	schema: z.object({
		title: z.string().optional(),
		disableIndex: z.boolean().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().optional(),
		publishDate: z.coerce.date().optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { pages, blog };
