import { useEffect, useState } from 'react';

/**
 * useNavPill — computes the active-item pill geometry (left/width)
 * relative to the nav container.
 *
 * Returns `null` when no item is active, otherwise `{ left, width }`
 * matching the active item's position within the nav bar.
 */
export function useNavPill(
  activeIndex: number,
  navRef: React.RefObject<HTMLElement>,
  itemRefs: React.RefObject<(HTMLElement | null)[]>,
) {
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (activeIndex < 0) {
      setPillStyle(null);
      return;
    }
    const items = itemRefs.current;
    const nav = navRef.current;
    if (!items || !nav) return;
    const el = items[activeIndex];
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
    });
  }, [activeIndex, navRef, itemRefs]);

  return pillStyle;
}
