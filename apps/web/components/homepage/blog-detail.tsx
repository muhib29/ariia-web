'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from './header';
import { Share2, Clock } from 'lucide-react';
import { NewsletterFooter } from './footer';
import React, { useEffect, useMemo, useState } from 'react';
import { ShareModal } from './ShareModal';
import { FadeInWhenInView } from './hero-section';
import MarkdownRenderer from '../markdown-renderer';
import slugify from 'slugify';
import { lenisScrollTo } from '@/lib/lenis';
import { SectionHeader } from '../SectionHeader';

interface BlogHeading {
  text: string;
  id: string;
}

function cleanHeadingText(raw: string): string {
  return raw
    .replace(/\[(.*?)]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNodeText(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (React.isValidElement(child)) {
        return getNodeText(
          (child as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        );
      }
      return '';
    })
    .join(' ');
}

function normalizeMarkdownInput(raw: unknown): string {
  if (typeof raw === 'string') {
    return raw.replace(/\\n/g, '\n').trim();
  }

  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizeMarkdownInput(item))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  if (raw && typeof raw === 'object') {
    const asRecord = raw as Record<string, unknown>;

    if (typeof asRecord.content === 'string') {
      return normalizeMarkdownInput(asRecord.content);
    }
    if (typeof asRecord.text === 'string') {
      return normalizeMarkdownInput(asRecord.text);
    }
    if (Array.isArray(asRecord.children)) {
      return normalizeMarkdownInput(asRecord.children);
    }
  }

  return '';
}

