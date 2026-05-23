'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInWhenInViewProps {
  children: React.ReactNode;
  delay?: number; // in ms
  duration?: number; // in seconds
  className?: string;
  yOffset?: number;
  /** Above-the-fold content: visible immediately (better LCP). */
  immediate?: boolean;
}

function isNodeInViewport(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.98 && rect.bottom > vh * 0.02;
}

export function FadeInWhenInView({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = '',
  immediate = false,
}: FadeInWhenInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(immediate);
  const [hasAnimated, setHasAnimated] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;

    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setIsVisible(true);
      setHasAnimated(true);
    };

    if (isNodeInViewport(node)) {
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
      {
        threshold: 0.05,
        rootMargin: '0px',
      },
    );

    observer.observe(node);

    const onScroll = () => {
      if (isNodeInViewport(node)) {
        reveal();
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [immediate]);

  const transition = `opacity ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay / 1000}s, transform ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay / 1000}s`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${yOffset}px, 0)`,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: hasAnimated ? 'auto' : 'opacity, transform',
        transition,
      }}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
}
