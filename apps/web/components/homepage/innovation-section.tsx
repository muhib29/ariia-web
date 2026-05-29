'use client';
import dynamic from 'next/dynamic';
import MarkdownRenderer from '../markdown-renderer';
import { SectionHeader } from '../SectionHeader';
import { SPLINE_SCENES } from '@/config/spline-scenes';

const SplineScene = dynamic(() => import('../SplineScene'), { ssr: false });
import { FadeInWhenInView } from '@/components/animations/FadeInWhenInView';

export interface InnovationSectionProps {
  header?: {
    id?: string;
    title?: string;
    styledTitle?: string;
    tag?: string;
    description?: string;
  };
  image?: string | null;
}

/** Normalize Strapi/GraphQL content so markdown parses (e.g. lists); escaped newlines become real newlines. */
function normalizeMarkdownContent(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw !== 'string') return String(raw);
  return raw.replace(/\\n/g, '\n').trim();
}

export function InnovationSection({ header, image: _image }: InnovationSectionProps) {
  const description = normalizeMarkdownContent(header?.description);

  return (
    <section
      id="about-us"
      className="py-7 md:py-15 px-6 relative overflow-visible md:overflow-hidden bg-white mt-14 md:mt-10"
    >
      {/* Mobile-only distinct divider between sections */}
      <div className="absolute md:hidden inset-x-0 -top-8 h-px pointer-events-none z-[10] flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-80" />
      </div>

      {/* Mobile-only top purple tint outside the fade mask so it remains visible */}
      <div className="absolute md:hidden inset-x-6 top-4 h-[220px] rounded-[72px] blur-[44px] bg-gradient-to-b from-[#7F56D9]/24 via-[#635BFF]/16 to-transparent pointer-events-none z-[1]" />

      {/* Mobile-only bottom glow outside the mask so it stays visible under the card */}
      <div className="absolute md:hidden inset-x-0 -bottom-3 h-[180px] pointer-events-none z-[1]">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[94%] h-[80px] rounded-[999px] blur-[34px] bg-gradient-to-t from-[#7F56D9]/30 via-[#5E6BFF]/22 to-transparent" />
      </div>

      {/* Desktop-only bottom purple glow (outside fade mask for consistent visibility) */}
      <div className="hidden md:block absolute inset-x-0 -bottom-16 h-[260px] pointer-events-none z-[1]">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[92%] h-[150px] rounded-[999px] blur-[64px] bg-gradient-to-t from-[#7F56D9]/40 via-[#635BFF]/28 to-transparent" />
      </div>

      {/* Background Blur Gradient — fades at top/bottom */}
      <div className="absolute inset-0 section-bg-fade pointer-events-none z-0">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(180deg,rgba(103,121,255,0.1)_0%,rgba(46,255,234,0.1)_100%)]" />
        {/* Mobile top section tint for stronger purplish identity */}
        <div className="absolute md:hidden inset-x-6 top-12 h-[520px] rounded-t-[72px] rounded-b-[96px] blur-[34px] bg-gradient-to-b from-[#7F56D9]/42 via-[#5E6BFF]/30 to-transparent" />
        {/* Mobile extra top glow focused behind the card head */}
        <div className="absolute md:hidden left-1/2 top-8 -translate-x-1/2 w-[88%] h-[260px] rounded-full blur-[48px] bg-gradient-to-r from-[#7F56D9]/22 via-[#635BFF]/18 to-[#3B6BFF]/16" />
        {/* Mobile bottom section tint to mirror top identity */}
        <div className="absolute md:hidden left-1/2 -translate-x-1/2 inset-x-auto bottom-0 w-[92%] h-[240px] rounded-[999px] blur-[44px] bg-gradient-to-t from-[#7F56D9]/58 via-[#5E6BFF]/40 to-transparent" />
        {/* Mobile extended purple carry-over at end of section */}
        <div className="absolute md:hidden inset-x-2 -bottom-56 h-[320px] rounded-[999px] blur-[82px] bg-gradient-to-r from-[#7F56D9]/46 via-[#635BFF]/22 to-[#3B6BFF]/18" />
        {/* Top purplish/blue orb - matching UseCases style */}
        <div className="absolute w-[400px] h-[250px] md:w-[600px] md:h-[400px] -top-40 left-1/2 -translate-x-1/2 rounded-full blur-[100px] md:blur-[140px] bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9] opacity-80 md:opacity-40" />

        {/* Middle purplish blur (#2) */}
        <div className="absolute w-[400px] h-[400px] top-1/4 -right-20 blur-[100px] bg-[#635BFF] opacity-10 rounded-full" />
        {/* Bottom purplish blur (#3) */}
        <div className="absolute w-[400px] h-[400px] bottom-1/4 -left-20 blur-[100px] bg-[#635BFF] opacity-10 rounded-full" />
        {/* Original bottom purplish blur */}
        <div className="absolute md:hidden w-full h-[300px] -bottom-40 left-1/2 -translate-x-1/2 blur-[60px] bg-[linear-gradient(91deg,rgba(99,91,255,0.50)_35.93%,#635BFF_51.47%,#635BFF_67.02%)] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="rounded-[22px] overflow-hidden shadow-md bg-white bg-opacity-70 backdrop-blur-xl p-8">
          {/* Badge and Title */}
          <div className="text-center">
            <SectionHeader
              tag={header?.tag || 'Innovation'}
              title={header?.title || 'Innovation Starts'}
              gradientTitle={header?.styledTitle || 'with Intelligence'}
            />
          </div>

          <div className="grid md:grid-cols-2 items-center gap-8">
            {/* Left Text Content */}
            {description && (
              <FadeInWhenInView duration={0.5} yOffset={10}>
                <div className="innovation-description text-[#101828] text-sm md:text-[16px] md:leading-[normal] mb-6 whitespace-normal">
                  <MarkdownRenderer
                    components={{
                      p: ({ ...props }) => (
                        <p
                          className="text-[#101828] text-sm md:text-[16px] md:leading-[28px]"
                          {...props}
                        />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          className="list-disc list-outside pl-5 space-y-1 my-3 text-[#101828] text-sm md:text-[16px] md:leading-[28px]"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          className="list-decimal list-outside pl-5 space-y-1 my-3 text-[#101828] text-sm md:text-[16px] md:leading-[28px]"
                          {...props}
                        />
                      ),
                      li: ({ ...props }) => (
                        <li
                          className="text-[#101828] text-sm md:text-[16px] md:leading-[28px]"
                          {...props}
                        />
                      ),
                      strong: ({ ...props }) => (
                        <strong className="font-semibold text-[#101828]" {...props} />
                      ),
                      a: ({ ...props }) => (
                        <a className="text-[#3B6BFF] underline hover:no-underline" {...props} />
                      ),
                      h1: ({ ...props }) => (
                        <h1 className="text-lg font-bold mt-4 mb-2 text-[#101828]" {...props} />
                      ),
                      h2: ({ ...props }) => (
                        <h2 className="text-base font-bold mt-3 mb-2 text-[#101828]" {...props} />
                      ),
                      h3: ({ ...props }) => (
                        <h3 className="text-sm font-bold mt-2 mb-1 text-[#101828]" {...props} />
                      ),
                    }}
                  >
                    {description}
                  </MarkdownRenderer>
                </div>
              </FadeInWhenInView>
            )}

            {/* Right Image Content */}
            <FadeInWhenInView delay={100} duration={0.5} yOffset={10}>
              <div className="flex justify-center items-center relative">
                <div className="absolute w-[250px] md:w-[400px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] bg-gradient-to-r from-[#51C7F0] via-[#35B5F5] to-[#2EFFEA] opacity-45 z-0" />
                <div className="relative w-full max-w-md aspect-square z-10">
                  {/* TEMP DISABLE: SplineScene causes freeze on some devices */}
                  {/* <SplineScene config={SPLINE_SCENES.aboutUs} /> */}
                </div>
              </div>
            </FadeInWhenInView>
          </div>
        </div>
      </div>
    </section>
  );
}
