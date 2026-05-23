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
  if (typeof window === 'undefined') return false;
  if (webglSupported !== null) return webglSupported;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    webglSupported = Boolean(gl);
  } catch {
    webglSupported = false;
  }

  return webglSupported;
}

/** Whether this device should ever load Spline (desktop only, good connection). */
export function shouldLoadSpline(): boolean {
  if (typeof window === 'undefined') return false;
  // Off by default — set NEXT_PUBLIC_ENABLE_SPLINE=true in Vercel when ready for 3D
  if (process.env.NEXT_PUBLIC_ENABLE_SPLINE !== 'true') return false;
  // Phones/tablets: CSS fallback only — Spline was blocking navigation & LCP
  if (isTouchDevice()) return false;
  if (prefersReducedMotion()) return false;
  if (!supportsWebGL()) return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return false;

  const speed = nav.connection?.effectiveType;
  if (speed === 'slow-2g' || speed === '2g' || speed === '3g') return false;

  return true;
}

/** Lenis smooth scroll fights native touch scrolling on iOS — use native scroll instead. */
export function shouldUseSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (isTouchDevice()) return false;
  return true;
}
