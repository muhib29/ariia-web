'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { PlayIcon } from '../icons/PlayIcon';
import { MuteIcon } from '../icons/MuteIcon';
import { SpeakerIcon } from '../icons/SpeakerIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from '@/components/animations/FadeInWhenInView';

export interface UseCasesSectionProps {
  header?: {
    id?: string;
    title?: string;
    styledTitle?: string;
    tag?: string;
    description?: string;
  };
  audioWithContent?: Array<{
    id: string;
    title: string;
    name: string;
    description: string;
    image?: string | null;
    audio?: string | null;
  }>;
}

export function UseCasesSection({ header, audioWithContent }: UseCasesSectionProps) {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const handlePlayPause = (index: number) => {
    const currentAudio = audioRefs.current[index];

    if (!currentAudio) return;

    // Pause any other playing audio
    if (currentPlayingIndex !== null && currentPlayingIndex !== index) {
      const previousAudio = audioRefs.current[currentPlayingIndex];
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }

    // Toggle current audio
    if (currentAudio.paused) {
      currentAudio.play();
      setCurrentPlayingIndex(index);
    } else {
      currentAudio.pause();
      setCurrentPlayingIndex(null);
    }
  };

  return (
    <section
      id="use-cases"
      className="py-7 md:py-15 px-6 bg-white relative overflow-visible md:overflow-hidden"
    >
      {/* Background: top orb, center orb, bottom orb — fades at section edges */}
      <div className="absolute inset-0 pointer-events-none section-bg-fade">
        {/* Top circle */}
        <div className="absolute w-[400px] h-[250px] md:w-[500px] md:h-[300px] -top-24 left-1/2 -translate-x-1/2 rounded-full blur-[100px] md:blur-[120px] bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9] opacity-25 md:opacity-30" />
        {/* Center orb */}
        <div className="absolute w-[1100px] h-[300px] md:w-[1400px] md:h-[200px] top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] md:blur-[180px] bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] opacity-35 md:opacity-40" />
        {/* Bottom circle */}
        <div className="absolute w-[400px] h-[300px] md:w-[500px] md:h-[350px] -bottom-24 left-1/2 -translate-x-1/2 rounded-full blur-[100px] md:blur-[120px] bg-gradient-to-r from-[#2E96FF] to-[#2EFFEA] opacity-25 md:opacity-30" />
        {/* Mobile: curved bottom fade (no hard straight cutoff) */}
        <div className="absolute md:hidden inset-x-3 -bottom-14 h-[220px] rounded-[999px] blur-[28px] bg-gradient-to-t from-[#EAF3FF] via-[#EEF6FF]/90 to-transparent opacity-95" />
        {/* Desktop: keep existing bottom tint */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-[420px] rounded-none bg-gradient-to-t from-[#EAF3FF] via-[#EEF6FF]/90 to-transparent opacity-95" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center">
          <SectionHeader
            tag={header?.tag || 'Use Cases'}
            title={header?.title || 'The Future of'}
            gradientTitle={header?.styledTitle || 'Business Interactions'}
            description={
              header?.description ||
              'Listen to demos showcasing how our AI agents could transform businesses across industries.'
            }
          />
        </div>

        {/* Cards */}
        <div className="relative">
          {/* Mobile-only hue behind cards (organic spread, no hard edges) */}
              <div className="absolute md:hidden inset-x-0 -top-4 -bottom-12 z-0 pointer-events-none">
                    <div className="absolute -left-12 top-10 h-[360px] w-[360px] rounded-full blur-[84px] bg-gradient-to-r from-[#3B6BFF]/18 to-[#2E96FF]/14" />
                    <div className="absolute left-1/2 top-14 -translate-x-1/2 h-[380px] w-[86%] rounded-full blur-[92px] bg-gradient-to-r from-[#3B6BFF]/12 via-[#2E96FF]/14 to-[#7F56D9]/12" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[92%] rounded-full blur-[96px] bg-gradient-to-r from-[#3B6BFF]/16 via-[#2E96FF]/18 to-[#7F56D9]/14" />
                    <div className="absolute right-[-3rem] bottom-6 h-[360px] w-[360px] rounded-full blur-[84px] opacity-70 bg-gradient-to-r from-[#3B6BFF]/16 to-[#2E96FF]/12" />
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 relative z-10">
            {audioWithContent?.length
              ? audioWithContent.map((card, index) => (
                <FadeInWhenInView key={card.id} delay={index * 120} className="h-full">
                  <div className="h-full flex flex-col bg-white p-6 rounded-[22px] shadow-md text-left">
                    {/* Gradient Card Container */}
                    <div className="flex-shrink-0 rounded-[22px] p-[25px] pb-0 mb-4 bg-gradient-to-br from-[#667BD666] to-[#7F56D966]">
                      {/* Black iPhone Frame */}
                      <div className="bg-black rounded-t-[48px] px-4 pt-4 pb-0 shadow-inner relative overflow-hidden">
                        {/* Phone Screen */}
                        <div className="bg-gradient-to-b from-[#363636] to-[#9C9C9C] rounded-t-[34px]">
                          {/* Status Bar */}
                          <div className="mb-3 px-1">
                            <Image
                              src="/images/statusbar.svg"
                              alt="Status bar"
                              width={240}
                              height={20}
                              className="mx-auto"
                            />
                          </div>
                          {/* Dynamic Island */}
                          <div className="w-[70px] h-[20px] bg-black rounded-full mx-auto -mt-[35px] mb-3 z-10"></div>
                          <div className="px-6 py-4 text-center text-white">
                            <div className="flex justify-center">
                              <Image
                                src={card.image || '/images/avatar-spa.png'}
                                alt={card.name}
                                width={72}
                                height={72}
                                className="rounded-full mb-2"
                              />
                            </div>
                            <h4 className="text-base">{card.name}</h4>
                            {/* Call Control Buttons */}
                            <div className="flex justify-center gap-3 sm:gap-6 mt-2.5">
                              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <SpeakerIcon size={22} color="#FFFFFF" />
                              </button>
                              <button
                                className="w-12 h-12 rounded-full bg-[#BEC5DD] text-white flex items-center justify-center hover:cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
                                onClick={() => handlePlayPause(index)}
                              >
                                {currentPlayingIndex === index ? (
                                  <PauseIcon size={32} color="#FFFFFF" />
                                ) : (
                                  <PlayIcon size={34} color="#FFFFFF" />
                                )}
                              </button>
                              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <MuteIcon size={20} color="#FFFFFF" />
                              </button>
                            </div>
                            {/* Audio Element */}
                            <audio
                              ref={(el) => {
                                if (el) audioRefs.current[index] = el;
                              }}
                              src={card.audio || '/audio/11labs.mp3'}
                              onEnded={() => setCurrentPlayingIndex(null)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="flex flex-col flex-1 min-h-0">
                      <FadeInWhenInView delay={index * 120 + 120} duration={0.5} yOffset={10}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-shrink-0">
                          {card.title}
                        </h3>
                        <div className="text-gray-600 text-sm leading-relaxed flex-1 min-h-0">
                          <ReactMarkdown>{card.description}</ReactMarkdown>
                        </div>
                      </FadeInWhenInView>
                    </div>
                  </div>
                </FadeInWhenInView>
              ))
              : null}
          </div>
          {/* Mobile-only glow under the last card */}
          <div className="absolute md:hidden -z-0 inset-x-6 -bottom-5 h-[120px] rounded-[999px] blur-[70px] bg-gradient-to-r from-[#3B6BFF]/18 via-[#2E96FF]/16 to-[#2EFFEA]/14 pointer-events-none" />

          {/* Desktop-only centered bluish glow under the cards */}
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-[220px] pointer-events-none z-0">
            <div className="absolute left-1/2 bottom-4 -translate-x-1/2 w-[76%] h-[120px] rounded-[999px] blur-[82px] bg-gradient-to-r from-[#3B6BFF]/20 via-[#2E96FF]/24 to-[#2EFFEA]/18" />
          </div>
        </div>
      </div>
    </section>
  );
}
