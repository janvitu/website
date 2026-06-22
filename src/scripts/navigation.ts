import { animate, stagger, type AnimationHandle } from "@/lib/motion";
import { prefersReducedMotion } from "./utils";

// Animation timing constants
const ANIM_OVERLAY_FADE = 0.2;
const ANIM_LABELS_IN = 0.3;
const ANIM_LABELS_OUT = 0.2;
const ANIM_STAGGER_IN = 0.05;
const ANIM_STAGGER_OUT = 0.02;

// Desktop: grace period before closing on pointer/focus leave, so brief
// excursions (e.g. crossing the gap to reach the labels, or drifting a pixel
// past the text) don't collapse the nav.
const CLOSE_DELAY_MS = 220;

const desktopMql = window.matchMedia("(min-width: 768px)");
const isDesktop = () => desktopMql.matches;

const toggle = document.querySelector<HTMLElement>("[data-nav-toggle]");
const overlay = document.querySelector<HTMLElement>("[data-nav-overlay]");

if (toggle && overlay) initNav(toggle, overlay);

function initNav(toggle: HTMLElement, overlay: HTMLElement) {

const desktopLabels = toggle.querySelectorAll<HTMLElement>(".nav-label");
const mobileLabels =
	overlay.querySelectorAll<HTMLElement>(".nav-label-mobile");
const navLogoWrapper = document.querySelector<HTMLElement>("[data-nav-logo]");

const menuBtn = document.querySelector<HTMLButtonElement>(
	"[data-nav-menu-btn]",
);

let isOpen = false;
let lockedOpen = false; // true when opened via menu button / sidebar tap
let activeAnimation: AnimationHandle | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const cancelScheduledClose = () => {
	if (closeTimer !== null) {
		clearTimeout(closeTimer);
		closeTimer = null;
	}
};

// Drive the "menu" → X morph (0 = wordmark, 1 = X). CSS transitions the value.
const setMenuMorph = (open: boolean) => {
	if (menuBtn) menuBtn.style.setProperty("--menu-progress", open ? "1" : "0");
};

const resetState = () => {
	overlay.style.pointerEvents = "none";
	overlay.style.opacity = "0";
	desktopLabels.forEach((label) => {
		label.style.opacity = "0";
		label.style.transform = "translateX(10px)";
		label.style.pointerEvents = "none";
	});
	mobileLabels.forEach((label) => {
		label.style.opacity = "0";
		label.style.transform = "translateY(10px)";
	});
};

const onEnter = () => {
	// Cancel a pending close first — otherwise a re-enter while the grace
	// timer is still running would hit the isOpen guard and the nav would
	// close out from under the pointer.
	cancelScheduledClose();
	if (isOpen) return;
	isOpen = true;
	setMenuMorph(true);

	// Cancel any in-flight leave animation
	if (activeAnimation) {
		activeAnimation.cancel();
		activeAnimation = null;
	}

	// Fade in overlay
	overlay.style.pointerEvents = "auto";
	if (prefersReducedMotion) {
		overlay.style.opacity = "1";
	} else {
		animate(overlay, { opacity: [0, 1] }, {
			duration: ANIM_OVERLAY_FADE,
		});
	}

	if (isDesktop()) {
		// Desktop: reveal labels next to dots
		if (prefersReducedMotion) {
			desktopLabels.forEach((label) => {
				label.style.opacity = "1";
				label.style.transform = "translateX(0)";
				label.style.pointerEvents = "auto";
			});
		} else {
			animate(desktopLabels, { opacity: [0, 1], x: [10, 0] }, {
				duration: ANIM_LABELS_IN,
				delay: stagger(ANIM_STAGGER_IN),
				ease: "easeOut",
			});
			desktopLabels.forEach((label) => {
				label.style.pointerEvents = "auto";
			});
		}
	} else {
		// Mobile: dots remain visible behind the glass (nav is z-1098, overlay is z-1099)
		if (prefersReducedMotion) {
			mobileLabels.forEach((label) => {
				label.style.opacity = "1";
				label.style.transform = "translateY(0)";
			});
		} else {
			animate(mobileLabels, { opacity: [0, 1], y: [10, 0] }, {
				duration: ANIM_LABELS_IN,
				delay: stagger(ANIM_STAGGER_IN),
				ease: "easeOut",
			});
		}
	}
};

const closeNav = () => {
	cancelScheduledClose();
	if (!isOpen) return;
	isOpen = false;
	setMenuMorph(false);

	if (prefersReducedMotion) {
		resetState();
		return;
	}

	activeAnimation = animate(overlay, { opacity: [1, 0] }, {
		duration: ANIM_OVERLAY_FADE,
	});

	const labels = isDesktop() ? desktopLabels : mobileLabels;
	const axis = isDesktop() ? { x: [0, 10] } : { y: [0, 10] };
	animate(labels, { opacity: [1, 0], ...axis }, {
		duration: ANIM_LABELS_OUT,
		delay: stagger(ANIM_STAGGER_OUT),
		ease: "easeIn",
	});

	activeAnimation.then(() => {
		activeAnimation = null;
		resetState();
	});
};

const onLeave = () => {
	if (lockedOpen) return; // menu button / sidebar tap keeps it open
	// Defer the close so the nav survives crossing the gap to the labels or
	// drifting just past the text; re-entering cancels this (see onEnter).
	cancelScheduledClose();
	closeTimer = setTimeout(() => {
		closeTimer = null;
		closeNav();
	}, CLOSE_DELAY_MS);
};

const forceClose = () => {
	lockedOpen = false;
	if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
	closeNav();
};

// Mobile: menu button tap toggles nav open/closed (stays open)
if (menuBtn) {
	menuBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		if (lockedOpen) {
			forceClose();
		} else {
			lockedOpen = true;
			menuBtn.setAttribute("aria-expanded", "true");
			onEnter();
		}
	});

	// Prevent touchstart on menu button from triggering press-and-hold
	menuBtn.addEventListener(
		"touchstart",
		(e) => {
			e.stopPropagation();
		},
		{ passive: true },
	);
}

