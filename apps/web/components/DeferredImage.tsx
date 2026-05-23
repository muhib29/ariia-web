'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

type DeferredImageProps = ImageProps & {
  rootMargin?: string;
};

/** Loads images only when scrolled near — keeps multi-MB SVGs off initial network. */
export function DeferredImage({
  rootMargin = '500px 0px',
  alt,
  className,
  fill,
  style,
  ...props
}: DeferredImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (fill) {
    return (
      <div ref={ref} className={`relative ${className ?? ''}`} style={style}>
        {visible ? (
          <Image alt={alt} fill {...props} className="object-contain" loading="lazy" fetchPriority="low" />
        ) : (
          <div className="absolute inset-0 rounded-lg bg-slate-200/50 animate-pulse" aria-hidden />
        )}
      </div>
    );
  }

  return (
    <div ref={ref} style={style}>
      {visible ? (
        <Image alt={alt} className={className} {...props} loading="lazy" fetchPriority="low" />
      ) : (
        <div
          className={`${className ?? ''} min-h-[100px] bg-slate-200/50 animate-pulse rounded-lg`}
          aria-hidden
        />
      )}
    </div>
  );
}
