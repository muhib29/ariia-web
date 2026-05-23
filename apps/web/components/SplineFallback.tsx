import type { CSSProperties } from 'react';

interface SplineFallbackProps {
  className?: string;
  style?: CSSProperties;
  variant?: 'orb' | 'pattern';
}

/** Lightweight static placeholder when WebGL / Spline is skipped. */
export function SplineFallback({ className = '', style, variant = 'orb' }: SplineFallbackProps) {
  const isPattern = variant === 'pattern';

  return (
    <div
      className={className}
      style={style}
      aria-hidden
    >
      <div
        className={
          isPattern
            ? 'absolute inset-0 rounded-full opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(103,121,255,0.35)_0%,rgba(53,181,245,0.15)_45%,transparent_70%)]'
            : 'absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_30%_30%,#7b9cfd_0%,#4E97FA_35%,#35B5F5_60%,#2EFFEA_100%)] shadow-[inset_0_0_40px_rgba(255,255,255,0.25)]'
        }
      />
      {!isPattern && (
        <div className="absolute inset-[18%] rounded-full bg-white/10 backdrop-blur-[2px]" />
      )}
    </div>
  );
}
