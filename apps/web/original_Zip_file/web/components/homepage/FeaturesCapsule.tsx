'use client';

interface FeaturesCapsuleProps {
  text?: string;
  className?: string;
}

export function FeaturesCapsule({ text = 'Features', className = '' }: FeaturesCapsuleProps) {
  return (
    <div
      className={`inline-flex items-center justify-center w-auto h-auto min-h-8 md:min-h-[36px] px-4 md:px-6 py-1 md:py-1.5 gap-[10px] rounded-full bg-[#DEF4FA] ${className}`}
    >
      <span className="font-semibold text-sm md:text-base leading-normal md:leading-[24px] tracking-normal text-center align-middle bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] bg-clip-text text-transparent">
        {text}
      </span>
    </div>
  );
}
