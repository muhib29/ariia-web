'use client';

import type Lenis from 'lenis';

let activeLenis: Lenis | null = null;

const noopLenis = {
  stop() {},
  start() {},
  scrollTo() {},
  destroy() {},
} as unknown as Lenis;

export function registerLenis(instance: Lenis) {
  if (process.env.NEXT_PUBLIC_DISABLE_SPLINE === 'true') return;
  activeLenis = instance;
}

export function unregisterLenis(instance: Lenis) {
  if (activeLenis === instance) {
    activeLenis = null;
  }
}

export function getLenis(): Lenis {
  return activeLenis ?? noopLenis;
}

export function lenisScrollTo(target: string | number | HTMLElement, offset = 0) {
  const lenis = getLenis();

  // If a real Lenis instance exists, use it
  if (lenis && (lenis as any).scrollTo && (lenis as any) !== noopLenis) {
    (lenis as any).scrollTo(target as Parameters<Lenis['scrollTo']>[0], {
      offset: -offset,
      duration: 1.1,
    });
    return;
  }

  // Fallback to native scrolling
  if (typeof target === 'number') {
    window.scrollTo({ top: target - offset, behavior: 'smooth' });
    return;
  }

  if (typeof target === 'string') {
    const element = document.querySelector<HTMLElement>(target);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    return;
  }

  const top = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

