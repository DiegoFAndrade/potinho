import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useAppStore } from '@/stores/appStore';

let shakePlayer: AudioPlayer | null = null;

const ensureShake = (): AudioPlayer | null => {
  if (shakePlayer) return shakePlayer;
  try {
    shakePlayer = createAudioPlayer(require('../../assets/sound.wav'));
    return shakePlayer;
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
