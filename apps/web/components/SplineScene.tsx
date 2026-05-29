'use client';

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';

// Lazy load Spline component with Suspense
const SplineComponentLazy = lazy(() =>
  import('@splinetool/react-spline').then((mod) => ({ default: mod.default }))
);

// Module-level flag — listeners added once across ALL instances
// let globalInteractionListenersAdded = false;
// let userHasInteractedWithPage = false;

interface SplineSceneProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  onLoad?: (spline: Application) => void;
  priority?: boolean;
}

export default function SplineScene({
  config,
  className = '',
  style = {},
  onLoad,
  priority = false,
}: SplineSceneProps) {
  const [hasRenderError, setHasRenderError] = useState(false);
  const [canUseWebGL, setCanUseWebGL] = useState(true);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);

  const currentHeight = config.height[screenSize];

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch {
        return false;
      }
    };

    setCanUseWebGL(checkWebGLSupport());
  }, []);

  const handleLoad = (spline: Application) => {
    onLoad?.(spline);
  };

  const handleError = (error: unknown) => {
    console.error('Spline render failed:', error);
    setHasRenderError(true);
  };

  const fallbackImageSrc =
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="24">3D preview unavailable</text></svg>`,
    );

  // Fallback if WebGL not supported or render error
  if (!canUseWebGL || hasRenderError) {
    return (
      <img
        src={fallbackImageSrc}
        alt="3D preview unavailable"
        className={className}
        style={{ width: '100%', height: currentHeight, objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`spline-container ${className}`}
      style={{ width: '100%', height: currentHeight, position: 'relative', ...style }}
      data-scene-id={config.id}
    >
      <Suspense
        fallback={
          <div style={{ width: '100%', height: '100%', background: '#f8fafc' }} />
        }
      >
        <SplineComponentLazy scene={config.url} onLoad={handleLoad} onError={handleError as any} />
      </Suspense>
    </div>
  );

}