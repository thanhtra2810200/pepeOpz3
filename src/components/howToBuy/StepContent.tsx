import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function StepContent({
  index,
  total,
  icon: Icon,
  title,
  body,
}: {
  index: number;
  total: number;
  icon: LucideIcon;
  title: string;
  body: string;
}): ReactNode {
  return (
    <div className="py-6">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, rgba(74,222,128,0.18) 0%, rgba(22,163,74,0.08) 100%)',
            border: '1px solid rgba(74,222,128,0.3)',
            boxShadow: '0 0 24px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Icon className="w-7 h-7 text-green-400" />
        </div>
        <div className="flex flex-col">
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase text-green-400"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Step {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      <h3
        className="mb-3"
        style={{
          fontFamily: '"Luckiest Guy", cursive',
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          letterSpacing: '0.01em',
          color: '#fafff4',
          textShadow:
            '0 2px 0 #166534,' +
            '0 4px 0 #14532d,' +
            '0 6px 8px rgba(0,0,0,0.6),' +
            '0 0 24px rgba(74,222,128,0.35)',
        }}
      >
        {title}
      </h3>

      <p
        className="leading-relaxed max-w-md"
        style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500, color: '#d1d5db' }}
      >
        {body}
      </p>
    </div>
  );
}
