'use client';

import Link from 'next/link';
import useSmoothScroll from '@/hooks/useSmoothScroll';

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function SmoothLink({ href, children, offset = 0, className = '' }: SmoothLinkProps) {
  const { scrollTo } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Parse the href
    if (href.includes('#')) {
      // Important: keep the hash in the pushed URL so HashScrollManager can
      // read window.location.hash after navigation.
      scrollTo(href, { offset });
    } else if (href.startsWith('#')) {
      // Same page hash scroll
      scrollTo(href, { offset });
    } else {
      // Just navigate
      scrollTo(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
