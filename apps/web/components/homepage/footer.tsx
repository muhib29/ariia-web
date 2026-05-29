'use client';

import Image from 'next/image';
import { ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isTouchDevice } from '@/lib/device-capabilities';
import { HeroLogo } from '../icons/HeroLogo';
import { FadeInWhenInView } from './hero-section';

// Footer link constants for maintainability
const FOOTER_LINKS = [
  [
    // First column (Logo & Socials, no links)
    // No links here
  ],
  [
    // Second column
    { href: '/', label: 'Homepage' },
    { href: '/#about-us', label: 'About Us' },
    { href: '/story-behind-ariia/', label: 'The Story\nBehind ARIIA' },
    { href: '/features/', label: 'Features' },
    { href: '/pricing/', label: 'Pricing' },
  ],
  [
    // Third column
    { href: '/blog/', label: 'Blog' },
    { href: '/careers/', label: 'Careers' },
    { href: '/customers/', label: 'Customers' },
    { href: '/contact-us/', label: 'Contact Us' },
    { href: '/#use-cases', label: 'Use Cases' },
  ],
  [
    // Fourth column
    { href: '/industries/', label: 'Industries' },
    { href: '/#faq', label: 'Questions & Answers' },
    { href: '/#security', label: 'Security & Data Protection' },
    { href: '/terms-of-service/', label: 'Terms of Service' },
    { href: '/privacy-policy/', label: 'Privacy Policy' },
  ],
];

const FOOTER_NAV_LINK_CLASS =
  'text-white/90 visited:text-white/90 active:text-white/90 font-medium hover:text-white transition-colors whitespace-pre-line md:whitespace-normal leading-[1.25] md:leading-normal';

export function NewsletterFooter({ isHomePage = true }: { isHomePage?: boolean }) {
  // Newsletter state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [enableHoverFx, setEnableHoverFx] = useState(false);

  useEffect(() => {
    setEnableHoverFx(!isTouchDevice());
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHoverFx) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [enableHoverFx]);

  return (
    <>
      {/* First Section - White background with ElevenLabs badge */}
      {isHomePage && (
        <FadeInWhenInView>
          <section className="relative mt-12 pt-0 pb-3 md:pb-5 overflow-hidden bg-white">
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="https://elevenlabs.io/startup-grants"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp"
                    alt="ElevenLabs"
                    width={280}
                    height={84}
                    sizes="(max-width: 768px) 220px, 280px"
                    className="w-[220px] sm:w-[280px] md:w-[280px] h-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </section>
        </FadeInWhenInView>
      )}
      {/* Newsletter Card - Floating between sections */}
      <section
        className={`relative ${
          isHomePage ? 'mt-0 md:mt-0 -mb-24 md:-mb-16' : 'mt-2 md:mt-3 -mb-24 md:-mb-16'
        } z-30 pointer-events-none `}
      >
        <div className="max-w-[73.123rem] mx-auto px-0 md:px-6 pb-0 pointer-events-auto">
          <div className="relative z-40 overflow-hidden md:rounded-3xl shadow-xl w-[377px] rounded-xl h-[179px] mx-auto md:w-full md:h-full bg-cover bg-center bg-no-repeat bg-[url('/images/newsletter-mob-bg.webp')] md:bg-[#0B0F1A] md:bg-[url('/images/newsletter-bg.webp')]">
            <div className="px-8 pt-8 md:px-16  md:py-12 mt-0 text-center text-white bg-transparent">
              <h2 className="text-[22px] mb-2 sm:mb-5 md:w-full leading-[30px] md:text-[2.3125rem] md:leading-tight font-bold sm:font-semibold max-w-none mx-auto">
                Get the latest product updates—join our newsletter
              </h2>
              {success ? (
                <div className="flex items-center gap-3 px-5 py-1 sm:py-3 rounded-full bg-white/90 shadow-lg border border-gray-200 w-[700px]  max-w-fit mx-auto mt-4 animate-fade-in">
                  <ThumbsUp className="text-blue-600 w-6 h-6" />
                  <span className="text-gray-900 text-base font-medium">{success}</span>
                </div>
              ) : (
                <form
                  className="flex flex-row gap-2 justify-center items-center max-w-md mx-auto border-2 border-white rounded-full p-1"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    setSuccess('');
                    try {
                      const res = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setSuccess("Thank you! You're on the list — stay tuned for updates!");
                        setEmail('');
                      } else if (data.error?.toLowerCase().includes('already')) {
                        setSuccess("You're already subscribed to the list!");
                      } else if (data.error?.toLowerCase().includes('valid email')) {
                        setError('Please enter a valid email address.');
                      } else {
                        setError(data.error || 'Something went wrong. Please try again.');
                      }
                    } catch (err) {
                      setError('Network error. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2 rounded-full text-base md:text-sm text-white placeholder-white/70 bg-transparent focus:outline-none focus:ring-0 min-w-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 px-4 py-2 rounded-full bg-white text-blue-500 font-medium hover:bg-gray-100 transition-colors text-sm hover:cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Subscribe'}
                  </button>
                </form>
              )}
              {error && (
                <div className="mt-4 text-red-500 text-sm text-center bg-white/80 rounded-full px-4 py-2 max-w-fit mx-auto animate-fade-in">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Dark background */}
      <footer
        ref={containerRef}
        {...(enableHoverFx && {
          onMouseMove: handleMouseMove,
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        })}
        className="relative z-20 group bg-[#101828] text-white overflow-hidden"
      >
        <div className="relative w-full">
          {/* Gradient overlay effect — desktop only */}
          <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: isHovering ? 0.5 : 0,
                background: `linear-gradient(90deg, #35B5F5 0%, #6779FF 100%), url("/images/bg-grid.svg")`,
                backgroundSize: 'cover',
                backgroundBlendMode: 'overlay',
                WebkitMaskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 80%)`,
                maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 80%)`,
              }}
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-10 md:pt-22 md:pb-12">
            {/* Footer Links */}
            <div className="flex flex-col-reverse gap-6 px-0 text-sm text-white/90 mb-1 md:mb-4 md:px-10 md:gap-10 md:flex-row">
              {/* First Column - Logo and Social Icons */}
              <div className="flex flex-col md:flex-col items-center sm:pr-12 space-y-6 col-span-2 md:col-span-1">
                <a href="/" style={{ touchAction: 'manipulation' }}>
                  <HeroLogo width={70} height={70} className="object-contain" />
                </a>
                {/* Social Icons */}
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/ai.ariia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.059 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/ariiaai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://m.youtube.com/@ariiaai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ariia-ai?trk=profile-position"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="w-full grid grid-cols-3 justify-center md:grid-cols-3 gap-4 md:gap-8 text-sm text-white/70 mb-0 md:mb-4">
                {/* Second Column */}
                <div>
                  <ul className="space-y-3">
                    {FOOTER_LINKS[1].map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className={FOOTER_NAV_LINK_CLASS} style={{ touchAction: 'manipulation' }}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Third Column */}
                <div>
                  <ul className="space-y-3">
                    {FOOTER_LINKS[2].map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className={FOOTER_NAV_LINK_CLASS} style={{ touchAction: 'manipulation' }}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fourth Column */}
                <div>
                  <ul className="space-y-3">
                    {FOOTER_LINKS[3].map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className={FOOTER_NAV_LINK_CLASS} style={{ touchAction: 'manipulation' }}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Copyright */}
            <div className="text-center text-white text-xs pt-6">
              © 2026 ARIIA AI. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
