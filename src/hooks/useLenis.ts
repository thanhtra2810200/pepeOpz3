import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lightweight Lenis smooth scrolling, initialized once at the app root.
 * Uses requestAnimationFrame — no GSAP, no Locomotive.
 *
 * Disabled on mobile (<=768px): touch devices already have native momentum
 * scrolling, and a permanent rAF loop wastes CPU/battery on mobile. The
 * instance is exposed on window.__lenis so the Navbar and Footer can call
 * lenis.scrollTo() for anchor navigation. When Lenis is disabled, callers
 * fall back to native window.scrollTo (see useScrollTo).
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
