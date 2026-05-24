import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FadeInWhenInView } from './animations/FadeInWhenInView';

export interface SectionHeaderProps {
  tag?: string;
  title?: string;
  gradientTitle?: string;
  description?: string;
  breakAfterTitle?: boolean;
  breakAfterTitleOnLaptop?: boolean;
  splitGradientAfterFirstWordOnLaptop?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tag,
  title,
  gradientTitle,
  description,
  breakAfterTitle = false,
  breakAfterTitleOnLaptop = false,
  splitGradientAfterFirstWordOnLaptop = false,
}) => {
  const normalizedTitle = (title ?? '').trim();
  const normalizedGradientTitle = (gradientTitle ?? '').trim();
  const hasTitle = normalizedTitle.length > 0;
  const hasGradientTitle = normalizedGradientTitle.length > 0;

  const gradientWords = normalizedGradientTitle.split(/\s+/);
  const gradientFirstWord = gradientWords[0] ?? '';
  const gradientRemainingText = gradientWords.slice(1).join(' ');

  return (
    <FadeInWhenInView delay={0}>
      <div className="flex flex-col items-center pb-7 md:pb-7 z-10 w-full">
        {tag && (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#DEF4FA] text-blue-700">
            {tag}
          </span>
        )}
        {(hasTitle || hasGradientTitle) && (
          <h1 className="text-gray-900 font-bold leading-[36px] w-full md:max-w-4xl text-[28px] md:text-[36px] md:leading-[42px] tracking-tight pt-4 text-center">
            {normalizedTitle}
            {hasTitle &&
              hasGradientTitle &&
              (breakAfterTitle ? (
                <br />
              ) : breakAfterTitleOnLaptop ? (
                <>
                  <span className="inline lg:hidden"> </span>
                  <br className="hidden lg:block" />
                </>
              ) : (
                ' '
              ))}
            {hasGradientTitle &&
              (splitGradientAfterFirstWordOnLaptop && gradientFirstWord && gradientRemainingText ? (
                <>
                  <span className="gradient-header-animated-purple" style={{ display: 'inline' }}>
                    {gradientFirstWord}
                  </span>
                  <span className="inline lg:hidden"> </span>
                  <br className="hidden lg:block" />
                  <span className="gradient-header-animated-purple" style={{ display: 'inline' }}>
                    {gradientRemainingText}
                  </span>
                </>
              ) : (
                <span className="gradient-header-animated-purple" style={{ display: 'inline' }}>
                  {normalizedGradientTitle}
                </span>
              ))}
          </h1>
        )}
        {description && description?.length > 1 && (
          <div className="max-w-2xl mx-auto mt-4 text-[#101828] text-base md:text-lg leading-[27px]">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        )}
      </div>
    </FadeInWhenInView>
  );
};
