export const SlideRouter = ({ setActiveSlide }: any) => {
	return (
		<div class="grid grid-cols-3 gap-4 px-3">
			<button
				class="p-2"
				onClick={() => {
					setActiveSlide("consent");
				}}
			>
				Consent
			</button>
			<button
				class="p-2"
				onClick={() => {
					setActiveSlide("detail");
				}}
			>
				Details
			</button>
			<button
				class="p-2"
				onClick={() => {
					setActiveSlide("about");
				}}
			>
				About
			</button>
		</div>
	);
};
