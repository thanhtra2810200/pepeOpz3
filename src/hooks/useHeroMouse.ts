import { useEffect, useRef } from 'react';

/**
 * Tracks the pointer position and exposes a lerp-smoothed copy.
 *
 * The raw mouse position is captured on `mousemove` and lerped toward the
 * smoothed value inside the shared rAF loop (driven by useHeroParallax).
 * On mobile the hook is inert: no listeners, no rAF, no state changes.
 */
export function useHeroMouse(enabled: boolean) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    smoothRef.current = { x: w / 2, y: h / 2 };
    mouseRef.current = { x: w / 2, y: h / 2 };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  return { mouseRef, smoothRef };
}
