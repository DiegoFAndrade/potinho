export const useTranslation = () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`;
    return key;
  },
  i18n: { language: 'pt' },
});
export const initReactI18next = { type: '3rdParty', init: () => {} };
