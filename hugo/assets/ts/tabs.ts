export const initTabs = (): void => {
	const tabButtons =
		document.querySelectorAll<HTMLButtonElement>("[role='tab']");
	const tabPanels =
		document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

	if (tabButtons.length === 0) return;

	const validIds = new Set(
		Array.from(tabButtons, (btn) => btn.getAttribute("data-tab")),
	);

	const activateTab = (targetId: string, updateHash = true): void => {
		tabButtons.forEach((btn) => {
			const isTarget = btn.getAttribute("data-tab") === targetId;
			btn.setAttribute("aria-selected", isTarget ? "true" : "false");
			btn.style.color = isTarget
				? "var(--color-text)"
				: "var(--color-text-muted)";
			btn.style.borderBottomColor = isTarget
				? "var(--color-accent)"
				: "transparent";
		});

		tabPanels.forEach((panel) => {
			if (panel.getAttribute("data-tab-id") === targetId) {
				panel.hidden = false;
				panel.classList.add("tab-entering");
				requestAnimationFrame(() => {
					panel.classList.remove("tab-entering");
				});
			} else {
				panel.hidden = true;
				panel.classList.remove("tab-entering");
			}
		});

		if (updateHash) {
			history.replaceState(null, "", `#${targetId}`);
		}
	};

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const targetId = button.getAttribute("data-tab");
			if (!targetId) return;
			activateTab(targetId);
		});
	});

	// Activate tab from URL hash on load
	const hash = window.location.hash.slice(1);
	if (hash && validIds.has(hash)) {
		activateTab(hash, false);
	}

	// Listen for hash changes (back/forward navigation)
	window.addEventListener("hashchange", () => {
		const newHash = window.location.hash.slice(1);
		if (newHash && validIds.has(newHash)) {
			activateTab(newHash, false);
		}
	});
};
