const store = new Map<string, string>();

export class MMKV {
  set(k: string, v: string) { store.set(k, v); }
  getString(k: string) { return store.get(k); }
  delete(k: string) { store.delete(k); }
  clearAll() { store.clear(); }
  getAllKeys() { return Array.from(store.keys()); }
}
