import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';

type HeroLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

/** Lightweight logo — replaces 1.3MB inline SVG that was bloating the JS bundle. */
export function HeroLogo({
  className,
  width = 90,
  height = 110,
  priority = true,
}: HeroLogoProps) {
  return (
    <Image
      src="/images/ariia-image.png"
      alt="ARIIA"
      width={width}
      height={height}
      priority={priority}
      fetchPriority={priority ? 'high' : 'low'}
      className={cn('object-contain', className)}
    />
  );
}
