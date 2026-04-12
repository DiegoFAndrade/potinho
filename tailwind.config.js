/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Riso zine warm palette
        paper: '#F8EFD9',         // warm cream (dominant bg)
        paperHi: '#FFFBEF',       // highlight paper for cards
        ink: '#231208',           // espresso text
        inkSoft: '#4A2E1E',       // softer text
        tomato: '#E8503D',        // brand punchy red
        tomatoDark: '#B8321E',
        mustard: '#D9A520',       // warm accent
        sage: '#89A47C',          // dusty sage for streak
        blush: '#FFD5C8',         // soft pink
        night: '#1A0E07',         // deepest ink for dramatic shadows
        // legacy tokens (keep for compatibility with untouched files)
        cream: '#F8EFD9',
        jar: '#E8D5B7',
        brand: '#E8503D',
        brandDark: '#B8321E',
        muted: '#8A7868',
      },
      fontFamily: {
        display: ['Caprasimo_400Regular'],
        body: ['Fraunces_400Regular'],
        bodyMedium: ['Fraunces_500Medium'],
        bodySemi: ['Fraunces_600SemiBold'],
        bodyBold: ['Fraunces_700Bold'],
        bodyBlack: ['Fraunces_900Black'],
      },
    },
  },
  plugins: [],
};
