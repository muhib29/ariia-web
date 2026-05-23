'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { lenisScrollTo } from '@/lib/lenis';

function getHeaderOffset() {
  // Prefer a real header element if present; fall back to a conservative default.
  const header = document.querySelector('header');
  if (header instanceof HTMLElement) {
    return header.getBoundingClientRect().height;
  }
  return 0;
}

function scrollToHashWithRetry(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) return;

  // Extra margin from the top (in addition to header compensation).
  const extraMargin = 6;

  let attempt = 0;
  const maxAttempts = 30; // ~3s at 100ms interval

  const tick = () => {
    attempt += 1;

    const el = document.getElementById(id);
    if (el) {
      const offset = -(getHeaderOffset() + extraMargin);
      lenisScrollTo(el, offset);

      // Re-apply scroll a few frames to counter late layout shifts (images/fonts)
      requestAnimationFrame(() => lenisScrollTo(el, offset));
      requestAnimationFrame(() => requestAnimationFrame(() => lenisScrollTo(el, offset)));
      return;
    }

    if (attempt < maxAttempts) {
      window.setTimeout(tick, 100);
    }
  };

  tick();
}

export function HashScrollManager() {
  const pathname = usePathname();

  const runScroll = () => {
    const hash = window.location.hash;

    if (!hash) return;
    scrollToHashWithRetry(hash);
  };

  useEffect(() => {
    // 1) Handle hash after route navigation (e.g. /pricing -> /#about-us)
    // Wait a tick so the new page/sections are mounted, then retry until the element exists.
    const t = window.setTimeout(runScroll, 0);

    // Some pages still shift after hydration (fonts, images, async sections).
    // Do another retry after first paint, and again when window fully loads.
    const raf1 = window.requestAnimationFrame(() => {
      runScroll();
    });

    const onLoad = () => {
      runScroll();
    };
    window.addEventListener('load', onLoad);

    // Back/forward navigation can restore a hash without a pathname change.
    window.addEventListener('popstate', runScroll);

    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf1);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('popstate', runScroll);
    };
  }, [pathname]);

  useEffect(() => {
    // 2) Handle hash changes on the same route (e.g. clicking #faq while already on /)
    const onHashChange = () => runScroll();

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return null;
}

export {};


