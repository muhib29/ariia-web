'use client';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import Image from 'next/image';
import { MapPin, Briefcase, PieChart, Gift, DollarSign } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../markdown-renderer';
import React, { useEffect } from 'react';
import { SectionHeader } from '../SectionHeader';
// import dynamic from 'next/dynamic';
import { SPLINE_SCENES } from '@/config/spline-scenes';
import { FadeInWhenInView } from '../animations/FadeInWhenInView';

// const SplineScene = dynamic(() => import('../SplineScene'), { ssr: false });

export interface CareerJobInfo {
  employment?: string;
  equity?: string;
  experience?: string;
  location?: string;
  salary?: string;
}

export interface CareerCard {
  description?: string;
  jobDescription?: string;
  jobInfo?: CareerJobInfo;
}

export interface CareerDetail {
  title?: string;
  slug?: string;
  careerCard?: CareerCard;
}

export interface CareerHero {
  id?: string;
  title?: string;
  description?: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
}

export interface CareerData {
  seo?: any;
  header?: {
    id?: string;
    title?: string;
    styledTitle?: string;
    tag?: string;
    description?: string;
  };
  careerHero?: CareerHero | CareerHero[];
  career_details?: CareerDetail[];
}

interface JobCardProps {
  title: string;
  slug: string;
  description: string;
  jobInfo?: CareerJobInfo;
}

function JobCard({ title, slug, description, jobInfo }: JobCardProps) {
  const href = `/careers/${slug}`;
  const details = [
    { icon: MapPin, label: 'Location', value: jobInfo?.location },
    { icon: Briefcase, label: 'Employment Type', value: jobInfo?.employment },
    { icon: PieChart, label: 'Equity', value: jobInfo?.equity },
    { icon: Gift, label: 'Experience', value: jobInfo?.experience },
    { icon: DollarSign, label: 'Salary', value: jobInfo?.salary },
  ].filter((item) => item.value && item.value !== 'N/A');

  const detailsBox =
    details.length > 0 ? (
      <div className="flex flex-col gap-3 w-full md:w-[320px] flex-shrink-0 p-4 self-center rounded-[20px] [background:linear-gradient(125deg,_rgba(66,172,225,0.05)_-40.05%,_rgba(80,198,240,0.10)_35.68%,_rgba(84,202,242,0.40)_99.35%)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),_0_2px_4px_-2px_rgba(0,0,0,0.10)]">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-center gap-2 text-gray-800 text-sm">
            <detail.icon className="w-5 h-5 flex-shrink-0" />
            {detail.label}: {detail.value}
          </div>
        ))}
      </div>
    ) : null;

  return (
    <Link href={href} className="mb-5 block">
      <div className="group flex flex-col md:flex-row p-4 md:p-5 gap-4 md:gap-5 rounded-[28px] [background:linear-gradient(280deg,_rgba(84,202,242,0.09)_31.63%,_rgba(84,202,242,0.06)_62.05%,_rgba(84,202,242,0.06)_92.48%),_#FFF] shadow-[0_2.589px_3.884px_-0.647px_rgba(0,0,0,0.10),_0_1.295px_2.589px_-1.295px_rgba(0,0,0,0.10)] transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_16px_40px_-24px_rgba(20,132,180,0.55)]">
        <div className="flex-1 min-w-0 p-0 md:p-3">
          <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 transition-colors duration-300 group-hover:text-sky-700">
            {title}
          </h3>
          <div className="text-gray-700 text-sm md:text-base">
            <MarkdownRenderer>{description}</MarkdownRenderer>
          </div>
        </div>
        {detailsBox}
      </div>
    </Link>
  );
}

