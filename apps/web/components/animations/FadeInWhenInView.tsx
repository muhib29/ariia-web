'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';

interface FadeInWhenInViewProps {
  children: React.ReactNode;
  delay?: number; // in ms
  duration?: number; // in seconds
  className?: string;
  yOffset?: number;
  /** Above-the-fold content: visible immediately (better LCP). */
  immediate?: boolean;
}

function prefersScrollReveal(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(max-width: 767px)').matches) return false;
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

export function FadeInWhenInView({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = '',
  immediate = false,
}: FadeInWhenInViewProps) {
  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!prefersScrollReveal()) return;

    const node = ref.current;
    if (!node) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setIsVisible(true);
    };

    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh && rect.bottom > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '80px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = {
    '--fade-delay': `${delay}ms`,
    '--fade-duration': `${duration}s`,
    '--fade-y': `${yOffset}px`,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      className={cn('fade-in-when-in-view', isVisible && 'fade-in-when-in-view--revealed', className)}
      style={style}
    >
      {children}
    </div>
  );
}
