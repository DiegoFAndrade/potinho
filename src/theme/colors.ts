export const colors = {
  cream: '#FFF8EF',
  jar: '#E8D5B7',
  paper: '#FFFBF2',
  ink: '#3B2A1F',
  brand: '#E8896B',
  brandDark: '#C96B4D',
  muted: '#8A7868',
};

export type ThemeName = 'default' | 'pastel-blue' | 'pastel-pink' | 'pastel-green' | 'dark';

export const themes: Record<ThemeName, typeof colors> = {
  default: colors,
  'pastel-blue': { ...colors, brand: '#8AB4D8', brandDark: '#5E8CB3' },
  'pastel-pink': { ...colors, brand: '#E8A6B6', brandDark: '#C77A8D' },
  'pastel-green': { ...colors, brand: '#9FC9A3', brandDark: '#6FA075' },
  dark: { ...colors, cream: '#2B231C', paper: '#3B2F26', ink: '#FFF8EF', muted: '#A89680' },
};
