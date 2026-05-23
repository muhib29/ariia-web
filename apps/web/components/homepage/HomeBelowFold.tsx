'use client';

import {
  ContentSection,
  FAQSection,
  NewsletterFooter,
  SecuritySection,
  UseCasesSection,
  VideoSection,
} from '@/components/homepage';
import type { FAQSectionProps } from './faqsection';
import type { SecuritySectionProps } from './security-section';
import type { UseCasesSectionProps } from './use-cases-section';

interface HomeBelowFoldProps {
  useCasesProps: UseCasesSectionProps | null;
  securityProps: SecuritySectionProps | null;
  faqProps: FAQSectionProps | null;
}

/** All below-fold sections in one client chunk — avoids staggered empty loads on mobile scroll. */
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
