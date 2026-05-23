'use client';

import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { GradientHeader } from './GradientHeader';
import { FadeInWhenInView } from '@/components/animations/FadeInWhenInView';
import { useIsMobileResolved } from '@/hooks/useClientMediaQuery';
import { useIdleReady } from '@/hooks/useIdleReady';
import dynamic from 'next/dynamic';

const SplineScene = dynamic(() => import('../SplineScene'), { ssr: false });
import { SPLINE_SCENES } from '@/config/spline-scenes';
import { HeroLogo } from '../icons/HeroLogo';

export interface HeroSectionProps {
  leftContent?: {
    title: string;
    typewriterText: string[];
    description: string;
    cta?: { ctaText: string; httpsUrl?: string; internalUrl?: string } | null;
  };
  rightContent?: {
    title: string;
    listOfWork: string[];
    image?: string | null;
    cta?: { ctaText: string; httpsUrl?: string; internalUrl?: string } | null;
  };
}

export { FadeInWhenInView };

function SmoothTypewriter({
  words,
  renderCursor = true,
  enabled = true,
}: {
  words: string[];
  renderCursor?: boolean;
  enabled?: boolean;
}) {
  const safeWords =
    words && words.length > 0 ? words : ['AI Agents', 'Smart Assistants', 'Digital Co-Pilots'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const currentWord = safeWords[wordIndex % safeWords.length];
    const typingSpeed = isDeleting ? 35 : 55;
    const pauseAfterTyping = 1200;

    let timeoutId: number;

    if (!isDeleting && displayText === currentWord) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), pauseAfterTyping);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
    } else {
      timeoutId = window.setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1),
        );
      }, typingSpeed);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [displayText, isDeleting, enabled, safeWords, wordIndex]);

  if (!enabled) {
    return <span>{safeWords[0]}</span>;
  }

  return (
    <>
      <span>{displayText}</span>
      {renderCursor && (
        <span
          className="typewriter-cursor ml-0.5 inline-block min-w-[0.35em] w-[10px] animate-pulse align-baseline"
          aria-hidden
        >
          _
        </span>
      )}
    </>
  );
}

