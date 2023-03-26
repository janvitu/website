import { $, $$ } from "./selector";
import { animate } from "motion";

document.addEventListener("DOMContentLoaded", () => {
	const testimonials = $$(".testimonials__item");
	const testimonialsIndication = $(".testimonials__controls__indication");
	const indicationLine = testimonialsIndication?.querySelectorAll(
		".testimonials__controls__indication-line",
	);
	const indicationItem = testimonialsIndication?.querySelectorAll(
		".testimonials__controls__indication-item",
	);

	let activeTestimonialIndex = 0;
	let activeTestimonial = testimonials[activeTestimonialIndex];

	// @ts-ignore
	let activeIndicationItem = indicationItem[activeTestimonialIndex];
	// @ts-ignore
	let activeIndicationLine = indicationLine[activeTestimonialIndex];

	const buttonPrev = $("[data-button='prev']");
	const buttonNext = $("[data-button='next']");

	buttonPrev?.addEventListener("click", () => {
		if (activeTestimonialIndex <= 0) return;
		if (activeTestimonialIndex === 1)
			buttonPrev?.classList.add("testimonials__button--disabled");

		buttonNext?.classList.remove("testimonials__button--disabled");
		activeTestimonialIndex = activeTestimonialIndex - 1;

		toggleTestimonial(true);
		toggleIndication();
	});

	buttonNext?.addEventListener("click", () => {
		if (activeTestimonialIndex >= testimonials.length - 1) return;
		activeTestimonialIndex += 1;
		buttonPrev?.classList.remove("testimonials__button--disabled");
		if (activeTestimonialIndex === testimonials.length - 1)
			buttonNext?.classList.add("testimonials__button--disabled");

		toggleTestimonial(false);
		toggleIndication();
	});

	const toggleTestimonial = (isPrev: boolean) => {
		const prevTestimonial = activeTestimonial;
		activeTestimonial = testimonials[activeTestimonialIndex];

		const textBg1 = prevTestimonial.querySelectorAll(".text-bg");
		const textBg2 = activeTestimonial.querySelectorAll(".text-bg");

		textBg1.forEach((bg: any) => {
			bg.style.transformOrigin = isPrev ? "right" : "left";
		});
		textBg2.forEach((bg: any) => {
			bg.style.transformOrigin = isPrev ? "left" : "right";
		});

		setTimeout(() => {
			prevTestimonial.style.display = "none";
			activeTestimonial.style.display = "block";
		}, 250);

		animate(textBg1, { scaleX: [0, 1] }, { duration: 0.25 });
		animate(textBg2, { scaleX: [1, 0] }, { delay: 0.25, duration: 0.25 });
	};

	const toggleIndication = () => {
		activeIndicationItem.classList.toggle(
			"testimonials__controls__indication--disabled",
		);

		activeIndicationItem.classList.toggle(
			"testimonials__controls__indication-item--disabled",
		);

		// @ts-ignore
		if (activeIndicationItem !== indicationItem[indicationItem?.length - 1])
			if (activeTestimonialIndex <= testimonials.length - 2) {
				animate(
					activeIndicationLine,
					{ width: "0px", marginLeft: "0px", marginRight: "0px" },
					{ duration: 0.5 },
				);
			}

		// @ts-ignore
		activeIndicationItem = indicationItem[activeTestimonialIndex];

		activeIndicationItem.classList.toggle(
			"testimonials__controls__indication-item--disabled",
		);

		if (activeTestimonialIndex !== testimonials.length - 1) {
			activeIndicationLine.classList.toggle("indication-line--hidden");
			// @ts-ignore
			activeIndicationLine = indicationLine[activeTestimonialIndex];
			activeIndicationLine.classList.toggle("indication-line--hidden");
			animate(
				activeIndicationLine,
				{ width: "128px", marginLeft: "2px", marginRight: "10px" },
				{ duration: 0.5 },
			);
		}

		activeIndicationItem.classList.toggle(
			"testimonials__controls__indication--disabled",
		);
	};
});
