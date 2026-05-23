'use client';

import dynamic from 'next/dynamic';
import type { UseCasesSectionProps } from './use-cases-section';
import type { SecuritySectionProps } from './security-section';
import type { FAQSectionProps } from './faqsection';

const VideoSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.VideoSection })),
  { loading: () => null },
);
const ContentSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.ContentSection })),
  { loading: () => null },
);
const UseCasesSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.UseCasesSection })),
  { loading: () => null },
);
const SecuritySection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.SecuritySection })),
  { loading: () => null },
);
const FAQSection = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.FAQSection })),
  { loading: () => null },
);
const NewsletterFooter = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.NewsletterFooter })),
  { loading: () => null },
);

interface HomeBelowFoldProps {
  useCasesProps: UseCasesSectionProps | null;
  securityProps: SecuritySectionProps | null;
  faqProps: FAQSectionProps | null;
}

/** Below-fold sections — code-split via dynamic(); always mounted so scroll/IO stay reliable on iOS. */
export function HomeBelowFold({ useCasesProps, securityProps, faqProps }: HomeBelowFoldProps) {
  return (
    <>
      <VideoSection />
      <ContentSection />
      {useCasesProps && <UseCasesSection {...useCasesProps} />}
      {securityProps && <SecuritySection {...securityProps} />}
      {faqProps && <FAQSection {...faqProps} />}
      <NewsletterFooter />
    </>
  );
}
