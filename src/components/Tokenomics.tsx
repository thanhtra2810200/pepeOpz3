import { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';
import { useIsMobile } from '@/hooks/useIsMobile';
import RotatingText from '@/components/RotatingText';
import {
  SEGMENTS,
  STATS,
  ROTATING_WORDS,
  BG_IMAGE_DESKTOP,
  BG_IMAGE_MOBILE,
  DONUT_RADIUS,
  DONUT_CIRCUMFERENCE,
} from '@/components/tokenomics/constants';
import { StatCard } from '@/components/tokenomics/StatCard';

export function Tokenomics() {
  const { ref, visible } = useReveal();
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const tilt = useTilt<HTMLDivElement>(20);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  let offsetAcc = 0;

  return (
    <section id="tokenomics" ref={ref} aria-labelledby="tokenomics-heading" className={`section-full relative py-13 px-6 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${isMobile ? BG_IMAGE_MOBILE : BG_IMAGE_DESKTOP})` }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[700px] sm:h-[700px] bg-green-500/5 rounded-full blur-[80px] sm:blur-[160px] pointer-events-none" />
      {/* Subtle vignette + ambient lighting for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%),' +
            'radial-gradient(circle at 30% 20%, rgba(74,222,128,0.06) 0%, transparent 45%),' +
            'radial-gradient(circle at 70% 80%, rgba(34,197,94,0.05) 0%, transparent 45%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-12 sm:mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span
            className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Tokenomics
          </span>
          <h2
            id="tokenomics-heading"
            className="leading-none mt-4"
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
            <span style={{ display: 'inline' }}>NUMBERS THAT </span>
            <RotatingText
              texts={ROTATING_WORDS}
              rotationInterval={2200}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              mainClassName="inline-flex align-baseline"
              elementLevelClassName="text-stroke"
              style={{
                fontFamily: '"Luckiest Guy", cursive',
                WebkitTextStroke: '1.5px rgba(74,222,128,0.5)',
                color: 'transparent',
                textShadow:
                  '0 2px 0 #166534,' +
                  '0 4px 0 #14532d,' +
                  '0 6px 8px rgba(0,0,0,0.6)',
                letterSpacing: '0.01em',
              }}
            />
          </h2>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} active={visible} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* 3D tilt donut — stationary, glow pulse only */}
          <div className="flex justify-center perspective-1000">
            <div
              ref={tilt.ref}
              onMouseMove={tilt.onMove}
              onMouseLeave={tilt.onLeave}
              className="relative w-56 h-56 sm:w-72 sm:h-72"
            >
              {/* Outer glow pulse — lighting only, no rotation */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ animation: 'tokenGlowPulse 4s ease-in-out infinite' }}
              />
              <div className="absolute inset-0 rounded-full bg-green-500/5 blur-2xl" />
              <svg viewBox="0 0 220 220" className="relative w-full h-full -rotate-90">
                <circle cx="110" cy="110" r={DONUT_RADIUS} fill="none" stroke="#1f2937" strokeWidth="28" />
                {SEGMENTS.map((seg, i) => {
                  const len = (seg.value / 100) * DONUT_CIRCUMFERENCE * progress;
                  const el = (
                    <circle
                      key={i}
                      cx="110"
                      cy="110"
                      r={DONUT_RADIUS}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="28"
                      strokeDasharray={`${len} ${DONUT_CIRCUMFERENCE}`}
                      strokeDashoffset={-offsetAcc}
                    />
                  );
                  offsetAcc += (seg.value / 100) * DONUT_CIRCUMFERENCE * progress;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center tilt-inner">
                <span className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Total Supply</span>
                <span className="text-white text-3xl font-black font-mono">420.69T</span>
                <span className="text-green-400 text-sm font-bold mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>$PEPE</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {SEGMENTS.map((seg, i) => (
              <div
                key={seg.label}
                className={`group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-green-500/30 hover:translate-x-2 transition-all duration-300 reveal ${visible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform" style={{ background: seg.color, boxShadow: `0 0 12px ${seg.color}` }} />
                <span className="text-gray-200 font-semibold flex-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{seg.label}</span>
                <span className="text-white font-black font-mono text-lg">{seg.value.toFixed(1)}%</span>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10 text-gray-500 text-sm font-mono">
              Network: <span className="text-green-400 font-semibold">Ethereum (ERC-20)</span> ·
              Decimals: <span className="text-green-400 font-semibold">18</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tokenGlowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(74,222,128,0.15), 0 0 80px rgba(74,222,128,0.06); }
          50%      { box-shadow: 0 0 70px rgba(74,222,128,0.3),  0 0 130px rgba(74,222,128,0.12); }
        }
      `}</style>
    </section>
  );
}
