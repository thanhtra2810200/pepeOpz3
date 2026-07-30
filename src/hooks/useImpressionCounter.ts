import { useEffect, useRef, useState } from 'react';
import { START_COUNT, INCREMENT_INTERVAL_MS } from '@/components/impressions/constants';
import { pickIncrement } from '@/components/impressions/depth';

/**
 * useImpressionCounter — drives the live impression counter.
 *
 * Periodically bumps a target value by a weighted random increment, then
 * eases the displayed value toward it each frame. Returns the current
 * digit array (commas included) for the odometer component.
 *
 * `active` gates the loop so it only runs while the section is visible.
 */
export function useImpressionCounter(active: boolean) {
  const displayRef = useRef(START_COUNT);
  const targetRef = useRef(START_COUNT + 120);
  const lastBumpRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [odoDigits, setOdoDigits] = useState<string[]>(
    START_COUNT.toLocaleString('en-US').split(''),
  );

  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    lastBumpRef.current = last;
    let lastRounded = START_COUNT;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const sinceBump = now - lastBumpRef.current;
      const interval = INCREMENT_INTERVAL_MS * (0.6 + Math.random() * 0.8);
      if (sinceBump > interval) {
        targetRef.current += pickIncrement();
        lastBumpRef.current = now;
      }

      const gap = targetRef.current - displayRef.current;
      const factor = Math.min(1, (1.8 + Math.min(1.4, Math.log10(Math.abs(gap) + 1))) * dt);
      displayRef.current += gap * factor;

      const rounded = Math.floor(displayRef.current);
      if (rounded !== lastRounded) {
        lastRounded = rounded;
        setOdoDigits(rounded.toLocaleString('en-US').split(''));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return odoDigits;
}
