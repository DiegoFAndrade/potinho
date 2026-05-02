/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-hi': 'rgb(var(--color-surface-hi) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-dark': 'rgb(var(--color-brand-dark) / <alpha-value>)',
        sage: 'rgb(var(--color-sage) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        jar: 'rgb(var(--color-jar) / <alpha-value>)',
        blush: 'rgb(var(--color-blush) / <alpha-value>)',
        night: 'rgb(var(--color-night) / <alpha-value>)',
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
