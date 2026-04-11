/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EF',
        jar: '#E8D5B7',
        paper: '#FFFBF2',
        ink: '#3B2A1F',
        brand: '#E8896B',
        brandDark: '#C96B4D',
      },
      fontFamily: {
        round: ['System'],
      },
    },
  },
  plugins: [],
};
