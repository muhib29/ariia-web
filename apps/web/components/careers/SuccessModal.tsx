// components/careers/SuccessModal.tsx
'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  message?: string;
}

export function SuccessModal({ isOpen, onCloseAction, message }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseAction} />

      <div className="relative z-[101] mx-4 w-full max-w-md">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image src={'/images/hexagon.svg'} alt="Pattern" fill className="object-fit opacity-50" />
        </div>
        <div className="rounded-xl p-8 bg-[linear-gradient(126deg,_#CAF2FB_-0.49%,_#FFF_55.75%,_#CAF2FB_104.89%)] shadow-[0_2.589px_3.884px_-0.647px_rgba(0,0,0,0.10),_0_1.295px_2.589px_-1.295px_rgba(0,0,0,0.10)]">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Application Received
          </h2>
          <p className="text-gray-900 text-center mb-4 leading-relaxed">
            {message ?? (
              <>
                Thank you for applying to join our mission to redefine how businesses operate with AI
                agents. We'll review your application and be in touch if there's a strong fit.
              </>
            )}
          </p>
          <button
            onClick={onCloseAction}
            className="min-w-[240px] w-full bg-gradient-to-r from-[#3B6BFF] to-[#2E96FF] shadow-sm hover:scale-105 hover:shadow-lg hover:brightness-110 hover:cursor-pointer active:scale-95 duration-300 ease-out text-white font-semibold py-3 px-4 rounded-full transition-all text-base"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
