import { useCookieContext } from "../../context/cookieProvider";
import { ButtonFilled, ButtonOutlined } from "../Buttons";

export const DialogButtons = ({ setConsent }: any) => {
	const { state } = useCookieContext();
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
					setConsent(state().ad_storage, state().analytics_storage);
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
