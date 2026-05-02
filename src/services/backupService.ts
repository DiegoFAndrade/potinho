import { Alert } from 'react-native';
import i18n from '@/locales';
import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';

export interface BackupData {
  version: number;
  exportedAt: string;
  app: {
    streak: { count: number; lastDrawDate: string };
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    theme: string;
  };
  jars: unknown[];
  tasks: unknown[];
}

export function buildExportData(): BackupData {
  const appState = useAppStore.getState();
  const jars = useJarStore.getState().jars;
  const tasks = useTaskStore.getState().tasks;

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: {
      streak: appState.streak,
      soundEnabled: appState.soundEnabled,
      hapticsEnabled: appState.hapticsEnabled,
      theme: appState.theme,
    },
    jars,
    tasks,
  };
}

export function validateBackup(data: unknown): data is BackupData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (!Array.isArray(d.jars)) return false;
  if (!Array.isArray(d.tasks)) return false;
  return true;
}

export async function exportData(): Promise<void> {
  // Lazy-load native-backed modules so the screen importing this file can still
  // render in dev clients that don't have these modules linked.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const FileSystem = require('expo-file-system/legacy');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sharing = require('expo-sharing');

  const data = buildExportData();
  const json = JSON.stringify(data, null, 2);
  const path = `${FileSystem.cacheDirectory}potinho-backup.json`;

  await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Potinho Backup' });
}

export async function importData(): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const FileSystem = require('expo-file-system/legacy');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DocumentPicker = require('expo-document-picker');

  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

  if (result.canceled || !result.assets?.[0]) return false;

  const uri = result.assets[0].uri;
  const content = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    Alert.alert(i18n.t('backup.importError'), i18n.t('backup.importInvalidFile'));
    return false;
  }

  if (!validateBackup(parsed)) {
    Alert.alert(i18n.t('backup.importError'), i18n.t('backup.importInvalidFile'));
    return false;
  }

  return new Promise((resolve) => {
    Alert.alert(
      i18n.t('backup.importTitle'),
      i18n.t('backup.importConfirm'),
      [
        { text: i18n.t('backup.importCancel'), style: 'cancel', onPress: () => resolve(false) },
        {
          text: i18n.t('backup.importConfirmButton'),
          style: 'destructive',
          onPress: () => {
            const appState = useAppStore.getState();
            appState.setTheme(parsed.app.theme);
            if (parsed.app.soundEnabled !== appState.soundEnabled) appState.toggleSound();
            if (parsed.app.hapticsEnabled !== appState.hapticsEnabled) appState.toggleHaptics();

            useJarStore.setState({ jars: parsed.jars as never[] });
            useTaskStore.setState({ tasks: parsed.tasks as never[] });

            resolve(true);
          },
        },
      ],
    );
  });
}
