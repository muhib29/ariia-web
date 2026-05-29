'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import { Share2, Briefcase, Users, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { ShareModal } from './ShareModal';
import MarkdownRenderer from '../markdown-renderer';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from '../animations/FadeInWhenInView';

export interface CustomerContentBlock {
  heading?: string;
  text: string;
}

export interface CustomerDetailData {
  id: string;
  date: string;
  title: string;
  styledTitle?: string;
  tag?: string;
  image?: string;
  heroImage?: string;
  slug: string;
  content: CustomerContentBlock[];
  feedback?: string;
  industry?: string;
  employeeRange?: string;
  location?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  jobFounderName?: string;
}

export function CustomerDetail({ customer }: { customer: CustomerDetailData }) {
  const [showShare, setShowShare] = useState(false);
  const shareTitle = customer.title + (customer.styledTitle ? ' ' + customer.styledTitle : '');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const hasContent =
    Array.isArray(customer.content) &&
    customer.content.some((b) => b.text && b.text.trim().length > 0);

  console.log(customer);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff]">
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        shareTitle={shareTitle}
        shareUrl={shareUrl}
      />
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[800px] h-[800px] top-[-250px] left-[10%] rounded-full blur-[180px] bg-gradient-to-r from-[#79D8F5] to-[#E8F3FF] opacity-20" />
        <div className="absolute w-[600px] h-[600px] bottom-[-200px] right-[5%] rounded-full blur-[160px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-10" />
        <div className="absolute w-[520px] h-[320px] md:w-[860px] md:h-[520px] top-[90px] left-1/2 -translate-x-1/2 rounded-full blur-[110px] md:blur-[170px] bg-gradient-to-r from-[#6779FF] via-[#7F56D9] to-[#2E96FF] opacity-20 md:opacity-30" />
      </div>

      <Header isHomePage={false} />

      {/* Back + Share bar */}
      <div className="w-full flex items-center justify-between pt-22 md:pt-28 pb-2 px-5 md:px-4 max-w-6xl mx-auto z-10 relative">
        <Link href="/customers" prefetch={false}>
          <span className="flex items-center text-gray-500 hover:text-black cursor-pointer transition-colors">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </span>
        </Link>
        <button
          className="flex items-center gap-1 text-gray-500 hover:text-blue-700 p-2 rounded-full transition-colors cursor-pointer"
          title="Share"
          onClick={() => setShowShare(true)}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 max-w-6xl mx-auto w-full pb-6 sm:pb-16">
        {/* Page title */}
         <div className="text-center sm:-mt-10 md:pt-0 mb-0 w-full relative">
          <SectionHeader
            tag={customer.tag || 'Customers'}
            title={customer.title || ''}
            gradientTitle={customer.styledTitle || ''}
            breakAfterTitle={true}
          />
        </div>

        {/* Hero Image */}
        {customer.heroImage && (
          <FadeInWhenInView delay={80} className="w-full">
            <div className="relative w-full h-[220px] md:h-[320px] mb-8 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff]">
              <Image
                src={customer.heroImage}
                alt={customer.title || 'Customer hero'}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
                style={{ objectPosition: 'center' }}
                priority
              />
            </div>
          </FadeInWhenInView>
        )}

         {/* Two-column layout */}
         <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-start mt-2">
          {/* LEFT sidebar */}
          <FadeInWhenInView
            delay={100}
            className="md:col-span-1 flex flex-col gap-4 order-first md:order-1"
          >
            {/* Company logo card */}
            <div className="bg-white/90 rounded-3xl border border-[#e3f3ff] shadow p-6 md:p-7 flex flex-col items-center w-full">
              {customer.image ? (
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src={customer.image}
                    alt={customer.title || 'Company logo'}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mb-4 rounded-xl bg-gradient-to-br from-[#e3f3ff] to-[#BFD9FF] flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">
                    {(customer.title || 'C')[0]}
                  </span>
                </div>
              )}

              <div className="text-center w-full pb-4 border-b border-[#e8eef8] mb-4">
                <p className="text-base font-semibold text-gray-900 line-clamp-2">
                  {customer.title}
                </p>
                {customer.tag && <p className="text-sm text-blue-600 mt-1">{customer.tag}</p>}
              </div>

              {/* Stat rows */}
              <div className="w-full flex flex-col gap-3 mt-1">
                {customer.date && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="font-medium">Published:</span>
                    <span>{customer.date}</span>
                  </div>
                )}
                {customer.industry && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Industry: </span>
                      {customer.industry}
                    </span>
                  </div>
                )}
                {customer.employeeRange && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Employees: </span>
                      {customer.employeeRange}
                    </span>
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Location: </span>
                      {customer.location}
                    </span>
                  </div>
                )}
                {customer.jobFounderName && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Spokesperson: </span>
                      {customer.jobFounderName}
                    </span>
                  </div>
                )}
              </div>

              {/* Social links */}
              {(customer.twitterUrl || customer.facebookUrl || customer.linkedinUrl) && (
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 w-full justify-center">
                  {customer.twitterUrl && (
                    <a
                      href={customer.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                      </svg>
                    </a>
                  )}
                  {customer.facebookUrl && (
                    <a
                      href={customer.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {customer.linkedinUrl && (
                    <a
                      href={customer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </FadeInWhenInView>

           {/* RIGHT main content */}
           <FadeInWhenInView delay={150} className="md:col-span-3 flex flex-col order-last md:order-2">
            {hasContent ? (
              <div className="w-full">
                {customer.content.map((block, i) => (
                  <div key={i} className="mb-6">
                    {block.heading && (
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-3 sm:mt-6 sm:mb-3">
                        {block.heading}
                      </h2>
                    )}
                    {block.text && (
                      <MarkdownRenderer
                        components={{
                          p: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <p
                              className="text-gray-700 text-base leading-relaxed mb-4"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2" {...props} />
                          ),
                          h3: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <h3
                              className="text-lg font-semibold text-gray-900 mt-4 mb-2"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />
                          ),
                          li: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <li className="text-gray-700 text-base" {...props} />
                          ),
                          strong: ({ node, ...props }: { node?: any; [key: string]: any }) => (
                            <strong className="font-semibold text-gray-900" {...props} />
                          ),
                        }}
                      >
                        {block.text}
                      </MarkdownRenderer>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-base">Content coming soon.</p>
              </div>
            )}

            {/* Feedback / Quote block */}
            {customer.feedback && (
              <div className="w-full mt-2 sm:mt-8 sm:mb-4">
                <div
                  className="relative rounded-3xl shadow-xl bg-[#101828] bg-cover bg-center text-white"
                  style={{ backgroundImage: "url('/images/newsletter-bg.webp')" }}
                >
                  <div className="px-6 md:px-12 py-10 text-center">
                    <p className="text-lg md:text-xl italic mb-4 leading-relaxed">
                      &ldquo;{customer.feedback}&rdquo;
                    </p>
                    {customer.jobFounderName && (
                      <p className="text-sm text-gray-300 font-medium">
                        — {customer.jobFounderName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FadeInWhenInView>
        </div>
      </div>

      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
