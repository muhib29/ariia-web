'use client';

import { useEffect, useState } from 'react';

/** True after the browser is idle — safe to load heavy WebGL / 3D. */
export function useIdleReady(timeoutMs = 2500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(markReady, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(markReady, Math.min(timeoutMs, 1500));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [timeoutMs]);

  return ready;
}
