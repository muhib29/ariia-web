'use client';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { useState } from 'react';
import { FadeInWhenInView } from './hero-section';

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <section className="py-10 md:py-20 px-6">
      <FadeInWhenInView>
        <div className="max-w-6xl mx-auto">
          {/* Video Container */}
          <div className="relative w-full h-[235px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl md:shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/thumbnail.webp"
              alt="Video Background"
              fill
              sizes="100vw"
              className="object-cover aspect-square"
              priority
            />
          </div>

          {/* Blurred Overlay Container */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white/20 backdrop-blur-sm rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              <Play
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-800 ml-1 group-hover:text-blue-600 transition-colors duration-300"
                fill="currentColor"
              />
            </button>
          </div>

            {/* Gradient Border Effect */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  'linear-gradient(45deg, transparent, rgba(103, 121, 255, 0.3), rgba(46, 255, 234, 0.3), transparent)',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'exclude',
                maskComposite: 'exclude',
              }}
            />
          </div>
        </div>
      </FadeInWhenInView>

      {/* Modal Overlay */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/qe2ofqxpKD8?autoplay=1"
              title="YouTube video player"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <button
              onClick={handleClose}
              className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
