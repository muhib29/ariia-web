'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInWhenInViewProps {
  children: React.ReactNode;
  delay?: number; // in ms
  duration?: number; // in seconds
  className?: string;
  yOffset?: number;
}

export function FadeInWhenInView({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = '',
}: FadeInWhenInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const transition = `opacity ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay / 1000}s, transform ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay / 1000}s`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${yOffset}px, 0)`,
        willChange: hasAnimated ? 'auto' : 'opacity, transform',
        transition,
      }}
    >
      {children}
    </div>
  );
}
