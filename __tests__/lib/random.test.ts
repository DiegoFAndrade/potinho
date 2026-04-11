import { createRandom, pickRandom } from '@/lib/random';

describe('random', () => {
  test('createRandom with same seed is deterministic', () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  test('pickRandom returns an item from the array', () => {
    const rng = createRandom(1);
    const items = ['a', 'b', 'c'];
    const picked = pickRandom(items, rng);
    expect(items).toContain(picked);
  });

  test('pickRandom throws on empty array', () => {
    const rng = createRandom(1);
    expect(() => pickRandom([], rng)).toThrow('Cannot pick from empty array');
  });
});
