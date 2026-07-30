import { useEffect, useState } from 'react';

/**
 * Reactive viewport breakpoint check.
 * Returns true while the viewport is at or below `breakpoint` px wide.
 * Used to skip desktop-only visual effects on mobile without duplicating
 * components — the desktop code path stays untouched.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    // Safari < 14 uses addListener/removeListener instead of addEventListener
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, [breakpoint]);

  return isMobile;
}
