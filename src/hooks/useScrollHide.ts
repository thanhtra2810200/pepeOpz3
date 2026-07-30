import { useEffect, useRef, useState } from 'react';

/**
 * useScrollHide — hide-on-scroll-down, reveal-on-scroll-up.
 *
 * Returns `visible` (true while the bar should be shown) and a ref to
 * the last scroll position. The bar is always visible near the top of
 * the page (below `topThreshold`).
 */
export function useScrollHide(topThreshold = 80) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      if (Math.abs(y - lastScrollY.current) > 4) {
        setVisible(!goingDown || y < topThreshold);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [topThreshold]);

  return visible;
}
