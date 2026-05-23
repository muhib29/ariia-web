'use client';

import type Lenis from 'lenis';

let activeLenis: Lenis | null = null;

export function registerLenis(instance: Lenis) {
  activeLenis = instance;
}

export function unregisterLenis(instance: Lenis) {
  if (activeLenis === instance) {
    activeLenis = null;
  }
}

export function getLenis() {
  return activeLenis;
}

export function lenisScrollTo(target: string | number | HTMLElement, offset = 0) {
  if (activeLenis) {
    activeLenis.scrollTo(target as Parameters<Lenis['scrollTo']>[0], {
      offset: -offset,
      duration: 1.1,
    });
    return;
  }

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

  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

