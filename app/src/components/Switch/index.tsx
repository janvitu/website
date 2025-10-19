import { Accessor, createSignal } from "solid-js";

export type SwitchProps = {
	checked: Accessor<boolean> | boolean;
	onClick?: () => void;
	isDisabled?: boolean;
};

export const Switch = ({
	checked,
	onClick,
	isDisabled = false,
}: SwitchProps) => {
	const [isChecked, setIsChecked] = createSignal(
		typeof checked === "boolean" ? checked : checked(),
	);

	const handleToggle = () => {
		if (!isDisabled) {
			setIsChecked(!isChecked());
			if (onClick) onClick();
		}
	};

	return (
		<>
			<div
				class={`relative flex h-8 w-[52px] shrink-0 ${
					isDisabled ? "opacity-30" : ""
				}`}
			>
				<form class="m-0 h-full w-full border-0 p-0">
					<span
						class={`absolute inset-0 h-full w-full rounded-full transition-colors before:absolute before:top-1 before:left-1 before:h-6 before:w-6 before:rounded-full before:bg-neutral-800 before:shadow-xs before:transition-all after:absolute after:-inset-px after:rounded-full after:border after:border-neutral-700 ${
							isChecked() ? "bg-amber-300 before:translate-x-5" : "bg-white"
						}`}
					></span>
					<input
						onClick={handleToggle}
						type="checkbox"
						tabIndex="0"
						class="box-border h-full w-full cursor-pointer opacity-0"
						checked={isChecked()}
					></input>
				</form>
			</div>
		</>
	);
};
