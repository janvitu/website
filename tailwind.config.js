module.exports = {
  content: ["./**/*.{html,md,svg}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#1A1C33",
          dark: "#252525",
        },
        crimson: "#D80032",
        sunset: {
          50: "#ffebee",
          100: "#ffccd2",
          200: "#f99898",
          300: "#f36e6f",
          // primary
          400: "#fe4949",
          500: "#ff322a",
          600: "#f5262b",
          700: "#e31725",
          800: "#d6061e",
          900: "#c60010",
        },
      },
      zIndex: {
        "-10": "-10",
        "-1": "-1",
      },
    },
  },
  plugins: [],
};
