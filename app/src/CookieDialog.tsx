import { createSignal, Match, Switch } from "solid-js";
import { DialogButtons } from "./components/Dialog/DialogButtons";
import { About } from "./components/Dialog/Routes/about";
import { Consent } from "./components/Dialog/Routes/consent";
import { Detail } from "./components/Dialog/Routes/Detail";
import { Slide } from "./components/Dialog/Slide";

import { SlideRouter } from "./components/Dialog/SlideRouter";
import { CookieProvider } from "./context/cookieProvider";

export const CookieDialog = ({ content, consent, setConsent }: any) => {
	const [activeSlide, setActiveSlide] = createSignal("detail");

	return (
		<CookieProvider>
			<div class="flex flex-col">
				<SlideRouter content={content} setActiveSlide={setActiveSlide} />
				<Slide activeSlide={activeSlide} content={content} />
				<DialogButtons consent={consent} setConsent={setConsent} />
			</div>
		</CookieProvider>
	);
};
