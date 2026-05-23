'use client';

import { useConserveMemory } from '@/hooks/useConserveMemory';
import { useEffect, useRef, useState } from 'react';

type ViewportSectionProps = {
  children: React.ReactNode;
  estimatedHeight: number;
  id?: string;
  className?: string;
  rootMargin?: string;
};

function isNearViewport(rect: DOMRectReadOnly, vh: number): boolean {
  return rect.top < vh * 1.8 && rect.bottom > -vh * 0.8;
}

/**
 * Mobile: lazy-mount section when scrolled near (saves initial RAM).
 * Once mounted, content stays in the DOM — never unmounted (avoids white-screen gaps).
 */
export function ViewportSection({
  children,
  estimatedHeight,
  id,
  className = '',
  rootMargin = '90% 0px',
}: ViewportSectionProps) {
  const conserve = useConserveMemory();
  const rootRef = useRef<HTMLDivElement>(null);
  const heightCache = useRef(estimatedHeight);
  const [mounted, setMounted] = useState(!conserve);

  useEffect(() => {
    if (!conserve) {
      setMounted(true);
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const tryMount = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = node.getBoundingClientRect();
      if (isNearViewport(rect, vh)) {
        setMounted(true);
        return true;
      }
      return false;
    };

    if (tryMount()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [conserve, rootMargin]);

  useEffect(() => {
    if (!mounted || !conserve) return;
    const content = rootRef.current?.querySelector('[data-viewport-section-content]');
    if (!content || !(content instanceof HTMLElement)) return;

    const ro = new ResizeObserver(() => {
      const h = rootRef.current?.offsetHeight;
      if (h && h > 80) heightCache.current = h;
    });
    ro.observe(content);
    return () => ro.disconnect();
  }, [mounted, conserve]);

  if (!conserve) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const minH = mounted ? undefined : heightCache.current;

  return (
    <div
      ref={rootRef}
      id={id}
      className={className}
      style={minH ? { minHeight: minH } : undefined}
    >
      {mounted ? (
        <div data-viewport-section-content>{children}</div>
      ) : (
        <div
          className="viewport-section-slot bg-white"
          style={{ minHeight: minH }}
          aria-hidden
        />
      )}
    </div>
  );
}
