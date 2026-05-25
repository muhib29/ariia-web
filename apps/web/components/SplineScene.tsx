// components/SplineScene.tsx
'use client';

import { useState, CSSProperties, useEffect, useRef } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';
import { useScreenSize } from '@/hooks/useScreenSize';

interface SplineSceneProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  onLoad?: (spline: Application) => void;
  priority?: boolean; // For hero sections
}

export default function SplineScene({
  config,
  className = '',
  style = {},
  onLoad,
  priority = false,
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const currentHeight = config.height[screenSize];
  const shouldLoadImmediately = priority || config.priority;
  const [isNearViewport, setIsNearViewport] = useState(shouldLoadImmediately);

  useEffect(() => {
    if (shouldLoadImmediately || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldLoadImmediately]);

  // Dynamically load Spline only when needed on client side
  useEffect(() => {
    if (!isNearViewport) return;

    // Wait for page to be interactive before loading Spline
    const load = () => {
      import('@splinetool/react-spline')
        .then((mod) => {
          setSplineComponent(() => mod.default);
        })
        .catch((err) => {
          console.error('Failed to load Spline:', err);
          setError(true);
        });
    };

    if (document.readyState === 'complete') {
      requestIdleCallback ? requestIdleCallback(load) : setTimeout(load, 200);
    } else {
      window.addEventListener('load', () => {
        requestIdleCallback ? requestIdleCallback(load) : setTimeout(load, 200);
      }, { once: true });
    }
  }, [isNearViewport]);



  const handleLoad = (spline: Application) => {
    setIsLoaded(true);

    // Disable all interactions completely
    if (config.disableInteractions) {
      try {
        spline.setZoom(1);

        // Disable all mouse events
        const canvas = document.querySelector(`[data-scene-id="${config.id}"] canvas`);
        if (canvas) {
          (canvas as HTMLElement).style.pointerEvents = 'none';
        }
      } catch (err) {
        console.warn('Could not disable interactions:', err);
      }
    }

    onLoad?.(spline);
  };

  const handleError = (err: Error) => {
    setError(true);
    console.error(`✗ Failed to load scene: ${config.id}`, err);
  };

  const containerStyle: CSSProperties = {
    width: '100%',
    height: currentHeight,
    position: 'relative',
    ...style,
  };

  

  const splineStyle: CSSProperties = {
    width: '100%',
    height: currentHeight,
    background: 'transparent',
    ...(config.disableInteractions && {
      pointerEvents: 'none',
      touchAction: 'none',
      userSelect: 'none',
    }),
  };

  return (
      <div
        ref={containerRef}
         className={`spline-container ${className}`}
         style={containerStyle}
         data-scene-id={config.id}
       >
      {/* Better Loading State for Hero */}
      {!isLoaded && !error && SplineComponent && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            opacity: priority ? 0.5 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="animate-spin h-6 w-6 border-3 border-primary/50 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fee',
            color: '#dc2626',
            gap: '12px',
          }}
        >
          <p>Unable to load 3D scene</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Spline Scene */}
      {SplineComponent && !error && (
        <div style={splineStyle}>
          <SplineComponent scene={config.url} onLoad={handleLoad} onError={handleError} />
        </div>
      )}
    </div>
  );
}
