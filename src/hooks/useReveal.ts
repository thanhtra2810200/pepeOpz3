import { useEffect, useRef, useState } from 'react';

export interface RevealOptions {
  /** IntersectionObserver threshold (0–1). Default 0.15. */
  threshold?: number;
  /** Reveal only once, then disconnect. Default true. */
  once?: boolean;
  /** Root margin passed to IntersectionObserver. Default '0px 0px -60px 0px'. */
  rootMargin?: string;
}

/**
 * Reveal-on-scroll hook backed by IntersectionObserver.
 *
 * Accepts either an options object or, for backward compatibility, a bare
 * number interpreted as the threshold:
 *
 *   useReveal()                  // threshold 0.15, once
 *   useReveal(0.3)               // threshold 0.3, once
 *   useReveal({ threshold: 0.3, once: false })
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  optionsOrThreshold: RevealOptions | number = 0.15,
) {
  const opts: RevealOptions =
    typeof optionsOrThreshold === 'number'
      ? { threshold: optionsOrThreshold }
      : optionsOrThreshold;

  const { threshold = 0.15, once = true, rootMargin = '0px 0px -60px 0px' } = opts;

  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, visible };
}
