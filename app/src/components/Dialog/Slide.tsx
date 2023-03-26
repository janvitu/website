import { LangData } from "app/app";
import { Accessor, Match, Switch } from "solid-js";
import { About } from "./Routes/about";
import { Consent } from "./Routes/consent";
import { Detail } from "./Routes/Detail";

type SlideProps = {
	activeSlide: Accessor<string>;
	content: LangData["cookieDialog"];
};

export const Slide = ({ activeSlide, content }: SlideProps) => {
	return (
		<div class="h-auto max-w-xl overflow-auto pt-5">
			<Switch>
				<Match when={activeSlide() === "about"}>
					<About content={content.about} />
				</Match>
				<Match when={activeSlide() === "detail"}>
					<Detail content={content.details} />
				</Match>
				<Match when={activeSlide() === "about"}>
					<Consent content={content.consent} />
				</Match>
			</Switch>
		</div>
	);
};
