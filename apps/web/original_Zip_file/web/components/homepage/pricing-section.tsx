'use client';
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { GradientHeader } from './GradientHeader';
import { FadeInWhenInView } from './hero-section';

interface PricingData {
  seo?: any;
  title?: string;
  styledTitle?: string;
  tag?: string;
  heroSection?: {
    title?: string;
    tag?: string;
    description?: string;
    backgroundImage?: {
      url: string;
      alternativeText?: string;
    };
    sliderInfo?: {
      title?: string;
      subtext?: string;
      startRange?: number;
      endRange?: number;
      pricePerMin?: number;
      cta?: {
        ctaText?: string;
        httpsUrl?: string;
        internalUrl?: string;
      };
    };
  };
  subscriptionSection?: {
    header?: {
      title?: string;
      styledTitle?: string;
      tag?: string;
      description?: string;
    };
    pricingDetails?: {
      plans?: Array<{
        planType?: string;
        planOptions?: Array<{
          id: string;
          icon?: {
            url: string;
            alternativeText?: string;
          };
          title?: string;
          planValue?: string;
          description?: string;
          backgroundImage?: {
            url: string;
            alternativeText?: string;
          };
          cta?: {
            ctaText?: string;
            httpsUrl?: string;
            internalUrl?: string;
          };
          extraCharges?: Array<{
            id: string;
            text: string;
          }>;
        }>;
      }>;
    };
  };
  pricingTable?: {
    title?: string;
    header?: {
      title?: string;
      styledTitle?: string;
      tag?: string;
      description?: string;
    };
    featurePricing?: Array<{
      id: string;
      title?: string;
      feature_pricings?: Array<{
        documentId: string;
        title?: string;
        featureValue?: Array<{
          id: string;
          value?: string;
          check?: boolean;
          plan_feature?: {
            title?: string;
            pricing?: string;
          };
        }>;
      }>;
    }>;
  };
}

const GradientSquare = ({ image, alt, style }: { image: string; alt: string; style: string }) => {
  return (
    <div className="w-11 h-11 mb-3 bg-gradient-to-r from-[#9eb6fc] to-[#99cbfc] p-2 border-2 border-[#b0cbfc] rounded-lg flex items-center justify-center">
      <img src={image} alt={alt} className={style} />
    </div>
  );
};

