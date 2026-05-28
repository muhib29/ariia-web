'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { getLenis, registerLenis, unregisterLenis } from '@/lib/lenis';
import { shouldUseSmoothScroll } from '@/lib/device-capabilities';

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldUseSmoothScroll()) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    registerLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, []);

  // Reset Lenis on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      const timeout = window.setTimeout(() => {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }, 100);

      return () => window.clearTimeout(timeout);
    }
  }, [pathname]);

  return <>{children}</>;
}
