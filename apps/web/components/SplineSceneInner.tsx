'use client';

import React, { useState, useEffect, useRef, type CSSProperties } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';
import { useScreenSize } from '@/hooks/useScreenSize';
import { requestSplineSlot, releaseSplineSlot } from '@/lib/spline-loader';

export interface SplineSceneInnerProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  onLoad?: (spline: Application) => void;
  onSceneReady?: () => void;
  priority?: boolean;
  fillParent?: boolean;
}

export default function SplineSceneInner({
  config,
  className = '',
  style = {},
  onLoad,
  onSceneReady,
  priority = false,
  fillParent = false,
}: SplineSceneInnerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<React.ComponentType<any> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const currentHeight = config.height[screenSize];
  const shouldLoadImmediately = priority || config.priority;
  const [isNearViewport, setIsNearViewport] = useState(shouldLoadImmediately);

  // Check WebGL support immediately
  // NOTE: temporarily disabled for testing. Re-enable after verifying whether WebGL is the source of the issue.
  /*
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported on this device');
        setError(true);
      }
    } catch (e) {
      console.warn('WebGL check failed:', e);
      setError(true);
    }
  }, []);
  */

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

  useEffect(() => {
    if (!isNearViewport) return;

    let cancelled = false;
    let slotHeld = false;

    requestSplineSlot()
      .then(() => {
        if (cancelled) return;
        slotHeld = true;
        return import('@splinetool/react-spline');
      })
      .then((mod) => {
        if (slotHeld) {
          releaseSplineSlot();
          slotHeld = false;
        }
        if (cancelled || !mod) return;
        setSplineComponent(() => mod.default);
      })
      .catch((err) => {
        console.error('Failed to load Spline:', err);
        if (!cancelled) setError(true);
        if (slotHeld) {
          releaseSplineSlot();
          slotHeld = false;
        }
      });

    return () => {
      cancelled = true;
      if (slotHeld) releaseSplineSlot();
    };
  }, [isNearViewport]);

  const handleLoad = (spline: Application) => {
    setIsLoaded(true);
    onSceneReady?.();

    if (config.disableInteractions) {
      try {
        spline.setZoom(1);
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

  const containerStyle: CSSProperties = fillParent
    ? { width: '100%', height: '100%', position: 'relative', ...style }
    : { width: '100%', height: currentHeight, position: 'relative', ...style };

  const splineStyle: CSSProperties = {
    width: '100%',
    height: fillParent ? '100%' : currentHeight,
    background: 'transparent',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease',
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
            type="button"
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

      {SplineComponent && !error && (
        <div style={splineStyle}>
          <SplineComponent
            scene={config.url}
            onLoad={handleLoad}
            onError={(err: unknown) => handleError(err instanceof Error ? err : new Error(String(err)))}
          />
        </div>
      )}
    </div>
  );
}
