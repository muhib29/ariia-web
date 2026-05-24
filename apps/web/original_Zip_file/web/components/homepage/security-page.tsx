'Use Client';
import React from 'react';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { GradientHeader } from './GradientHeader';
import { SectionHeader } from '../SectionHeader';

export interface SecurityPageSectionProps {
  security: {
    header?: {
      tag?: string;
      title?: string;
      styledTitle?: string;
      description?: string;
    };
    imageWithContent?: Array<{
      id: string;
      image?: string | null;
      description: string;
    }>;
  };
}

export function SecurityPageSection({ security }: SecurityPageSectionProps) {
  const { header, imageWithContent } = security || {};
  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex flex-col justify-start pt-16 md:pt-20">
      {/* Header */}
      <Header isHomePage={false} />
      {/* Main Content */}
      <div className="py-10 px-6 max-w-5xl mx-auto z-10 relative">
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#DEF4FA] text-blue-700">
              {header?.tag || 'Security & Data Protection'}
            </span>
          </div>
          <h1 className="text-gray-900 font-bold text-[32px] leading-[42px] md:text-[40px] md:leading-[52px] tracking-tight">
            {header?.title || 'Security at the Core of Our Platform'}
            {header?.styledTitle ? <GradientHeader>{header.styledTitle}</GradientHeader> : null}
          </h1>
          {header?.description && (
            <div className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base mt-4">
              <ReactMarkdown>{header.description}</ReactMarkdown>
            </div>
          )}
        </div> */}
        <div className="text-center">
          <SectionHeader
            tag={header?.tag || 'Security & Data Protection'}
            title={header?.title || 'Security at the Core of Our Platform'}
            gradientTitle={header?.styledTitle ? header.styledTitle : ''}
            description={header?.description || ''}
          />
        </div>
        {/* Protection Cards */}
        {imageWithContent?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {imageWithContent.map((card) => (
              <div
                key={card.id}
                className="bg-white text-gray-900 p-6 rounded-xl shadow-md text-sm text-center flex flex-col items-center border border-gray-100"
              >
                <div className="relative w-10 h-10 mb-4">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt="icon"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 10vw"
                      className="object-contain"
                    />
                  )}
                </div>
                <ReactMarkdown>{card.description}</ReactMarkdown>
              </div>
            ))}
          </div>
        ) : null}
        {/* Compliance Roadmap */}
        <div className="rounded-[20px] bg-gray-50 text-gray-900 p-6 md:p-8 shadow-lg relative overflow-hidden border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Compliance Roadmap</h3>
          <p className="text-sm mb-4">
            To reinforce our commitment to accountability and trust, we are:
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-[#0086BF] w-5 h-5 mt-1" />
              <span>
                <span className="font-medium">Advancing HIPAA compliance efforts:</span>{' '}
                Strengthening specific safeguards to ensure adherence to HIPAA’s regulatory
                requirements for healthcare clients by winter 2025.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-[#0086BF] w-5 h-5 mt-1" />
              <span>
                <span className="font-medium">Advancing SOC 2 compliance validation:</span> Pursuing
                third-party audit certification for SOC 2 Type II by Q1 2026.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
