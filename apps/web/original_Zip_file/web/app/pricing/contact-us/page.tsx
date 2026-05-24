'use client';
import { Header } from '../../../components/homepage/header';
import { NewsletterFooter } from '../../../components/homepage/footer';
import { Share2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShareModal } from '@/components/homepage/ShareModal';
import { SectionHeader } from '@/components/SectionHeader';
import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';

export default function PricingContactUs() {
  const [showShare, setShowShare] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    callMinutes: '',
    message: '',
  });

  const shareTitle = 'Contact Us';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError('');
  };

  const applyFieldBorderGlow = (
    element: HTMLInputElement | HTMLTextAreaElement,
    clientX: number,
    clientY: number,
  ) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    element.style.borderColor = 'transparent';
    element.style.background = `linear-gradient(#fff, #fff) padding-box, radial-gradient(110px circle at ${x}px ${y}px, rgba(59, 107, 255, 0.92) 0%, rgba(121, 216, 245, 0.75) 38%, rgba(59, 107, 255, 0) 72%) border-box`;
    element.style.boxShadow = '0 8px 20px rgba(59, 107, 255, 0.12)';
  };

  const clearFieldBorderGlow = (element: HTMLInputElement | HTMLTextAreaElement) => {
    element.style.background = '';
    element.style.borderColor = '';
    element.style.boxShadow = '';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touchMatch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(touchMatch);
  }, []);

  const handleFieldMouseMove = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTouchDevice) return;
    applyFieldBorderGlow(e.currentTarget, e.clientX, e.clientY);
  };

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    applyFieldBorderGlow(e.currentTarget, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleFieldMouseLeave = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTouchDevice) return;
    if (document.activeElement !== e.currentTarget) {
      clearFieldBorderGlow(e.currentTarget);
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTouchDevice) return;
    clearFieldBorderGlow(e.currentTarget);
  };

  const formFieldClassName =
    'cursor-glow-field w-full rounded-xl bg-white text-black px-4 py-3 border border-gray-200 placeholder:text-sm placeholder:text-gray-300 focus:outline-none transition-all duration-200';

  const mobileFormFieldClassName =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-sm placeholder:text-gray-300 focus:outline-none transition-all duration-200';

  const activeFormFieldClassName = isTouchDevice ? mobileFormFieldClassName : formFieldClassName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/enterprise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setSubmitError(data?.error || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success — clear form and show dialog
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        website: '',
        callMinutes: '',
        message: '',
      });
      setShowDialog(true);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff]">
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        shareTitle={shareTitle}
        shareUrl={shareUrl}
      />
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute w-[760px] h-[760px] top-[-280px] left-[8%] rounded-full blur-[180px] bg-gradient-to-r from-[#79D8F5] to-[#E8F3FF] opacity-25" />
        <div className="absolute w-[560px] h-[560px] top-[20%] left-1/2 -translate-x-1/2 rounded-full blur-[160px] bg-gradient-to-br from-[#C4CDF3] to-[#D0F0FB] opacity-30" />
        <div className="absolute w-[620px] h-[620px] bottom-[-260px] right-[0%] rounded-full blur-[170px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-20" />
      </div>

      <Header isHomePage={false} />
      {/* Back Button */}
      <div className="w-full flex items-center justify-between pt-24 md:pt-32 pb-2 px-5 md:px-4 max-w-6xl mx-auto z-10 relative">
        <Link href="/pricing">
          <span className="flex items-center text-gray-700 hover:text-blue-700 font-medium text-base cursor-pointer transition-colors">
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

      <div className="flex-1 flex flex-col items-center px-4 pt-2 md:-mt-15 pb-10 md:pb-16">
        <div className="w-full max-w-6xl text-center [&_h1]:text-center [&_h1]:mx-auto [&_h1]:pt-3 [&_h1]:md:pt-4 [&_h1]:pb-2">
          <SectionHeader
            tag="Enterprise"
            title="Drive Business Growth with"
            gradientTitle="Scalable AI Agents"
          />
        </div>

        <div className="w-full max-w-6xl mx-auto md:p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] gap-6 md:gap-8 lg:gap-6 items-start">
          {/* Right Info Box */}
          <div className="order-1 md:order-2 w-full md:max-w-[420px] bg-white/90 rounded-2xl py-6 px-4 md:pt-6 md:pb-4 self-start z-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-left">
              Discuss Your Use Case!
            </h2>
            <ul className="space-y-3 bg-gradient-to-br from-[#42ACE1]/5 via-[#50C6F0]/10 to-[#54CAF2]/40 rounded-xl p-4 shadow-md">
              <li className="flex items-start gap-2 text-sm font-medium text-gray-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-black inline-block flex-shrink-0" />A
                consultation to understand your goals and challenges
              </li>
              <li className="flex items-start gap-2 text-sm font-medium text-gray-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-black inline-block flex-shrink-0" />
                Tailored recommendations based on relevant use cases
              </li>
              <li className="flex items-start gap-2 text-sm font-medium text-gray-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-black inline-block flex-shrink-0" />A
                personalized demo aligned with your workflows
              </li>
              <li className="flex items-start gap-2 text-sm font-medium text-gray-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-black inline-block flex-shrink-0" />
                Free onboarding to get you started quickly
              </li>
              <li className="flex items-start gap-2 text-sm font-medium text-gray-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-black inline-block flex-shrink-0" />
                Ongoing support for setup, scalability, and custom integrations
              </li>
            </ul>
          </div>

          {/* Form */}
          <form
            id="enterprise-inquiry-form"
            className="pricing-contact-mobile-form order-2 md:order-1 w-full md:max-w-none grid grid-cols-1 md:grid-cols-2 gap-6 z-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={activeFormFieldClassName}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                required
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={activeFormFieldClassName}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Company name</label>
              <input
                type="text"
                placeholder="Enter company name"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={activeFormFieldClassName}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Phone number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={activeFormFieldClassName}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-sm font-medium text-gray-700">
                What's your company's website?
              </label>
              <input
                type="text"
                placeholder="Enter company website"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={activeFormFieldClassName}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-sm font-medium text-gray-700">
                How many call minutes do you handle per month?
              </label>
              <input
                type="text"
                placeholder="Enter your estimated monthly calls (e.g. 10,000 minutes)"
                value={form.callMinutes}
                onChange={(e) => handleChange('callMinutes', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={formFieldClassName}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-sm font-medium text-gray-700">Message</label>
              <textarea
                placeholder="Enter your message"
                rows={3}
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                onMouseMove={handleFieldMouseMove}
                onMouseLeave={handleFieldMouseLeave}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className={`${activeFormFieldClassName} resize-none`}
              />
            </div>

            {submitError && (
              <p className="md:col-span-2 text-center text-red-500 text-sm">{submitError}</p>
            )}

            <div className="hidden md:col-span-2 md:flex justify-center mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-8 py-2 shadow-md cursor-pointer hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sticky CTA on mobile to mirror careers interaction */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <button
          form="enterprise-inquiry-form"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>

      {/* Success Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-sm">
          <div className="bg-white relative overflow-hidden rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full flex flex-col items-center text-center">
            <div className="absolute inset-0">
              <div className="absolute z-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] top-[0px] left-[0px] bg-gradient-to-br from-[#a3eeff] via-white to-[#a3eeff] opacity-90 blur-[70px]" />
            </div>
            <div className={cn('absolute inset-0 w-full h-full pointer-events-none p-2 md:p-4')}>
              <Image
                src={'/images/hexagon.svg'}
                alt="Pattern"
                fill
                className="object-fit opacity-65"
              />
            </div>
            <h2 className="text-xl md:text-3xl font-semibold mb-3 md:mb-5 z-10 text-gray-900">
              Thank You for Your Interest
            </h2>
            <p className="text-gray-700 mb-3 text-sm z-10 md:text-base md:mb-5">
              We've received your enterprise demo request. A member of our team will be in touch
              shortly — typically within the hour — to schedule a time that works best for you.
            </p>
            <button
              className="w-full h-10 md:h-12 bg-[#1976FF] text-white z-10 rounded-full py-2 font-semibold hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe]"
              onClick={() => setShowDialog(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
      <div className="relative z-10">
        <NewsletterFooter isHomePage={false} />
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .pricing-contact-mobile-form {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .pricing-contact-mobile-form > div {
            width: 90%;
            margin-left: auto;
            margin-right: auto;
          }
        }

        .cursor-glow-field {
          border: 1px solid #e5e7eb;
          background: #fff;
          transition:
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease;
        }
      `}</style>
    </section>
  );
}
