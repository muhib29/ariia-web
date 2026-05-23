'use client';

import Image, { type ImageProps } from 'next/image';
import { useConserveMemory } from '@/hooks/useConserveMemory';
import { useEffect, useRef, useState } from 'react';

type DeferredImageProps = ImageProps & {
  rootMargin?: string;
};

/**
 * Loads images when near the viewport. On mobile, keeps them mounted once loaded
 * (no unload — unloading caused visible gaps / memory churn on iOS).
 */
export function DeferredImage({
  rootMargin = '400px 0px',
  alt,
  className,
  fill,
  style,
  sizes,
  ...props
}: DeferredImageProps) {
  const conserve = useConserveMemory();
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const margin = conserve ? '200px 0px' : rootMargin;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded, margin]);

  const mobileSizes = conserve ? '(max-width: 767px) 90vw, 50vw' : sizes;

  if (fill) {
    return (
      <div ref={ref} className={`relative ${className ?? ''}`} style={style}>
        {loaded ? (
          <Image
            alt={alt}
            fill
            sizes={mobileSizes}
            {...props}
            className="object-contain"
            loading="lazy"
            fetchPriority="low"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100/80" aria-hidden />
        )}
      </div>
    );
  }

  return (
    <div ref={ref} style={style}>
      {loaded ? (
        <Image
          alt={alt}
          className={className}
          sizes={mobileSizes}
          {...props}
          loading="lazy"
          fetchPriority="low"
        />
      ) : (
        <div
          className={`${className ?? ''} min-h-[80px] bg-slate-100/80 rounded-lg`}
          aria-hidden
        />
      )}
    </div>
  );
}
