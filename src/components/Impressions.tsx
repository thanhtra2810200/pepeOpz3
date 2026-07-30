import { useReveal } from '@/hooks/useReveal';
import { useImpressionField } from '@/hooks/useImpressionField';
import { useImpressionCounter } from '@/hooks/useImpressionCounter';
import { Odometer } from '@/components/impressions/Odometer';

export function Impressions() {
  const { ref, visible } = useReveal();
  const { fieldRef, counterRef, shake, glowPulse } = useImpressionField(visible);
  const odoDigits = useImpressionCounter(visible);

  return (
    <section
      id="stats"
      ref={ref}
      aria-labelledby="stats-heading"
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-32 imp-section section-reveal ${visible ? 'is-visible' : ''}`}
    >
      {/* Background */}
      <div data-depth="background" className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Card field */}
      <div
        ref={fieldRef}
        data-depth="decorative"
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div data-depth="content" className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-red-900 imp-badge-dot" />
          <span
            className="text-green-400 text-[0.65rem] sm:text-xs font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Live Meme Activity
          </span>
        </div>

        {/* Heading */}
        <h2
          id="stats-heading"
          className="mb-10 leading-[0.95]"
          style={{
            fontFamily: '"Luckiest Guy", cursive',
            fontSize: 'clamp(1rem, 2vw, 1.8rem)',
            letterSpacing: '0.01em',
            color: '#fafff4',
            textShadow:
              '0 2px 0 #166534,' +
              '0 4px 0 #14532d,' +
              '0 6px 8px rgba(0,0,0,0.6),' +
              '0 0 30px rgba(74,222,128,0.4)',
          }}
        >
          TOTAL PEPE MEME IMPRESSIONS
        </h2>

        {/* Counter */}
        <div className="relative mb-6">
          <div
            ref={counterRef}
            className={`imp-counter select-none ${shake ? 'imp-shake' : ''}`}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(3.64rem, 11.7vw, 9.1rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#ffd54a',
              WebkitTextStroke: '0.04em rgba(255,213,74,0.25)',
              textShadow: glowPulse
                ? '0 0 16px rgba(74,222,128,.28), 0 0 28px rgba(74,222,128,.12), 0 3px 10px rgba(0,0,0,.55)'
                : '0 0 10px rgba(74,222,128,.12), 0 3px 10px rgba(0,0,0,.45)',
              transition: 'text-shadow 0.35s ease',
            }}
          >
            <Odometer digits={odoDigits} />
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="mb-8"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(0.6rem, 1.6vw, 0.95rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#fafff4',
            textShadow: '0 0 18px rgba(74,222,128,0.5)',
          }}
        >
          Collective Views
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-900 imp-badge-dot" />
          <span
            className="text-gray-400"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)',
              letterSpacing: '0.1em',
            }}
          >
            Real Time Tracker
          </span>
        </div>

      </div>
    </section>
  );
}
