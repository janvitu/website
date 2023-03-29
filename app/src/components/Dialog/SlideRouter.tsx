import { LangData } from "../../../app";
import { Accessor, Setter } from "solid-js";

type SlideRouter = {
	setActiveSlide: Setter<string>;
	activeSlide: Accessor<string>;
	content: LangData["cookieDialog"];
};

export const SlideRouter = ({
	setActiveSlide,
	activeSlide,
	content,
}: SlideRouter) => {
	return (
		<div class="grid grid-cols-3 gap-4 px-3">
			<button
				class={`p-2 decoration-amber-400 hover:text-neutral-900 ${
					activeSlide() === "consent"
						? "border-b-2 border-neutral-800 font-bold"
						: "hover:underline"
				}`}
				onClick={() => {
					setActiveSlide("consent");
				}}
			>
				{content.consent.key}
			</button>
			<button
				class={`p-2 decoration-amber-400 hover:text-neutral-900 ${
					activeSlide() === "detail"
						? "border-b-2 border-neutral-800 font-bold"
						: "hover:underline"
				}`}
				onClick={() => {
					setActiveSlide("detail");
				}}
			>
				{content.details.key}
			</button>
			<button
				class={`p-2 decoration-amber-400 hover:text-neutral-900 ${
					activeSlide() === "about"
						? "border-b-2 border-neutral-800 font-bold"
						: "hover:underline"
				}`}
				onClick={() => {
					setActiveSlide("about");
				}}
			>
				{content.about.key}
			</button>
		</div>
	);
};
