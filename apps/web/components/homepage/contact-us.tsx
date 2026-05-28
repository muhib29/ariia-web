'use client';
import React from 'react';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import MarkdownRenderer from '../markdown-renderer';
import { SectionHeader } from '../SectionHeader';
import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';
import { FadeInWhenInView } from '@/components/animations/FadeInWhenInView';

export interface ContactCard {
  id: string;
  title: string;
  email: string;
  redirection?: string;
  backgroundImage?: string;
  gradient?: string;
  decorativeImage?: string;
  blurConfig?: {
    color: string;
    size: string;
    position: string;
    opacity: string;
  };
}

export interface ContactUsData {
  seo?: any;
  title?: string;
  styledTitle?: string;
  tag?: string;
  card?: ContactCard[];
}

interface ContactCardProps {
  title: string;
  email: string;
  redirection?: string;
  backgroundImage?: string;
  gradient?: string;
  decorativeImage?: string;
  blurConfig?: {
    color: string;
    size: string;
    position: string;
    opacity: string;
  };
  className?: string;
}

function ContactCardComponent({
  title,
  email,
  redirection,
  backgroundImage,
  decorativeImage,
  blurConfig,
  gradient = 'linear-gradient(301deg, rgba(103,121,255,0.20) -9.95%, rgba(78,151,250,0.20) 13.29%, rgba(53,181,245,0.20) 36.53%, rgba(46,255,234,0.20) 83.01%)',
  className = '',
}: ContactCardProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div
      className={`relative min-h-[260px] p-6 md:p-7 text-left overflow-hidden rounded-[28px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),_0_2px_4px_-2px_rgba(0,0,0,0.10)] ${className}`}
      style={{
        background: gradient,
        ...backgroundStyle,
      }}
    >
      {/* Blur Effect */}
      {blurConfig && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: blurConfig.size,
            height: blurConfig.size,
            background: blurConfig.color,
            opacity: blurConfig.opacity,
            filter: 'blur(97px)',
            ...parsePosition(blurConfig.position),
          }}
        />
      )}

      {/* Decorative SVG Image */}
      {decorativeImage && (
        <div
          className={cn(
            'absolute inset-0 w-full h-full pointer-events-none',
            decorativeImage?.includes('lines') && 'left-36',
          )}
        >
          <Image src={decorativeImage} alt="Pattern" fill className="object-fit opacity-100" />
        </div>
      )}

      <div className="relative h-full flex flex-col z-10">
        <div className="flex flex-col gap-8 md:gap-5">
          <h3 className="text-lg md:text-[20px] font-bold text-gray-900 pr-0 md:pr-8 leading-snug">
            <MarkdownRenderer>{title}</MarkdownRenderer>
          </h3>
          <a
            href={`mailto:${email}`}
            className="text-sm text-[#101828] hover:text-blue-600 transition-colors underline"
          >
            {email}
          </a>
        </div>
        <div className="mt-auto pt-14 md:pt-8">
          {redirection ? (
            <a
              href={redirection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-20 h-9 items-center justify-center rounded-full bg-white border border-[#35B5F5] shadow hover:shadow-md transition"
              aria-label={`Open ${title}`}
            >
              <span className="text-blue-600 text-lg">→</span>
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex w-20 h-9 items-center justify-center rounded-full bg-white border border-[#35B5F5] shadow hover:shadow-md transition"
              aria-label={`Contact ${email}`}
            >
              <span className="text-blue-600 text-lg">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to parse position string into style object
function parsePosition(position: string): React.CSSProperties {
  const positions: Record<string, React.CSSProperties> = {
    'top-left': { top: '-20%', left: '-20%' },
    'top-right': { top: '-20%', right: '-20%' },
    'bottom-left': { bottom: '-20%', left: '-20%' },
    'bottom-right': { bottom: '-20%', right: '-20%' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'top-center': { top: '-20%', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '-20%', left: '50%', transform: 'translateX(-50%)' },
  };
  return positions[position] || positions['center'];
}

export function ContactUs({ contact }: { contact: ContactUsData }) {
  const defaultCards: ContactCard[] = [
    {
      id: '1',
      title: 'General inquiries, product info, and company questions.',
      email: 'info@ariiaai.com',
      gradient:
        'linear-gradient(301deg, rgba(103,121,255,0.20) -9.95%, rgba(78,151,250,0.20) 13.29%, rgba(53,181,245,0.20) 36.53%, rgba(46,255,234,0.20) 83.01%)',
      decorativeImage: '/images/lines.svg',
      blurConfig: {
        color: 'linear-gradient(to right, #0F657E 0%, #20A8BE 100%)',
        size: '210px',
        position: 'top-right',
        opacity: '0.9',
      },
    },
    {
      id: '2',
      title: 'Customer support, technical issues, subscription plans, billing, or payments.',
      email: 'support@ariiaai.com',
      gradient:
        'linear-gradient(179deg, rgba(99,91,255,0.30) 0.53%, rgba(53,128,255,0.20) 49.61%, rgba(46,150,255,0.20) 98.69%)',
      decorativeImage: '/images/hexagon.svg',
      blurConfig: {
        color: 'linear-gradient(180deg, #0F657E 0%, #20A8BE 100%)',
        size: '210px',
        position: 'top-right',
        opacity: '0.9',
      },
    },
    {
      id: '3',
      title: 'Sales inquiries, partnership opportunities, and demo requests.',
      email: 'sales@ariiaai.com',
      gradient:
        'linear-gradient(116deg, rgba(46,150,255,0.20) 22.97%, rgba(46,150,255,0.30) 64.06%, rgba(53,128,255,0.20) 128.11%)',
      decorativeImage: '/images/hexagon.svg',
      blurConfig: {
        color: 'linear-gradient(180deg, #0F657E 0%, #20A8BE 100%)',
        size: '210px',
        position: 'bottom-left',
        opacity: '0.9',
      },
    },
    {
      id: '4',
      title:
        'Security issues, system vulnerabilities, data privacy concerns, or to request data deletion in accordance with applicable laws.',
      email: 'security-privacy@ariiaai.com',
      gradient:
        'linear-gradient(295deg, #EAF3FF -6.9%, rgba(53,181,245,0.20) 51.17%, rgba(234,243,255,0.20) 102.68%)',
      decorativeImage: '/images/lines.svg',
      blurConfig: {
        color: 'linear-gradient(180deg, #0F657E 0%, #20A8BE 100%)',
        size: '190px',
        position: 'bottom-right',
        opacity: '0.9',
      },
    },
  ];

  const cardsToDisplay =
    contact.card && contact.card.length > 0
      ? contact.card.map((c, index) => {
          const defaultStyle = defaultCards[index % defaultCards.length];
          return {
            ...c,
            gradient: c.gradient || defaultStyle.gradient,
            decorativeImage: c.decorativeImage || defaultStyle.decorativeImage,
            blurConfig: c.blurConfig || defaultStyle.blurConfig,
            backgroundImage: c.backgroundImage || defaultStyle.backgroundImage,
          };
        })
      : defaultCards;

  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex flex-col justify-start pt-16 md:pt-[80px] pb-0">
      {/* Background Blurs */}
      <div className="absolute inset-0 z-10">
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[180px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bottom-[1800px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
      </div>

      <Header isHomePage={false} />

      <div className="py-10 px-6 max-w-6xl mx-auto z-10 text-center">
        <SectionHeader
          tag={contact.tag || 'Contact Us'}
          title={contact.title || 'We Aim to Respond to All Inquiries Within 24 Hours.'}
          gradientTitle={
            contact.styledTitle ||
            'Response Times May Vary Slightly Depending on Request Complexity and Volume'
          }
        />

        <div className="grid gap-[30px] sm:grid-cols-2">
          {cardsToDisplay.map((card, index) => (
            <FadeInWhenInView key={card.id || index} delay={index * 100}>
              <ContactCardComponent
                title={card.title}
                email={card.email}
                redirection={card.redirection}
                backgroundImage={card.backgroundImage}
                gradient={card.gradient}
                decorativeImage={card.decorativeImage}
                blurConfig={card.blurConfig}
              />
            </FadeInWhenInView>
          ))}
        </div>
      </div>

      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
