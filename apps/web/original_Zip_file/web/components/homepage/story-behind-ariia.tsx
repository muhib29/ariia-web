// components/homepage/story-behind-ariia.tsx
'use client';

import Image from 'next/image';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { SectionHeader } from '../SectionHeader';
import LottieAnimation from '../LottieAnimation';
import { FadeInWhenInView } from './hero-section';

export interface AboutContentSection {
  id?: string;
  title?: string;
  showTitle?: boolean;
  content: string;
}

export interface AboutData {
  seo?: any;
  content?: {
    tag?: string;
    title?: string;
    styledTitle?: string;
    contentSections?: AboutContentSection | AboutContentSection[];
  };
  sideImage?: { url: string; alternativeText?: string };
  below?: {
    title?: string;
    description?: string;
    image?: { url: string; alternativeText?: string };
  };
}

export default function StoryBehindAriia({ about }: { about: AboutData }) {
  const content = about?.content || {};
  const sideImage = about?.sideImage;
  const below = about?.below;

  // Normalize to array
  const contentSectionsArray: AboutContentSection[] = React.useMemo(() => {
    if (!content?.contentSections) return [];
    return Array.isArray(content.contentSections)
      ? content.contentSections
      : [content.contentSections];
  }, [content]);

  function splitParagraphs(md: string) {
    const cleaned = (md || '').trim();
    if (!cleaned) return { para1: '', para2: '', rest: '' };

    const parts = cleaned.split(/\n\s*\n/); // blank-line split
    const para1 = parts.shift() ?? '';
    const para2 = parts.shift() ?? '';
    const rest = parts.join('\n\n');

    return { para1, para2, rest };
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff] pt-16 md:pt-20">
      {/* Background Blurs */}
      <div className="absolute inset-0 z-1">
        {/* Top-left circle highlight right above heading */}
        <div className="absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] top-[40px] left-[-40px] md:top-[30px] md:left-[-60px] rounded-full blur-[90px] bg-gradient-to-br from-[#3B6BFF] via-[#5CA8FF] to-[#B7E0FF] opacity-40 md:opacity-50" />
        <div className="absolute w-[800px] h-[800px] top-[-250px] left-[10%] rounded-full blur-[180px] bg-gradient-to-r from-[#79D8F5] to-[#E8F3FF] opacity-20" />
        <div className="absolute w-[600px] h-[600px] bottom-[-200px] right-[5%] rounded-full blur-[160px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-10" />
        <div className="absolute w-[700px] h-[700px] top-[30%] left-[50%] -translate-x-1/2 rounded-full blur-[140px] bg-gradient-to-br from-[#B5D5FF] to-[#D7EBFF] opacity-10" />
      </div>

      <Header isHomePage={false} />

      <div className="flex-1 flex flex-col items-center px-4 max-w-6xl mx-auto w-full z-2">
        {/* Title and Badge */}
        <FadeInWhenInView className="text-center pt-10">
          <SectionHeader
            tag={content.tag || 'About'}
            title={content.title || 'The Story '}
            gradientTitle={content.styledTitle || 'Behind ARIIA'}
          />
        </FadeInWhenInView>

        {/* Main Content Section */}
        <FadeInWhenInView className="w-full mx-auto mb-0 md:mb-2" delay={100}>
          {contentSectionsArray.map((section, index) => (
            <div key={section.id ?? index} className="mb-6 md:mb-8">
              {section.showTitle !== false && section.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-4">{section.title}</h2>
              )}

              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 md:mb-4"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 text-gray-700 mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                }}
              >
                {section.content}
              </ReactMarkdown>

              {/* Featured Image Full Width with Grid Background */}
              <div className="relative w-full max-w-6xl aspect-[1.4] md:aspect-video mt-6 flex items-center justify-center rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff]" />
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1200 340"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <rect x="0" y="0" width="1200" height="340" rx="32" fill="none" />
                  <g stroke="#b3d6f7" strokeWidth="1">
                    <line x1="60" y1="0" x2="60" y2="340" />
                    <line x1="120" y1="0" x2="120" y2="340" />
                    <line x1="180" y1="0" x2="180" y2="340" />
                    <line x1="240" y1="0" x2="240" y2="340" />
                    <line x1="300" y1="0" x2="300" y2="340" />
                    <line x1="360" y1="0" x2="360" y2="340" />
                    <line x1="420" y1="0" x2="420" y2="340" />
                    <line x1="480" y1="0" x2="480" y2="340" />
                    <line x1="540" y1="0" x2="540" y2="340" />
                    <line x1="600" y1="0" x2="600" y2="340" />
                    <line x1="660" y1="0" x2="660" y2="340" />
                    <line x1="720" y1="0" x2="720" y2="340" />
                    <line x1="780" y1="0" x2="780" y2="340" />
                    <line x1="840" y1="0" x2="840" y2="340" />
                    <line x1="900" y1="0" x2="900" y2="340" />
                    <line x1="960" y1="0" x2="960" y2="340" />
                    <line x1="1020" y1="0" x2="1020" y2="340" />
                    <line x1="1080" y1="0" x2="1080" y2="340" />
                    <line x1="1140" y1="0" x2="1140" y2="340" />
                    <line y1="60" x2="1200" y2="60" />
                    <line y1="120" x2="1200" y2="120" />
                    <line y1="180" x2="1200" y2="180" />
                    <line y1="240" x2="1200" y2="240" />
                    <line y1="300" x2="1200" y2="300" />
                  </g>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {sideImage?.url ? (
                    <Image
                      src={sideImage.url}
                      alt={sideImage.alternativeText || 'Story Behind ARIIA'}
                      fill
                      sizes="(max-width: 768px) 100vw, 1152px"
                      className="object-cover rounded-3xl shadow-lg min-h-[475px]"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <video
                      src="/videos/story.mov"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover rounded-3xl shadow-lg w-full h-full"
                      style={{ objectPosition: 'center' }}
                    >
                      <p className="text-white bg-black/50 p-4 rounded-xl">
                        Your browser does not support the video tag or format.
                      </p>
                    </video>
                  )}
                </div>
              </div>

              {index === 0 && sideImage?.url && (
                <Image
                  src={sideImage.url}
                  alt={sideImage.alternativeText || 'Story Behind ARIIA'}
                  width={520}
                  height={520}
                  className="object-cover rounded-3xl w-full mb-4 float-none sm:w-full sm:float-none md:w-[380px] lg:w-[430px] xl:w-[460px] md:float-right md:ml-6"
                  style={{ shapeOutside: 'inset(0 round 1.5rem)' }}
                />
              )}
            </div>
          ))}
          <div className="clear-both" />
        </FadeInWhenInView>

        {/* Below Section */}
        {below && (
          <FadeInWhenInView className="w-full mx-auto mb-4 md:mb-16" delay={200}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-4">{below.title}</h2>

            {(() => {
              const { para1, para2, rest } = splitParagraphs(below.description || '');

              const globeComponent = (isMobileForGlobe: boolean) => (
                <div
                  className={`relative w-full overflow-hidden rounded-[20px] lg:rounded-[28px] flex justify-center items-center ${
                    isMobileForGlobe
                      ? 'md:hidden w-screen max-w-none relative left-1/2 -translate-x-1/2 aspect-square my-6 rounded-none'
                      : 'hidden md:flex md:float-right md:ml-6 md:mb-6 md:w-[360px] xl:w-[400px] xl:h-[450px] mt-1'
                  }`}
                >
                  <LottieAnimation
                    src="/lottie/storyglobe.lottie"
                    loop
                    autoplay
                    playWhenInView
                    className="w-[100%] h-[100%] object-cover pointer-events-none"
                  />
                </div>
              );

              return (
                <div>
                  {/* Paragraph 1 */}
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 md:mb-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {para1}
                  </ReactMarkdown>

                  {/* Desktop Globe (Floats right starting after p1) */}
                  {globeComponent(false)}

                  {/* Paragraph 2 */}
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 md:mb-4 "
                          {...props}
                        />
                      ),
                    }}
                  >
                    {para2}
                  </ReactMarkdown>

                  {/* Mobile Globe (Centered after p2) */}
                  {globeComponent(true)}

                  {/* Remaining Content */}
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 md:mb-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {rest}
                  </ReactMarkdown>

                  <div className="clear-both" />
                </div>
              );
            })()}
          </FadeInWhenInView>
        )}
      </div>

      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
