module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },

    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    extend: {
      colors: {
        pink: "rgb(219, 133, 147)",
        claret: "rgb(46, 20, 25)",
        white: "rgb(245, 232, 234)",
        cream: "rgb(234, 205, 201)",
        green: "rgb(173, 243, 188)",
        darkGreen: "rgb(14, 55, 23)",
        darkBlue: "rgb(4, 44, 99)",
        foam: "rgb(141, 182, 252)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
