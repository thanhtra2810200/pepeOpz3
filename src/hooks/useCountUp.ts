import { useEffect, useState } from 'react';

/**
 * Eased count-up animation driven by requestAnimationFrame.
 *
 * Animates from 0 to `target` over `dur` ms using a cubic ease-out curve.
 * The animation only runs while `active` is true, making it ideal for
 * reveal-on-scroll scenarios.
 */
export function useCountUp(target: number, active: boolean, dur = 1600) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, dur]);

  return val;
}
