'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { FAQSectionProps } from './faqsection';
import type { SecuritySectionProps } from './security-section';
import type { UseCasesSectionProps } from './use-cases-section';

const VideoSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.VideoSection })),
);
const ContentSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.ContentSection })),
);
const UseCasesSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.UseCasesSection })),
);
const SecuritySection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.SecuritySection })),
);
const FAQSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.FAQSection })),
);
const NewsletterFooter = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.NewsletterFooter })),
);

interface HomeBelowFoldProps {
  useCasesProps: UseCasesSectionProps | null;
  securityProps: SecuritySectionProps | null;
  faqProps: FAQSectionProps | null;
}

/** Lightweight wrapper that mounts children only when near viewport. */
function Deferred({
  children,
  rootMargin = '300px',
}: {
  children: ReactNode | (() => ReactNode);
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted || !ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [mounted, rootMargin]);

  return <div ref={ref}>{mounted ? (typeof children === 'function' ? (children as any)() : children) : null}</div>;
}

/** Below-fold sections — code-split + viewport-gated so they don't mount on initial paint. */
export function HomeBelowFold({ useCasesProps, securityProps, faqProps }: HomeBelowFoldProps) {
  return (
    <>
      <Deferred>{() => <VideoSection />}</Deferred>
      <Deferred>{() => <ContentSection />}</Deferred>
      {useCasesProps && <Deferred>{() => <UseCasesSection {...useCasesProps} />}</Deferred>}
      {securityProps && <Deferred>{() => <SecuritySection {...securityProps} />}</Deferred>}
      {faqProps && <Deferred>{() => <FAQSection {...faqProps} />}</Deferred>}
      <Deferred>{() => <NewsletterFooter />}</Deferred>
    </>
  );
}
