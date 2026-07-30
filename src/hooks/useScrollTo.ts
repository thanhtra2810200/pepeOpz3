import type Lenis from 'lenis';

function getLenis(): Lenis | undefined {
  return typeof window !== 'undefined' ? window.__lenis : undefined;
}

/** Scroll to a pixel offset, using Lenis if available, else native smooth scroll. */
function scrollToTarget(target: number | HTMLElement) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  const top = typeof target === 'number' ? target : target.offsetTop;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Sections whose scroll target is derived from a transition container
// rather than the section element itself.
const SECTION_OVERRIDES: Record<string, { containerId: string }> = {
  'stats':      { containerId: 'hero-transition' },
  'how-to-buy': { containerId: 'htb-transition' },
  'community':  { containerId: 'htb-transition' },
};

export function scrollToId(id: string) {
  const override = SECTION_OVERRIDES[id];

  if (override) {
    const container = document.getElementById(override.containerId);
    if (!container) return;

    // Stats and Community appear one viewport into their transition container.
    const offset = id === 'stats' || id === 'community' ? window.innerHeight : 0;
    scrollToTarget(container.offsetTop + offset);
    return;
  }

  // All other sections — scroll directly to the element.
  const el = document.getElementById(id);
  if (!el) return;
  scrollToTarget(el);
}
