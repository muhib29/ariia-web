'use client';

import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from '../animations/FadeInWhenInView';

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
}

/** Default feature cards matching the design (18 items); spanTwo = card spans 2 columns on lg. */
const STATIC_FEATURE_CARDS: (FeatureCard & { spanTwo?: boolean })[] = [
  {
    id: '1',
    title: '24/7 Call Answering',
    description:
      'Aria automates call answering for any size business, handling FAQs, qualifying leads, booking appointments, and more, all with a human-like voice.',
  },
  {
    id: '2',
    title: 'Concurrent Calls',
    description:
      'Aria can handle hundreds of calls simultaneously, ensuring no customer is left waiting, even during peak hours.',
  },
  {
    id: '3',
    title: 'Voice Orders',
    description:
      'Takes phone orders instantly with high accuracy, including pickup and delivery orders, capturing all details and sending them through the system to reduce errors and improve customer satisfaction.',
  },
  {
    id: '4',
    title: 'Real-Time Intelligence & Performance Analytics',
    description:
      'Provides an intuitive live dashboard with real-time (current day) metrics and historical insights, including call volume and interactions. Businesses can track appointments, reservations, orders, and past AI calls with transcriptions for continuous improvement.',
  },
  {
    id: '5',
    title: 'Multilingual Support',
    description:
      'Communicates in multiple languages, assisting businesses in overcoming language barriers and effectively serving a diverse customer base.',
  },
  {
    id: '6',
    title: 'Customer Memory',
    description:
      'Remembers past interactions—including orders, dietary preferences, booked services, and treatments—to provide personalized, seamless, and human-like experiences by continuing the conversation where it left off.',
  },
  {
    id: '7',
    title: 'Reservation Management',
    description:
      'Books and manages reservations instantly, allowing customers to secure, modify, or cancel a table without speaking to a human.',
  },
  {
    id: '8',
    title: 'Secure Phone Payments',
    description:
      "Processes payments securely and efficiently over the phone using Stripe's PCI-compliant system, with no staff needed.",
  },
  {
    id: '9',
    title: 'Voice Cloning & Voice Library',
    description:
      "Delivers human-like AI voices for realistic conversations, with options to choose from a curated library of tones, accents, and languages, or clone a voice to match a brand's identity.",
    spanTwo: true,
  },
  {
    id: '10',
    title: 'Smart SMS Messaging',
    description:
      'Automatically sends SMS reminders, confirmations, order-ready alerts, follow-ups to reschedule missed appointments or reservations, and personalized marketing messages, keeping customers informed, engaged, reducing no-shows, and more likely to return.',
  },
  {
    id: '11',
    title: 'Appointment Scheduling',
    description:
      'Handles booking, canceling, and rescheduling in real time, ensuring a seamless and efficient experience for customers without the need for human staff intervention.',
  },
  {
    id: '12',
    title: 'Menu Sync and POS integration',
    description:
      'Syncs your menu through POS integration or direct setup. Menu updates are reflected in real time, allowing the AI to take accurate phone orders and send them straight to the POS automatically with no manual entry required.',
    spanTwo: true,
  },
  {
    id: '13',
    title: 'Call Summary',
    description:
      'Provides a concise summary after each interaction, including key points, customer questions, and follow-up actions.',
  },
  {
    id: '14',
    title: 'Call Recording',
    description:
      'Record and store all customer calls for quality assurance, training, and compliance purposes, with easy access and playback.',
  },
  {
    id: '15',
    title: 'Follow-Up Calls',
    description:
      'Automate follow-up calls for missed appointments, abandoned carts, or new leads, nurturing customer relationships.',
  },
  {
    id: '16',
    title: 'Knowledge Base',
    description:
      'Integrate with your knowledge base to provide instant answers to customer questions, improving first-call resolution.',
  },
  {
    id: '17',
    title: 'Transcription',
    description:
      'Automatically transcribe all customer calls, making it easy to search, analyze, and extract valuable insights.',
  },
  {
    id: '18',
    title: 'Human Call Transfer',
    description:
      'Seamlessly transfer calls to a human agent when needed, ensuring a smooth customer experience.',
  },
];

type GlowCardProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function GlowCard({ className, style, children }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardMousePosition, setCardMousePosition] = useState({ x: 0, y: 0 });
  const [isCardHovering, setIsCardHovering] = useState(false);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden group isolation-isolate ${className ?? ''}`}
      style={style}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setIsCardHovering(true)}
      onMouseLeave={() => setIsCardHovering(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden md:block rounded-[inherit]"
        style={{ WebkitBackdropFilter: 'none' }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isCardHovering ? 0.45 : 0,
            background: `linear-gradient(90deg, #35B5F5 0%, #6779FF 100%)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
            WebkitMaskImage: `radial-gradient(circle 200px at ${cardMousePosition.x}px ${cardMousePosition.y}px, black 0%, transparent 80%)`,
            maskImage: `radial-gradient(circle 200px at ${cardMousePosition.x}px ${cardMousePosition.y}px, black 0%, transparent 80%)`,
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function FeaturesSection() {
  const cardsAreaRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-screen flex flex-col justify-start bg-white overflow-hidden pt-16 md:pt-[120px] pb-15 md:pb-20">
      {/* Top Badge & Heading */}
      <FadeInWhenInView className="relative z-10 w-[95%] mx-auto">
        <div className="text-center  pt-10 md:pt-0 mb-[5px] md:mb-6">
          <SectionHeader
            tag="Features"
            title="Explore a Suite of Capabilities Built to Optimize"
            gradientTitle=" Operations and Fuel Scalable Growth"
          />
        </div>
      </FadeInWhenInView>
      {/* Cards Grid — each card has its own div for custom layouts */}
      <div
        ref={cardsAreaRef}
        className="w-full max-w-[1156px] mx-auto flex flex-col gap-3 md:gap-4 relative z-10 px-4 xl:px-0"
      >
        {/* Glow is intentionally scoped to the cards area only (excludes header/title region) */}
        {/* Section-level glow effect disabled - hover effects only show on individual cards */}
        {/* 24/7 Call Answering & Concurrent Calls Grid */}
        <div className="flex flex-col xl:flex-row w-full gap-3 md:gap-4">
          {/* 1. 24/7 Call Answering */}
          <FadeInWhenInView className="relative w-full xl:w-[714px] h-auto xl:h-[189px]" delay={0}>
            <GlowCard className="relative flex flex-col w-full h-full bg-gradient-to-r from-[white/90] from-[10%] via-[#bfe6ff47] via-[50%] to-[white/90] to-[90%] rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden z-10">
              {/* 24-7-bg SVG background - 45% width on right side */}
              <div className="absolute -right-13 top-0 bottom-0 pointer-events-none w-[45%] bg-no-repeat bg-[length:100%_100%] bg-right-center bg-[url('/images/24-7-bg.svg')]" />
              {/* Content layer - full width */}
              <div className="relative z-10 p-6 pt-4 md:p-8 md:pt-4 w-full">
                <h3 className="font-semibold text-gray-900 mb-2 text-[24px] leading-[120%] tracking-[-0.72px]">
                  24/7 Call Answering
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Operates 24/7, including after hours, to automatically answer calls and respond to
                  customer questions. It books appointments, reservations, and pre-orders for
                  products, services, or food, allowing staff to view orders that require
                  preparation on the dashboard and begin work once business opens. All interactions
                  are fully managed by the AI and securely logged for review.
                </p>
              </div>
            </GlowCard>
          </FadeInWhenInView>

          {/* 2. Concurrent Calls */}
          <FadeInWhenInView
            className="w-full xl:w-[426px] h-auto xl:h-[189px] relative xl:mt-0"
            delay={100}
          >
            <GlowCard className="flex flex-col w-full h-full bg-[linear-gradient(90deg,rgba(103,121,255,0.1)_0%,rgba(78,151,250,0.1)_25%,rgba(53,181,245,0.1)_50%,rgba(46,255,234,0.1)_100%)] rounded-[20px] p-6 md:p-8 md:pt-4 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden">
              <div className="relative z-10 flex h-full w-full flex-row items-center sm:items-start gap-0 sm:gap-3">
                <div className="w-full sm:w-[62%] ">
                  <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px] mb-2">
                    Concurrent Calls
                  </h3>
                  <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px] w-[190px] sm:w-full">
                    Handles multiple calls simultaneously, giving every customer immediate attention
                    and preventing missed calls or extended wait times.
                  </p>
                </div>
                <div className="flex sm:w-[38%] w-full h-full items-end justify-end">
                  <Image
                    src="/images/features/call-icons.svg"
                    alt="Concurrent Calls"
                    width={140}
                    height={140}
                    className="h-auto w-full max-w-[140px] object-contain"
                  />
                </div>
              </div>
            </GlowCard>
          </FadeInWhenInView>
        </div>

        {/* Voice Orders & Real-Time Intelligence & Performance Analytics Grid */}
        <div className="flex flex-col xl:flex-row w-full gap-3 md:gap-4 xl:mt-0">
          {/* 3. Voice Orders */}
          <FadeInWhenInView delay={0}>
            <GlowCard className="relative flex flex-col w-full xl:w-[393px] h-auto xl:h-[469px] xl:min-w-[393px] bg-gradient-to-t from-[#3b6cff37] from-[30%] to-[white/90] to-[90%] md:bg-[linear-gradient(90deg,rgba(59,107,255,0.1)_0%,rgba(46,150,255,0.1)_100%)] rounded-[20px] px-6 py-6 md:px-[16px] md:py-[8px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden">
              <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[117px] xl:ml-[8px] mt-[8px] gap-[8px]">
                <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                  Voice Orders
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Takes phone orders instantly with high accuracy, including pickup and delivery
                  orders, capturing all details and sending them through the system to reduce errors
                  and improve customer satisfaction.
                </p>
              </div>
              <Image
                src="/images/features/voice-order.png"
                alt="Voice Orders"
                width={361}
                height={291}
                sizes="(max-width: 1280px) 100vw, 361px"
                className="mt-5 object-cover object-center"
              />
            </GlowCard>
          </FadeInWhenInView>

          <div className="w-full flex flex-col gap-3 md:gap-4">
            {/* 4. Real-Time Intelligence & Performance Analytics */}
            <FadeInWhenInView delay={100}>
              <GlowCard className="flex flex-col sm:flex-row items-start w-full xl:w-[747px] h-auto xl:h-[244px] bg-white/90 rounded-[20px] px-6 py-4 md:py-8 md:pt-4 md:pl-8 md:pr-3 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[46%] before:bg-[linear-gradient(90deg,rgba(243,244,246,0.85)_0%,rgba(248,249,252,0.45)_55%,rgba(255,255,255,0)_100%)]">
                <div className="flex w-full flex-col sm:flex-row sm:items-start gap-6 xl:gap-2 h-[422px] sm:h-full">
                  <div className="flex flex-col gap-2 w-full xl:w-auto">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px] pt-1">
                      Real-Time Intelligence & Performance Analytics
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px] sm:w-[327px]">
                      Provides an intuitive live dashboard with real-time (current day) metrics and
                      historical insights, including call volume and interactions. Businesses can
                      track appointments, reservations, orders, and past AI calls with
                      transcriptions for continuous improvement.
                    </p>
                  </div>
                  <div className="relative  shrink-0  xl:-mt-16">
                    <div
                      className="bg-no-repeat bg-contain bg-center
                  bg-[url('/images/features/real-time-bg.svg')] z-2 absolute  h-auto w-[400px] sm:h-[339px] sm:w-[339px]"
                    ></div>
                    <div className="pointer-events-none absolute inset-0   rounded-full bg-[radial-gradient(circle,rgba(127,86,217,0.34)_0%,rgba(127,86,217,0.18)_45%,rgba(127,86,217,0)_75%)] blur-[8px] sm:blur-[22px]" />
                    <Image
                      src="/images/features/real-time.png"
                      alt="Real-Time Intelligence & Performance Analytics"
                      width={339}
                      height={339}
                      className="relative z-10 h-auto w-[400px] sm:h-[339px] sm:w-[339px] object-contain"
                    />
                  </div>
                </div>
              </GlowCard>
            </FadeInWhenInView>

            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 ">
              {/* 5. Multilingual Support */}
              <FadeInWhenInView delay={200} className="w-full xl:w-[407px]">
                <GlowCard className="flex flex-col w-full h-[214px] xl:h-[209px] bg-gradient-to-t from-[#3b6cff26] via-[#bfd9ff55] to-[#f3f4f6] rounded-[20px] px-6 pt-4 pb-6 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
                  <div className="flex flex-row gap-4 sm:gap-1 h-full items-start text-left">
                    <div className="flex flex-col w-[184px] xl:w-[208px] h-auto xl:h-[166px] gap-[8px]">
                      <h3 className="font-semibold text-gray-900 text-[24px]  leading-[120%] tracking-[-0.72px]">
                        Multilingual Support
                      </h3>
                      <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px] ">
                        Communicates in multiple languages, assisting businesses in overcoming
                        language barriers and effectively serving a diverse customer base.
                      </p>
                    </div>
                    <Image
                      src="/images/features/multilingual.svg"
                      alt="Multilingual Support"
                      width={150}
                      height={150}
                      sizes="150px"
                      className="object-contain absolute -right-4 top-2 w-[168px] sm:w-[150px] sm:h-[150px]"
                    />
                  </div>
                </GlowCard>
              </FadeInWhenInView>

              {/* 6. Customer Memory */}
              <FadeInWhenInView delay={300} className="w-full xl:w-[324px]">
                <GlowCard className="relative overflow-hidden flex flex-col w-full h-auto xl:h-[209px] bg-gradient-to-t from-[#3b6cff26] via-[#bfd9ff55] to-[#f3f4f6] rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
                  <div className="pointer-events-none absolute -right-25 inset-x-0 bottom-3 sm:bottom-0 h-[90px] bg-[url('/images/features/customer-memory.svg')] bg-contain bg-bottom bg-no-repeat" />
                  <div className="relative z-10 p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Customer Memory
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Remembers past interactions—including orders, dietary preferences, booked
                      services, and treatments—to provide personalized, seamless, and human-like
                      experiences by continuing the conversation where it left off.
                    </p>
                  </div>
                </GlowCard>
              </FadeInWhenInView>
            </div>
          </div>
        </div>

        {/* Reservation Management, Secure Phone Payments, & Voice Cloning & Voice Library Grid */}
        <div className="flex flex-col xl:flex-row w-full gap-3 md:gap-4 xl:mt-0">
          {/* 7. Reservation Management */}
          <FadeInWhenInView delay={0}>
            <GlowCard className="relative flex shrink-0 flex-col w-full xl:w-[393px] h-auto xl:h-[380px] bg-[#F8F9FC] rounded-[20px] p-6 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-[58%] before:bg-[linear-gradient(90deg,rgba(103,121,255,0.2)_0%,rgba(78,151,250,0.2)_25%,rgba(53,181,245,0.2)_50%,rgba(46,255,234,0.1)_100%)] before:[mask-image:linear-gradient(to_top,black_0%,black_70%,transparent_100%)] before:[-webkit-mask-image:linear-gradient(to_top,black_0%,black_70%,transparent_100%)] before:z-0">
              <div className="relative z-10 flex flex-col sm:flex-row xl:flex-col gap-4 xl:gap-2">
                <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[97px] gap-[8px]">
                  <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                    Reservation Management
                  </h3>
                  <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                    Books and manages reservations instantly, allowing customers to secure, modify,
                    or cancel a table without speaking to a human.
                  </p>
                  <Image
                    src="/images/features/reservation.png"
                    alt="Reservation Management"
                    width={1500}
                    height={1500}
                    sizes="(max-width: 1280px) 100vw, 1500px"
                    className="object-contain mt-4"
                  />
                </div>
              </div>
            </GlowCard>
          </FadeInWhenInView>

          <div className="w-full flex flex-col gap-3 md:gap-4">
            {/* 8. Secure Phone Payments */}
            <FadeInWhenInView delay={100}>
              <GlowCard className="relative flex flex-col w-full xl:w-[747px] h-auto xl:h-[182px] bg-[#F8F9FC] rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
                <div
                  className="absolute top-23 left-0 w-full h-[250px]
                sm:w-[45%] sm:h-full sm:-right-10 sm:left-auto
                pointer-events-none
                bg-no-repeat bg-contain sm:bg-[length:auto_100%]
                bg-center sm:bg-right-center
                bg-[url('/images/features/secure-phone.svg')]"
                />
                <div className="relative z-10 p-6 flex flex-col xl:block">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex flex-col w-full xl:w-[296px] h-auto xl:h-[97px] gap-[8px]">
                      <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                        Secure Phone Payments
                      </h3>
                      <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                        Processes payments securely and efficiently over the phone using Stripe's
                        PCI-compliant system, with no staff needed.
                      </p>
                    </div>
                  </div>
                  <Image
                    src="/images/features/secure-payments.svg"
                    alt="Secure Phone Payments"
                    width={290}
                    height={104}
                    sizes="(max-width: 1280px) 290px, 290px"
                    className="mt-4 xl:mt-4 relative xl:absolute mx-auto xl:mx-0 xl:left-[409px] xl:top-1/2 xl:-translate-y-1/2 w-full max-w-[290px] h-auto xl:h-[104px] object-contain"
                  />
                </div>
              </GlowCard>
            </FadeInWhenInView>

            {/* 9. Voice Cloning & Voice Library */}
            <FadeInWhenInView delay={200}>
              <GlowCard className="flex flex-col w-full xl:w-[747px] h-[336px] xl:h-[182px] bg-[#F8F9FC] rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
                <div className="absolute right-0 xl:-right-8 top-0 bottom-0 pointer-events-none w-[45%] bg-no-repeat bg-[length:auto_100%] bg-right-center sm:bg-[linear-gradient(90deg,rgba(59,107,255,0)_0%,rgba(78,151,250,0.14)_48%,rgba(53,181,245,0.18)_100%)]" />
                <div className="flex flex-col sm:flex-row gap-0 relative z-10 w-full h-[316px] sm:h-full">
                  <div className="flex flex-col w-full xl:w-[600px] h-auto xl:h-[97px] gap-[8px] p-6 ">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Voice Cloning & Voice Library
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Delivers human-like AI voices for realistic conversations, with options to
                      choose from a curated library of tones, accents, and languages, or clone a
                      voice to match a brand's identity.
                    </p>
                  </div>
                  <div className="w-full sm:max-w-[310px] px-0 sm:px-0 self-center overflow-hidden   sm:h-[180px] xl:h-[270px] flex items-end justify-center">
                    <Image
                      src="/images/features/voice-cloning.svg"
                      alt="Voice Cloning & Voice Library"
                      width={350}
                      height={300}
                      sizes="(max-width: 1280px) 310px, 350px"
                      className="hidden md:block h-full w-full object-cover sm:object-contain object-center sm:object-top sm:-translate-y-2 mx-auto"
                    />
                    <Image
                      src="/images/features/voice-cloning-mobile.svg"
                      alt="Voice Cloning & Voice Library"
                      width={350}
                      height={300}
                      sizes="(max-width: 1280px) 310px, 350px"
                      className="absolute top-14 h-[280px] block md:hidden  w-full object-cover   object-center mx-auto -z-20"
                    />
                  </div>
                </div>
              </GlowCard>
            </FadeInWhenInView>
          </div>
        </div>

        {/* Appointment Scheduling, Smart SMS Messaging, & Menu Sync and POS integration Grid */}
        <div className="flex flex-col xl:flex-row-reverse w-full gap-3 md:gap-4 xl:mt-0">
          {/* 10. Appointment Scheduling */}
          <FadeInWhenInView delay={0}>
            <GlowCard className="flex shrink-0 flex-col w-full xl:w-[393px] h-auto xl:h-[429px] bg-gradient-to-t from-[#bfd9ff8e] from-[30%] to-[white/90] to-[70%] rounded-[20px] p-6 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
              <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[117px] gap-[8px]">
                <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                  Appointment Scheduling
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Handles booking, canceling, and rescheduling in real time, ensuring a seamless and
                  efficient experience for customers without the need for human staff intervention.
                </p>
              </div>
              <div className="mt-6 sm:mt-4 flex w-full items-center justify-center">
                <Image
                  src="/images/features/appointment-scheduling.png"
                  alt="Appointment Scheduling"
                  width={361}
                  height={259}
                  className="h-[259px] w-[361px] rounded-[8px] object-contain"
                />
              </div>
            </GlowCard>
          </FadeInWhenInView>

          <div className="w-full flex flex-col gap-3 md:gap-4">
            {/* 11. Smart SMS Messaging */}
            <FadeInWhenInView delay={100}>
              <GlowCard className="flex flex-col w-full xl:w-[747px] h-auto xl:h-[207px] bg-[#F8F9FC] rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:z-0 before:w-[46%] before:bg-[url('/images/features/sms-right.svg')] before:bg-no-repeat before:bg-right before:bg-[length:auto_100%] before:[mask-image:linear-gradient(to_right,transparent_0%,black_38%,black_100%)] before:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_38%,black_100%)]">
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between relative z-10 w-full h-[400px] sm:h-full xl:items-start">
                  <div className="flex flex-col w-full xl:w-[450px] h-auto xl:h-[97px] gap-[8px] px-6 pt-6  sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Smart SMS Messaging
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Automatically sends SMS reminders, confirmations, order-ready alerts,
                      follow-ups to reschedule missed appointments or reservations, and personalized
                      marketing messages, keeping customers informed, engaged, reducing no-shows,
                      and more likely to return.
                    </p>
                  </div>
                  <Image
                    src="/images/features/sms-messaging.svg"
                    alt="Smart SMS Messaging"
                    width={224}
                    height={220}
                    sizes="(max-width: 1280px) 280px, 224px"
                    className="mt-2 sm:mt-4 object-contain w-full max-w-[340px] h-[240px] px-6 sm:px-0 self-center sm:self-center sm:ml-auto sm:max-w-[280px] relative top-2 sm:h-auto md:mt-0 md:absolute md:right-4 md:top-28 md:-translate-y-1/2 md:translate-x-1.5"
                  />
                </div>
              </GlowCard>
            </FadeInWhenInView>

            {/* 12. Menu Sync and POS integration */}
            <FadeInWhenInView delay={200}>
              <GlowCard className="flex flex-col sm:flex-row w-full xl:w-[747px] h-auto xl:h-[207px] items-start bg-[linear-gradient(94.08deg,rgba(46,255,234,0.1)_-39.47%,rgba(53,181,245,0.1)_28.34%,rgba(78,151,250,0.1)_62.25%,rgba(103,121,255,0.1)_96.15%)] rounded-[20px] p-6 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
                <div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-6 xl:gap-20">
                  <div className="flex flex-col w-full xl:w-[400px] h-auto xl:h-[97px] gap-[8px]">
                    <h3 className="sm:font-semibold text-gray-900  text-[20px] font-bold sm:text-[24px] leading-[120%] tracking-[-0.72px]">
                      Menu Sync and POS integration
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Syncs your menu through POS integration or direct setup. Menu updates are
                      reflected in real time, allowing the AI to take accurate phone orders and send
                      them straight to the POS automatically with no manual entry required.
                    </p>
                  </div>
                  <Image
                    src="/images/features/menue-sync.png"
                    alt="Menu Sync and POS integration"
                    width={224}
                    height={156}
                    sizes="(max-width: 1280px) 224px, 224px"
                    className="mx-auto sm:ml-auto sm:mr-0 h-auto sm:h-[156px] w-[300px] sm:w-[224px] shrink-0 object-contain"
                  />
                </div>
              </GlowCard>
            </FadeInWhenInView>
          </div>
        </div>

        {/* Call Summary, Call Recording, & Follow-Up Calls Grid */}
        <div className="flex flex-col xl:flex-row w-full gap-3 md:gap-4 xl:mt-0">
          {/* 13. Call Summary */}
          <FadeInWhenInView delay={0}>
            <GlowCard className="flex flex-col w-full xl:w-[393px] h-auto xl:h-[392px] xl:min-w-[393px] bg-gradient-to-tr from-[#3b6cff37] from-[30%] to-[#97B1FF33] to-[50%] md:bg-[linear-gradient(90deg,rgba(59,107,255,0.1)_0%,rgba(46,150,255,0.1)_100%)] rounded-[20px] px-6 py-6 md:px-[16px] md:py-[8px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden">
              <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[117px] xl:ml-[8px] mt-[8px] gap-[8px]">
                <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                  Call Summary
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Provides a concise summary after each interaction, including key points, customer
                  questions, and follow-up actions.
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-1 mt-5 sm:mt-0">
                <Image
                  src="/images/features/call-summary.png"
                  alt="Call Summary"
                  width={361}
                  height={106}
                  className="h-auto w-[361px] object-contain"
                />
                <Image
                  src="/images/features/call-summary-2.png"
                  alt="Call Summary Details"
                  width={361}
                  height={121}
                  className="h-auto w-[361px] object-contain"
                />
              </div>
            </GlowCard>
          </FadeInWhenInView>

          <div className="w-full flex flex-col gap-3 md:gap-4">
            {/* 14. Call Recording */}
            <FadeInWhenInView delay={100}>
              <GlowCard className="flex flex-col sm:flex-row w-full xl:w-[747px] h-[260px] xl:h-[178px] bg-white/90 rounded-[20px] text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[40%] before:bg-[linear-gradient(90deg,rgba(243,244,246,0.82)_0%,rgba(248,249,252,0.4)_58%,rgba(255,255,255,0)_100%)]">
                <div
                  className="absolute bottom-0 left-0 w-full h-[220px]
              sm:top-0 sm:right-0 sm:left-auto  sm:w-[45%] sm:h-full sm:bottom-0
              pointer-events-none bg-no-repeat bg-cover  sm:bg-[length:auto_100%]
              bg-bottom sm:bg-right-center
              bg-[url('/images/features/call-recording-bg-mobile.svg')] sm:bg-[url('/images/features/call-recording-bg.svg')]
              sm:[mask-image:linear-gradient(to_right,transparent,black_25%,black_100%)]
            "
                />
                <div className="relative z-10 flex flex-col sm:flex-row w-full sm:items-start gap-3 sm:gap-2">
                  <div className="flex w-full xl:w-[395px] flex-col gap-[8px] sm:py-4 p-5 sm:px-6">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Call Recording
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] sm:w-[327px] tracking-[-0.42px]">
                      Records and stores calls for quality assurance, training, and future
                      reference, providing insights to improve customer interactions.
                    </p>
                  </div>
                  <div className="w-full flex justify-center sm:justify-end  p-6">
                    <Image
                      src="/images/features/call-recording.svg"
                      alt="Call Recording"
                      width={396}
                      height={251}
                      unoptimized
                      className="h-full w-full -mt-14 sm:-mt-0  sm:max-w-[360px] xl:max-w-[370px] shrink-0 mx-auto sm:mx-0"
                    />
                  </div>
                </div>
              </GlowCard>
            </FadeInWhenInView>

            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4">
              {/* 15. Follow-Up Calls */}
              <FadeInWhenInView delay={200} className="w-full xl:w-[386px]">
                <GlowCard className="relative flex flex-col w-full h-auto xl:h-[197px] rounded-[20px] px-6 pt-4 pb-6 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden bg-[linear-gradient(180deg,#F8F9FC_0%,#F8F9FC_48%,#EDF5FF_76%,#E7F2FF_100%)]">
                  <div className="absolute bottom-0 left-1/2 h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#36C5F0_0%,#58E6FD_100%)] blur-[36px] opacity-100" />
                  <Image
                    src="/images/features/down-bg.svg"
                    alt=""
                    width={400}
                    height={180}
                    unoptimized
                    sizes="(max-width: 1280px) 100vw, 400px"
                    className="absolute top-23 bottom-0 left-0 w-full h-auto object-contain pointer-events-none"
                  />
                  <div className="relative flex flex-col w-full xl:w-[315px] h-auto xl:h-[117px] gap-[8px] z-10">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Follow-Up Calls
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Automatically follows up on missed appointments and reservations, re-engaging
                      customers, collecting feedback, and offering services to improve retention.
                    </p>
                  </div>
                </GlowCard>
              </FadeInWhenInView>

              {/* 16. Knowledge Base */}
              <FadeInWhenInView delay={300} className="w-full xl:w-[345px]">
                <GlowCard className="relative flex flex-col w-full h-auto xl:h-[197px] rounded-[20px] p-6 pt-4 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040] overflow-hidden bg-[linear-gradient(180deg,#F8F9FC_0%,#F8F9FC_48%,#EDF5FF_76%,#E7F2FF_100%)]">
                  <div className="absolute bottom-0 left-1/2 h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#36C5F0_0%,#58E6FD_100%)] blur-[36px] opacity-100" />
                  <Image
                    src="/images/features/down-bg.svg"
                    alt=""
                    width={400}
                    height={180}
                    sizes="(max-width: 1280px) 100vw, 400px"
                    className="absolute top-23 bottom-0 left-0 w-full h-auto object-contain pointer-events-none"
                  />
                  <div className="relative flex flex-col w-full xl:w-[289px] h-auto xl:h-[117px] gap-[8px] z-10">
                    <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                      Knowledge Base
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                      Allows businesses to upload PDFs and Word documents, enabling AI agents to
                      provide accurate, real-time answers on FAQs, products, policies, and services.
                    </p>
                  </div>
                </GlowCard>
              </FadeInWhenInView>
            </div>
          </div>
        </div>

        {/* Transcription & Human Call Transfer Grid */}
        <div className="flex flex-col xl:flex-row w-full gap-3 md:gap-4 xl:mt-0">
          {/* 17. Transcription */}
          <FadeInWhenInView
            className="isolate flex flex-col w-full xl:w-[616px] h-auto xl:h-[343px] shrink-0"
            delay={0}
          >
            <GlowCard className="isolate flex flex-col w-full h-full bg-[linear-gradient(90deg,#EEF5FF_0%,#E6F2FF_100%)] rounded-[20px] p-6 md:p-8 text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
              <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[77px] gap-[8px]">
                <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                  Transcription
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Transcribes customer conversations accurately, capturing key details for easy
                  review and analysis.
                </p>
              </div>
              <div className="mt-4 w-full flex-1 flex items-end justify-center overflow-hidden">
                <Image
                  src="/images/features/transcription.png"
                  alt="Transcription"
                  width={568}
                  height={200}
                  className="w-full h-auto object-contain"
                />
              </div>
            </GlowCard>
          </FadeInWhenInView>

          {/* 18. Human Call Transfer */}
          <FadeInWhenInView
            className="flex flex-col w-full xl:w-[524px] h-[270px] xl:h-[343px] shrink-0"
            delay={100}
          >
            <GlowCard className="flex flex-col w-full h-full bg-[linear-gradient(90deg,rgba(59,107,255,0.1)_0%,rgba(46,150,255,0.1)_100%)] rounded-[20px]  text-left border-[1px] border-gray-200 shadow-[0px_3px_4px_0px_#00000040]">
              <div className="flex flex-col w-full xl:w-[345px] h-auto xl:h-[77px] gap-[8px] p-6 md:p-8 mb-4 xl:mb-5">
                <h3 className="font-semibold text-gray-900 text-[24px] leading-[120%] tracking-[-0.72px]">
                  Human Call Transfer
                </h3>
                <p className="text-gray-600 text-[14px] leading-[140%] tracking-[-0.42px]">
                  Seamlessly transfers calls from AI agents to human staff, ensuring complex
                  inquiries are handled effectively.
                </p>
              </div>
              <div className="absolute top-12 sm:top-20 mt-4 w-full flex-1 flex items-end justify-center overflow-hidden">
                <Image
                  src="/images/features/last-card.svg"
                  alt="Human Call Transfer"
                  width={176}
                  height={200}
                  className="w-full h-[150%] max-h-[220px] object-cover"
                />
              </div>
            </GlowCard>
          </FadeInWhenInView>
        </div>
      </div>

      {/* Background — fades at top/bottom */}
      <div className="absolute inset-0 z-[0] pointer-events-none section-bg-fade overflow-hidden">
        {/* Top-left bluish shadow */}
        <div className="absolute w-[520px] h-[520px] -top-40 -left-62 rounded-full blur-[80px] md:blur-[150px] bg-gradient-to-br from-[#3B6BFF] via-[#4E97FA] to-[#BFD9FF] opacity-40 md:opacity-70" />

        {/* Bottom-left shadow near Transcription Card (matched to global light-blue page tone) */}
        <div className="absolute w-[520px] h-[520px] -bottom-20 -left-40 rounded-full blur-[60px] md:blur-[150px] bg-gradient-to-br from-[#3B6BFF] via-[#4E97FA] to-[#BFD9FF] opacity-25 md:opacity-45" />

        {/* <div className="absolute w-[600px] h-[600px] bottom-[-200px] right-[5%] rounded-full blur-[160px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-70" />
        <div className="absolute w-[700px] h-[700px] top-[30%] left-[50%] -translate-x-1/2 rounded-full blur-[140px] bg-gradient-to-br from-[#B5D5FF] to-[#D7EBFF] opacity-70" /> */}
      </div>
    </section>
  );
}
