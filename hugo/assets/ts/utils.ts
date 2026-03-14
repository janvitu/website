export const scrollToTop = () => {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
};

export const copyContent = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	navigator.clipboard.writeText(target.innerHTML);
};
