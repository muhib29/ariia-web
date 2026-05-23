'use client';

import { Header } from '../homepage/header';
import { NewsletterFooter } from '../homepage/footer';
import { Share2 } from 'lucide-react';
import { ShareModal } from '../homepage/ShareModal';
import { useState, FormEvent } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { LocationIcon } from '../icons/LocationIcon';
import { WorkIcon } from '../icons/WorkIcon';
import { ChartCircleIcon } from '../icons/ChartCircleIcon';
import { GiftIcon } from '../icons/GiftIcon';
import { FileUpload } from './FileUpload';
import { SuccessModal } from './SuccessModal';
import { useRouter } from 'next/navigation';
import { SectionHeader } from '../SectionHeader';
import SplineScene from '../SplineScene';
import { SPLINE_SCENES } from '@/config/spline-scenes';
import { FadeInWhenInView } from '../animations/FadeInWhenInView';
import remarkBreaks from 'remark-breaks';

// Define types for the career data
interface CareerJobInfo {
  employment?: string;
  equity?: string;
  experience?: string;
  location?: string;
  salary?: string;
  benefits?: string;
}

interface CareerCTA {
  ctaText?: string;
  httpsUrl?: string;
  internalUrl?: string;
}

interface CareerCard {
  description?: string;
  jobDescription?: string;
  jobInfo?: CareerJobInfo;
  cta?: CareerCTA;
}

interface WhyJoinUs {
  title?: string;
  description?: string;
}

interface CareerData {
  seo?: any;
  title?: string;
  slug?: string;
  careerCard?: CareerCard;
  whyJoinUs?: WhyJoinUs;
}

function normalizeMarkdownContent(raw: unknown): string {
  if (typeof raw === 'string') {
    return raw
      .replace(/\r\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\u00a0/g, ' ')
      .trim();
  }

  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizeMarkdownContent(item))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  if (raw && typeof raw === 'object') {
    const asRecord = raw as Record<string, unknown>;

    if (typeof asRecord.content === 'string') {
      return normalizeMarkdownContent(asRecord.content);
    }

    if (typeof asRecord.text === 'string') {
      return normalizeMarkdownContent(asRecord.text);
    }

    if (Array.isArray(asRecord.children)) {
      return normalizeMarkdownContent(asRecord.children);
    }
  }

  return '';
}

interface FormData {
  name: string;
  email: string;
  linkedin: string;
  college: string;
  location: string;
  salaryExpectations: string;
  resume: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export function CareerDetailClient({ careerData }: { careerData: CareerData }) {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false); // NEW: Toggle between job description and form

  const shareTitle = careerData.title || 'Career Opportunity';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    linkedin: '',
    college: '',
    location: '',
    salaryExpectations: '',
    resume: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobData = careerData;
  const isSalesRepresentativeRole = jobData.slug === 'sales-representative';
  const targetEarningsLabel = isSalesRepresentativeRole
    ? 'What are your annual target earning goals?'
    : 'What are your salary expectations?';
  const targetEarningsPlaceholder = isSalesRepresentativeRole
    ? 'Enter your annual target earning goals'
    : 'Enter your salary expectations';
  const careerDescription = normalizeMarkdownContent(jobData.careerCard?.description);
  const careerJobDescription = normalizeMarkdownContent(jobData.careerCard?.jobDescription);
  const whyJoinUsDescription = normalizeMarkdownContent(jobData.whyJoinUs?.description);