export function HeroSection({ leftContent, rightContent }: HeroSectionProps) {
  const isMobile = useIsMobileResolved();
  const interactionsReady = useIdleReady(1800);
  const heroDescription =
    leftContent?.description ||
    'Autonomous, personalized, and intelligent—bringing powerful enterprise-grade AI to businesses of every size.';
  const [selectedBusiness, setSelectedBusiness] = useState(rightContent?.listOfWork?.[0] || '');
  const [isCalling, setIsCalling] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [pathData, setPathData] = useState<string | null>(null);
  const showConnector = Boolean(rightContent?.listOfWork?.length);
  const typewriterWords =
    leftContent?.typewriterText?.length
      ? leftContent.typewriterText
      : ['AI Agents', 'Smart Assistants', 'Digital Co-Pilots'];

  const updatePath = useCallback(() => {
    if (!showConnector) {
      setPathData(null);
      return;
    }

    const selectedRef = itemRefs.current[selectedBusiness];
    const orb = orbRef.current;
    const container = containerRef.current;

    if (!selectedRef || !orb || !container) return;

    const itemRect = selectedRef.getBoundingClientRect();
    const orbRect = orb.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const itemCenterX = itemRect.left + itemRect.width / 2 - containerRect.left;
    const orbCenterX = orbRect.left + orbRect.width / 2 - containerRect.left;
    const itemIsLeftOfOrb = itemCenterX <= orbCenterX;

    const itemAnchorX = itemIsLeftOfOrb
      ? itemRect.right - containerRect.left
      : itemRect.left - containerRect.left;
    const orbAnchorX = itemIsLeftOfOrb
      ? orbRect.left - containerRect.left
      : orbRect.right - containerRect.left;

    // Keep a tiny inset from anchors so the connector visually touches both ends.
    const itemOffset = isMobile ? 3 : 5;
    const orbOffset = isMobile ? 1 : 2;
    const startX = itemAnchorX + (itemIsLeftOfOrb ? itemOffset : -itemOffset);
    const endX = orbAnchorX + (itemIsLeftOfOrb ? -orbOffset : orbOffset);

    const direction = Math.sign(endX - startX) || 1;
    const curvePull = Math.max(36, Math.min(110, Math.abs(endX - startX) * 0.4));
    const controlX1 = startX + direction * curvePull;
    const controlX2 = endX - direction * curvePull;

    const startY = itemRect.top + itemRect.height / 2 - containerRect.top;
    const endY = orbRect.top + orbRect.height / 2 - containerRect.top;

    const path = `M ${startX},${startY} C ${controlX1},${startY} ${controlX2},${endY} ${endX},${endY}`;
    setPathData(path);
  }, [isMobile, selectedBusiness, showConnector]);

  const schedulePathUpdate = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => updatePath());
    });
  }, [updatePath]);

  useEffect(() => {
    if (!showConnector || !interactionsReady) {
      if (!showConnector) setIsAnimationComplete(true);
      return;
    }

    const connectorDelay = isMobile ? 200 : 400;
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
      schedulePathUpdate();
    }, connectorDelay);
    return () => clearTimeout(timer);
  }, [interactionsReady, isMobile, schedulePathUpdate, showConnector]);

  useLayoutEffect(() => {
    if (!interactionsReady || !isAnimationComplete || !showConnector) return;
    const resizeObserver = new ResizeObserver(() => schedulePathUpdate());
    const container = containerRef.current;
    const orb = orbRef.current;
    const selectedRef = itemRefs.current[selectedBusiness];

    if (container) resizeObserver.observe(container);
    if (orb) resizeObserver.observe(orb);
    if (selectedRef) resizeObserver.observe(selectedRef);

    schedulePathUpdate();

    window.addEventListener('resize', schedulePathUpdate);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', schedulePathUpdate);
    };
  }, [interactionsReady, selectedBusiness, isMobile, isAnimationComplete, schedulePathUpdate, showConnector]);

  return (
    <section className="relative flex flex-col justify-center bg-white overflow-hidden min-h-[760px] md:min-h-[780px] lg:h-[860px] lg:min-h-[860px] lg:max-h-[860px] 2xl:h-[900px] 2xl:min-h-[900px] 2xl:max-h-[900px] pt-20 xl:pt-10 pb-6 md:pb-8 lg:pb-0 hero-orb-breakpoint-1860">
      {/* Decorative elements */}
      <div className="absolute inset-0 h-full w-full vertical-lines" />

      <div
        className="absolute top-[57%] lg:top-[50%] left-1/2 w-[min(690px,100vw)] aspect-square -translate-x-1/2 -translate-y-1/2 scale-95 pointer-events-none hidden md:block"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full opacity-50 bg-[radial-gradient(circle_at_50%_50%,rgba(103,121,255,0.4)_0%,rgba(53,181,245,0.12)_50%,transparent_72%)]" />
      </div>
      <div
        className="absolute top-[26%] left-1/2 w-[min(390px,95vw)] aspect-square -translate-x-1/2 -translate-y-1/2 scale-105 pointer-events-none md:hidden"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full opacity-45 bg-[radial-gradient(circle_at_50%_50%,rgba(103,121,255,0.35)_0%,rgba(46,255,234,0.1)_55%,transparent_70%)]" />
      </div>

      <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none">
        <div
          className="absolute block bottom-[-80px] right-[-100px] w-[300px] h-[260px] rounded-full blur-3xl opacity-30 bg-[linear-gradient(135deg,_#6779FF_0%,_#4E97FA_50%,_#35B5F5_100%)] md:hidden"
        />
        <div
          className="absolute block top-[400px] left-[80px] w-2xs h-28 rounded-full blur-3xl opacity-45 bg-gradient-to-r from-[#4E97FA] to-[#2EFFEA] md:hidden"
        />
        <div
          className="absolute md:hidden block -bottom-[10px] -left-[100px] w-[740px] h-[270px] rounded-full blur-3xl opacity-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA]"
        />
        <div
          className="absolute hidden md:block bottom-[-10px] left-[-100px] w-[380px] h-[420px] rounded-full blur-3xl opacity-15 bg-[linear-gradient(135deg,_#6779FF_0%,_#4E97FA_50%,_#35B5F5_100%)]"
        />
        <div
          className="absolute hidden md:block bottom-[10px] left-[100px] w-[740px] h-[270px] rounded-full blur-3xl opacity-[28%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA]"
        />
        <div
          className="absolute hidden md:block bottom-[50px] right-[525px] w-[380px] h-[240px] rounded-full blur-3xl opacity-[28%] bg-gradient-to-r from-[#7b9cfd] to-[#7abcff]"
        />
        <div
          className="absolute hidden md:block bottom-[50px] right-[120px] w-[532px] h-[240px] rounded-full blur-3xl opacity-[28%] bg-gradient-to-r from-[#678dff] to-[#2E96FF]"
        />
      </div>

      <div className="relative max-w-[80rem] 2xl:max-w-[83rem] mx-auto px-6 md:px-12 z-10 -translate-y-2 md:-translate-y-10 lg:-translate-y-12 xl:-translate-y-14 2xl:-translate-y-16">
        <div className="grid lg:grid-cols-2 gap-5 md:gap-12 items-center pt-0">
          {/* Left Column */}
          <div className="flex flex-col items-center lg:items-start mt-0 md:mt-2 lg:mt-0 space-y-1 md:space-y-5">
            {/* Centered image */}
            <div className="w-full flex justify-center">
              <FadeInWhenInView
                immediate
                className="relative top-0 w-[90px] h-[110px] md:h-[150px] md:w-[143px] md:right-0 lg:right-16 xl:right-28 mb-4 md:mb-0"
              >
                <HeroLogo className="object-contain max-w-[90px]  md:pb-2 md:max-w-full" />
              </FadeInWhenInView>
            </div>

            <div className="space-y-3 text-center mx-2 md:space-y-6 md:mx-0 lg:text-left">
              <FadeInWhenInView immediate>
                <h1 className="text-gray-900 !font-bold text-[30px] leading-[42px] md:text-[52px] md:leading-[60px] tracking-tight">
                  <span className="block md:hidden">Reimagine Your</span>
                  <span className="block md:hidden">Business Operations</span>
                  <span className="block md:hidden">
                    with
                    {' '}
                    <GradientHeader className="gradient-header-no-anim gradient-header-hero-blue inline">
                      <SmoothTypewriter words={typewriterWords} enabled={interactionsReady} />
                    </GradientHeader>
                  </span>

                  {/* Desktop: keep current dynamic title */}
                  <span className="hidden md:inline">
                    {leftContent?.title || 'Reimagine Your Business Operations with'}
                  </span>
                  <span className="hidden md:mt-0 md:ml-2 md:inline-flex md:items-baseline">
                    <GradientHeader className="gradient-header-no-anim gradient-header-hero-blue">
                      <SmoothTypewriter words={typewriterWords} renderCursor={false} enabled={interactionsReady} />
                    </GradientHeader>
                    <span
                      className="typewriter-cursor ml-0.5 inline-block min-w-[0.35em] w-[10px] animate-pulse align-baseline"
                      aria-hidden
                    >
                      _
                    </span>
                  </span>
                </h1>
              </FadeInWhenInView>
              <FadeInWhenInView immediate>
                <p className="text-gray-600 max-w-lg mx-auto lg:mx-0 text-[16px] md:text-[18px] leading-[27px]">
                  {heroDescription}
                </p>
              </FadeInWhenInView>
            </div>

            {leftContent?.cta && (
              <FadeInWhenInView immediate>
                <Button
                  asChild
                  className="w-full max-w-52 h-[42px] rounded-[118px] text-base bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] text-white font-medium shadow-lg my-2 hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out transition-all md:text-[18px] md:h-[55px] md:min-w-60"
                >
                  <a
                    href={leftContent.cta.httpsUrl || leftContent.cta.internalUrl || '#'}
                    target={leftContent.cta.httpsUrl ? '_blank' : undefined}
                  >
                    {leftContent.cta.ctaText}
                  </a>
                </Button>
              </FadeInWhenInView>
            )}
          </div>

          {/* Right Column */}
          <div
            className="relative flex flex-row-reverse items-start justify-start md:justify-between gap-7 max-[424px]:gap-4 max-[374px]:gap-2 md:gap-0 min-h-[400px] md:min-h-[560px] xl:min-h-[580px] mt-0 md:mt-1 lg:gap-2 lg:flex-row lg:mt-0 overflow-hidden"
            ref={containerRef}
          >
            {/* Businesses */}
            <FadeInWhenInView
              immediate
              className="relative z-10 flex-shrink-0 w-[147px] max-[374px]:w-[130px] ml-0 md:w-[200px] lg:pt-31"
            >
              <div className="flex flex-col gap-2 md:gap-[17px]">
                {rightContent?.listOfWork?.length
                  ? rightContent.listOfWork.map((business) => (
                      <div
                        key={business}
                        onClick={() => setSelectedBusiness(business)}
                        ref={(el) => {
                          itemRefs.current[business] = el;
                        }}
                        className="cursor-pointer"
                      >
                        {selectedBusiness === business ? (
                          <div className="w-[97%] h-[48px] rounded-[60px] px-3 py-2 md:px-6 md:py-3 bg-[#101828] text-white text-sm flex items-center justify-end md:justify-center">
                            {business}
                          </div>
                        ) : (
                          <div className="w-[97%] rounded-full px-3 md:px-4 py-2 hover:bg-white/90 hover:shadow-md flex items-center justify-end md:justify-center min-h-[48px] text-sm font-medium text-gray-700">
                            {business}
                          </div>
                        )}
                      </div>
                    ))
                  : null}
              </div>
            </FadeInWhenInView>

            {/* SVG Connector */}
            {showConnector && pathData && isAnimationComplete && (
              <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-visible">
                <path d={pathData} fill="none" stroke="black" strokeWidth={2.5} />
              </svg>
            )}

            {/* Orb & Button */}
            <div
              ref={orbRef}
              className={
                ' relative z-10 w-[182px] h-[182px] max-[424px]:w-[160px] max-[424px]:h-[160px] max-[374px]:w-[134px] max-[374px]:h-[134px] ml-0 -translate-x-5 max-[424px]:translate-x-0 md:translate-x-0 md:ml-0 rounded-full md:mx-0 md:w-[255px] md:h-[255px] mt-14 md:mt-16 lg:mt-32 xl:mt-40 2xl:mt-40 lg:ml-10'
              }
            >
              <div className="relative w-full h-full rounded-full overflow-hidden md:top-5 ">
                {interactionsReady ? (
                  <SplineScene config={SPLINE_SCENES.hero} priority deferMs={500} />
                ) : (
                  <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_30%_30%,#7b9cfd_0%,#4E97FA_35%,#35B5F5_60%,#2EFFEA_100%)]" aria-hidden />
                )}

                {isCalling ? (
                  <button
                    onClick={() => setIsCalling(false)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-blue-50 hover:bg-blue-50 border border-blue-300 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
                    aria-label="Cancel Call"
                  >
                    <Image
                      src="/images/Missed Outbound.svg"
                      alt="Cancel Call"
                      width={30}
                      height={25}
                      unoptimized
                      className="object-contain"
                    />
                  </button>
                ) : (
                  rightContent?.cta && (
                    <Button
                      onClick={() => setIsCalling(true)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[40px] md:w-[150px] md:h-[48px] rounded-[60px] text-[14px] font-medium p-[3px] bg-[#a9d4ff39] backdrop-blur-md md:backdrop-blur-3xl hover:bg-[#43b9f1] in-hover:backdrop-blur-3xl"
                    >
                      <div className="w-full h-full bg-white rounded-[60px] text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
                        {rightContent.cta.ctaText}
                      </div>
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
