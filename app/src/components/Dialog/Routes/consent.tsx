export const Consent = ({ content }: any) => {
	console.log(content);
	return (
		<div>
			<h2 class="mb-3 text-base font-bold">{content.heading}</h2>
			<p class="mb-2 text-sm leading-relaxed">{content.text}</p>
		</div>
	);
};
