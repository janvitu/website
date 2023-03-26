import { For } from "solid-js";

export const About = ({ content }: any) => {
	return (
		<ul class="text-sm">
			<For each={content.list}>
				{(listItem) => (
					<li class="relative mb-5 pl-6 before:absolute before:left-0 before:top-[6px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-amber-500">
						{listItem}
					</li>
				)}
			</For>
		</ul>
	);
};
