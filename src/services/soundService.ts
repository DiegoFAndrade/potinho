import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useAppStore } from '@/stores/appStore';

let shakePlayer: AudioPlayer | null = null;

const ensureShake = (): AudioPlayer | null => {
  if (shakePlayer) return shakePlayer;
  try {
    // TODO: replace with a royalty-free jar/shake sound before first build.
    // Add file at assets/sounds/shake.mp3 (CC0 from freesound.org) and uncomment:
    // shakePlayer = createAudioPlayer(require('../../assets/sounds/shake.mp3'));
    // Until then, sound is a no-op so the app still builds and runs.
    void createAudioPlayer; // silence unused import warning
    return null;
  } catch {
    return null;
  }
};

export const soundService = {
  playShake: () => {
    if (!useAppStore.getState().soundEnabled) return;
    const p = ensureShake();
    if (!p) return;
    try {
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
