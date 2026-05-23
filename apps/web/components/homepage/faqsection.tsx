'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@workspace/ui/lib/utils';
import { SectionHeader } from '../SectionHeader';

export interface FAQSectionProps {
  header?: {
    id?: string;
    title?: string;
    styledTitle?: string;
    tag?: string;
    description?: string;
  };
  questions?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export function FAQSection({ header, questions }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="pt-10 md:pt-18 pb-0 px-4 md:px-6 relative overflow-hidden overflow-x-hidden bg-white"
    >
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top glow matches Use Cases card gradient palette */}
        <div className="absolute top-[-70px] left-1/2 -translate-x-1/2 w-[100%] h-[100px] rounded-full blur-3xl opacity-[15%] bg-[linear-gradient(90deg,rgba(53,128,255,0.22)_20%,#3580FF_100%,#2E96FF_100%)]" />

        <div className="absolute top-0 left-0 w-full h-[220px] opacity-30 bg-[linear-gradient(180deg,rgba(53,128,255,0.12)_0%,rgba(46,150,255,0.08)_45%,rgba(255,255,255,0)_100%)]" />
        {/* Top blue blur */}
        <div className="absolute w-full h-[300px] -top-40 left-1/2 -translate-x-1/2 blur-[60px] bg-[linear-gradient(91deg,rgba(53,128,255,0.45)_35.93%,#3580FF_51.47%,#2E96FF_67.02%)] opacity-20" />
        {/* Keep bottom clear so FAQ ends on white */}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Blue circle shadow on left side of container (FAQ label blue) */}
        <div
          className="hidden md:block absolute left-[-450px] top-1/2 -translate-y-1/2 w-[320px] h-[550px] rounded-full blur-[90px] opacity-20 pointer-events-none bg-[#3B6BFF]"
          aria-hidden
        />
        <div className="rounded-[22px] bg-transparent bg-opacity-70 p-2 md:p-8 relative">
          {/* Badge and Header */}
          <div className="text-center">
            <SectionHeader
              tag={header?.tag || 'FAQ'}
              title={header?.title || 'Questions'}
              gradientTitle={header?.styledTitle || '& Answers'}
              description={
                header?.description ||
                'Common questions about ARIIA—from setup and usage to integrations and support.'
              }
            />
          </div>

          {/* Accordion List */}
          <div className="space-y-0 bg-transparent md:bg-white">
            {questions?.length
              ? questions.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        'group border border-gray-200 bg-white bg-opacity-80 backdrop-blur-sm shadow-[0_2px_6px_-2px_rgba(16,24,40,0.12)] transition-all duration-300 hover:shadow-[0_16px_40px_-24px_rgba(20,132,180,0.55)] hover:border-[#bcd6ff] focus-within:shadow-[0_16px_40px_-24px_rgba(20,132,180,0.55)] focus-within:border-[#bcd6ff]',
                        index === 0 && 'rounded-ss-xl rounded-se-xl',
                        index === questions?.length - 1 && 'rounded-es-xl rounded-ee-xl',
                      )}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7db3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        <span className="text-base font-medium text-[#101828] transition-colors duration-300 group-hover:text-[#175CD3] group-focus-within:text-[#175CD3]">
                          {faq.title}
                        </span>
                        <span className="ml-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-[0_4px_10px_-5px_rgba(46,150,255,0.9)] transition-shadow duration-300 group-hover:shadow-[0_8px_18px_-6px_rgba(46,150,255,0.9)] group-focus-within:shadow-[0_8px_18px_-6px_rgba(46,150,255,0.9)]">
                            {isOpen ? (
                              <Minus className="w-4 h-4 text-white" />
                            ) : (
                              <Plus className="w-4 h-4 text-white" />
                            )}
                          </span>
                        </span>
                      </button>

                      <div
                        className={cn(
                          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                        )}
                      >
                        <div className="overflow-hidden min-h-0">
                          <div className="px-6 pb-5 text-sm text-[#475467] leading-[24px] whitespace-normal">
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => (
                                  <ul
                                    className="list-disc list-outside pl-5 space-y-1 mb-4"
                                    {...props}
                                  />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol
                                    className="list-decimal list-outside pl-5 space-y-1 mb-4"
                                    {...props}
                                  />
                                ),
                                a: ({ node, ...props }) => (
                                  <a
                                    className="text-[#3B6BFF] underline hover:no-underline"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {faq.content?.replace(/\\n/g, '\n') || ''}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </section>
  );
}
