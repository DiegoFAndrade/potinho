import { useState, useRef, useCallback, useEffect } from 'react';
import type { JarHandle } from '@/components/Jar';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { hapticsService } from '@/services/hapticsService';
import { soundService } from '@/services/soundService';
import { adsService } from '@/services/adsService';
import { analyticsService, Events } from '@/services/analyticsService';
import { toDateKey } from '@/lib/streak';
import type { Task } from '@/types';
import i18n from '@/locales';

const MILESTONES = [5, 10, 25, 50, 100, 250, 500];

export const useDrawTask = (jarId: string) => {
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);
  const jarRef = useRef<JarHandle>(null);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore drawn task from persisted lastDrawId on mount
  useEffect(() => {
    const { lastDrawId, lastDrawAccepted } = useAppStore.getState();
    if (!lastDrawId) return;
    const task = useTaskStore.getState().tasks.find(
      (t) => t.id === lastDrawId && t.status === 'active',
    );
    if (task) {
      setDrawnTask(task);
      setIsAccepted(lastDrawAccepted);
    } else {
      useAppStore.getState().clearLastDraw();
    }
  }, []);

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

    analyticsService.track(Events.DRAW_STARTED);
    setIsDrawing(true);
    hapticsService.light();
    soundService.playShake();

    await jarRef.current?.shake();

    soundService.fadeOut(1500);

    const prevStreakDate = useAppStore.getState().streak.lastDrawDate;
    const today = toDateKey(new Date());
    const isFirstDrawToday = prevStreakDate !== today;

    useAppStore.getState().registerDraw(picked.id);
    hapticsService.success();
    setDrawnTask(picked);
    setIsAccepted(false);
    setIsDrawing(false);

    adsService.maybeShowInterstitial(isFirstDrawToday);
  };

  const accept = () => {
    if (!drawnTask) return;
    analyticsService.track(Events.DRAW_ACCEPTED);
    useAppStore.getState().acceptDraw();
    setIsAccepted(true);
    hapticsService.light();
  };

  const done = () => {
    if (!drawnTask) return;
    useTaskStore.getState().markDone(drawnTask.id);
    useAppStore.getState().clearLastDraw();
    setDrawnTask(null);
    setIsAccepted(false);
    hapticsService.success();

    analyticsService.track(Events.TASK_COMPLETED);

    const totalDone = useTaskStore.getState().tasks.filter((t) => t.status === 'done').length;
    const milestone = MILESTONES.find((m) => m === totalDone);

    if (milestone) {
      analyticsService.track(Events.MILESTONE_REACHED, { milestone });
      showCelebration(i18n.t('home.milestone', { count: milestone }));
    } else {
      showCelebration(i18n.t('home.done'));
    }
  };

  const skip = () => {
    if (!drawnTask) return;
    analyticsService.track(Events.TASK_SKIPPED);
    useTaskStore.getState().skip(drawnTask.id);
    useAppStore.getState().clearLastDraw();
    setDrawnTask(null);
    setIsAccepted(false);
  };

  return { draw, accept, done, skip, drawnTask, isAccepted, isDrawing, jarRef, celebration };
};
