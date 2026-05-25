'use client';

import { useState, CSSProperties, useEffect, useRef } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useIdleReady } from '@/hooks/useIdleReady';
import { shouldLoadSpline } from '@/lib/device-capabilities';
import { requestSplineSlot, releaseSplineSlot } from '@/lib/spline-loader';
import { SplineFallback } from './SplineFallback';

interface SplineSceneProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  onLoad?: (spline: Application) => void;
  priority?: boolean;
  deferMs?: number;
}

export default function SplineScene({
  config,
  className = '',
  style = {},
  onLoad,
  priority = false,
  deferMs = 0,
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const currentHeight = config.height[screenSize];
  const canUseSpline = shouldLoadSpline();
  const idleReady = useIdleReady(priority ? 1200 : 3000);
  const shouldLoadImmediately = priority || config.priority;
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [loadAllowed, setLoadAllowed] = useState(false);
  const [hasSlot, setHasSlot] = useState(false);

  useEffect(() => {
    if (!canUseSpline || !idleReady) return;
    const delay = deferMs > 0 ? deferMs : 0;
    const timer = window.setTimeout(() => setLoadAllowed(true), delay);
    return () => window.clearTimeout(timer);
  }, [canUseSpline, idleReady, deferMs]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: shouldLoadImmediately ? '0px' : '120px 0px' },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldLoadImmediately]);

  useEffect(() => {
    if (!canUseSpline || !loadAllowed || !isNearViewport) return;

    let cancelled = false;

    requestSplineSlot().then(() => {
      if (cancelled) {
        releaseSplineSlot();
        return;
      }
      setHasSlot(true);

      import('@splinetool/react-spline')
        .then((mod) => {
          if (!cancelled) setSplineComponent(mod.default);
        })
        .catch((err) => {
          console.error('Failed to load Spline:', err);
          if (!cancelled) setError(true);
          releaseSplineSlot();
        });
    });

    return () => {
      cancelled = true;
    };
  }, [canUseSpline, loadAllowed, isNearViewport]);

  useEffect(() => {
    return () => {
      if (hasSlot && !isLoaded) releaseSplineSlot();
    };
  }, [hasSlot, isLoaded]);

  const handleLoad = (spline: Application) => {
    setIsLoaded(true);
    releaseSplineSlot();

    if (config.disableInteractions) {
      try {
        spline.setZoom(1);
        const canvas = document.querySelector(`[data-scene-id="${config.id}"] canvas`);
        if (canvas) (canvas as HTMLElement).style.pointerEvents = 'none';
      } catch {
        /* ignore */
      }
    }
    onLoad?.(spline);
  };

  const handleError = (err: Error) => {
    setError(true);
    releaseSplineSlot();
    console.error(`Failed to load scene: ${config.id}`, err);
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
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease',
    ...(config.disableInteractions && {
      pointerEvents: 'none',
      touchAction: 'none',
      userSelect: 'none',
    }),
  };

  const fallbackVariant = config.id.includes('pattern') ? 'pattern' : 'orb';

  if (!canUseSpline) {
    return (
      <div className={`spline-container ${className}`} style={containerStyle} data-scene-id={config.id}>
        <SplineFallback variant={fallbackVariant} style={{ width: '100%', height: currentHeight }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`spline-container ${className}`} style={containerStyle} data-scene-id={config.id}>
      <SplineFallback
        variant={fallbackVariant}
        style={{ position: 'absolute', inset: 0, width: '100%', height: currentHeight }}
      />

      {SplineComponent && !error && loadAllowed && isNearViewport && (
        <div style={splineStyle}>
          <SplineComponent scene={config.url} onLoad={handleLoad} onError={handleError} />
        </div>
      )}
    </div>
  );
}
