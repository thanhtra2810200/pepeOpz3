import { useEffect, useRef } from 'react';

interface ParallaxRefs {
  section: React.RefObject<HTMLDivElement>;
  gridPattern: React.RefObject<SVGPatternElement>;
  reveal: React.RefObject<HTMLDivElement>;
  sky: React.RefObject<HTMLDivElement>;
  city: React.RefObject<HTMLDivElement>;
  fog: React.RefObject<HTMLDivElement>;
  water: React.RefObject<HTMLDivElement>;
  revealWrap: React.RefObject<HTMLDivElement>;
  particles: React.RefObject<HTMLDivElement>;
  glow: React.RefObject<HTMLDivElement>;
  overlay: React.RefObject<HTMLDivElement>;
  bottomFade: React.RefObject<HTMLDivElement>;
  pepe: React.RefObject<HTMLDivElement>;
  content: React.RefObject<HTMLDivElement>;
}

const DEPTH = {
  sky: 8,
  city: 16,
  fog: -10,
  water: 22,
  pepe: 34,
  content: 6,
};

const ZERO_DEPTH_LAYERS: (keyof ParallaxRefs)[] = [
  'revealWrap',
  'particles',
  'glow',
  'overlay',
  'bottomFade',
];

/**
 * Drives the hero parallax rAF loop.
 *
 * Performance notes (no visual change):
 * - The section rect is cached once per frame instead of per-layer.
 * - The loop self-terminates when the smoothed mouse has settled AND no
 *   downstream consumer (letters) reports motion, then restarts on the
 *   next mousemove.
 * - Layers with depth 0 are skipped entirely — they never receive a
 *   transform, matching the original `applyMouse(el, 0, …)` no-op.
 * - The grid pattern offset and reveal spotlight are only written when
 *   their values actually change by more than a sub-pixel epsilon.
 *
 * `onFrame` is invoked each frame with the normalized cursor offset
 * (-0.5..0.5) so consumers like useHeroLetters can react to the same
 * smoothed position. It returns `true` while it still has motion to settle,
 * keeping the rAF loop alive.
 */
export function useHeroParallax(
  enabled: boolean,
  refs: ParallaxRefs,
  mouseRef: React.RefObject<{ x: number; y: number }>,
  smoothRef: React.RefObject<{ x: number; y: number }>,
  onFrame?: (cx: number, cy: number) => boolean,
) {
  const rafRef = useRef(0);
  const tickingRef = useRef(false);
  const gridOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const applyMouse = (
      el: HTMLElement | null,
      depth: number,
      cx: number,
      cy: number,
    ) => {
      if (!el || depth === 0) return;
      const mx = cx * depth;
      const my = cy * depth;
      el.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
    };

    const loop = () => {
      const section = refs.section.current;
      if (!section) {
        tickingRef.current = false;
        return;
      }

      const smooth = smoothRef.current;
      const mouse = mouseRef.current;
      if (!smooth || !mouse) {
        tickingRef.current = false;
        return;
      }
      smooth.x += (mouse.x - smooth.x) * 0.08;
      smooth.y += (mouse.y - smooth.y) * 0.08;

      const sRect = section.getBoundingClientRect();
      const cx = (smooth.x - sRect.left) / sRect.width - 0.5;
      const cy = (smooth.y - sRect.top) / sRect.height - 0.5;

      // Grid pattern offset — only write when it actually moves.
      const gx = cx * 16;
      const gy = cy * 16;
      gridOffsetRef.current.x += (gx - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (gy - gridOffsetRef.current.y) * 0.06;
      const gp = refs.gridPattern.current;
      if (gp) {
        const nx = gridOffsetRef.current.x.toFixed(2);
        const ny = gridOffsetRef.current.y.toFixed(2);
        if (gp.getAttribute('x') !== nx) gp.setAttribute('x', nx);
        if (gp.getAttribute('y') !== ny) gp.setAttribute('y', ny);
      }

      // Reveal spotlight — only write when it actually moves.
      const r = refs.reveal.current;
      if (r) {
        const sx = `${smooth.x}px`;
        const sy = `${smooth.y}px`;
        if (r.style.getPropertyValue('--spot-x') !== sx) r.style.setProperty('--spot-x', sx);
        if (r.style.getPropertyValue('--spot-y') !== sy) r.style.setProperty('--spot-y', sy);
      }

      applyMouse(refs.sky.current, DEPTH.sky, cx, cy);
      applyMouse(refs.city.current, DEPTH.city, cx, cy);
      applyMouse(refs.fog.current, DEPTH.fog, cx, cy);
      applyMouse(refs.water.current, DEPTH.water, cx, cy);
      for (const key of ZERO_DEPTH_LAYERS) {
        applyMouse((refs[key] as React.RefObject<HTMLDivElement>).current, 0, cx, cy);
      }
      applyMouse(refs.pepe.current, DEPTH.pepe, cx, cy);
      applyMouse(refs.content.current, DEPTH.content, cx, cy);

      const lettersSettled = onFrame ? onFrame(cx, cy) : true;

      const dx = Math.abs(mouse.x - smooth.x);
      const dy = Math.abs(mouse.y - smooth.y);
      if (dx > 0.5 || dy > 0.5 || !lettersSettled) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        tickingRef.current = false;
      }
    };

    const ensureTicking = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    // Restart on mousemove — matches original behavior.
    const onMove = () => ensureTicking();
    window.addEventListener('mousemove', onMove);

    // Kick off the first frame (original started the loop immediately).
    tickingRef.current = true;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      tickingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { rafRef, tickingRef };
}