// Desktop: hover
toggle.addEventListener("mouseenter", onEnter);
toggle.addEventListener("mouseleave", onLeave);

// Keyboard: focus within nav area
toggle.addEventListener("focusin", onEnter);
toggle.addEventListener("focusout", onLeave);

// Mobile: press-and-hold pattern
// touchstart → open nav (or navigate home if on logo)
// touchmove → highlight item under finger
// touchend → navigate to highlighted item, or close if none

let highlightedLink: HTMLAnchorElement | null = null;
let didMove = false; // whether the finger moved during the current gesture

const clearHighlight = () => {
	if (highlightedLink) {
		if (highlightedLink.hasAttribute("data-nav-logo-link")) {
			if (navLogoWrapper) navLogoWrapper.style.fill = "";
		} else {
			highlightedLink.classList.remove("link-strikethrough--active");
			const kanji =
				highlightedLink.parentElement?.querySelector<HTMLElement>(
					".nav-mobile-kanji",
				);
			if (kanji) kanji.style.opacity = "";
		}
		highlightedLink = null;
	}
};

const getNavLinkAtPoint = (
	x: number,
	y: number,
): HTMLAnchorElement | null => {
	const elements = document.elementsFromPoint(x, y);
	for (const el of elements) {
		// Check for mobile nav links or the logo link
		const link = el.closest(
			".nav-label-mobile, [data-nav-logo-link]",
		) as HTMLAnchorElement | null;
		if (link) return link;
	}
	return null;
};

// Touch gesture handlers (attached/removed dynamically)
const handleTouchMove = (e: TouchEvent) => {
	e.preventDefault();
	didMove = true;

	const touch = e.touches[0];
	const link = getNavLinkAtPoint(touch.clientX, touch.clientY);

	if (link !== highlightedLink) {
		clearHighlight();
		if (link) {
			highlightedLink = link;
			if (link.hasAttribute("data-nav-logo-link")) {
				if (navLogoWrapper) navLogoWrapper.style.fill = "var(--color-accent)";
			} else {
				link.classList.add("link-strikethrough--active");
				const kanji =
					link.parentElement?.querySelector<HTMLElement>(".nav-mobile-kanji");
				if (kanji) kanji.style.opacity = "1";
			}
		}
	}
};

const handleTouchEnd = (e: TouchEvent) => {
	e.preventDefault();

	// Remove listeners immediately (while touch is still active)
	document.removeEventListener("touchmove", handleTouchMove);
	document.removeEventListener("touchend", handleTouchEnd);

	// Also check the release position: covers taps (no touchmove) where the
	// finger lands on a link at the same point it started (e.g. logo tap)
	const touch = e.changedTouches[0];
	const releaseLink = touch
		? getNavLinkAtPoint(touch.clientX, touch.clientY)
		: null;
	const targetLink = highlightedLink ?? releaseLink;

	if (targetLink) {
		const href = targetLink.getAttribute("href");
		clearHighlight();
		forceClose();
		if (href) {
			window.location.href = href;
		}
		return;
	}

	// Released on empty space (no link under the finger).
	if (!didMove) {
		// A stationary tap on the sidebar toggles the nav open and keeps it
		// open — same affordance as the menu button.
		if (lockedOpen) {
			forceClose();
		} else {
			lockedOpen = true;
			if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
			// Nav was already opened on touchstart; just keep it locked open.
		}
	} else if (!lockedOpen) {
		// Dragged around and let go off any link — collapse it.
		closeNav();
	}
};

toggle.addEventListener(
	"touchstart",
	(e: TouchEvent) => {
		e.preventDefault();
		didMove = false;

		// If the touch starts directly on the logo, navigate home immediately
		// without opening the nav overlay
		const touch = e.touches[0];
		const startLink = getNavLinkAtPoint(touch.clientX, touch.clientY);
		if (startLink?.hasAttribute("data-nav-logo-link")) {
			window.location.href = startLink.getAttribute("href") ?? "/";
			return;
		}

		onEnter();

		// Attach listeners for this gesture
		document.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});
		document.addEventListener("touchend", handleTouchEnd, { passive: false });
	},
	{ passive: false },
);

// Close menu when clicking a mobile nav link (when locked open)
mobileLabels.forEach((label) => {
	label.addEventListener("click", () => {
		if (lockedOpen) forceClose();
	});
});

// Tap overlay to close (for click events, e.g. assistive tech)
overlay.addEventListener("click", forceClose);

}
