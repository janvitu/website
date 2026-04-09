export const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

export const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: prefersReducedMotion ? "auto" : "smooth",
	});
};

export const copyContent = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	navigator.clipboard.writeText(target.textContent ?? "");
};
