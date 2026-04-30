import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { buildExportData, validateBackup } from '@/services/backupService';

beforeEach(() => {
  useAppStore.getState().reset();
  useJarStore.getState().reset();
  useTaskStore.getState().reset();
});

describe('buildExportData', () => {
  it('exports current store state with version and timestamp', () => {
    useJarStore.getState().ensureDefault();
    const jar = useJarStore.getState().jars[0];
    useTaskStore.getState().addTask(jar.id, 'Test task');

    const data = buildExportData();

    expect(data.version).toBe(1);
    expect(data.exportedAt).toBeDefined();
    expect(data.jars).toHaveLength(1);
    expect(data.tasks).toHaveLength(1);
    expect(data.app.soundEnabled).toBe(true);
    expect(data.app.hapticsEnabled).toBe(true);
    expect(data.app.theme).toBe('default');
  });

  it('excludes session state from export', () => {
    const data = buildExportData();
    const app = data.app as Record<string, unknown>;

    expect(app.isPremium).toBeUndefined();
    expect(app.lastDrawId).toBeUndefined();
    expect(app.lastDrawAccepted).toBeUndefined();
    expect(app.drawsSinceLastInterstitial).toBeUndefined();
    expect(app.onboardingDone).toBeUndefined();
  });
});

describe('validateBackup', () => {
  it('accepts valid backup', () => {
    const data = buildExportData();
    expect(validateBackup(data)).toBe(true);
  });

  it('rejects missing version', () => {
    expect(validateBackup({ jars: [], tasks: [], app: {} })).toBe(false);
  });

  it('rejects wrong version', () => {
    expect(validateBackup({ version: 99, jars: [], tasks: [], app: {} })).toBe(false);
  });

  it('rejects non-array jars', () => {
    expect(validateBackup({ version: 1, jars: 'nope', tasks: [], app: {} })).toBe(false);
  });

  it('rejects non-array tasks', () => {
    expect(validateBackup({ version: 1, jars: [], tasks: null, app: {} })).toBe(false);
  });
});
