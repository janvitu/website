import { on } from "events";
import { animate, stagger } from "motion";

function wrapWordsInSpans(element: HTMLElement): HTMLElement[] {
	const spans: HTMLElement[] = [];
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
	let node;
	while ((node = walker.nextNode())) {
		const text = node.textContent || "";
		if (text.trim()) {
			const words = text.split(/\s+/);
			const fragment = document.createDocumentFragment();
			words.forEach((word, index) => {
				if (word) {
					const span = document.createElement("span");
					span.textContent = word;
					span.style.display = "inline-block";
					span.style.opacity = "0";
					span.style.transform = "translateY(10px)";
					spans.push(span);
					fragment.appendChild(span);
					if (index < words.length - 1) {
						fragment.appendChild(document.createTextNode(" "));
					}
				}
			});
			node.parentNode?.replaceChild(fragment, node);
		}
	}
	return spans;
}

document.addEventListener("DOMContentLoaded", () => {
	const glosaryContainers = document.querySelectorAll<HTMLElement>(
		"[data-glosary-toggle]",
	);
	glosaryContainers.forEach((glosary) => {
		const title = glosary.querySelector<HTMLElement>(
			"[data-glosary-title]>span",
		);
		const glossaryContent =
			glosary.querySelector<HTMLElement>("[data-glosary]");

		glossaryContent.style.opacity = "0";
		glossaryContent.style.pointerEvents = "none";

		const onEnter = () => {
			title.style.zIndex = "1000";
			glossaryContent.classList.remove("hidden");
			animate(glossaryContent, { opacity: [0, 1] } as any, { duration: 0.2 });
			animate(wordSpans, { opacity: [0, 1], y: [10, 0] } as any, {
				duration: 0.3,
				delay: stagger(0.05),
				ease: "easeOut",
			});
		};
		const onLeave = () => {
			animate(glossaryContent, { opacity: [1, 0] } as any, {
				duration: 0.2,
			}).then(() => {
				title.style.zIndex = "0";
			});
		};

		const wordSpans = wrapWordsInSpans(glossaryContent);

		title.addEventListener("mouseenter", onEnter);
		title.addEventListener("mouseleave", onLeave);
		title.addEventListener("touchstart", onEnter);
		title.addEventListener("touchend", onLeave);
	});
});
