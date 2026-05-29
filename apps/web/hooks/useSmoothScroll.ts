'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
// import { lenisScrollTo } from '@/lib/lenis';

export default function useSmoothScroll() {
  const router = useRouter();
  const currentPathname = usePathname();

  const scrollTo = useCallback(
    (
      href: string,
      options?: {
        hash?: string;
        offset?: number;
      },
    ) => {
      const { hash: optionHash, offset = 0 } = options || {};

      let targetPathname: string;
      let targetHash = '';

      if (optionHash) {
        targetPathname = href || '/';
        targetHash = optionHash;
      } else if (href.includes('#')) {
        const [path, hashPart] = href.split('#');
        targetPathname = path || '/';
        targetHash = hashPart;
      } else if (href.startsWith('#')) {
        targetPathname = currentPathname;
        targetHash = href.slice(1);
      } else {
        targetPathname = href;
      }

      const normalizedCurrent = currentPathname.replace(/\/$/, '') || '/';
      const normalizedTarget = targetPathname.replace(/\/$/, '') || '/';

      const isSamePage = normalizedCurrent === normalizedTarget;

      if (targetHash) {
        if (isSamePage) {
          const element = document.getElementById(targetHash);

          if (element) {
            // lenisScrollTo(element, offset);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn(`Element #${targetHash} not found on same page`);
          }
        } else {
          const fullHref = targetHash ? `${targetPathname}#${targetHash}` : targetPathname;
          router.push(fullHref, { scroll: false });
          // Scrolling is handled centrally (after route navigation) by HashScrollManager.
          // This avoids race conditions with route transitions and prevents scroll
          // logic from fighting with LenisProvider's route scroll behavior.
        }
      } else {
        // router.push(href, { scroll: false });
        // window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        router.push(href); // let Next.js handle scroll naturally

      }
    },
    [router, currentPathname],
  );

  return { scrollTo };
}

