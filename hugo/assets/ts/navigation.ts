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

  // Hide desktop labels by default (JS-only behavior)
  desktopLabels.forEach((label) => {
    label.style.opacity = "0";
    label.style.transform = "translateX(10px)";
    label.style.pointerEvents = "none";
  });

  // Hide mobile labels by default
  mobileLabels.forEach((label) => {
    label.style.opacity = "0";
    label.style.transform = "translateY(10px)";
  });

  let isOpen = false;

  const onEnter = () => {
    if (isOpen) return;
    isOpen = true;

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
      // Mobile: reveal centered labels inside overlay
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
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      desktopLabels.forEach((label) => {
        label.style.opacity = "0";
        label.style.transform = "translateX(10px)";
        label.style.pointerEvents = "none";
      });
      mobileLabels.forEach((label) => {
        label.style.opacity = "0";
        label.style.transform = "translateY(10px)";
      });
    } else {
      animate(overlay, { opacity: [1, 0] } as any, { duration: 0.2 }).then(
        () => {
          overlay.style.pointerEvents = "none";
          desktopLabels.forEach((label) => {
            label.style.opacity = "0";
            label.style.transform = "translateX(10px)";
            label.style.pointerEvents = "none";
          });
          mobileLabels.forEach((label) => {
            label.style.opacity = "0";
            label.style.transform = "translateY(10px)";
          });
        },
      );
    }
  };

  // Desktop: hover
  toggle.addEventListener("mouseenter", onEnter);
  toggle.addEventListener("mouseleave", onLeave);

  // Mobile: touch
  toggle.addEventListener("touchstart", onEnter, { passive: true });
  toggle.addEventListener("touchend", onLeave, { passive: true });
});
