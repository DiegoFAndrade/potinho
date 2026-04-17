import { useState, useRef, useCallback } from 'react';
import type { JarHandle } from '@/components/Jar';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { hapticsService } from '@/services/hapticsService';
import { soundService } from '@/services/soundService';
import { adsService } from '@/services/adsService';
import { toDateKey } from '@/lib/streak';
import type { Task } from '@/types';

const MILESTONES = [5, 10, 25, 50, 100, 250, 500];

export const useDrawTask = (jarId: string) => {
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);
  const jarRef = useRef<JarHandle>(null);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCelebration = useCallback((message: string) => {
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    setCelebration(message);
    celebrationTimer.current = setTimeout(() => {
      setCelebration(null);
      celebrationTimer.current = null;
    }, 2500);
  }, []);

  const draw = async () => {
    if (isDrawing) return;
    const picked = useTaskStore.getState().draw(jarId);
    if (!picked) return;

    setIsDrawing(true);
    hapticsService.light();
    soundService.playShake();

    await jarRef.current?.shake();

    // Fade out the sound smoothly over 1.5s
    soundService.fadeOut(1500);

    const prevStreakDate = useAppStore.getState().streak.lastDrawDate;
    const today = toDateKey(new Date());
    const isFirstDrawToday = prevStreakDate !== today;

    useAppStore.getState().registerDraw(picked.id);
    hapticsService.success();
    setDrawnTask(picked);
    setIsDrawing(false);

    // Show interstitial *after* the task card is visible
    adsService.maybeShowInterstitial(isFirstDrawToday);
  };

  const done = () => {
    if (!drawnTask) return;
    useTaskStore.getState().markDone(drawnTask.id);
    setDrawnTask(null);
    hapticsService.success();

    // Check for milestones
    const totalDone = useTaskStore.getState().tasks.filter((t) => t.status === 'done').length;
    const milestone = MILESTONES.find((m) => m === totalDone);

    if (milestone) {
      showCelebration(`${milestone} tarefas concluídas! 🏆`);
    } else {
      showCelebration('Feito! 🎉');
    }
  };

  const skip = () => {
    if (drawnTask) useTaskStore.getState().skip(drawnTask.id);
    setDrawnTask(null);
  };

  return { draw, done, skip, drawnTask, isDrawing, jarRef, celebration };
};
