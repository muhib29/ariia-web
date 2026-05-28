import Image from 'next/image';

interface HeroLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/** Hero mark — served from /public to avoid multi‑MB inline base64 in the JS bundle. */
export function HeroLogo({
  className = '',
  width = 149,
  height = 143,
  priority = true,
}: HeroLogoProps) {
  return (
    <Image
      src="/images/hero-logo.webp"
      alt="ARIIA"
      width={width}
      height={height}
      priority={priority}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
}
