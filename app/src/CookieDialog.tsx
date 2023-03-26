import { createSignal } from "solid-js";
import { DialogButtons } from "./components/Dialog/DialogButtons";
import { Slide } from "./components/Dialog/Slide";

import { SlideRouter } from "./components/Dialog/SlideRouter";
import { CookieProvider } from "./context/cookieProvider";

export const CookieDialog = ({ content, consent, setConsent }: any) => {
	const [activeSlide, setActiveSlide] = createSignal("detail");

	return (
		<CookieProvider>
			<div class="flex h-full max-h-[80vh] grid-rows-[max-content,minmax(0px,_auto),max-content] flex-col">
				<SlideRouter content={content} setActiveSlide={setActiveSlide} />
				<Slide activeSlide={activeSlide} content={content} />
				<DialogButtons consent={consent} setConsent={setConsent} />
			</div>
		</CookieProvider>
	);
};
