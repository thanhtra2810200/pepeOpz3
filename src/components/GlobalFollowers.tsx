import CircularGallery from '@/components/CircularGallery';
import { GALLERY_ITEMS, SOCIAL_PLATFORMS } from '@/components/globalFollowers/data';

export function GlobalFollowers() {
  return (
    <section
      id="about"
      className="relative overflow-hidden pb-32 pt-0 imp-section"
    >
      {/* Background — flat dark green, no glow */}
      <div className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Heading + social row — centered */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <span
            className="text-green-400 mb-2"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              letterSpacing: '0.05em',
            }}
          >
            5,000,000+
          </span>
          <h2
            className="leading-[0.9]"
            style={{
              fontFamily: '"Luckiest Guy", cursive',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '0.01em',
              color: '#fafff4',
              textShadow:
                '0 2px 0 #166534,' +
                '0 4px 0 #14532d,' +
                '0 6px 8px rgba(0,0,0,0.6),' +
                '0 0 40px rgba(86,242,123,0.45)',
            }}
          >
            GLOBAL FOLLOWERS
          </h2>

          {/* Social platform row — official icon + platform name.
              Desktop: single row. Mobile: wraps into 2x2 grid with equal spacing. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-10 mt-8 max-w-[320px] sm:max-w-none mx-auto">
            {SOCIAL_PLATFORMS.map(({ icon: Icon, iconSrc, iconSize, name, font }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Icon src={iconSrc} size={iconSize} />
                <span
                  className="text-white"
                  style={{
                    fontFamily: font,
                    fontWeight: 700,
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    letterSpacing: name === 'YouTube' ? '0.03em' : '0.01em',
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive circular gallery — full width */}
      <div className="relative z-10 w-full" style={{ height: '60vh', minHeight: '400px' }}>
        <CircularGallery
          items={GALLERY_ITEMS}
          bend={0.8}
          textColor="#56F27B"
          borderRadius={0.04}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>
    </section>
  );
}
