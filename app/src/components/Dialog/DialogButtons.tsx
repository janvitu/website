import { ButtonFilled, ButtonOutlined } from "../Buttons";

export const DialogButtons = ({ setConsent, consent }: any) => {
	return (
		<div class="grid grid-cols-3 gap-4 px-3 pt-5 pb-3">
			<ButtonFilled
				onClick={() => {
					setConsent(true, true);
				}}
			>
				Accept All
			</ButtonFilled>
			<ButtonOutlined
				onClick={() => {
					setConsent(consent().ad_storage, consent().analytics_storage);
				}}
			>
				Confirm
			</ButtonOutlined>
			<ButtonOutlined
				onClick={() => {
					setConsent(false, false);
				}}
			>
				Deny
			</ButtonOutlined>
		</div>
	);
};
