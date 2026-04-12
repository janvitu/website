import { animate, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "./utils";

function wrapWordsInSpans(element: HTMLElement): HTMLElement[] {
	const spans: HTMLElement[] = [];
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
	let node: Node | null;
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

const glossaryContainers = document.querySelectorAll<HTMLElement>(
	"[data-glossary-toggle]",
);
glossaryContainers.forEach((glossary) => {
	const title = glossary.querySelector<HTMLElement>(
		"[data-glossary-title]>span",
	);
	const glossaryContent =
		glossary.querySelector<HTMLElement>("[data-glossary]");

	if (!glossaryContent || !title) return;

	glossaryContent.style.opacity = "0";
	glossaryContent.style.pointerEvents = "none";

	title.setAttribute("role", "button");
	title.setAttribute("tabindex", "0");
	title.setAttribute("aria-expanded", "false");

	let wordSpans: HTMLElement[] = [];
	let hasWrapped = false;

	const onEnter = () => {
		if (!hasWrapped) {
			wordSpans = wrapWordsInSpans(glossaryContent);
			hasWrapped = true;
		}

		title.style.zIndex = "1000";
		title.setAttribute("aria-expanded", "true");
		glossaryContent.classList.remove("hidden");
		if (prefersReducedMotion) {
			glossaryContent.style.opacity = "1";
			wordSpans.forEach((s) => {
				s.style.opacity = "1";
				s.style.transform = "translateY(0)";
			});
		} else {
			animate(glossaryContent, { opacity: [0, 1] }, {
				duration: 0.2,
			});
			animate(wordSpans, { opacity: [0, 1], y: [10, 0] }, {
				duration: 0.3,
				delay: stagger(0.05),
				ease: "easeOut",
			});
		}
	};
	const onLeave = () => {
		title.setAttribute("aria-expanded", "false");
		// Reset word spans opacity for next open
		wordSpans.forEach((s) => {
			s.style.opacity = "0";
		});
		if (prefersReducedMotion) {
			glossaryContent.style.opacity = "0";
			title.style.zIndex = "0";
		} else {
			animate(glossaryContent, { opacity: [1, 0] }, {
				duration: 0.2,
			}).then(() => {
				title.style.zIndex = "0";
			});
		}
	};

	let isTouching = false;

	title.addEventListener("mouseenter", () => {
		if (!isTouching) onEnter();
	});
	title.addEventListener("mouseleave", () => {
		if (!isTouching) onLeave();
	});

	title.addEventListener(
		"touchstart",
		() => {
			isTouching = true;
			onEnter();
		},
		{ passive: true },
	);
	const onTouchEnd = () => {
		onLeave();
		setTimeout(() => {
			isTouching = false;
		}, 300);
	};
	title.addEventListener("touchend", onTouchEnd, { passive: true });
	title.addEventListener("touchcancel", onTouchEnd, { passive: true });

	title.addEventListener("keydown", (e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			const expanded = title.getAttribute("aria-expanded") === "true";
			expanded ? onLeave() : onEnter();
		} else if (
			e.key === "Escape" &&
			title.getAttribute("aria-expanded") === "true"
		) {
			onLeave();
		}
	});
});
