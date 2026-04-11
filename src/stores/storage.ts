import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({ id: 'potinho' });

export const mmkvStorage: StateStorage = {
  getItem: (name) => {
    const v = storage.getString(name);
    return v ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};
