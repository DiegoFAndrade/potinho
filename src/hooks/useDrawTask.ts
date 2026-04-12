import { useState, useRef } from 'react';
import type { JarHandle } from '@/components/Jar';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { hapticsService } from '@/services/hapticsService';
import { soundService } from '@/services/soundService';
import { adsService } from '@/services/adsService';
import { toDateKey } from '@/lib/streak';
import type { Task } from '@/types';

export const useDrawTask = (jarId: string) => {
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const jarRef = useRef<JarHandle>(null);

  const draw = async () => {
    if (isDrawing) return;
    const picked = useTaskStore.getState().draw(jarId);
    if (!picked) return;

    setIsDrawing(true);
    hapticsService.light();
    soundService.playShake();

    await jarRef.current?.shake();

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
    if (drawnTask) useTaskStore.getState().markDone(drawnTask.id);
    setDrawnTask(null);
  };

  const skip = () => {
    if (drawnTask) useTaskStore.getState().skip(drawnTask.id);
    setDrawnTask(null);
  };

  return { draw, done, skip, drawnTask, isDrawing, jarRef };
};
