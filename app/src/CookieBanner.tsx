import { ButtonFilled } from "./components/Buttons";
import { ButtonOutlined } from "./components/Buttons";

export const CookieBanner = ({ content, setConsent, openDialog }: any) => {
	return (
		<>
			<p class="space-y-2 pr-4 text-sm text-neutral-800">
				{content.content.text}{" "}
				<button
					onClick={openDialog}
					class="strikethrough-text strikethrough-text--interactive font-medium uppercase"
				>
					{content.content.manageToggle}
				</button>
			</p>
			<div class="mt-4 grid grid-cols-2 gap-3 font-medium sm:mt-0 sm:w-auto ">
				<ButtonFilled onClick={() => setConsent(true, true)}>
					{content.buttonFilled}
				</ButtonFilled>
				<ButtonOutlined onClick={() => setConsent(false, false)}>
					{content.buttonOutlined}
				</ButtonOutlined>
			</div>
		</>
	);
};
