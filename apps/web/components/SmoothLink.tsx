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

  const isHashLink = href.includes('#');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHashLink) return; // ← let native Next.js Link handle normal navigation

    e.preventDefault();
    scrollTo(href, { offset });
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}