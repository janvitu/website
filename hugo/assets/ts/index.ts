import { scrollToTop } from "./utils";
import { animate, stagger } from "motion";

document.addEventListener("DOMContentLoaded", () => {
	const scrollToTopButton = document.getElementById("scrolltotop");
	scrollToTopButton?.addEventListener("click", scrollToTop);

	animate(
		"#scroll-indication>span",
		{ y: ["2px", "-2px"] },
		{ duration: 0.5, delay: 5, repeat: Infinity, direction: "alternate" },
	);
	// const cookieBanner = document.getElementById("cookie-banner");
	// const acceptButton = cookieBanner.querySelector("[data-consent='accept']");
	// const denyButton = cookieBanner.querySelector("[data-consent='deny']");
	// const optionstButton = cookieBanner.querySelector("[data-consent='options']");

	/* const hideBanner = () => {
		animate(
			cookieBanner,
			{ right: "-100%", left: "100vw" },
			{ duration: 0.25 },
		);
		setTimeout(() => {
			cookieBanner.classList.toggle("hidden");
		}, 250);
	}; */

	/* acceptButton.addEventListener("click", () => {
		setConsent(true, true);
		hideBanner();
	});
	denyButton.addEventListener("click", () => {
		setConsent(false, false);
		hideBanner();
	}); */
});
