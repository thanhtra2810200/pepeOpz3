import { useEffect, useRef, useState } from 'react';
import {
  BASE_CARD_PX,
  CARD_IMAGES,
  COMPASS_ANGLES,
  POOL_SIZE,
  Z_FAR,
  Z_NEAR,
} from '@/components/impressions/constants';
import {
  depthBlur,
  depthBrightness,
  depthOpacity,
  depthScale,
  isBottomLane,
} from '@/components/impressions/depth';
import { spawnCard } from '@/components/impressions/spawn';
import type { Card } from '@/components/impressions/types';

/**
 * useImpressionField — builds the card pool, preloads images, runs the
 * object animation loop, and drives the counter shake/glow pulse when a
 * card passes near the counter.
 *
 * `active` gates the animation loop (e.g. paused until the section is
 * visible). Returns refs the caller attaches to the field container and
 * the counter element, the imagesReady flag, plus shake/glowPulse state.
 */
export function useImpressionField(active: boolean) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<Card[]>([]);
  const rafRef = useRef<number>(0);
  const fieldW = useRef(0);
  const fieldH = useRef(0);

  const [imagesReady, setImagesReady] = useState(false);
  const [shake, setShake] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const shakeTO = useRef<number | undefined>(undefined);

  // ── Build pool ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const n = POOL_SIZE;
    const pool: Card[] = [];

    // One card per lane — lane i owns card i permanently
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        'top:0',
        'left:0',
        `width:${BASE_CARD_PX}px`,
        `height:${BASE_CARD_PX}px`,
        'will-change:transform,opacity',
        'pointer-events:none',
        'border-radius:14px',
        'overflow:hidden',
        'box-shadow:0 4px 24px rgba(0,0,0,0.55)',
        'opacity:0',
        'backface-visibility:hidden',
      ].join(';');

      const img = document.createElement('img');
      img.draggable = false;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none';
      el.appendChild(img);
      field.appendChild(el);

      pool.push({
        el,
        img,
        laneIndex: i,
        x0: 0, y0: 0, x: 0, y: 0,
        z: 0, vz: 0,
        driftAmp: 0, driftPhase: 0,
        tilt: 0, active: false, lastImgIdx: -1,
      });
    }

    poolRef.current = pool;

    const measure = () => {
      fieldW.current = field.clientWidth;
      fieldH.current = field.clientHeight;
    };
    measure();
    window.addEventListener('resize', measure);

    // Preload all card images before starting the animation
    let cancelled = false;
    const preload = CARD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    );

    Promise.all(preload).then(() => {
      if (cancelled) return;

      // Distribute the lanes evenly across depth
      const startZ = Z_FAR;
      const endZ = Z_NEAR * 0.82;

      for (let i = 0; i < n; i++) {
        spawnCard(pool[i], fieldW.current, fieldH.current, false);
        pool[i].z = startZ + (i / (n - 1)) * (endZ - startZ);
      }

      setImagesReady(true);
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
      pool.forEach((c) => c.el.remove());
      poolRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Object animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!active || !imagesReady) return;
    const counter = counterRef.current;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3.0);
      last = now;

      const pool = poolRef.current;
      const cx = fieldW.current / 2;
      const cy = fieldH.current / 2;

      let nearCounter = false;

      for (let i = 0; i < pool.length; i++) {
        const c = pool[i];
        if (!c.active) continue;

        c.z += c.vz * dt;
        c.driftPhase += 0.006 * dt;

        if (c.z >= Z_NEAR) {
          c.el.style.opacity = '0';
          c.active = false;
          spawnCard(c, fieldW.current, fieldH.current, false);
          continue;
        }

        const scale = depthScale(c.z);
        const opacity = depthOpacity(c.z);
        const blur = depthBlur(c.z);
        const bright = depthBrightness(c.z);
        const cardPx = BASE_CARD_PX * scale;

        const drift = Math.sin(c.driftPhase) * c.driftAmp;

        // Perspective: preserve spawn radius at z=0, expand outward as z→1
        const nz = c.z / Z_NEAR;

        const laneAngle = COMPASS_ANGLES[c.laneIndex];
        const bottomLane = isBottomLane(laneAngle);
        const perspExp = bottomLane ? 0.85 : 1.1;
        const perspFactor = 1 + Math.pow(nz, 1.8) * perspExp;
        const sx = cx + (c.x0 + drift) * perspFactor - cardPx / 2;
        const sy = cy + c.y0 * perspFactor - cardPx / 2;

        // Boundary fade — card completes fade-out before reaching section edges
        const edgeMargin = 220;
        const bottomMargin = bottomLane ? 300 : 220;
        const distLeft = sx;
        const distRight = fieldW.current - sx - cardPx;
        const distTop = sy;
        const distBottom = fieldH.current - sy - cardPx;
        const edgeFade = Math.max(
          0,
          Math.min(
            1,
            Math.min(distLeft / edgeMargin, distRight / edgeMargin, distTop / edgeMargin, distBottom / bottomMargin),
          ),
        );

        const recycleThreshold = bottomLane ? 0.1 : 0.02;
        if (edgeFade < recycleThreshold) {
          c.el.style.opacity = '0';
          c.active = false;
          spawnCard(c, fieldW.current, fieldH.current, false);
          continue;
        }

        const finalOpacity = opacity * edgeFade;

        c.el.style.transform =
          `translate3d(${sx}px,${sy}px,0) scale(${scale}) rotate(${c.tilt * (1 - nz * 0.6)}deg)`;
        c.el.style.opacity = String(finalOpacity.toFixed(3));

        const filters: string[] = [];
        if (blur > 0.05) filters.push(`blur(${blur.toFixed(2)}px)`);
        if (Math.abs(bright - 1) > 0.005) filters.push(`brightness(${bright.toFixed(3)})`);
        c.el.style.filter = filters.join(' ');

        if (counter && finalOpacity > 0.6 && scale > 0.65) {
          const dx = sx + cardPx / 2 - cx;
          const dy = sy + cardPx / 2 - cy;
          if (Math.sqrt(dx * dx + dy * dy) < 180) nearCounter = true;
        }
      }

      if (nearCounter && !shake) {
        setGlowPulse(true);
        setShake(true);
        window.clearTimeout(shakeTO.current);
        shakeTO.current = window.setTimeout(() => {
          setShake(false);
          setGlowPulse(false);
        }, 420);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(shakeTO.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, imagesReady]);

  return { fieldRef, counterRef, imagesReady, shake, glowPulse };
}
