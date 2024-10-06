/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

// const Myclass = plugin(function ({ addUtilities }) {
//   addUtilities({
//     ".my-rotate-y-180": {
//       transform: "rotateY(180deg)",
//     },
//     ".preserve-3d": {
//       transformStyle: "preserve-3d",
//     },
//     ".perspective": {
//       perspective: "1000px",
//     },
//     ".backface-hidden": {
//       backfaceVisibility: "hidden",
//     },
//   });
// });

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".my-rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".perspective": {
          perspective: "1000px",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
      });
    }),
  ],
};
