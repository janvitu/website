export const initTabs = (): void => {
	const tabButtons =
		document.querySelectorAll<HTMLButtonElement>("[role='tab']");
	const tabPanels =
		document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

	if (tabButtons.length === 0) return;

	const activateTab = (targetId: string): void => {
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
			panel.hidden = panel.getAttribute("data-tab-id") !== targetId;
		});
	};

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const targetId = button.getAttribute("data-tab");
			if (!targetId) return;
			activateTab(targetId);
		});
	});
};
