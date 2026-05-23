'use client';

import { Share2, X as CloseIcon, Linkedin, Facebook, Mail, Check } from 'lucide-react';
import React, { useState } from 'react';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareTitle: string;
  shareUrl?: string;
}

export function ShareModal({ open, onClose, shareTitle, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? shareUrl || window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  const handleShare = (type: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(shareTitle);
    if (type === 'linkedin') {
      window.open(
        `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        '_blank',
      );
    } else if (type === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
    } else if (type === 'x') {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        '_blank',
      );
    } else if (type === 'mail') {
      window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_blank');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <div className="mb-4 text-lg font-semibold text-gray-900">Share This Page</div>
        <div className="flex flex-wrap gap-3 mb-2">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium transition-all ${copied ? 'bg-green-100 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700'}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="px-4 py-2 rounded-full border flex items-center gap-2 font-medium bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="px-4 py-2 rounded-full border flex items-center gap-2 font-medium bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </button>
          <button
            onClick={() => handleShare('x')}
            className="px-4 py-2 rounded-full border flex items-center gap-2 font-medium bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700"
          >
            {/* Custom Twitter/X SVG with currentColor */}
            <span
              className="w-4 h-4 inline-block"
              style={{ display: 'inline-flex', verticalAlign: 'middle' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                imageRendering="optimizeQuality"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                viewBox="0 0 512 462.799"
              >
                <path
                  fillRule="nonzero"
                  d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                />
              </svg>
            </span>
            X
          </button>
          <button
            onClick={() => handleShare('mail')}
            className="px-4 py-2 rounded-full border flex items-center gap-2 font-medium bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700"
          >
            <Mail className="w-4 h-4" /> Mail
          </button>
        </div>
      </div>
    </div>
  );
}
