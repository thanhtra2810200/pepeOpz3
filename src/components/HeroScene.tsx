import { useRef } from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';
import { RevealLayer } from '@/components/RevealLayer';
import { Particles } from '@/components/Particles';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useHeroMouse } from '@/hooks/useHeroMouse';
import { useHeroParallax } from '@/hooks/useHeroParallax';
import { useHeroLetters } from '@/hooks/useHeroLetters';

const BG_IMAGE_DESKTOP =
  'https://ik.imagekit.io/zznoau6lx/tr:w-1920,q-75,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_30_48%20PM.webp';

const BG_IMAGE_MOBILE =
  'https://ik.imagekit.io/zznoau6lx/tr:w-1536,q-90,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_30_48%20PM.webp';

const LETTERS = ['P', 'E', 'P', 'E'];

const STATS = [
  { label: 'Market Cap',  value: '$1.2B',   icon: TrendingUp },
  { label: 'Holders',     value: '300K+',   icon: Users },
  { label: 'Total Supply', value: '420.69T', icon: Zap },
];

export function HeroScene() {
  const isMobile = useIsMobile();

  const sectionRef = useRef<HTMLDivElement>(null);
  const gridPatternRef = useRef<SVGPatternElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const skyRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const revealWrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const pepeRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const { mouseRef, smoothRef } = useHeroMouse(!isMobile);
  const { update: updateLetters } = useHeroLetters(!isMobile, pepeRef, letterRefs, smoothRef);

  useHeroParallax(
    !isMobile,
    {
      section: sectionRef,
      gridPattern: gridPatternRef,
      reveal: revealRef,
      sky: skyRef,
      city: cityRef,
      fog: fogRef,
      water: waterRef,
      revealWrap: revealWrapRef,
      particles: particlesRef,
      glow: glowRef,
      overlay: overlayRef,
      bottomFade: bottomFadeRef,
      pepe: pepeRef,
      content: contentRef,
    },
    mouseRef,
    smoothRef,
    updateLetters,
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="h-screen overflow-hidden flex flex-col relative"
    >
      <div
        ref={skyRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${isMobile ? BG_IMAGE_MOBILE : BG_IMAGE_DESKTOP})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        ref={cityRef}
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <svg
        aria-hidden="true"
        className="will-change-transform"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern
            ref={gridPatternRef}
            id="grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {!isMobile && (
        <div
          ref={fogRef}
          className="absolute inset-0 will-change-transform pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 30% 35%, rgba(74,222,128,0.10) 0%, transparent 70%),' +
              'radial-gradient(ellipse 50% 35% at 75% 55%, rgba(34,197,94,0.08) 0%, transparent 70%),' +
              'radial-gradient(ellipse 70% 45% at 50% 75%, rgba(132,204,22,0.06) 0%, transparent 70%)',
            mixBlendMode: 'screen',
            animation: 'fogDrift 24s ease-in-out infinite alternate',
          }}
        />
      )}

      {!isMobile && (
        <div
          ref={waterRef}
          className="absolute bottom-0 left-0 right-0 h-1/3 will-change-transform pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.04) 40%, rgba(34,197,94,0.08) 100%)',
            animation: 'waterShimmer 8s ease-in-out infinite alternate',
          }}
        />
      )}

      {!isMobile && (
        <div ref={revealWrapRef} className="absolute inset-0 will-change-transform">
          <RevealLayer ref={revealRef} />
        </div>
      )}

      {!isMobile && (
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-[15] will-change-transform">
          <Particles className="absolute inset-0 pointer-events-none" />
        </div>
      )}

      <div
  ref={overlayRef}
  className="absolute inset-0 pointer-events-none z-[16] will-change-transform"
  style={{
    background: isMobile
      ? 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.60) 100%)'
      : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.78) 100%)',
  }}
/>

      {!isMobile && (
        <div
          ref={glowRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none z-[14] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
            animation: 'breathe 7s ease-in-out infinite',
          }}
        />
      )}

      <div ref={contentRef} className="relative z-20 flex flex-col h-screen will-change-transform">
        <div className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full" />

        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-20 sm:pb-24 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Live on Ethereum</span>
          </div>

          <h1
            ref={pepeRef}
            className="hero-title select-none mb-6 will-change-transform"
            style={{
              fontFamily: '"Luckiest Guy", cursive',
              fontSize: 'clamp(4rem, 11vw, 9rem)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              color: '#fafff4',
              textShadow:
                '0 2px 0 #166534,' +
                '0 4px 0 #14532d,' +
                '0 6px 8px rgba(0,0,0,0.6),' +
                '0 0 36px rgba(74,222,128,0.55),' +
                '0 0 90px rgba(74,222,128,0.25)',
            }}
          >
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                ref={(el) => { letterRefs.current[i] = el; }}
                className="inline-block will-change-transform"
              >
                {ch}
              </span>
            ))}
          </h1>

          <p
            className="mb-6"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(0.56rem, 1.76vw, 1rem)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#4ade80',
              textShadow: '0 0 18px rgba(74,222,128,0.5)',
            }}
          >
            The Most Memeable Memecoin
          </p>

          <p
            className="max-w-xl mb-12"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(0.76rem, 1.44vw, 0.96rem)',
              lineHeight: 1.7,
              color: '#d1d5db',
            }}
          >
            No taxes. No bullshit. Just vibes and green candles.<br />
            Pepe is here to make memecoins great again.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto px-4 sm:px-0">
            <a
              href="#how-to-buy"
              className="hero-btn-primary group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base transition-all duration-300"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                color: '#052e16',
                background: 'linear-gradient(180deg, #86efac 0%, #4ade80 100%)',
                border: '2px solid #4ade80',
                boxShadow: '0 0 24px rgba(74,222,128,0.45), 0 0 48px rgba(74,222,128,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              <TrendingUp className="w-4 h-4" />
              Buy on Uniswap
            </a>
            <a
              href="#how-to-buy"
              className="hero-btn-secondary group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base transition-all duration-300"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                color: '#4ade80',
                background: 'rgba(74,222,128,0.06)',
                border: '2px solid rgba(74,222,128,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Zap className="w-4 h-4" />
              How to Buy
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-14">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="stat-card group flex flex-col items-center gap-1.5 transition-all duration-300"
                style={{ cursor: 'default' }}
              >
                <Icon className="w-3.5 h-3.5 text-green-500 mb-1 transition-all duration-300 group-hover:scale-125 group-hover:text-green-300" />
                <span
                  className="stat-value transition-all duration-300 group-hover:text-green-300"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                    color: '#ffffff',
                    textShadow: '0 0 20px rgba(74,222,128,0.25)',
                  }}
                >
                  {value}
                </span>
                <span
                  className="stat-label transition-colors duration-300 group-hover:text-green-400/80"
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.52rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: '#6b7280',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={bottomFadeRef}
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[18] will-change-transform"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}
      />
    </section>
  );
}
