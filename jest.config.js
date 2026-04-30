/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  globals: { __DEV__: true },
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react', esModuleInterop: true, module: 'commonjs', target: 'es2020', moduleResolution: 'node' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.ts',
    '^react-native-get-random-values$': '<rootDir>/__mocks__/empty.ts',
    '^uuid$': '<rootDir>/__mocks__/uuid.ts',
    '^react-native-google-mobile-ads$': '<rootDir>/__mocks__/react-native-google-mobile-ads.ts',
    '^i18next$': '<rootDir>/__mocks__/i18next.ts',
    '^react-i18next$': '<rootDir>/__mocks__/react-i18next.ts',
    '^expo-localization$': '<rootDir>/__mocks__/expo-localization.ts',
    '^expo-file-system$': '<rootDir>/__mocks__/empty.ts',
    '^expo-file-system/legacy$': '<rootDir>/__mocks__/empty.ts',
    '^expo-sharing$': '<rootDir>/__mocks__/empty.ts',
    '^expo-document-picker$': '<rootDir>/__mocks__/empty.ts',
    '^@/locales$': '<rootDir>/__mocks__/i18next.ts',
  },
};
