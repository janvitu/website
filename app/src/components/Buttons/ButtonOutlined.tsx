import { JSX } from "solid-js";

type ButtonProps = {
	onClick: () => void;
	children: JSX.Element[] | JSX.Element;
};

export const ButtonOutlined = ({ onClick, children }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			class="border border-neutral-500 bg-neutral-50 px-6 py-3 transition-colors hover:bg-neutral-900 hover:text-neutral-50"
		>
			{children}
		</button>
	);
};