export function BlogDetail({ blog, otherBlogs = [] }: { blog: any; otherBlogs?: any[] }) {
  const [showShare, setShowShare] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const shareTitle = blog.title + (blog.styledTitle ? ' ' + blog.styledTitle : '');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Build navigation from all visible section headings in the post content.
  const headings: BlogHeading[] = useMemo(() => {
    const list: BlogHeading[] = [];
    const pushHeading = (label: string) => {
      const clean = cleanHeadingText(label);
      if (!clean) return;
      if (blog?.title && clean.trim().toLowerCase() === blog.title.trim().toLowerCase()) return;

      const id = slugify(clean, { lower: true, strict: true });
      if (!id) return;
      if (list.some((item) => item.id === id)) return;
      list.push({
        text: clean.length > 72 ? `${clean.slice(0, 69)}...` : clean,
        id,
      });
    };

    (blog.content || []).forEach((block: any) => {
      if (
        typeof block.heading === 'string' &&
        block.heading.trim() &&
        block.heading !== blog.title
      ) {
        pushHeading(block.heading);
      }

      const normalizedText = normalizeMarkdownInput(block.text);
      if (normalizedText) {
        const matches: Array<{ index: number; text: string }> = [];

        // 1. Match standard markdown headings (H2 - H4)
        for (const match of normalizedText.matchAll(/^\s{0,3}#{2,4}\s+(.+?)\s*#*\s*$/gm)) {
          if (match.index !== undefined) {
            matches.push({ index: match.index, text: match[1] || '' });
          }
        }

        // 2. Match standalone bold lines often used as fake headers
        for (const match of normalizedText.matchAll(/^\s*\*\*(.+?)\*\*\s*$/gm)) {
          if (match.index !== undefined) {
            matches.push({ index: match.index, text: match[1] || '' });
          }
        }

        // Sort chronologically by their physical position in the text
        matches.sort((a, b) => a.index - b.index);

        for (const match of matches) {
          pushHeading(match.text);
        }
      }
    });

    return list;
  }, [blog.content]);

  useEffect(() => {
    if (!headings.length) return;

    const updateActiveFromScroll = () => {
      const viewportOffset = 350;
      let nextActive = 0;

      headings.forEach((h, index) => {
        const element = document.getElementById(h.id);
        if (!element) return;
        const top = element.getBoundingClientRect().top;
        if (top <= viewportOffset) {
          nextActive = index;
        }
      });

      setActiveIdx((prev) => (prev === nextActive ? prev : nextActive));
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);

    return () => {
      window.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
    };
  }, [headings]);

  if (!blog) return <div>Blog not found</div>;

  const finalHeroImage = blog.image || blog.heroImage;

  return (
    <section className="relative min-h-screen flex flex-col bg-[#f7fcff] bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff] h-full">
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        shareTitle={shareTitle}
        shareUrl={shareUrl}
      />
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] top-[-250px] left-[10%] rounded-full blur-[180px] bg-gradient-to-r from-[#79D8F5] to-[#E8F3FF] opacity-30" />
        <div className="absolute w-[600px] h-[600px] bottom-[-200px] right-[5%] rounded-full blur-[160px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-10" />
        <div className="absolute w-[700px] h-[700px] top-[30%] left-[50%] -translate-x-1/2 rounded-full blur-[140px] bg-gradient-to-br from-[#B5D5FF] to-[#D7EBFF] opacity-10" />
        {/* Title Background Glare - Matching Index Page Cyan/Blue Glow */}
        <div className="absolute w-[500px] h-[300px] md:w-[800px] md:h-[500px] top-[100px] left-1/2 -translate-x-1/2 rounded-full blur-[100px] md:blur-[160px] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-25 md:opacity-35 -z-1" />
      </div>
      <Header isHomePage={false} />
      <div className="w-full flex items-center justify-between pt-22 md:pt-28  px-5 md:px-4 max-w-6xl mx-auto z-10 relative">
        <Link href="/blog" prefetch={false}>
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

      <div className="flex-1 flex flex-col items-center px-4 max-w-6xl mx-auto w-full pb-6 sm:pb-16">
        {/* Page title */}
        <div className="text-center sm:-mt-8 md:pt-0 mb-0 w-full relative">
          <SectionHeader
            tag={blog.tag || 'Blog'}
            title={blog.title || ''}
            gradientTitle={blog.styledTitle || ''}
            breakAfterTitleOnLaptop={Boolean(blog.styledTitle)}
          />
        </div>
        {/* Hero Image (if present) */}
        {finalHeroImage && (
          <FadeInWhenInView className="w-full">
            <div className="relative w-full h-[220px] md:h-[320px] mb-8 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff]">
              <Image
                src={finalHeroImage}
                alt={blog.title || 'Blog hero image'}
                fill
                className="object-cover"
                style={{ objectPosition: 'center' }}
                priority
              />
            </div>
          </FadeInWhenInView>
        )}
        {/* Author and Meta */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            {blog.avatar && (
              <Image
                src={blog.avatar}
                alt={blog.author || 'Author avatar'}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            )}
            <span className="text-sm text-gray-900 font-medium">{blog.author}</span>
            {blog.authorRole && (
              <>
                <span className="mx-2 h-5 border-l border-gray-300 inline-block"></span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] text-white capitalize">
                  {blog.authorRole}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-2">
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
            <span>{blog.date}</span>
            {blog.readTime && (
              <>
                <span className="mx-2 h-4 border-l border-gray-300 inline-block"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blog.readTime} mins
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-start relative">
          {/* Side Nav (Desktop) */}
          <div className="hidden md:flex md:col-span-1 flex-col items-start pt-6 sticky top-18 h-fit overflow-y-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <nav className="flex flex-col gap-1 w-full pr-2">
              {headings.map((h: BlogHeading, idx) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`px-3 py-2 rounded-xl transition-colors text-base font-medium
                    ${activeIdx === idx ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-black'}
                  `}
                  style={{
                    display: 'inline-block',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIdx(idx);
                    const el = document.getElementById(h.id);
                    if (el) {
                      // Get the actual header element and calculate its height
                      const header = document.querySelector('header');
                      const headerHeight = header ? header.offsetHeight : 80;

                      // Calculate the target scroll position
                      const rect = el.getBoundingClientRect();
                      const elementTop = rect.top + window.scrollY;
                      const targetScrollTop = elementTop - headerHeight - 120; // Exact offset aligned precisely

                      lenisScrollTo(Math.max(0, targetScrollTop));
                    }
                  }}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
          {/* Main Content */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <FadeInWhenInView delay={100} className="w-full max-w-3xl mx-auto md:mx-0 pb-5">
              {blog.content?.map((block: any, i: number) => (
                <div key={i} className="mb-4 w-full scroll-mt-32 md:scroll-mt-24">
                  {block.heading && block.heading.toLowerCase() !== blog.title.toLowerCase() && (
                    <FadeInWhenInView>
                      <h2
                        id={slugify(block.heading, { lower: true, strict: true })}
                        className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 scroll-mt-32 md:scroll-mt-24"
                      >
                        {block.heading}
                      </h2>
                    </FadeInWhenInView>
                  )}

                  {(() => {
                    const markdownText = normalizeMarkdownInput(block.text);
                    if (!markdownText) return null;

                    return (
                      <FadeInWhenInView delay={50}>
                        <MarkdownRenderer
                          components={{
                            h2: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
                              const text = cleanHeadingText(getNodeText(children));
                              const id = slugify(text, { lower: true, strict: true });
                              return (
                                <h2
                                  id={id}
                                  className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 scroll-mt-32 md:scroll-mt-24"
                                  {...props}
                                >
                                  {children}
                                </h2>
                              );
                            },
                            h3: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
                              const text = cleanHeadingText(getNodeText(children));
                              const id = slugify(text, { lower: true, strict: true });
                              return (
                                <h3
                                  id={id}
                                  className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 scroll-mt-32 md:scroll-mt-24"
                                  {...props}
                                >
                                  {children}
                                </h3>
                              );
                            },
                            p: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
                              const childArray = React.Children.toArray(children).filter(
                                (child) => {
                                  return !(typeof child === 'string' && child.trim() === '');
                                },
                              );

                              // Convert paragraph-only bold labels (e.g. **Why Now?**) into anchors for side nav.
                              if (
                                childArray.length === 1 &&
                                React.isValidElement(childArray[0]) &&
                                childArray[0].type === 'strong'
                              ) {
                                const strongNode = childArray[0] as React.ReactElement<{
                                  children?: React.ReactNode;
                                }>;
                                const strongText = cleanHeadingText(
                                  getNodeText(strongNode.props.children),
                                );
                                const id = slugify(strongText, { lower: true, strict: true });
                                if (id) {
                                  return (
                                    <h3
                                      id={id}
                                      className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 scroll-mt-32 md:scroll-mt-24"
                                      {...props}
                                    >
                                      {strongText}
                                    </h3>
                                  );
                                }
                              }

                              return (
                                <p
                                  className="text-gray-700 text-base leading-relaxed font-normal mb-4 whitespace-pre-wrap break-words"
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    minHeight: '1em',
                                  }}
                                  {...props}
                                >
                                  {children}
                                </p>
                              );
                            },
                          }}
                        >
                          {markdownText}
                        </MarkdownRenderer>
                      </FadeInWhenInView>
                    );
                  })()}
                </div>
              ))}
            </FadeInWhenInView>
          </div>
        </div>
        {/* Related Blogs (optional, can be implemented later) */}
      </div>
      {/* Other Blogs Section */}
      {otherBlogs.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mt-6 md:mt-12 mb-10 px-4">
          <div className="flex flex-col items-center mb-8 md:mb-10 gap-4 md:gap-[26px]">
            <div className="inline-flex items-center justify-center w-auto md:w-[118px] h-auto min-h-8 md:min-h-[36px] px-4 md:px-[15px] py-1 md:py-[5px] gap-[10px] rounded-full bg-[#DEF4FA]">
              <span className="font-medium text-[14px] md:text-[16px]  tracking-normal text-center text-nowrap bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] bg-clip-text text-transparent">
                Other Blogs
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              You Might{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9]">
                Also Like
              </span>
            </h2>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherBlogs.slice(0, 3).map((post, idx) => {
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
                <Link
                  key={idx}
                  href={`/blog/${slug}`}
                  prefetch={false}
                  className="flex min-w-0 w-full flex-col items-start cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Featured Image Only - 3:2 Aspect Ratio */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e3f3ff] via-[#d0eaff] to-[#c2e0ff] shadow-md w-full aspect-[3/2] mb-3">
                    {finalImage ? (
                      <Image
                        src={finalImage}
                        alt={title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
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
                          {post.readTime} min read
                        </span>
                      </>
                    )}
                  </div>
                  {/* Title */}
                  <h3 className="w-full min-w-0 text-base font-semibold text-gray-900 my-2 leading-tight [overflow-wrap:anywhere]">
                    {title}
                  </h3>
                  {/* Author Info */}
                  <div className="flex items-center gap-2 mt-auto mb-1">
                    <Image
                      src={post.avatar}
                      alt={post.author}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-900 font-medium">{post.author}</span>
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
              );
            })}
          </div>
        </div>
      )}
      <NewsletterFooter isHomePage={false} />
    </section>
  );
}
