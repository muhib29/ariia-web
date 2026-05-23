import dynamic from 'next/dynamic';
import React from 'react';
import { HomeBelowFold } from '@/components/homepage/HomeBelowFold';
import { HeroSection } from '@/components/homepage/hero-section';
import { fetchAPI } from '@/utils/api-helper';
import { homeQuery } from '@/graphql/querys';

export const revalidate = 300;

const Header = dynamic(
  () => import('@/components/homepage').then((m) => ({ default: m.Header })),
  {
    loading: () => (
      <header className="fixed top-0 left-0 z-50 w-full h-[72px] bg-white/90 backdrop-blur-sm" aria-hidden />
    ),
  },
);

export default async function Homepage() {
  const res = await fetchAPI(homeQuery);
  const home = res?.data?.home;
  // Prepare HeroSection props
  const heroSection = home?.heroSection;
  const heroProps = heroSection
    ? {
        leftContent: {
          title: heroSection.leftContent?.title || '',
          typewriterText:
            heroSection.leftContent?.typerwriteText?.text?.map((t: any) => t.text) || [],
          description: heroSection.leftContent?.Description?.[0]?.children?.[0]?.text || '',
          cta: heroSection.leftContent?.cta || null,
        },
        rightContent: {
          title: heroSection.rightContent?.Title || '',
          listOfWork: heroSection.rightContent?.listOfWork?.text?.map((t: any) => t.text) || [],
          image: heroSection.rightContent?.image?.url || null,
          cta: heroSection.rightContent?.cta?.[0] || null,
        },
      }
    : null;

  // Prepare UseCasesSection props
  const useCaseSection = home?.useCaseSection;
  const useCasesProps = useCaseSection
    ? {
        header: useCaseSection.header || {},
        audioWithContent: (useCaseSection.audioWithContent || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          name: item.name,
          description: item.description,
          image: item.image?.url || null,
          audio: item.audio?.url || null,
        })),
      }
    : null;

  // Prepare InnovationSection props
  const innovationSection = home?.innovationSection;
  const innovationProps = innovationSection
    ? {
        header: innovationSection.header || {},
        image: innovationSection.image?.url || null,
      }
    : null;

  // Prepare SecuritySection props
  const securitySection = home?.securitySection;
  const securityProps = securitySection
    ? {
        header: securitySection.header || {},
        imageWithContent: (securitySection.imageWithContent || []).map((item: any) => ({
          id: item.id,
          image: item.image?.url || null,
          description: item.description,
        })),
      }
    : null;

  // Prepare FAQSection props
  const faqSection = home?.faqSection;
  const faqProps = faqSection
    ? {
        header: faqSection.header || {},
        questions: (faqSection.questions || []).map((q: any) => ({
          id: q.id,
          title: q.title,
          content: q.content,
        })),
      }
    : null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection {...heroProps} />
      <HomeBelowFold
        useCasesProps={useCasesProps}
        securityProps={securityProps}
        faqProps={faqProps}
      />
    </div>
  );
}
