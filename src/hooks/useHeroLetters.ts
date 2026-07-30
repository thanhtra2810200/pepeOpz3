import { useEffect, useRef } from 'react';

interface LetterState {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  glow: number;
}

interface CachedOffset {
  left: number;
  top: number;
  halfW: number;
  halfH: number;
}

const MAX_DIST = 300;

/**
 * Magnetic-repel effect for the hero title letters.
 *
 * Each letter is pushed away from the cursor and glows based on proximity.
 * The per-letter offset position (relative to the <h1>) is cached once on
 * mount and on resize — the original read `offsetLeft/Top/Width/Height` for
 * every letter every frame, which forced layout. Now only the <h1>'s
 * `getBoundingClientRect()` is read once per frame (it must be, because the
 * parallax transform moves it).
 *
 * Returns an `update(cx, cy)` callback for useHeroParallax's `onFrame`.
 * Returns `true` when all letters have settled (loop may stop).
 */
export function useHeroLetters(
  enabled: boolean,
  h1Ref: React.RefObject<HTMLHeadingElement>,
  letterRefs: React.RefObject<(HTMLSpanElement | null)[]>,
  smoothRef: React.RefObject<{ x: number; y: number }>,
) {
  const stateRef = useRef<LetterState[]>([]);
  const offsetCacheRef = useRef<CachedOffset[]>([]);

  // Initialize / refresh cached offsets. Called on mount and resize.
  useEffect(() => {
    if (!enabled) return;
    const h1 = h1Ref.current;
    const lRefs = letterRefs.current;
    if (!h1 || !lRefs || !lRefs.length) return;

    offsetCacheRef.current = lRefs.map((el) => {
      if (!el) return { left: 0, top: 0, halfW: 0, halfH: 0 };
      return {
        left: el.offsetLeft,
        top: el.offsetTop,
        halfW: el.offsetWidth / 2,
        halfH: el.offsetHeight / 2,
      };
    });

    if (stateRef.current.length !== lRefs.length) {
      stateRef.current = lRefs.map(() => ({ sx: 1, sy: 1, tx: 0, ty: 0, glow: 0 }));
    }
  }, [enabled, h1Ref, letterRefs]);

  // Recache on resize — layout may shift.
  useEffect(() => {
    if (!enabled) return;
    const onResize = () => {
      const h1 = h1Ref.current;
      const lRefs = letterRefs.current;
      if (!h1 || !lRefs || !lRefs.length) return;
      offsetCacheRef.current = lRefs.map((el) => {
        if (!el) return { left: 0, top: 0, halfW: 0, halfH: 0 };
        return {
          left: el.offsetLeft,
          top: el.offsetTop,
          halfW: el.offsetWidth / 2,
          halfH: el.offsetHeight / 2,
        };
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [enabled, h1Ref, letterRefs]);

  const update = (_cx: number, _cy: number): boolean => {
    const h1 = h1Ref.current;
    if (!h1) return true;

    const h1Rect = h1.getBoundingClientRect();
    const lRefs = letterRefs.current;
    const smooth = smoothRef.current;
    if (!lRefs || !smooth) return true;

    const lState = stateRef.current;
    const offsets = offsetCacheRef.current;
    const mx = smooth.x;
    const my = smooth.y;

    let settled = true;

    for (let i = 0; i < lRefs.length; i++) {
      const el = lRefs[i];
      if (!el) continue;
      const off = offsets[i] || { left: 0, top: 0, halfW: 0, halfH: 0 };

      const lx = h1Rect.left + off.left + off.halfW;
      const ly = h1Rect.top + off.top + off.halfH;
      const ddx = mx - lx;
      const ddy = my - ly;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      const force = Math.max(0, 1 - dist / MAX_DIST);
      const pushDir = dist > 0.5 ? ddx / dist : 0;

      const s = lState[i];
      s.sx += ((1 + force * 0.18) - s.sx) * 0.15;
      s.sy += ((1 - force * 0.10) - s.sy) * 0.15;
      s.tx += ((pushDir * force * 5) - s.tx) * 0.15;
      s.ty += ((-force * 7) - s.ty) * 0.15;
      s.glow += (force - s.glow) * 0.15;

      el.style.transform =
        `translate3d(${s.tx.toFixed(2)}px, ${s.ty.toFixed(2)}px, 0) scaleX(${s.sx.toFixed(3)}) scaleY(${s.sy.toFixed(3)})`;

      if (s.glow > 0.01) {
        el.style.filter =
          `drop-shadow(0 0 ${(20 + s.glow * 30).toFixed(0)}px rgba(74,222,128,${(0.45 + s.glow * 0.4).toFixed(2)}))` +
          ` drop-shadow(0 ${(4 + s.glow * 4).toFixed(0)}px ${(8 + s.glow * 8).toFixed(0)}px rgba(0,0,0,0.6))`;
      } else if (el.style.filter) {
        el.style.filter = '';
      }

      if (
        Math.abs(s.sx - 1) > 0.01 ||
        Math.abs(s.sy - 1) > 0.01 ||
        Math.abs(s.tx) > 0.05 ||
        Math.abs(s.ty) > 0.05 ||
        s.glow > 0.01
      ) {
        settled = false;
      }
    }

    return settled;
  };

  return { update };
}
