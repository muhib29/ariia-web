'use client';

import Link from 'next/link';

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}


export function SmoothLink({ href, children, className = '' }: SmoothLinkProps) {
  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}