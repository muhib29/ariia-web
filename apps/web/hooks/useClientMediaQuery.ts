'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `undefined` until mounted so callers can avoid rendering
 * breakpoint-specific heavy assets twice (SSR desktop + client mobile).
 */
export function useClientMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMobileResolved(): boolean | undefined {
  return useClientMediaQuery('(max-width: 767px)');
}
