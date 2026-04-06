import { defineCollection, z } from "astro:content";

const pages = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string().optional(),
		disableIndex: z.boolean().optional(),
	}),
});

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().optional(),
		publishDate: z.coerce.date().optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
	}),
});

const work = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string().optional(),
		date: z.coerce.date().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { pages, blog, work };
