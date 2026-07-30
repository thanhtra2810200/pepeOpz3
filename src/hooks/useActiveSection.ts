import { useEffect, useState } from 'react';

/**
 * useActiveSection — tracks which section occupies the viewport center.
 *
 * Uses document.elementFromPoint() at the viewport center to determine
 * which section the user is actually looking at. This naturally handles
 * occlusion from scroll-pinned transition containers (HeroRevealTransition,
 * HowToBuyCommunityTransition) where multiple sections share the same
 * screen position but only one is visually on top — something
 * IntersectionObserver's intersectionRatio cannot distinguish.
 *
 * A MutationObserver re-scans for section elements as lazy-loaded
 * sections mount after first paint.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let raf = 0;
    let current = -1;
    const sections: (HTMLElement | null)[] = sectionIds.map(() => null);

    const refreshSections = () => {
      for (let i = 0; i < sectionIds.length; i++) {
        sections[i] = document.getElementById(sectionIds[i]);
      }
    };

    const compute = () => {
      raf = 0;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const el = document.elementFromPoint(cx, cy);
      if (!el) return;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section && (section === el || section.contains(el))) {
          if (current !== i) {
            current = i;
            setActiveIndex(i);
          }
          return;
        }
      }

      if (current !== -1) {
        current = -1;
        setActiveIndex(-1);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    refreshSections();

    const mo = new MutationObserver(() => {
      refreshSections();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sectionIds]);

  return activeIndex;
}
