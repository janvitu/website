module.exports = {
	content: ["./hugo/**/*.{html,md,svg,tsx,ts}", "./app/**/*.{tsx,ts}"],
	theme: {
		extend: {
			zIndex: {
				"-10": "-10",
				"-1": "-1",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
