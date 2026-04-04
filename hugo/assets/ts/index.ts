import { scrollToTop, prefersReducedMotion } from "./utils";
import { animate } from "motion";
import { initTabs } from "./tabs";

document.addEventListener("DOMContentLoaded", () => {
	const scrollToTopButton = document.getElementById("scrolltotop");
	scrollToTopButton?.addEventListener("click", scrollToTop);

	const scrollIndicator = document.getElementById("scroll-indication");
	if (scrollIndicator && !prefersReducedMotion) {
		const controls = animate(
			"#scroll-indication>span",
			{ y: [2, -2] },
			{
				duration: 0.5,
				delay: 5,
				repeat: Infinity,
				repeatType: "reverse",
				easing: "ease-out",
			},
		);

		// Stop the animation once the indicator scrolls out of view
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) {
					controls.stop();
					observer.disconnect();
				}
			},
			{ threshold: 0 },
		);
		observer.observe(scrollIndicator);
	}

	initTabs();
});
