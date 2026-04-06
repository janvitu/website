import { animate, stagger } from "motion";
import { prefersReducedMotion } from "./utils";

// Animation timing constants
const ANIM_OVERLAY_FADE = 0.2;
const ANIM_LABELS_IN = 0.3;
const ANIM_LABELS_OUT = 0.2;
const ANIM_STAGGER_IN = 0.05;
const ANIM_STAGGER_OUT = 0.02;

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector<HTMLElement>("[data-nav-toggle]");
  const overlay = document.querySelector<HTMLElement>("[data-nav-overlay]");

  if (!toggle || !overlay) return;

  const desktopLabels = toggle.querySelectorAll<HTMLElement>(".nav-label");
  const mobileLabels = overlay.querySelectorAll<HTMLElement>(".nav-label-mobile");
  const dots = toggle.querySelectorAll<HTMLElement>(".nav-dot");
  const navLogoWrapper = document.querySelector<HTMLElement>("[data-nav-logo]");

  let isOpen = false;
  let activeAnimation: any = null;

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
    if (isOpen) return;
    isOpen = true;

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
      animate(overlay, { opacity: [0, 1] } as any, { duration: ANIM_OVERLAY_FADE });
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
        animate(
          desktopLabels,
          { opacity: [0, 1], x: [10, 0] } as any,
          { duration: ANIM_LABELS_IN, delay: stagger(ANIM_STAGGER_IN), ease: "easeOut" },
        );
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
        animate(
          mobileLabels,
          { opacity: [0, 1], y: [10, 0] } as any,
          { duration: ANIM_LABELS_IN, delay: stagger(ANIM_STAGGER_IN), ease: "easeOut" },
        );
      }
    }
  };

  const onLeave = () => {
    if (!isOpen) return;
    isOpen = false;

    if (prefersReducedMotion) {
      resetState();
    } else {
      // Animate everything out in parallel for smooth exit
      activeAnimation = animate(overlay, { opacity: [1, 0] } as any, { duration: ANIM_OVERLAY_FADE });

      if (isDesktop()) {
        animate(
          desktopLabels,
          { opacity: [1, 0], x: [0, 10] } as any,
          { duration: ANIM_LABELS_OUT, delay: stagger(ANIM_STAGGER_OUT), ease: "easeIn" },
        );
      } else {
        animate(
          mobileLabels,
          { opacity: [1, 0], y: [0, 10] } as any,
          { duration: ANIM_LABELS_OUT, delay: stagger(ANIM_STAGGER_OUT), ease: "easeIn" },
        );
      }

      activeAnimation.then(() => {
        activeAnimation = null;
        resetState();
      });
    }
  };

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

  const clearHighlight = () => {
    if (highlightedLink) {
      if (highlightedLink.hasAttribute("data-nav-logo-link")) {
        if (navLogoWrapper) navLogoWrapper.style.fill = "";
      } else {
        highlightedLink.classList.remove("link-strikethrough--active");
        const kanji = highlightedLink.parentElement?.querySelector<HTMLElement>(".nav-mobile-kanji");
        if (kanji) kanji.style.opacity = "";
      }
      highlightedLink = null;
    }
  };

  const getNavLinkAtPoint = (x: number, y: number): HTMLAnchorElement | null => {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      // Check for mobile nav links or the logo link
      const link = el.closest(".nav-label-mobile, [data-nav-logo-link]") as HTMLAnchorElement | null;
      if (link) return link;
    }
    return null;
  };

  // Touch gesture handlers (attached/removed dynamically)
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();

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
          const kanji = link.parentElement?.querySelector<HTMLElement>(".nav-mobile-kanji");
          if (kanji) kanji.style.opacity = "1";
        }
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    // Remove listeners immediately (while touch is still active)
    document.removeEventListener("touchmove", handleTouchMove, { passive: false } as any);
    document.removeEventListener("touchend", handleTouchEnd, { passive: false } as any);

    // Also check the release position: covers taps (no touchmove) where the
    // finger lands on a link at the same point it started (e.g. logo tap)
    const touch = e.changedTouches[0];
    const releaseLink = touch ? getNavLinkAtPoint(touch.clientX, touch.clientY) : null;
    const targetLink = highlightedLink ?? releaseLink;

    if (targetLink) {
      const href = targetLink.getAttribute("href");
      clearHighlight();
      onLeave();
      if (href) {
        window.location.href = href;
      }
    } else {
      onLeave();
    }
  };

  toggle.addEventListener("touchstart", (e: TouchEvent) => {
    e.preventDefault();

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
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  }, { passive: false });

  // Tap overlay to close (for click events, e.g. assistive tech)
  overlay.addEventListener("click", onLeave);
});
