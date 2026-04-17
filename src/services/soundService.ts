import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useAppStore } from '@/stores/appStore';

let shakePlayer: AudioPlayer | null = null;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

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
      // Clear any ongoing fade
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
      p.volume = 1;
      p.seekTo(0);
      p.play();
    } catch {
      // swallow — audio is non-critical
    }
  },
  fadeOut: (durationMs: number = 800) => {
    const p = shakePlayer;
    if (!p) return;
    try {
      const steps = 20;
      const stepMs = durationMs / steps;
      let currentStep = 0;
      fadeInterval = setInterval(() => {
        currentStep++;
        const volume = Math.max(0, 1 - currentStep / steps);
        try { p.volume = volume; } catch {}
        if (currentStep >= steps) {
          if (fadeInterval) clearInterval(fadeInterval);
          fadeInterval = null;
          try {
            p.pause();
            p.volume = 1;
          } catch {}
        }
      }, stepMs);
    } catch {
      // swallow
    }
  },
  unload: () => {
    if (fadeInterval) clearInterval(fadeInterval);
    shakePlayer?.remove();
    shakePlayer = null;
  },
};
