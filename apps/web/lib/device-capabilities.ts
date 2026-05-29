/** Client-only helpers for performance-sensitive rendering decisions. */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

let webglSupported: boolean | null = null;

/** Cached WebGL probe — avoids creating multiple contexts during checks. */
export function supportsWebGL(): boolean {
  // Force-disable WebGL checks while troubleshooting freezes.
  // This prevents creating WebGL contexts in the browser.
  return false;
}

/** Whether this device should load Spline/WebGL scenes. Touch devices stay off for stability/LCP; desktop loads by default unless explicitly disabled via env. */
export function shouldLoadSpline(): boolean {
  // Force-disable Spline/WebGL loading globally while troubleshooting.
  return false;
}

/**
 * Mobile Safari safe mode: all touch devices under 768px (no RAM detection).
 * Enables site-wide CSS that disables GPU-heavy blurs (see MobileSafariMode).
 */
export function shouldConserveMemory(): boolean {
  if (typeof window === 'undefined') return false;

  if (process.env.NEXT_PUBLIC_CONSERVE_MEMORY === 'true') return true;
  if (process.env.NEXT_PUBLIC_CONSERVE_MEMORY === 'false') return false;

  return isTouchDevice() && window.matchMedia('(max-width: 767px)').matches;
}

/** Scroll-reveal fades break on iOS when content uses opacity:0 — desktop only. */
export function shouldUseScrollReveal(): boolean {
  if (typeof window === 'undefined') return false;
  if (isTouchDevice()) return false;
  if (window.matchMedia('(max-width: 767px)').matches) return false;
  if (prefersReducedMotion()) return false;
  return true;
}

/** Lenis smooth scroll fights native touch scrolling on iOS — use native scroll instead. */
export function shouldUseSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (isTouchDevice()) return false;
  return true;
}
