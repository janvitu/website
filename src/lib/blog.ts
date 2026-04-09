import { getCollection, type CollectionEntry } from "astro:content";

const WORDS_PER_MINUTE = 185;

let cachedPosts: Promise<CollectionEntry<"blog">[]> | null = null;

export function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
	if (!cachedPosts) {
		cachedPosts = getCollection("blog", ({ data }) => !data.draft).then(
			(posts) => posts.sort((a, b) => +(getPostDate(b) ?? 0) - +(getPostDate(a) ?? 0)),
		);
	}
	return cachedPosts;
}

export function getPostDate(entry: CollectionEntry<"blog">): Date | null {
	return entry.data.date ?? entry.data.publishDate ?? null;
}

export function formatPostDate(date: Date | null | undefined): string | null {
	if (!date) return null;
	return date.toLocaleDateString("cs-CZ", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export function getReadingMinutes(body: string | undefined): number {
	const words = (body ?? "").split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.floor(words / WORDS_PER_MINUTE));
}
