import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';

type AriiaSvgMarkProps = {
  className?: string;
};

/** Header brand mark — file asset instead of 78KB inline SVG in the bundle. */
export function AriiaSvgMark({ className }: AriiaSvgMarkProps) {
  return (
    <Image
      src="/ariia-logo.svg"
      alt="ARIIA"
      width={127}
      height={36}
      className={cn('h-auto w-auto object-contain', className)}
    />
  );
}
