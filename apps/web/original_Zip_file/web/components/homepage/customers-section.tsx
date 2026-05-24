'use client';
import Image from 'next/image';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import Link from 'next/link';
import Lottie from 'lottie-react';
import logoAnimation from '../../public/lottie/logo.json';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from '../animations/FadeInWhenInView';
import React, { useState } from 'react';

export interface CustomerCard {
  id: string;
  date: string;
  title: string;
  styledTitle: string;
  slug: string;
  tag?: string;
  image?: string;
}

export function CustomersSection({ customers }: { customers: CustomerCard[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  const validCustomers = Array.isArray(customers)
    ? customers.filter(
        (card) =>
          typeof card?.title === 'string' &&
          card.title.trim().length > 0 &&
          typeof card?.slug === 'string' &&
          card.slug.trim().length > 0,
      )
    : [];

  const hasCustomersData = validCustomers.length > 0;

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-start bg-[#f7fcff] bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff] pt-16 md:pt-[80px]">
      {/* Background Blurs */}
      <div className="absolute inset-0 z-10">
        {hasCustomersData ? (
          <>
            <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[180px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
            <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bottom-[1800px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
            <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[700px] -right-[10%] bg-gradient-to-tr from-[#C4CDF3] to-[#C4CDF3] opacity-40 blur-[100px]" />
            <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bottom-[1000px] -right-[10%] bg-gradient-to-tr from-[#C4CDF3] to-[#C4CDF3] opacity-40 blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute w-[300px] h-[300px] md:w-full md:h-[400px] top-[40%] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-15 blur-[70px]" />
          </>
        )}
      </div>

      {/* Header */}
      <Header isHomePage={false} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start text-center items-center pt-10 px-4 max-w-6xl mx-auto z-10 relative w-full">
        <FadeInWhenInView>
          <div className="text-center z-10">
            <SectionHeader
              tag="Customers"
              title="Trusted by Leading Businesses. "
              gradientTitle="Driven by AI Agents"
            />
          </div>
        </FadeInWhenInView>

        {hasCustomersData ? (
          <>
            {/* Cards Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-10 sm:mt-8">
              {validCustomers.slice(0, visibleCount).map((card, idx) => (
                <FadeInWhenInView key={card.id || idx} delay={idx * 120}>
                  <Link
                    href={`/customers/${card.slug}`}
                    className="flex flex-col items-start cursor-pointer group w-full hover:scale-[1.02] transition-transform duration-300"
                    prefetch={false}
                  >
                    {/* Featured Image - 3:2 Aspect Ratio */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff] shadow-md w-full aspect-[3/2] mb-3">
                      {card.image && (
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                      {/* Lottie Animation Overlay */}
                      {/* <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded-3xl">
                        <Lottie
                          animationData={logoAnimation}
                          loop
                          autoplay
                          style={{ width: '50%', height: '50%' }}
                        />
                      </div> */}
                    </div>
                    {/* Meta Info */}
                    <div className="flex items-center text-xs text-gray-500 mb-1 gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      <span>{card.date}</span>
                    </div>
                    {/* Title */}
                    <h3 className="text-base text-start text-gray-900 my-2 leading-tight font-semibold">
                      {card.title}
                    </h3>
                    {/* Tag */}
                    {card.tag && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#e6f6f3] text-[#1db68b]">
                        {card.tag}
                      </span>
                    )}
                  </Link>
                </FadeInWhenInView>
              ))}
            </div>
            {/* See More Button */}
            {visibleCount < validCustomers.length && (
              <FadeInWhenInView delay={200}>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="mt-2 mb-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] text-white font-semibold text-base shadow-md hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                >
                  See More
                </button>
              </FadeInWhenInView>
            )}
          </>
        ) : (
          <>
            <FadeInWhenInView>
              <div className="flex flex-col items-center justify-center py-5 md:py-24 w-full">
                <div className="relative w-full max-w-lg h-36 md:h-[300px] mb-0 md:mb-12 flex items-center justify-center">
                  <Image
                    src={'/images/skeleton.svg'}
                    alt={'Skeleton UI'}
                    width={220}
                    height={280}
                    className="absolute object-contain scale-50 md:scale-100"
                    style={{
                      transform: 'rotate(-12deg) translateX(-150px) translateY(-80px)',
                      zIndex: 1,
                    }}
                  />

                  <Image
                    src={'/images/skeleton.svg'}
                    alt={'Skeleton UI'}
                    width={220}
                    height={280}
                    className="absolute object-contain scale-50 md:scale-100"
                    style={{
                      zIndex: 2,
                    }}
                  />

                  <Image
                    src={'/images/skeleton.svg'}
                    alt={'Skeleton UI'}
                    width={220}
                    height={280}
                    className="absolute object-contain scale-50 md:scale-100"
                    style={{
                      transform: 'rotate(12deg) translateX(150px) translateY(-80px)',
                      zIndex: 3,
                    }}
                  />
                </div>

                <p className="text-center text-black text-base md:text-[24px] max-w-[440px] px-4 md:px-0 mb-16">
                  We’ll be sharing customer success stories soon—check back for real-world insights
                  and inspiration.
                </p>
              </div>
            </FadeInWhenInView>
          </>
        )}
      </div>

      {/* Newsletter and Footer */}
      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
