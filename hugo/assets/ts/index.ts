import { scrollToTop } from "./utils";
import { animate, stagger } from "motion";

document.addEventListener("DOMContentLoaded", () => {
	const scrollToTopButton = document.getElementById("scrolltotop");
	scrollToTopButton?.addEventListener("click", scrollToTop);
	const scrollIndicator = document.getElementById("scroll-indication");

	if (scrollIndicator)
		animate(
			"#scroll-indication>span",
			{ y: [2, -2] },
			{
				duration: 0.5,
				delay: 5,
				repeat: Infinity,
				repeatType: "reverse",
				easing: "ease-in-out",
			},
		);
});
