import { createSignal } from "solid-js";
import { DialogButtons } from "./components/Dialog/DialogButtons";
import { Slide } from "./components/Dialog/Slide";

import { SlideRouter } from "./components/Dialog/SlideRouter";

export const CookieDialog = ({ content, setConsent }: any) => {
	const [activeSlide, setActiveSlide] = createSignal("detail");

	return (
		<div class="flex h-full max-h-[80vh] grid-rows-[max-content,minmax(0px,_auto),max-content] flex-col">
			<SlideRouter content={content} setActiveSlide={setActiveSlide} />
			<Slide activeSlide={activeSlide} content={content} />
			<DialogButtons setConsent={setConsent} />
		</div>
	);
};
