import { useCountUp } from '@/hooks/useCountUp';
import type { TokenStat } from './constants';

export function StatCard({
  stat,
  active,
  index,
}: {
  stat: TokenStat;
  active: boolean;
  index: number;
}) {
  const val = useCountUp(stat.value, active);
  const formatted = stat.value >= 100 ? Math.round(val) : val.toFixed(stat.value < 10 ? 1 : 0);

  return (
    <div
      className={`group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 reveal ${active ? 'is-visible' : ''}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Glass reflection sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(74,222,128,0.05) 100%)',
        }}
      />
      <div className="relative text-3xl md:text-4xl font-black text-white font-mono">
        {stat.prefix}{formatted}{stat.suffix}
      </div>
      <div className="relative text-gray-500 text-xs uppercase tracking-widest mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{stat.label}</div>
    </div>
  );
}
