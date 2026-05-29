'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from './header';
import { NewsletterFooter } from './footer';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from './hero-section';

export function BlogSection({ blogs }: { blogs: any[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  // Sort posts by date (newest first). Fallback: items without a date go last.
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-start bg-[#f7fcff] bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff] pt-16 md:pt-[80px]">
      {/* Background Blurs */}
      <div className="absolute inset-0 z-10">
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[180px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bottom-[1800px] -left-[10%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-20 blur-[70px]" />
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[700px] -right-[10%] bg-gradient-to-tr from-[#C4CDF3] to-[#C4CDF3] opacity-40 blur-[100px]" />
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bottom-[1000px] -right-[10%] bg-gradient-to-tr from-[#C4CDF3] to-[#C4CDF3] opacity-40 blur-[100px]" />
      </div>
      <Header isHomePage={false} />
      <div className="flex-1 flex flex-col justify-start text-center items-center pt-10 py-0 px-4 max-w-6xl mx-auto z-10 relative w-full">
        {/* Blog Header */}
        <FadeInWhenInView>
          <SectionHeader
            tag={'Blog'}
            title={'Stay Up to Date with '}
            gradientTitle={'Insights, Product Updates, and Perspectives from the Team Behind ARIIA'}
          />
        </FadeInWhenInView>
        {/* Blog Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-10 sm:mt-8">
          {sortedBlogs.slice(0, visibleCount).map((post, idx) => {
            // Robust title and slug fallbacks
            const title =
              post.title ||
              post.Card?.title ||
              post.content?.title ||
              post.content?.styledTitle ||
              'Untitled Blog';
            const slug =
              post.slug ||
              post.Card?.slug ||
              post.content?.slug ||
              (title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `blog-${idx}`).replace(
                /(^-|-$)/g,
                '',
              );
            const finalImage = post.image;
            return (
              <FadeInWhenInView key={idx} delay={idx * 120}>
                <Link
                  href={`/blog/${slug}`}
                  prefetch={false}
                  className="flex flex-col items-start cursor-pointer group w-full hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Featured Image Only - 3:2 Aspect Ratio */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff] shadow-md w-full aspect-[3/2] mb-3">
                    {finalImage && finalImage.length > 0 && (
                      <Image
                        src={finalImage}
                        alt={title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    )}
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
                    <span>{post.date}</span>
                    {post.readTime && (
                      <>
                        <span className="mx-2 h-4 border-l border-gray-300 inline-block"></span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} mins
                        </span>
                      </>
                    )}
                  </div>
                  {/* Title */}
                  <h3 className="text-base text-start text-gray-900 my-2 leading-tight font-semibold">
                    {title}
                  </h3>
                  {/* Author Info */}
                  <div className="flex items-center gap-2 mt-auto mb-1">
                    {post.avatar && (
                      <Image
                        src={post.avatar}
                        alt={post.author || 'Author'}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm text-gray-900 font-medium">
                      {post.author || 'ARIIA Team'}
                    </span>
                    {post.authorRole && (
                      <>
                        <span className="mx-2 h-5 border-l border-gray-300 inline-block"></span>
                        <span className="inline-block px-4 py-[3px] rounded-full text-sm font-medium bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] text-white capitalize">
                          {post.authorRole}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </FadeInWhenInView>
            );
          })}
        </div>
        {/* See More Button */}
        {visibleCount < sortedBlogs.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="mt-2 mb-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] text-white font-semibold text-base shadow-md hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
          >
            See More
          </button>
        )}
      </div>
      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
