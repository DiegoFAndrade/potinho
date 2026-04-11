import '@testing-library/jest-native/extend-expect';

// Mock MMKV for Jest node env (native module isn't available in tests)
jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string>();
  return {
    MMKV: class {
      set(k: string, v: string) { store.set(k, v); }
      getString(k: string) { return store.get(k); }
      delete(k: string) { store.delete(k); }
      clearAll() { store.clear(); }
      getAllKeys() { return Array.from(store.keys()); }
    },
  };
});
