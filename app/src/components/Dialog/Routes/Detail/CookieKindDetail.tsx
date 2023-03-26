import { Switch, SwitchProps } from "../../../Switch";

type CookieKindDetailProps = {
	heading: string;
	text: string;
	switchProps: SwitchProps;
};

export const CookieKindDetail = ({
	heading,
	text,
	switchProps,
}: CookieKindDetailProps) => {
	return (
		<div>
			<div class="mt-px flex">
				<div class="flex-1">
					<button class="mb-4 font-semibold">{heading}</button>
				</div>
				<Switch
					isDisabled={switchProps.isDisabled}
					checked={switchProps.checked}
					onClick={switchProps.onClick}
				/>
			</div>
			<p class="text-sm text-neutral-600">{text}</p>
		</div>
	);
};
