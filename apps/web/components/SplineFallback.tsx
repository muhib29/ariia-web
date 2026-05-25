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
      className={
        isPattern
          ? `${className} rounded-full overflow-hidden`
          : `${className} w-full h-full rounded-full bg-gradient-to-br from-[#a9d4ff]/25 to-[#43b9f1]/15`
      }
      style={style}
      aria-hidden
    />
  );
}