  const jobInfo = [
    {
      icon: WorkIcon,
      label: 'Employment',
      value: jobData.careerCard?.jobInfo?.employment ?? 'N/A',
    },
    ...(isSalesRepresentativeRole
      ? []
      : [
          {
            icon: ChartCircleIcon,
            label: 'Equity',
            value: jobData.careerCard?.jobInfo?.equity ?? 'N/A',
          },
          {
            icon: GiftIcon,
            label: 'Benefits',
            value: jobData.careerCard?.jobInfo?.benefits ?? 'N/A',
          },
        ]),
    {
      icon: LocationIcon,
      label: 'Location',
      value: jobData.careerCard?.jobInfo?.location ?? 'N/A',
    },
  ];

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLinkedIn = (url: string): boolean => {
    if (!url) return true;
    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[\w-]+\/?$/i;
    return linkedInRegex.test(url);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.linkedin && !validateLinkedIn(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn profile URL';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!isSalesRepresentativeRole && !formData.resume) {
      newErrors.resume = 'Please upload your resume';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, resume: file }));
    if (errors.resume) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.resume;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('linkedin', formData.linkedin);
      payload.append('college', formData.college);
      payload.append('location', formData.location);
      payload.append('salaryExpectations', formData.salaryExpectations);
      payload.append('role', jobData.title || '');
      if (formData.resume) {
        payload.append('resume', formData.resume, formData.resume.name);
      }

      const res = await fetch('/api/career-application', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setErrors((prev) => ({
          ...prev,
          submit: data?.error || 'Submission failed. Please try again.',
        }));
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        linkedin: '',
        college: '',
        location: '',
        salaryExpectations: '',
        resume: null,
      });
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Network error. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Handle back button click
  const handleBackClick = () => {
    if (showForm) {
      // If form is showing, go back to job description
      setShowForm(false);
    } else {
      // If job description is showing, navigate to careers page
      router.push('/careers');
    }
  };

  // NEW: Handle apply button click
  const handleApplyClick = () => {
    setShowForm(true);
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

  const handleFieldMouseMove = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    applyFieldBorderGlow(e.currentTarget, e.clientX, e.clientY);
  };

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    applyFieldBorderGlow(e.currentTarget, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleFieldMouseLeave = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (document.activeElement !== e.currentTarget) {
      clearFieldBorderGlow(e.currentTarget);
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearFieldBorderGlow(e.currentTarget);
  };

  const formFieldClassName =
    'career-glow-field w-full text-black rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder:text-sm placeholder:text-gray-300 focus:outline-none transition-all duration-200';

  const markdownComponents: Components = {
    p: (props) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3" {...props} />,
    h4: (props) => <h4 className="text-lg font-bold text-gray-900 mt-4 mb-3" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />,
    li: (props) => <li className="leading-relaxed" {...props} />,
    a: (props) => <a className="text-blue-700 underline underline-offset-2" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-4"
        {...props}
      />
    ),
    br: () => <br />,
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#f7fcff] via-[#f6f8ff] to-[#eaf6ff]">
        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          shareTitle={shareTitle}
          shareUrl={shareUrl}
        />
        <SuccessModal
          isOpen={showSuccess}
          onCloseAction={() => setShowSuccess(false)}
          message={
            isSalesRepresentativeRole
              ? "Thank you for applying for the Sales Rep role and supporting our mission to reshape how businesses operate with AI agents. We'll be in touch soon with next steps."
              : undefined
          }
        />

        {/* Background Blurs */}
        <div className="absolute inset-0 z-0">
          {showForm ? (
            <>
              <div className="absolute w-[250px] h-[300px] md:w-[400px] md:h-[400px] top-[300px] left-[40%] bg-gradient-to-r from-[#C4CDF3] to-[#D0F0FB] opacity-25 blur-[100px]" />
              <div className="absolute w-[250px] h-[300px] md:w-[400px] md:h-[400px] top-[400px] left-[40%] bg-gradient-to-r from-[#C4CDF3] to-[#D0F0FB] opacity-25 blur-[100px]" />
            </>
          ) : (
            <>
              <div className="absolute w-[250px] h-[300px] md:w-[400px] md:h-[400px] top-[300px] -left-[5%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-10 blur-[70px]" />
              <div className="absolute w-[250px] h-[300px] md:w-[400px] md:h-[400px] top-[400px] -left-[5%] bg-gradient-to-r from-[#6779FF] via-[#4E97FA] to-[#2EFFEA] opacity-10 blur-[70px]" />
            </>
          )}
        </div>

        <Header isHomePage={false} />

        {/* Back Button - below fixed header; spacer so it's not hidden */}
        <div className="w-full flex items-center justify-between pt-26 md:pt-28 pb-6 md:pb-12 px-5 md:px-1 max-w-[1140px] mx-auto z-40 relative">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center text-gray-500 hover:text-black cursor-pointer font-medium text-base"
          >
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
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-gray-500 hover:text-blue-700 p-2 rounded-full transition-colors cursor-pointer"
            title="Share"
            onClick={() => setShowShare(true)}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center sm:-mt-19 px-4 max-w-6xl mx-auto w-full z-10">
          {/* Title Section - UPDATED for form view */}
          <FadeInWhenInView>
            {showForm ? (
              <>
                <SectionHeader
                  tag={'Join'}
                  title={isSalesRepresentativeRole ? 'Sales Representative' : 'ARIIA AI '}
                  gradientTitle={'Application'}
                />
              </>
            ) : (
              <div className="w-full flex flex-col items-start mt-1 md:mt-1  mb-6 md:mb-8 space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center inline-block m-0 p-0 tracking-tight">
                  {jobData.title}
                </h1>
              </div>
            )}
          </FadeInWhenInView>

          {/* Main Content Flex Layout */}
          <FadeInWhenInView delay={120} className="w-full">
            <div className="w-full flex flex-col md:flex-row  md:gap-12 items-start justify-between max-w-6xl mx-auto">
              {/* Main Content - CONDITIONAL RENDERING */}
              <div className="flex-1 w-full min-w-0 flex flex-col items-center md:items-start order-1 md:order-none">
                {showForm ? (
                  // FORM VIEW
                  <form
                    id="career-application-form"
                    onSubmit={handleSubmit}
                    className="career-mobile-form w-full mb-4 md:mb-20 mx-auto md:mx-0 space-y-6"
                  >
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder="Enter your full name"
                          className={`${formFieldClassName} ${errors.name ? 'border-red-300' : ''}`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder="Enter your email address"
                          className={`${formFieldClassName} ${errors.email ? 'border-red-300' : ''}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* LinkedIn and College Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="linkedin"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder="Paste your LinkedIn profile URL"
                          className={`${formFieldClassName} ${errors.linkedin ? 'border-red-300' : ''}`}
                        />
                        {errors.linkedin && (
                          <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="college"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Current or Former College/University
                        </label>
                        <input
                          type="text"
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={(e) => handleInputChange('college', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder="Enter your college or university"
                          className={formFieldClassName}
                        />
                      </div>
                    </div>

                    {/* Location and Salary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Where are you based?
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder="Enter your location"
                          className={`${formFieldClassName} ${errors.location ? 'border-red-300' : ''}`}
                        />
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="salary"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          {targetEarningsLabel}
                        </label>
                        <input
                          type="text"
                          id="salary"
                          name="salary"
                          value={formData.salaryExpectations}
                          onChange={(e) => handleInputChange('salaryExpectations', e.target.value)}
                          onMouseMove={handleFieldMouseMove}
                          onMouseLeave={handleFieldMouseLeave}
                          onFocus={handleFieldFocus}
                          onBlur={handleFieldBlur}
                          placeholder={targetEarningsPlaceholder}
                          className={formFieldClassName}
                        />
                      </div>
                    </div>

                    {/* File Upload - only for roles that require a resume */}
                    {!isSalesRepresentativeRole && (
                      <FileUpload
                        file={formData.resume}
                        onFileSelect={handleFileSelect}
                        error={errors.resume}
                      />
                    )}

                    {/* Submit Button */}
                    <div className="hidden md:flex justify-center pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[240px] bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                ) : (
                  // JOB DESCRIPTION VIEW
                  <div className="w-full max-w-4xl mx-auto md:mx-0">
                    {jobData.careerCard?.description && (
                      <div className="mb-8">
                        <div className="text-gray-700 text-base leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkBreaks]}
                            components={markdownComponents}
                          >
                            {careerDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {jobData.careerCard?.jobDescription && (
                      <div className="mb-8 text-gray-700 text-base leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}
                          components={markdownComponents}
                        >
                          {careerJobDescription}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Card (right) - UPDATED to hide button when form is showing */}
              <div className="w-full md:w-[380px] shrink-0 flex flex-col items-center md:items-start bg-white/90 rounded-3xl border border-[#e3f3ff] px-5 py-6 mx-auto md:mx-0 mb-6 md:mb-0 order-last md:order-2 shadow-lg">
                {(jobData.careerCard?.jobInfo?.salary != null ||
                  jobData.careerCard?.jobInfo?.experience != null) && (
                  <>
                    <div className="font-medium text-2xl text-gray-800 mb-2">Salary</div>
                    <div className="text-[13px] text-gray-500 mb-4 font-semibold">
                      {jobData.careerCard?.jobInfo?.salary &&
                      jobData.careerCard?.jobInfo?.salary !== 'N/A'
                        ? jobData.careerCard?.jobInfo?.experience &&
                          jobData.careerCard?.jobInfo?.experience !== 'N/A'
                          ? `${jobData.careerCard.jobInfo.experience}: ${jobData.careerCard.jobInfo.salary}`
                          : `Salary: ${jobData.careerCard.jobInfo.salary}`
                        : jobData.careerCard?.jobInfo?.experience &&
                            jobData.careerCard?.jobInfo?.experience !== 'N/A'
                          ? jobData.careerCard.jobInfo.experience
                          : ''}
                    </div>
                  </>
                )}
                <div className="w-full rounded-[20px] shadow-md flex flex-col gap-2 bg-[linear-gradient(125deg,rgba(66,172,225,0.05)_-40.05%,rgba(80,198,240,0.10)_35.68%,rgba(84,202,242,0.40)_99.35%)] px-3 py-5">
                  {jobInfo.map((item, i) => {
                    if (!item.value) return null;
                    return (
                      <div key={i} className="flex items-center gap-2 text-gray-800 text-sm">
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                        </span>
                        <span>
                          {item.label}: {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Show apply button only when NOT in form view */}
                {!showForm && (
                  <button
                    onClick={handleApplyClick}
                    className="hidden md:block mt-4 w-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base"
                  >
                    {jobData.careerCard?.cta?.ctaText || 'Apply for this Role'}
                  </button>
                )}
              </div>
            </div>
          </FadeInWhenInView>

          {/* Why Join Us Card */}
          {!showForm && (
            <FadeInWhenInView delay={200} className="w-full">
              <div className="w-full max-w-6xl mx-auto mb-10 md:mb-20 mt-1 md:mt-4">
                <div
                  className="relative flex flex-col md:flex-row items-center rounded-3xl bg-[#101828] bg-cover bg-center overflow-hidden shadow-lg"
                  style={{ backgroundImage: "url('/images/newsletter-bg.png')" }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[170px] md:h-[220px] max-sm:bg-[url('/images/why-join-us.svg')] bg-top bg-no-repeat bg-cover opacity-45" />

                  <div className="relative z-10 flex-1 p-8 md:p-12 text-white">
                    {jobData.whyJoinUs?.title && (
                      <h2 className="text-2xl text-center md:text-3xl font-bold mb-6">
                        {jobData.whyJoinUs.title}
                      </h2>
                    )}
                    <div className="flex-shrink-0 w-full md:hidden flex items-center justify-center">
                      <SplineScene config={SPLINE_SCENES.careerRoles} />
                    </div>
                    {jobData.whyJoinUs?.description && (
                      <div className="text-white leading-relaxed px-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}
                          components={{
                            ...markdownComponents,
                            p: (props) => <p className="mb-4 text-white/90" {...props} />,
                            ul: (props) => <ul className="space-y-5 mb-4" {...props} />,
                            li: (props) => (
                              <li className="flex items-start gap-3 leading-relaxed" {...props}>
                                <span className="mt-1">
                                  <span className="block w-2 h-2 rounded-full bg-cyan-400"></span>
                                </span>
                                <span>{props.children}</span>
                              </li>
                            ),
                          }}
                        >
                          {whyJoinUsDescription}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 hidden md:flex flex-shrink-0 w-full max-w-[300px] items-center justify-center md:mr-5">
                    <SplineScene config={SPLINE_SCENES.careerRoles} />
                  </div>
                </div>
              </div>
            </FadeInWhenInView>
          )}
        </div>

        {/* Sticky Apply Button on Mobile - UPDATED */}
        {!showForm && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 p-4 z-50">
            <button
              onClick={handleApplyClick}
              className="min-w-[240px] w-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base"
            >
              {jobData.careerCard?.cta?.ctaText || 'Apply for this Role'}
            </button>
          </div>
        )}

        {showForm && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 p-4 z-50">
            <button
              form="career-application-form"
              type="submit"
              disabled={isSubmitting}
              className="min-w-[240px] w-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        )}

        <style jsx global>{`
          @media (max-width: 767px) {
            .career-mobile-form {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .career-mobile-form > div {
              width: 90%;
              margin-left: auto;
              margin-right: auto;
            }
          }
        `}</style>

        <NewsletterFooter isHomePage={false} />
      </section>
    </>
  );
}
