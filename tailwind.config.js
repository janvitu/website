module.exports = {
  content: [
    "./hugo/**/*.{html,md,svg,tsx,ts}",
    "./src/**/*.{astro,html,md,mdx,ts,tsx}",
  ],
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
