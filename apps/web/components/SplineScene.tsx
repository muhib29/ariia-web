'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback, type CSSProperties } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import { useScreenSize } from '@/hooks/useScreenSize';
import { whenPageInteractive } from '@/lib/when-page-interactive';
import { requestSplineSlot, releaseSplineSlot } from '@/lib/spline-loader';
import { shouldLoadSpline } from '@/lib/device-capabilities';
import { SplineStaticPlaceholder } from '@/components/SplineStaticPlaceholder';

type SplineApplication = {
  setZoom: (zoom: number) => void;
};

type SplineComponentType = typeof import('@splinetool/react-spline').default;

export interface SplineSceneProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  onLoad?: (spline: SplineApplication) => void;
  priority?: boolean;
  fillParent?: boolean;
}

export default function SplineScene({
  config,
  className = '',
  style = {},
  onLoad,
  priority = false,
  fillParent = false,
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [canLoadSpline, setCanLoadSpline] = useState(false);
  const [slotReady, setSlotReady] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<SplineComponentType | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [webglAllowed, setWebglAllowed] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const staticReadyNotified = useRef(false);
  const screenSize = useScreenSize();
  const currentHeight = config.height[screenSize];
  const shouldLoadImmediately = priority || config.priority;
  const [isNearViewport, setIsNearViewport] = useState(shouldLoadImmediately);

  useEffect(() => {
    setWebglAllowed(shouldLoadSpline());
  }, []);

  useEffect(() => {
    if (webglAllowed !== false || !onLoad || staticReadyNotified.current) return;
    staticReadyNotified.current = true;
    onLoad({ setZoom: () => {} });
  }, [webglAllowed, onLoad]);

  useEffect(() => {
    if (webglAllowed !== true) return;
    return whenPageInteractive(() => setCanLoadSpline(true));
  }, [webglAllowed]);

  useEffect(() => {
    if (webglAllowed !== true || shouldLoadImmediately || !containerRef.current) return;

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
  }, [shouldLoadImmediately, webglAllowed]);

  useEffect(() => {
    if (webglAllowed !== true || !canLoadSpline || !isNearViewport) return;

    let cancelled = false;
    let slotHeld = false;

    requestSplineSlot()
      .then(() => {
        if (cancelled) return;
        slotHeld = true;
        setSlotReady(true);
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
      setSlotReady(false);
      if (slotHeld) {
        releaseSplineSlot();
        slotHeld = false;
      }
    };
  }, [canLoadSpline, isNearViewport, retryCount, webglAllowed]);

  const constrainCanvasToParent = useCallback(() => {
    if (!fillParent || !containerRef.current) return;

    const root = containerRef.current;
    const canvas = root.querySelector('canvas');
    if (!canvas) return;

    const el = canvas as HTMLElement;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.maxWidth = '100%';
    el.style.maxHeight = '100%';
    el.style.display = 'block';

    let node: HTMLElement | null = el.parentElement;
    while (node && node !== root) {
      node.style.width = '100%';
      node.style.height = '100%';
      node.style.overflow = 'hidden';
      node = node.parentElement;
    }
  }, [fillParent]);

  const handleLoad = (spline: SplineApplication) => {
    setIsLoaded(true);
    constrainCanvasToParent();

    if (config.disableInteractions) {
      try {
        spline.setZoom(1);
        const canvas = containerRef.current?.querySelector('canvas');
        if (canvas) {
          (canvas as HTMLElement).style.pointerEvents = 'none';
        }
      } catch (err) {
        console.warn('Could not disable interactions:', err);
      }
    }

    onLoad?.(spline);
  };

  useLayoutEffect(() => {
    if (!fillParent || !isLoaded || !containerRef.current) return;

    constrainCanvasToParent();
    const observer = new ResizeObserver(() => constrainCanvasToParent());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [constrainCanvasToParent, fillParent, isLoaded]);

  const handleError = (err: Error) => {
    setError(true);
    console.error(`✗ Failed to load scene: ${config.id}`, err);
  };

  const retryLoad = useCallback(() => {
    setError(false);
    setSplineComponent(null);
    setIsLoaded(false);
    setRetryCount((prev) => prev + 1);
  }, []);

  const containerStyle: CSSProperties = fillParent
    ? {
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }
    : { width: '100%', height: currentHeight, position: 'relative', ...style };

  const splineStyle: CSSProperties = {
    ...(fillParent
      ? {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }
      : {
          position: 'relative',
          width: '100%',
          height: currentHeight,
        }),
    background: 'transparent',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease',
    ...(config.disableInteractions && {
      pointerEvents: 'none',
      touchAction: 'none',
      userSelect: 'none',
    }),
  };

  const showPlaceholder = !error && (!isLoaded || webglAllowed !== true);

  return (
    <div
      ref={containerRef}
      className={`spline-container ${className}`}
      style={containerStyle}
      data-scene-id={config.id}
    >
      {showPlaceholder && (
        <SplineStaticPlaceholder
          config={config}
          fillParent={fillParent}
          className="absolute inset-0 h-full w-full"
          style={fillParent ? undefined : { height: currentHeight }}
        />
      )}

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
            onClick={retryLoad}
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

      {webglAllowed === true && SplineComponent && slotReady && !error && (
        <div style={splineStyle}>
          <SplineComponent
            scene={config.url}
            style={fillParent ? { width: '100%', height: '100%', overflow: 'hidden' } : undefined}
            onLoad={handleLoad}
            onError={(err: unknown) =>
              handleError(err instanceof Error ? err : new Error(String(err)))
            }
          />
        </div>
      )}
    </div>
  );
}
