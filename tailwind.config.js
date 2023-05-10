const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
          { fontFeatureSettings: '"cv11", "cv03", "cv04"' }, // TODO these don't seem to be supported by the Inter font from Google Fonts
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
