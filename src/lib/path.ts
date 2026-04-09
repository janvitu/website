const normalize = (p: string) => p.replace(/\/$/, "") || "/";

export function isActivePath(current: string, href: string): boolean {
	const c = normalize(current);
	const h = normalize(href);
	return c === h || c.startsWith(h + "/");
}