export function CareersSection({ career }: { career: CareerData }) {
  useEffect(() => {
    // TEMP DISABLE: Spline viewer script injection blocked while testing freezes.
    // if (!document.querySelector('script[src*=\"spline-viewer.js\"]')) {
    //   const script = document.createElement('script');
    //   script.type = 'module';
    //   script.src = 'https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js';
    //   document.body.appendChild(script);
    // }
  }, []);

  const jobsToDisplay =
    career.career_details
      ?.filter((job: CareerDetail) => job.title)
      .map((job: CareerDetail) => ({
        title: job.title || '',
        slug: job.slug || 'job',
        description: job.careerCard?.description || '',
        jobInfo: job.careerCard?.jobInfo,
      })) ?? [];

  const rawHeroItems = Array.isArray(career.careerHero)
    ? career.careerHero
    : career.careerHero
      ? [career.careerHero]
      : [];

  const validHeroItems = rawHeroItems.filter((item) => item && item.title);

  const card1 = validHeroItems[0];
  const card3 = validHeroItems[1];
  const card2 = validHeroItems[2];
  const card4 = validHeroItems[3];

  return (
    <section className="relative min-h-screen flex flex-col justify-start bg-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[300px] top-[690px] left-[1%] bg-gradient-to-r from-[#4E97FA] via-[#35B5F5] to-[#2EFFEA] opacity-20 blur-[80px]" />
      </div>

      <Header isHomePage={false} />

      {/* Careers Tag & Heading */}
      <FadeInWhenInView className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center pt-24 md:pt-30">
        <div className="text-center pb-0 w-full flex justify-center z-0">
          <div className="w-full md:max-w-4xl ">
            <SectionHeader
              tag={career.header?.tag || 'Careers'}
              title={career.header?.title || 'Join Our Mission to Shape the'}
              gradientTitle={career.header?.styledTitle || 'Future of Business with AI Agents'}
            />
          </div>
        </div>
      </FadeInWhenInView>

      {/* Grid Layout */}
      <div className="relative w-full max-w-6xl mx-auto z-0 grid grid-cols-1 md:grid-cols-6 gap-y-4 gap-x-4 mt-0 mb-8 md:mb-10 px-4">
        {/* Left Column */}
        <FadeInWhenInView delay={80} className="grid grid-rows-2 gap-2 md:col-span-2 md:h-[300px]">
          {card1 && (
            <FadeInWhenInView delay={120} yOffset={18}>
              <div
                className="h-full rounded-[24px] bg-gradient-to-br from-[#E8F3FF] to-[#F8FAFF] px-6 py-4 flex flex-col justify-center items-center bg-cover bg-center shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                style={{ backgroundImage: "url('/images/c-1bg.webp')" }}
              >
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800 text-center">
                  {card1.title}
                </h3>
                <Image
                  src="/images/c-line.webp"
                  alt="divider"
                  width={320}
                  height={4}
                  className="w-full mb-2"
                />
                {card1.description && (
                  <p className="text-gray-600 text-sm text-center line-clamp-3">
                    {card1.description}
                  </p>
                )}
              </div>
            </FadeInWhenInView>
          )}
          {card2 && (
            <FadeInWhenInView delay={220} yOffset={18}>
              <div
                className="h-full rounded-[24px] bg-gradient-to-br from-[#F8FAFF] to-[#E8F3FF] p-6 flex flex-col justify-center items-center bg-cover bg-center shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                style={{ backgroundImage: "url('/images/c-2bg.webp')" }}
              >
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800 text-center">
                  {card2.title}
                </h3>
                <Image
                  src="/images/c-line.webp"
                  alt="divider"
                  width={320}
                  height={4}
                  className="w-full mb-2"
                />
                {card2.description && (
                  <p className="text-gray-600 text-sm text-center line-clamp-3">
                    {card2.description}
                  </p>
                )}
              </div>
            </FadeInWhenInView>
          )}
        </FadeInWhenInView>

        {/* Center Image Card */}
        <FadeInWhenInView delay={170} yOffset={22} className="md:col-span-2">
          <div className="group flex flex-col items-center justify-center rounded-[32px] bg-gradient-to-br from-[#F8FAFF] to-[#E8F3FF] p-0 min-h-[180px] md:h-[300px] h-full overflow-hidden relative shadow-lg transition-shadow duration-300 motion-safe:hover:shadow-xl">
            <div className="relative w-full h-full min-h-[180px] flex items-center justify-center">
              <Image
                src={'/images/c-main.webp'}
                alt="Careers Illustration"
                fill
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                priority
              />
              {/* TEMP DISABLE: SplineScene blocked while troubleshooting freeze */}
              {/* <SplineScene config={SPLINE_SCENES.career} /> */}
            </div>
          </div>
        </FadeInWhenInView>

        {/* Right Column */}
        <FadeInWhenInView delay={120} className="grid grid-rows-2 gap-2 md:col-span-2 md:h-[300px]">
          {card3 && (
            <FadeInWhenInView delay={170} yOffset={18}>
              <div
                className="h-full rounded-[24px] bg-gradient-to-br from-[#E8F3FF] to-[#F8FAFF] px-6 py-4 flex flex-col justify-center items-center bg-cover bg-center shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                style={{ backgroundImage: "url('/images/c-3bg.webp')" }}
              >
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800 text-center">
                  {card3.title}
                </h3>
                <Image
                  src="/images/c-line.webp"
                  alt="divider"
                  width={320}
                  height={4}
                  className="w-full mb-2"
                />
                {card3.description && (
                  <p className="text-gray-600 text-sm text-center line-clamp-3">
                    {card3.description}
                  </p>
                )}
              </div>
            </FadeInWhenInView>
          )}
          {card4 && (
            <FadeInWhenInView delay={270} yOffset={18}>
              <div
                className="h-full rounded-[24px] bg-gradient-to-br from-[#F8FAFF] to-[#E8F3FF] p-6 flex flex-col justify-center items-center bg-cover bg-center shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                style={{ backgroundImage: "url('/images/c-4bg.webp')" }}
              >
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800 text-center">
                  {card4.title}
                </h3>
                <Image
                  src="/images/c-line.webp"
                  alt="divider"
                  width={320}
                  height={4}
                  className="w-full mb-2"
                />
                {card4.description && (
                  <p className="text-gray-600 text-sm text-center line-clamp-3">
                    {card4.description}
                  </p>
                )}
              </div>
            </FadeInWhenInView>
          )}
        </FadeInWhenInView>
      </div>

      {/* Info Card */}
      <FadeInWhenInView
        delay={140}
        className="max-w-6xl min-w-full lg:min-w-6xl mx-auto px-4 mb-8 sm:mb-12"
      >
        <div
          className="relative rounded-3xl bg-[#101828] bg-cover bg-center transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-2xl"
          style={{ backgroundImage: "url('/images/newsletter-bg.webp')" }}
        >
          <div className="px-6 md:px-12 py-8 text-center text-white text-base md:text-lg font-medium whitespace-pre-line">
            {career.header?.description ||
              `These roles are not yet open, but they're part of our upcoming expansion plans.\nIf our mission resonates with you, connect with us—we'd love to keep you in mind for future opportunities.`}
          </div>
        </div>
      </FadeInWhenInView>

      <div className="max-w-6xl z-0 mx-auto px-4 mb-8 md:mb-16">
        {jobsToDisplay.map((job, index) => (
          <FadeInWhenInView key={index} delay={index * 90} yOffset={20}>
            <JobCard {...job} />
          </FadeInWhenInView>
        ))}
      </div>

      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
