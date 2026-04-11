import { useJarStore } from '@/stores/jarStore';

describe('jarStore', () => {
  beforeEach(() => {
    useJarStore.getState().reset();
  });

  test('starts empty then creates default jar', () => {
    expect(useJarStore.getState().jars).toEqual([]);
    useJarStore.getState().ensureDefault();
    expect(useJarStore.getState().jars).toHaveLength(1);
    expect(useJarStore.getState().jars[0].name).toBe('Meu potinho');
  });

  test('ensureDefault is idempotent', () => {
    useJarStore.getState().ensureDefault();
    useJarStore.getState().ensureDefault();
    expect(useJarStore.getState().jars).toHaveLength(1);
  });

  test('addJar creates a new jar with id', () => {
    useJarStore.getState().ensureDefault();
    useJarStore.getState().addJar({ name: 'Casa', color: '#AABBCC' });
    expect(useJarStore.getState().jars).toHaveLength(2);
    expect(useJarStore.getState().jars[1].name).toBe('Casa');
  });

  test('removeJar removes by id', () => {
    useJarStore.getState().ensureDefault();
    const id = useJarStore.getState().jars[0].id;
    useJarStore.getState().removeJar(id);
    expect(useJarStore.getState().jars).toHaveLength(0);
  });
});
