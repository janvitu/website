import { JSX } from "solid-js";

type ButtonProps = {
	onClick: () => void;
	children: JSX.Element[] | JSX.Element;
};

export const ButtonFilled = ({ onClick, children }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			class="border border-neutral-900 bg-neutral-700 px-6 py-3 text-neutral-50 transition-colors hover:bg-neutral-900 hover:text-neutral-50"
		>
			{children}
		</button>
	);
};
