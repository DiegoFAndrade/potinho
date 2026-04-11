class MockMMKV {
  private store = new Map<string, string>();
  set(k: string, v: string) { this.store.set(k, v); }
  getString(k: string): string | undefined { return this.store.get(k); }
  remove(k: string) { return this.store.delete(k); }
  clearAll() { this.store.clear(); }
  getAllKeys() { return Array.from(this.store.keys()); }
}

export const createMMKV = (_config?: { id?: string }) => new MockMMKV();
