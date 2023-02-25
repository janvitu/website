document.addEventListener("DOMContentLoaded", () => {
	const scrollToTopButton = document.getElementById("scrolltotop");
	scrollToTopButton.addEventListener("click", () => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
});
