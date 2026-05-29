'use client';

import React from 'react';
// import { shouldUseScrollReveal } from '@/lib/device-capabilities';

let dotLottieModulePromise: Promise<typeof import('@lottiefiles/dotlottie-react')> | null = null;

export type LottieAnimationProps = {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  /** When true (default), Lottie only mounts and plays when in viewport to save CPU and network. */
  playWhenInView?: boolean;
};

const LottieAnimation = React.forwardRef<any, LottieAnimationProps>(
  ({ src, loop = true, autoplay = true, speed = 1, className, playWhenInView = true }, ref) => {
    /*
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [hasEnteredView, setHasEnteredView] = useState(!playWhenInView);
    const [DotLottieComponent, setDotLottieComponent] = useState<any>(null);
    const dotLottieRef = useRef<any>(null);

    useEffect(() => {
      let mounted = true;

      const loadLibrary = () => {
        dotLottieModulePromise ||= import('@lottiefiles/dotlottie-react');
        dotLottieModulePromise
          .then((mod) => {
            if (mounted) setDotLottieComponent(() => mod.DotLottieReact);
          })
          .catch(() => {});
      };

      if (isMobileDevice()) {
        const delay = typeof window !== 'undefined' && 'requestIdleCallback' in window
          ? new Promise(resolve => (window as any).requestIdleCallback(resolve, { timeout: 4000 }))
          : new Promise(resolve => setTimeout(resolve, 2500));
        delay.then(() => { if (mounted) loadLibrary(); });
      } else {
        loadLibrary();
      }

      return () => { mounted = false; };
    }, []);

    useEffect(() => {
      if (!playWhenInView || !containerRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasEnteredView(true);
          }
        },
        {
          rootMargin: '200px', // Pre-load slightly before it hits the viewport
          threshold: 0.01,
        },
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [playWhenInView]);

    // Handle Play/Pause via instance instead of unmounting
    useEffect(() => {
      if (!dotLottieRef.current) return;

      if (inView) {
        dotLottieRef.current.play();
      } else {
        dotLottieRef.current.pause();
      }
    }, [inView]);

    // Optimized DPR: 2.5 for desktop, 2.0 for mobile to ensure high-quality 'Retina' display
    const dpr =
      typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, isMobileDevice() ? 2.0 : 2.5)
        : 1;

    function isMobileDevice() {
      if (typeof window === 'undefined') return false;
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    const useReveal = shouldUseScrollReveal();

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: !hasEnteredView ? 120 : undefined,
          // On touch devices we avoid visibility:hidden to prevent iOS intersection/paint bugs.
          visibility: useReveal && !inView && playWhenInView ? 'hidden' : 'visible',
        }}
      >
        {DotLottieComponent && hasEnteredView && (
          <DotLottieComponent
            src={src}
            loop={loop}
            autoplay={autoplay && inView}
            speed={speed}
            className={className}
            style={{
              width: '100%',
              height: '100%',
            }}
            renderConfig={{
              devicePixelRatio: dpr,
              autoResize: true,
            }}
            useFrameInterpolation={false}
            dotLottieRefCallback={(instance: any) => {
              dotLottieRef.current = instance;
              if (typeof ref === 'function') ref(instance);
              else if (ref) (ref as any).current = instance;
            }}
          />
        )}
      </div>
    );
    */
    return null;
  },
);

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
