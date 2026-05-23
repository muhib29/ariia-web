'use client';
import Image from 'next/image';
import { DeferredImage } from '@/components/DeferredImage';
import { CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { FadeInWhenInView } from '@/components/animations/FadeInWhenInView';

export interface SecuritySectionProps {
  header?: {
    id?: string;
    title?: string;
    styledTitle?: string;
    tag?: string;
    description?: string;
  };
  imageWithContent?: Array<{
    id: string;
    image?: string | null;
    description: string;
  }>;
}

export function SecuritySection({ header, imageWithContent }: SecuritySectionProps) {
  return (
    <section
      id="security"
      className="py-10 mt-8 sm:mt-0 md:py-20 px-6 relative overflow-hidden bg-[#222d53] text-white"
    >
      <div className="absolute inset-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[0px] w-[105%] h-[270px] rounded-full blur-3xl opacity-[30%] bg-gradient-to-r from-[#667BD6] to-[#7F56D9]" />
        <div className="absolute bottom-[-150px] left-[0px] w-[105%] h-[270px] rounded-full blur-3xl opacity-[100%] bg-gradient-to-r from-[#224e78] via-[#285d91] to-[#2a628b]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <FadeInWhenInView>
          <div className="text-center mb-8 md:mb-[50px]">
            <div className="inline-flex items-center justify-center">
              <span className="px-[1.0625rem] md:px-[0.9375rem] py-[2px] md:py-[3px] rounded-full text-base md:text-[1rem] font-medium bg-[#DEF4FA] text-blue-700 mb-4 md:mb-[0.9375rem]">
                {header?.tag || 'Security & Data Protection'}
              </span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold mb-2 tracking-tight">
              {header?.title || 'Security at the Core of Our Platform'}
            </h2>
            <div className="max-w-4xl mx-auto text-white/80 text-sm md:text-base">
              <ReactMarkdown>
                {header?.description ||
                  'Safeguarding your data is central to our platform. We use enterprise-grade security architecture that meets U.S. standards, ensuring your data is protected at every stage.'}
              </ReactMarkdown>
            </div>
          </div>
        </FadeInWhenInView>

        {/* Protection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 md:gap-6 md:mb-[30px]">
          {imageWithContent?.length
            ? imageWithContent.map((card, index) => (
                <FadeInWhenInView key={card.id} delay={index * 100} className="h-full">
                  <div className="h-full bg-white text-gray-900 p-3 sm:p-6 rounded-xl shadow-md text-xs sm:text-sm text-center flex flex-col items-center">
                    <div className="relative size-12 md:size-20 mb-2 sm:mb-4 flex-shrink-0">
                      <DeferredImage
                        src={`/images/security-${index + 1}.svg`}
                        alt={`Security Icon ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 48px, 80px"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <ReactMarkdown>{card.description}</ReactMarkdown>
                    </div>
                  </div>
                </FadeInWhenInView>
              ))
            : null}
        </div>

        {/* Compliance Roadmap */}
        <FadeInWhenInView delay={200}>
          <div className="rounded-[20px] bg-white text-gray-900 p-6 md:p-8 shadow-lg backdrop-blur-md relative overflow-hidden">
            <Image
              src="/images/compliance-bg.png"
              alt="Compliance background"
              fill
              sizes="100vw"
              className="object-cover absolute inset-0 z-0 rounded-[20px]"
            />
            <div className="relative z-10">
              <h3 className="font-semibold text-center md:text-left text-2xl md:text-3xl mb-4">
                Compliance Roadmap
              </h3>
              <p className="text-sm mb-4">
                To reinforce our commitment to accountability and trust, we are:
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#0086BF] min-w-4 md:min-w-5 h-5 mt-1" />
                  <span>
                    <span className="font-medium">Advancing HIPAA compliance:</span> Strengthening
                    specific safeguards to meet HIPAA requirements for health and wellness
                    organizations by Q4 2026.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#0086BF] min-w-4 md:min-w-5 h-5 mt-1" />
                  <span>
                    <span className="font-medium">Advancing SOC 2 compliance validation:</span>{' '}
                    Pursuing third-party audit certification for SOC 2 Type II by Q4 2026.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </FadeInWhenInView>
      </div>
    </section>
  );
}