export function PricingSection({ pricing }: { pricing: PricingData }) {
  const [minutes, setMinutes] = useState(pricing?.heroSection?.sliderInfo?.startRange || 3000);
  const [billing, setBilling] = useState('annually');

  // Get pricing values from Strapi or fallback to defaults
  const MIN_MINUTES = pricing?.heroSection?.sliderInfo?.startRange || 1;
  const MAX_MINUTES = pricing?.heroSection?.sliderInfo?.endRange || 6000;
  const PRICE_PER_MINUTE = pricing?.heroSection?.sliderInfo?.pricePerMin || 0.22;

  const price = (minutes * PRICE_PER_MINUTE).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

  const percent = ((minutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES)) * 100;

  // Get subscription plans from Strapi and filter based on billing selection
  const subscriptionPlans = pricing?.subscriptionSection?.pricingDetails?.plans || [];

  const normalizePlanType = (planType?: string) => {
    const value = (planType || '').toLowerCase();
    if (value.includes('month')) return 'monthly';
    if (value.includes('annual') || value.includes('year')) return 'annually';
    return '';
  };

  // Get the appropriate plan set based on billing selection
  const monthlyPlans =
    subscriptionPlans.find((p) => normalizePlanType(p.planType) === 'monthly')?.planOptions || [];
  const annualPlans =
    subscriptionPlans.find((p) => normalizePlanType(p.planType) === 'annually')?.planOptions || [];

  const currentPlanSet =
    billing === 'monthly'
      ? monthlyPlans.length > 0
        ? monthlyPlans
        : annualPlans
      : annualPlans.length > 0
        ? annualPlans
        : monthlyPlans;

  const subscriptionTag = (
    pricing?.subscriptionSection?.header?.tag || 'Subscription Plans'
  ).replace(/Subcription/gi, 'Subscription');

  // Separate regular plans from enterprise (Custom) plan
  const regularPlans = currentPlanSet.filter((plan) => plan.title !== 'Custom');
  const enterprisePlans = currentPlanSet.filter((plan) => plan.title === 'Custom');

  // Helper function to extract numeric value from planValue string
  const getPlanValueNumber = (planValue: string) => {
    if (!planValue || planValue === 'Custom') return 0;
    const numericValue = planValue.replace(/[^0-9]/g, '');
    return parseInt(numericValue) || 0;
  };

  const getStrapiPlanPrice = (title: string) => {
    if (title === 'Pay-As-You-Go') return `$${PRICE_PER_MINUTE.toFixed(2)} per min`;
    if (title === 'Enterprise') return 'Custom';

    // Fallback numbers just in case CMS fails
    const defaultPrices: Record<string, number> = {
      Starter: 199,
      Growth: 379,
      Scale: 699,
      Business: 949,
    };

    const plan = currentPlanSet.find((p: any) => p.title === title);
    let basePrice = defaultPrices[title] || 0;

    if (plan && plan.planValue && plan.planValue !== 'Custom') {
      basePrice = parseFloat(plan.planValue.replace(/[^0-9.]/g, '') || '0');
    }

    // When annual plans are not returned from CMS, show a graceful annual fallback.
    const finalPrice =
      billing === 'annually' && annualPlans.length === 0 ? Math.round(basePrice * 0.9) : basePrice;

    return `$${finalPrice}/month`;
  };

  const shouldShowAnnualNote = (title: string) =>
    billing === 'annually' && title !== 'Pay-As-You-Go' && title !== 'Enterprise';

  const HARDCODED_FEATURES = [
    { feature: 'Minutes Included', values: ['—', '1,000', '2,000', '4,000', '6,000', 'Custom'] },
    { feature: 'Extra Minutes', values: ['—', '$0.18', '$0.16', '$0.14', '$0.12', 'Custom'] },
    { feature: '24/7 Call Answering', values: [true, true, true, true, true, true] },
    { feature: 'Multilingual Support', values: [true, true, true, true, true, true] },
    { feature: 'Voice Cloning', values: [false, false, true, true, true, true] },
    { feature: 'Appointment Scheduling', values: [true, true, true, true, true, true] },
    { feature: 'Reservation Management', values: [true, true, true, true, true, true] },
    { feature: 'Live Menu Sync', values: [true, true, true, true, true, true] },
    { feature: 'Voice Orders', values: [true, true, true, true, true, true] },
    { feature: 'Customer Memory', values: [true, true, true, true, true, true] },
    { feature: 'Secure Phone Payments', values: [true, true, true, true, true, true] },
    { feature: 'Follow-Up Calls', values: [true, true, true, true, true, true] },
    { feature: 'Unlimited Concurrent Calls', values: [true, true, true, true, true, true] },
    { feature: 'Call Recording', values: [true, true, true, true, true, true] },
    { feature: 'Call Summary', values: [true, true, true, true, true, true] },
    { feature: 'Transcription', values: [true, true, true, true, true, true] },
    { feature: 'Smart SMS Messaging', values: [true, true, true, true, true, true] },
    { feature: 'Human Transfer', values: [true, true, true, true, true, true] },
    { feature: 'Knowledge Base', values: [true, true, true, true, true, true] },
    {
      feature: 'Real-Time Intelligence & Performance Analytics',
      values: [true, true, true, true, true, true],
    },
    { feature: 'Rebilling', values: ['—', true, true, true, true, true] },
    { feature: 'Free Onboarding', values: [true, true, true, true, true, true] },
    { feature: '1 Free Phone Number', values: [true, true, true, true, true, true] },
    {
      feature: 'Extra Phone Numbers',
      values: ['$1.50/month', '$1.50/month', '$1.50/month', '$1.50/month', '$1.50/month', true],
    },
    {
      feature: 'Priority Support (Slack/WhatsApp)',
      values: [false, false, true, true, true, true],
    },
  ];

  const HARDCODED_COLUMNS = [
    { title: 'Pay-As-You-Go', getPrice: () => getStrapiPlanPrice('Pay-As-You-Go') },
    { title: 'Starter', getPrice: () => getStrapiPlanPrice('Starter') },
    { title: 'Growth', getPrice: () => getStrapiPlanPrice('Growth') },
    { title: 'Scale', getPrice: () => getStrapiPlanPrice('Scale') },
    { title: 'Business', getPrice: () => getStrapiPlanPrice('Business') },
    { title: 'Enterprise', getPrice: () => getStrapiPlanPrice('Enterprise') },
  ];

  const payAsYouGoDescription = pricing?.heroSection?.description?.trim();
  const payAsYouGoPhrase = 'deducted as you use them.';
  const payAsYouGoHasSplitPhrase = (payAsYouGoDescription || '')
    .toLowerCase()
    .includes(payAsYouGoPhrase);
  const payAsYouGoBeforePhrase = payAsYouGoHasSplitPhrase
    ? (payAsYouGoDescription || '').slice(
        0,
        (payAsYouGoDescription || '').toLowerCase().indexOf(payAsYouGoPhrase),
      )
    : '';

  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex flex-col justify-start pt-16 md:pt-[120px] pb-16 md:pb-12">
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[800px] h-[800px] top-[-250px] left-[10%] rounded-full blur-[180px] bg-gradient-to-r from-[#79D8F5] to-[#E8F3FF] opacity-20" />
        <div className="absolute w-[600px] h-[600px] bottom-[-200px] right-[5%] rounded-full blur-[160px] bg-gradient-to-tr from-[#BFD9FF] to-[#E5EFFF] opacity-10" />
        <div className="absolute w-[700px] h-[700px] top-[30%] left-[50%] -translate-x-1/2 rounded-full blur-[140px] bg-gradient-to-br from-[#B5D5FF] to-[#D7EBFF] opacity-10" />
      </div>

      {/* Main Content */}
      <div className="w-full lg:px-20 md:px-10 px-6">
        {/* Header */}
        <FadeInWhenInView>
          <div className="text-center pt-10 md:pt-0 mb-[30px] md:mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#DEF4FA] text-blue-700">
                {pricing?.tag || 'Pricing'}
              </span>
            </div>
            <h1 className="text-gray-900 font-bold text-[32px] leading-[42px] md:text-[40px] md:leading-[52px] tracking-tight">
              <span className="block md:inline">{pricing?.title || 'Flexible Pricing'}</span>
              <span className="block md:inline text-transparent bg-clip-text bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9] md:ml-2">
                {pricing?.styledTitle || 'Designed to Scale'}
              </span>
            </h1>
          </div>
        </FadeInWhenInView>

        {/* Pay-As-You-Go Section */}
        <FadeInWhenInView delay={120}>
          <div
            className="relative w-[93%] sm:w-full max-w-[1113px] rounded-3xl shadow-xl bg-[#101828] bg-cover bg-center p-6 sm:p-8 md:p-10 text-white text-center flex flex-col items-center overflow-hidden mx-auto my-6 sm:my-10 md:my-12"
            style={{
              backgroundImage: pricing?.heroSection?.backgroundImage?.url
                ? `url('${pricing.heroSection.backgroundImage.url}')`
                : "url('/images/newsletter-bg.png')",
            }}
          >
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="mb-4">
                <span className="px-4 py-2 rounded-full text-xs font-semibold bg-[#DEF4FA] text-blue-700">
                  {pricing?.heroSection?.tag || 'Pay-As-You-Go'}
                </span>

                <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2 text-balance">
                  {pricing?.heroSection?.title || 'Pay Only for the Minutes You Use'}
                </h2>
                <div className="text-white/80 mb-6 text-base md:text-lg max-w-4xl mx-auto [&_p]:m-0">
                  {payAsYouGoDescription ? (
                    payAsYouGoHasSplitPhrase ? (
                      <p>
                        {payAsYouGoBeforePhrase}
                        <span className="block md:inline whitespace-nowrap">
                          {payAsYouGoPhrase}
                        </span>
                      </p>
                    ) : (
                      <ReactMarkdown>{payAsYouGoDescription}</ReactMarkdown>
                    )
                  ) : (
                    <p>
                      No monthly commitment-ideal for businesses with low volume and unpredictable
                      needs. Add funds to your account balance, and minutes are{' '}
                      <span className="block md:inline whitespace-nowrap">
                        deducted as you use them.
                      </span>
                    </p>
                  )}
                </div>
                <div className="mb-6 w-full max-w-4xl mx-auto">
                  <span className="block text-white mb-1 text-base font-semibold">
                    {pricing?.heroSection?.sliderInfo?.title || 'See Pricing Based on Usage'}
                  </span>
                  <span className="block text-white/90 font-normal text-base mb-3">
                    {pricing?.heroSection?.sliderInfo?.subtext ||
                      `($${PRICE_PER_MINUTE.toFixed(2)} Per Minute)`}
                  </span>
                  {/* Slider UI */}
                  <div className="flex items-center gap-2 justify-between text-sm text-white mb-2">
                    <span>{MIN_MINUTES} min</span>
                    <span>{MAX_MINUTES} min</span>
                  </div>
                  <div className="relative w-full flex items-center h-8">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-3 rounded-lg bg-blue-900/40" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-3 rounded-lg bg-blue-500"
                      style={{ width: `${percent}%` }}
                    />
                    <input
                      type="range"
                      min={MIN_MINUTES}
                      max={MAX_MINUTES}
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="w-full appearance-none bg-transparent -mt-5 z-10 slider-custom"
                      style={{ accentColor: '#3B6BFF' }}
                    />
                  </div>
                  <div className="mt-2 flex justify-center">
                    <span className="inline-block max-w-full bg-blue-600 text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-semibold shadow-lg border-2 border-white/30">
                      {price}/{minutes.toLocaleString()} min
                    </span>
                  </div>
                </div>
                {pricing?.heroSection?.sliderInfo?.cta && (
                  <Link
                    href={
                      pricing.heroSection.sliderInfo.cta.internalUrl ||
                      pricing.heroSection.sliderInfo.cta.httpsUrl ||
                      '#'
                    }
                    target={pricing.heroSection.sliderInfo.cta.httpsUrl ? '_blank' : undefined}
                  >
                    <button className="mt-4 px-5 py-2 rounded-full bg-white text-blue-700 font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 text-base shadow-md border-2 border-blue-100 hover:cursor-pointer">
                      {pricing.heroSection.sliderInfo.cta.ctaText || '1-Month Free Trial'}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </FadeInWhenInView>
      </div>

      {/* Subscription Plans Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center mt-8 md:mt-2 mb-0 md:my-[20px]">
        <FadeInWhenInView>
          <div className="text-center mb-6 md:mb-12 mx-10">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#DEF4FA] text-blue-700">
                {subscriptionTag}
              </span>
            </div>
            <h1 className="text-gray-900 font-bold text-[32px] leading-[42px] md:text-[40px] md:leading-[52px] tracking-tight">
              {pricing?.subscriptionSection?.header?.title || 'Plan that'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9]">
                {pricing?.subscriptionSection?.header?.styledTitle || 'Grows with Your Business'}
              </span>
            </h1>
            {pricing?.subscriptionSection?.header?.description && (
              <div className="mt-2 text-gray-600">
                <ReactMarkdown>{pricing.subscriptionSection.header.description}</ReactMarkdown>
              </div>
            )}
          </div>
        </FadeInWhenInView>

        {/* Toggle Capsule */}
        <FadeInWhenInView delay={120} className="relative z-[20]">
          <div className="flex items-center justify-center relative z-[60] mb-10 min-h-[52px]">
            <div className="flex isolate bg-white rounded-full p-1.5 shadow-lg relative z-[60]">
              <button
                type="button"
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all hover:cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-[#1976FF] text-white shadow'
                    : 'bg-white text-blue-700 hover:bg-[#f5f9ff]'
                }`}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all hover:cursor-pointer ${
                  billing === 'annually'
                    ? 'bg-[#1976FF] text-white shadow'
                    : 'bg-white text-blue-700 hover:bg-[#f5f9ff]'
                }`}
                onClick={() => setBilling('annually')}
              >
                Annually (-10%)
              </button>
            </div>
          </div>
        </FadeInWhenInView>

        {/* Plans Grid - 3 columns, 2 rows, center card spans 2 rows */}
        {/* Plans Grid - 3 columns, 2 rows, center card spans 2 rows */}
        <div className="relative z-0 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative gap-6 w-full lg:px-20 md:px-10 px-6 sm:px-10">
            <div className="pointer-events-none absolute top-[-100px] left-[0%] z-0 w-full h-[320px] rounded-full blur-3xl opacity-10 bg-[linear-gradient(135deg,_#36C5F0_0%,_#58E6FD_100%)]"></div>
            <div className="pointer-events-none absolute top-[400px] left-[0%] z-0 w-full h-[220px] rounded-full blur-3xl opacity-20 bg-[linear-gradient(135deg,_#36C5F0_0%,_#58E6FD_100%)]"></div>
            {/* For mobile only */}
            <div className="pointer-events-none absolute block md:hidden bottom-[600px] left-[0%] z-0 w-full h-[220px] rounded-full blur-2xl opacity-8 bg-[linear-gradient(135deg,_#36C5F0_0%,_#58E6FD_100%)]"></div>
            <div className="pointer-events-none absolute block md:hidden bottom-[400px] left-[0%] z-0 w-full h-[220px] rounded-full blur-2xl opacity-8 bg-[linear-gradient(135deg,_#36C5F0_0%,_#58E6FD_100%)]"></div>
            <div className="pointer-events-none absolute block md:hidden bottom-[-20px] left-[0%] z-0 w-full h-[220px] rounded-full blur-2xl opacity-8 bg-[linear-gradient(135deg,_#36C5F0_0%,_#58E6FD_100%)]"></div>

            {/* Map Strapi plans to fixed order: Starter, Growth, Scale, Business, Enterprise (Custom) */}
            {(() => {
              // Map plan titles to image and bg
              const planImages: Record<string, string> = {
                Starter: '/images/starter.svg',
                Growth: '/images/growth.svg',
                Scale: '/images/scale.svg',
                Business: '/images/business.svg',
                Enterprise: '/images/enterprise.svg',
                Custom: '/images/enterprise.svg',
              };
              const planBgs: Record<string, string> = {
                Starter: '/images/starter-bg.png',
                Growth: '/images/growth-bg.png',
                Scale: '/images/scale-bg.png',
                Business: '/images/business-bg.png',
                Enterprise: '/images/enterprise-bg.png',
                Custom: '/images/enterprise-bg.png',
              };
              // Get plans by title
              const getPlan = (title: string) => currentPlanSet.find((p) => p.title === title);
              const starter = getPlan('Starter');
              const growth = getPlan('Growth');
              const scale = getPlan('Scale');
              const business = getPlan('Business');
              const enterprise = currentPlanSet.find(
                (p) => p.title === 'Custom' || p.title === 'Enterprise',
              );
              // Keep card prices in sync with table prices using one resolver.
              const getPrice = (plan: any) => {
                if (!plan) return '-';
                return getStrapiPlanPrice(plan.title || '').replace(/\/month.*$/, '');
              };
              const priceCycleLabel = '/month';
              const annualBillingLabel = '(billed annually)';
              // Helper for extra charges
              const renderCharges = (plan: any) =>
                plan?.extraCharges?.map((charge: any) => (
                  <span key={charge.id} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {charge.text}
                  </span>
                ));
              return (
                <>
                  {/* Left Column (Starter, Growth) */}
                  <div className="flex flex-col z-10 gap-6">
                    {/* Starter */}
                    {starter && (
                      <FadeInWhenInView delay={100} className="h-full">
                        <div
                          className="w-[355px] max-w-full mx-auto md:w-auto bg-white bg-blend-multiply rounded-3xl shadow-lg p-5 flex flex-col items-start border-2 border-white hover:border-2 hover:border-[#3B6BFF] h-full"
                          style={{
                            backgroundImage: `url(${starter.backgroundImage?.url || planBgs.Starter})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <GradientSquare
                              image={planImages.Starter}
                              alt="Starter"
                              style="w-10 h-10"
                            />
                            <span className="text-black font-normal text-md mb-2">
                              {starter?.title || 'Starter'}
                            </span>
                          </div>
                          <span className="text-3xl font-bold text-gray-900 mb-1">
                            {getPrice(starter)}
                            <span className="text-base font-medium text-gray-400">
                              {priceCycleLabel}
                            </span>
                            <span
                              className={`ml-1 text-xs font-semibold text-black transition-opacity ${
                                billing === 'annually' ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              {annualBillingLabel}
                            </span>
                          </span>

                          <p className="text-gray-500 text-sm mb-4">{starter.description}</p>
                          {starter.cta && (
                            <button className="w-full bg-[#1976FF] text-white rounded-full py-2 font-semibold mb-3 hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe] transition-all duration-200 transform hover:scale-105">
                              {starter.cta.ctaText || '1-Month Free Trial'}
                            </button>
                          )}
                          <hr className="w-full border-t border-gray-200 my-2" />
                          <FadeInWhenInView delay={400}>
                            <div className="flex flex-col gap-1 w-full">
                              {starter.extraCharges?.map((charge: any) => (
                                <span
                                  key={charge.id}
                                  className="flex items-center text-sm text-black font-medium"
                                >
                                  <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-500 mr-2">
                                    <Check className="w-4 h-4 text-white" />
                                  </span>
                                  {charge.text}
                                </span>
                              ))}
                            </div>
                          </FadeInWhenInView>
                        </div>
                      </FadeInWhenInView>
                    )}
                    {/* Growth */}
                    {growth && (
                      <FadeInWhenInView delay={200} className="h-full">
                        <div
                          className="w-[355px] max-w-full mx-auto md:w-auto bg-white bg-blend-multiply rounded-3xl shadow-lg p-5 flex flex-col items-start border-2 border-white hover:border-2 hover:border-[#3B6BFF] h-full"
                          style={{
                            backgroundImage: `url(${growth.backgroundImage?.url || planBgs.Growth})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <GradientSquare
                              image={planImages.Growth}
                              alt="Growth"
                              style="w-10 h-10"
                            />
                            <span className="text-black font-normal text-md mb-2">
                              {growth?.title || 'Growth'}
                            </span>
                          </div>
                          <span className="text-3xl font-bold text-gray-900 mb-1">
                            {getPrice(growth)}
                            <span className="text-base font-medium text-gray-400">
                              {priceCycleLabel}
                            </span>
                            <span
                              className={`ml-1 text-xs font-semibold text-black transition-opacity ${
                                billing === 'annually' ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              {annualBillingLabel}
                            </span>
                          </span>
                          <p className="text-gray-500 text-sm mb-4">{growth.description}</p>
                          {growth.cta && (
                            <button className="w-full bg-[#1976FF] text-white rounded-full py-2 font-semibold mb-3 hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe] transition-all duration-200 transform hover:scale-105">
                              {growth.cta.ctaText || '1-Month Free Trial'}
                            </button>
                          )}
                          <hr className="w-full border-t border-gray-200 my-2" />
                          <FadeInWhenInView delay={500}>
                            <div className="flex flex-col gap-1 w-full">
                              {growth.extraCharges?.map((charge: any) => (
                                <span
                                  key={charge.id}
                                  className="flex items-center text-sm text-black font-medium"
                                >
                                  <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-500 mr-2">
                                    <Check className="w-4 h-4 text-white" />
                                  </span>
                                  {charge.text}
                                </span>
                              ))}
                            </div>
                          </FadeInWhenInView>
                        </div>
                      </FadeInWhenInView>
                    )}
                  </div>
                  {/* Center Column (Enterprise, spans 2 rows) */}
                  <FadeInWhenInView delay={300} className="row-span-2 lg:row-span-1">
                    <div className="w-[355px] max-w-full mx-auto md:w-auto h-full z-10 bg-gradient-to-b from-[#141f2e] via-[383e67] to-[#141f2e] bg-blend-multiply rounded-3xl shadow-2xl p-5 flex flex-col items-center border-2 border-[#232B3A] hover:border-2 hover:border-[#3B6BFF] relative overflow-hidden min-h-[750px] justify-between">
                      {/* Enterprise background image, same logic as regular cards */}
                      <div className="absolute inset-0 z-0" />
                      <span className="absolute inset-0 z-0 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#232B3A] before:to-[#101828] before:z-0" />
                      <div className="w-full flex flex-col items-start z-10 relative">
                        <div className="flex items-center gap-2">
                          <GradientSquare
                            image={planImages.Enterprise}
                            alt="Enterprise"
                            style="w-10 h-10"
                          />
                          <span className="text-white font-normal text-md mb-2">
                            {enterprise?.title || 'Enterprise'}
                          </span>
                        </div>
                        <span className="text-3xl font-bold text-white mb-1">Custom</span>
                        <p className="text-gray-200 text-sm mb-4 text-start">
                          {enterprise?.description ||
                            'Designed for enterprises running large-scale operations that require maximum cost efficiency and custom integrations. Get in touch with our team to receive a quote tailored to your needs and usage.'}
                        </p>
                        <Link href="/pricing/contact-us/" className="w-full">
                          <button className="w-full bg-[#1976FF] text-white rounded-full py-2 z-10 font-semibold mb-3 relative hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe] transition-all duration-200 transform hover:scale-105">
                            Contact Us
                          </button>
                        </Link>
                      </div>
                      {/*Enterprise illustration */}
                      <img
                        src="/images/pricing-illu.png"
                        alt="Enterprise Illustration"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[60%] object-cover z-10"
                      />
                      <img
                        src="/images/enterprise-pattern.svg"
                        alt="Enterprise Pattern"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] object-cover z-0"
                      />
                      <div className="absolute bottom-0 left-[60%] -translate-y-1/2 z-0 w-full h-[200px] md:h-[600px] lg:h-[320px] rounded-full blur-3xl opacity-40 bg-[linear-gradient(180deg,_#36C5F0_100%,_#58E6FD_100%)]"></div>
                      <div className="absolute bottom-0 left-[-10%] -translate-y-1/2 z-0 w-full h-[200px] md:h-[600px] lg:h-[320px] rounded-full blur-3xl opacity-40 bg-[linear-gradient(180deg,_#667BD6_100%,_#7F56D9_100%)]"></div>
                    </div>
                  </FadeInWhenInView>
                  {/* Right Column (Scale, Business) */}
                  <div className="flex z-10 flex-col gap-6">
                    {/* Scale */}
                    {scale && (
                      <FadeInWhenInView delay={400} className="h-full">
                        <div
                          className="w-[355px] max-w-full mx-auto md:w-auto bg-white bg-blend-multiply rounded-3xl shadow-lg p-5 flex flex-col items-start border-2 border-white hover:border-2 hover:border-[#3B6BFF] h-full"
                          style={{
                            backgroundImage: `url(${scale.backgroundImage?.url || planBgs.Scale})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <GradientSquare image={planImages.Scale} alt="Scale" style="w-10 h-10" />
                            <span className="text-black font-normal text-md mb-2">
                              {scale?.title || 'Scale'}
                            </span>
                          </div>
                          <span className="text-3xl font-bold text-gray-900 mb-1">
                            {getPrice(scale)}
                            <span className="text-base font-medium text-gray-400">
                              {priceCycleLabel}
                            </span>
                            <span
                              className={`ml-1 text-xs font-semibold text-black transition-opacity ${
                                billing === 'annually' ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              {annualBillingLabel}
                            </span>
                          </span>
                          <p className="text-gray-500 text-sm mb-4">{scale.description}</p>
                          {scale.cta && (
                            <button className="w-full bg-[#1976FF] text-white rounded-full py-2 font-semibold mb-3 hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe] transition-all duration-200 transform hover:scale-105">
                              {scale.cta.ctaText || '1-Month Free Trial'}
                            </button>
                          )}
                          <hr className="w-full border-t border-gray-200 my-2" />
                          <FadeInWhenInView delay={700}>
                            <div className="flex flex-col gap-1 w-full">
                              {scale.extraCharges?.map((charge: any) => (
                                <span
                                  key={charge.id}
                                  className="flex items-center text-sm text-black font-medium"
                                >
                                  <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-500 mr-2">
                                    <Check className="w-4 h-4 text-white" />
                                  </span>
                                  {charge.text}
                                </span>
                              ))}
                            </div>
                          </FadeInWhenInView>
                        </div>
                      </FadeInWhenInView>
                    )}
                    {/* Business */}
                    {business && (
                      <FadeInWhenInView delay={500} className="h-full">
                        <div
                          className="w-[355px] max-w-full mx-auto md:w-auto bg-white bg-blend-multiply rounded-3xl shadow-lg p-5 flex flex-col items-start border-2 border-white hover:border-2 hover:border-[#3B6BFF] h-full"
                          style={{
                            backgroundImage: `url(${business.backgroundImage?.url || planBgs.Business})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <GradientSquare
                              image={planImages.Business}
                              alt="Business"
                              style="w-10 h-10"
                            />
                            <span className="text-black font-normal text-md mb-2">
                              {business?.title || 'Business'}
                            </span>
                          </div>
                          <span className="text-3xl font-bold text-gray-900 mb-1">
                            {getPrice(business)}
                            <span className="text-base font-medium text-gray-400">
                              {priceCycleLabel}
                            </span>
                            <span
                              className={`ml-1 text-xs font-semibold text-black transition-opacity ${
                                billing === 'annually' ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              {annualBillingLabel}
                            </span>
                          </span>
                          <p className="text-gray-500 text-sm mb-4">{business.description}</p>
                          {business.cta && (
                            <button className="w-full bg-[#1976FF] text-white rounded-full py-2 font-semibold mb-3 hover:cursor-pointer hover:bg-[#4a92fe] active:bg-[#4a92fe] transition-all duration-200 transform hover:scale-105">
                              {business.cta.ctaText || '1-Month Free Trial'}
                            </button>
                          )}
                          <hr className="w-full border-t border-gray-200 my-2" />
                          <FadeInWhenInView delay={800}>
                            <div className="flex flex-col gap-1 w-full">
                              {business.extraCharges?.map((charge: any) => (
                                <span
                                  key={charge.id}
                                  className="flex items-center text-sm font-medium text-black"
                                >
                                  <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-500 mr-2">
                                    <Check className="w-4 h-4 text-white" />
                                  </span>
                                  {charge.text}
                                </span>
                              ))}
                            </div>
                          </FadeInWhenInView>
                        </div>
                      </FadeInWhenInView>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Features Table Section */}
      {pricing?.pricingTable && (
        <section className="w-full max-w-7xl mx-auto mt-12 px-2 md:px-6">
          <FadeInWhenInView>
            <div className="flex flex-col items-center mb-8 mx-5">
              <span className="px-4 py-2 rounded-full mb-4 text-sm font-medium bg-[#DEF4FA] text-blue-700">
                {pricing.pricingTable.header?.tag || 'Pricing Table'}
              </span>
              <h1 className="text-gray-900 font-bold text-center text-[32px] leading-[42px] md:text-[40px] md:leading-[52px] tracking-tight">
                {pricing.pricingTable.header?.title || 'Level the Playing Field with AI at'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6BFF] to-[#7F56D9]">
                  {pricing.pricingTable.header?.styledTitle || 'Every Plan'}
                </span>
              </h1>
              {pricing.pricingTable.header?.description && (
                <div className="text-gray-600 text-center mt-2 max-w-2xl">
                  <ReactMarkdown>{pricing.pricingTable.header.description}</ReactMarkdown>
                </div>
              )}
            </div>
          </FadeInWhenInView>

          {/* Desktop Table */}
          <FadeInWhenInView delay={120}>
            <div className="rounded-3xl bg-gradient-to-br from-[#42ACE1]/30 via-[#50C6F0]/10 to-[#54CAF2]/40 p-6 mb-14 shadow-lg hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-gray-700 font-bold">
                      <th className="pb-3 px-4 font-bold text-2xl text-[#1c2657] border-b-[1px] border-dotted border-[#3998fb]">
                        Features
                      </th>
                      {HARDCODED_COLUMNS.map((col, i) => (
                        <th
                          key={i}
                          className="pb-3 text-center text-black text-base px-4 font-medium border-b-[1px] border-dotted border-[#3998fb]"
                        >
                          {col.title}
                          <br />
                          <span className="text-sm text-[#2c3772] font-medium inline-flex flex-col items-center leading-tight min-h-[34px]">
                            <span>{col.getPrice()}</span>
                            <span
                              className={`text-[11px] font-semibold text-black h-[14px] ${
                                shouldShowAnnualNote(col.title) ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              (billed annually)
                            </span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {HARDCODED_FEATURES.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          className={`py-2 px-4 font-semibold ${idx !== HARDCODED_FEATURES.length - 1 ? 'border-b border-[#e1e9f7]' : ''}`}
                        >
                          {row.feature}
                        </td>
                        {row.values.map((val, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`py-2 px-4 text-center ${idx !== HARDCODED_FEATURES.length - 1 ? 'border-b border-[#e1e9f7]' : ''}`}
                          >
                            {typeof val === 'boolean' ? (
                              val ? (
                                <Check
                                  className="mx-auto text-[#2B3674] size-5"
                                  strokeWidth={2.75}
                                />
                              ) : (
                                <X className="mx-auto text-[#2B3674] size-5" strokeWidth={2.75} />
                              )
                            ) : (
                              val
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInWhenInView>

          {/* Mobile Feature Cards */}
          <div className="block md:hidden relative z-20 mx-0 sm:mx-2 mb-4 md:mb-16">
            <div className="flex flex-col gap-4">
              {HARDCODED_FEATURES.map((row, idx) => (
                <FadeInWhenInView key={idx} delay={Math.min(idx * 80, 640)} duration={0.55} yOffset={24}>
                  <div className="rounded-3xl bg-gradient-to-br from-[#42ACE1]/30 via-[#50C6F0]/10 to-[#54CAF2]/40 shadow-md pt-4 flex flex-col gap-3 max-w-[400px] w-full mx-auto relative z-20">
                    <div className="font-medium text-lg text-center text-[#1c2657] mb-2 pb-2 border-b-[1px] border-dotted border-[#3998fb]">
                      {row.feature}
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-6  pb-4">
                      {HARDCODED_COLUMNS.map((col, colIdx) => {
                        const val = row.values[colIdx];
                        return (
                          <React.Fragment key={colIdx}>
                            {colIdx === 3 && (
                              <div className="col-span-3 h-px w-full bg-gray-400/50 -mt-2 mb-2" />
                            )}
                            <div className="flex flex-col items-center justify-center pb-1">
                              <div className="text-sm font-medium text-center text-black mb-1">
                                {col.title}
                              </div>
                              <div className="text-xs text-[#2c3772] font-medium text-center mb-1 inline-flex flex-col items-center leading-tight min-h-[30px]">
                                <span>{col.getPrice()}</span>
                                <span
                                  className={`text-[10px] font-semibold text-black h-[12px] ${
                                    shouldShowAnnualNote(col.title) ? 'opacity-100' : 'opacity-0'
                                  }`}
                                >
                                  (billed annually)
                                </span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {typeof val === 'boolean' ? (
                                  val ? (
                                    <Check className="text-[#2B3674] w-5 h-5" strokeWidth={2.65} />
                                  ) : (
                                    <X className="text-[#2B3674]  w-5 h-5" strokeWidth={2.65} />
                                  )
                                ) : (
                                  val
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </FadeInWhenInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom slider styles */}
      <style jsx global>{`
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b6bff;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59, 107, 255, 0.15);
          cursor: pointer;
          transition: background 0.2s;
        }
        .slider-custom::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b6bff;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59, 107, 255, 0.15);
          cursor: pointer;
          transition: background 0.2s;
        }
        .slider-custom::-ms-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b6bff;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59, 107, 255, 0.15);
          cursor: pointer;
          transition: background 0.2s;
        }
        .slider-custom:focus {
          outline: none;
        }
        .slider-custom::-webkit-slider-runnable-track {
          height: 2px;
          background: transparent;
        }
        .slider-custom::-ms-fill-lower {
          background: transparent;
        }
        .slider-custom::-ms-fill-upper {
          background: transparent;
        }
        .slider-custom::-moz-range-track {
          height: 2px;
          background: transparent;
        }
      `}</style>
    </section>
  );
}
