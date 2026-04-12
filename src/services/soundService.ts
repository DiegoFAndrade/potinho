import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useAppStore } from '@/stores/appStore';

let shakePlayer: AudioPlayer | null = null;

const ensureShake = (): AudioPlayer => {
  if (!shakePlayer) {
    // TODO: replace with a royalty-free jar/shake sound before first build.
    // Freesound.org has several under CC0. Save as assets/sounds/shake.mp3.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    shakePlayer = createAudioPlayer(require('../../assets/sounds/shake.mp3'));
  }
  return shakePlayer;
};

export const soundService = {
  playShake: () => {
    if (!useAppStore.getState().soundEnabled) return;
    try {
      const p = ensureShake();
      p.seekTo(0);
      p.play();
    } catch {
      // swallow — audio is non-critical
    }
  },
  unload: () => {
    shakePlayer?.remove();
    shakePlayer = null;
  },
};
