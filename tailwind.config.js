/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        clashDisplay: ["Clash Display", "sans-serif"],
      },
      colors: {
        "primary-blue": "#004DB3",
      },
    },
  },
  plugins: [],
};
