export type RNG = () => number;

// Mulberry32 — fast, tiny, deterministic PRNG
export const createRandom = (seed: number): RNG => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const defaultRandom: RNG = () => Math.random();

export const pickRandom = <T>(items: readonly T[], rng: RNG = defaultRandom): T => {
  if (items.length === 0) throw new Error('Cannot pick from empty array');
  const i = Math.floor(rng() * items.length);
  return items[i];
};
