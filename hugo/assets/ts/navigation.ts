import { animate, stagger } from "motion";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector<HTMLElement>("[data-nav-toggle]");
  const overlay = document.querySelector<HTMLElement>("[data-nav-overlay]");

  if (!toggle || !overlay) return;

  const desktopLabels = toggle.querySelectorAll<HTMLElement>(".nav-label");
  const mobileLabels = overlay.querySelectorAll<HTMLElement>(".nav-label-mobile");

  let isOpen = false;
  let activeAnimation: any = null;

  const resetState = () => {
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.zIndex = "";
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
      animate(overlay, { opacity: [0, 1] } as any, { duration: 0.2 });
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
          { duration: 0.3, delay: stagger(0.05), ease: "easeOut" },
        );
        desktopLabels.forEach((label) => {
          label.style.pointerEvents = "auto";
        });
      }
    } else {
      // Mobile: bring overlay above dots so they're behind the glass
      overlay.style.zIndex = "1200";
      if (prefersReducedMotion) {
        mobileLabels.forEach((label) => {
          label.style.opacity = "1";
          label.style.transform = "translateY(0)";
        });
      } else {
        animate(
          mobileLabels,
          { opacity: [0, 1], y: [10, 0] } as any,
          { duration: 0.3, delay: stagger(0.05), ease: "easeOut" },
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
      activeAnimation = animate(overlay, { opacity: [1, 0] } as any, { duration: 0.2 });

      if (isDesktop()) {
        animate(
          desktopLabels,
          { opacity: [1, 0], x: [0, 10] } as any,
          { duration: 0.2, delay: stagger(0.02), ease: "easeIn" },
        );
      } else {
        animate(
          mobileLabels,
          { opacity: [1, 0], y: [0, 10] } as any,
          { duration: 0.2, delay: stagger(0.02), ease: "easeIn" },
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

  // Mobile: press-and-hold pattern
  // touchstart → open nav
  // touchmove → highlight item under finger
  // touchend → navigate to highlighted item, or close if none

  let highlightedLink: HTMLAnchorElement | null = null;

  const clearHighlight = () => {
    if (highlightedLink) {
      highlightedLink.classList.remove("link-strikethrough--active");
      highlightedLink = null;
    }
  };

  const getNavLinkAtPoint = (x: number, y: number): HTMLAnchorElement | null => {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      // Check if it's a mobile nav link or its child span
      const link = el.closest(".nav-label-mobile") as HTMLAnchorElement | null;
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
        link.classList.add("link-strikethrough--active");
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    // Remove listeners immediately (while touch is still active)
    document.removeEventListener("touchmove", handleTouchMove, { passive: false } as any);
    document.removeEventListener("touchend", handleTouchEnd, { passive: false } as any);

    if (highlightedLink) {
      const href = highlightedLink.getAttribute("href");
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
    onEnter();

    // Attach listeners for this gesture
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  }, { passive: false });

  // Tap overlay to close (for click events, e.g. assistive tech)
  overlay.addEventListener("click", onLeave);
});
