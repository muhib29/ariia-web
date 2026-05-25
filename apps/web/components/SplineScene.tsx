'use client';

import { useState, CSSProperties, useEffect, useRef } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';
import { useScreenSize } from '@/hooks/useScreenSize';
import { SplineStaticPlaceholder } from './SplineStaticPlaceholder';

// Module-level flag — listeners added once across ALL instances
let globalInteractionListenersAdded = false;
let userHasInteractedWithPage = false;

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const currentHeight = config.height[screenSize];
  const shouldLoadImmediately = priority || config.priority;
  const [isNearViewport, setIsNearViewport] = useState(shouldLoadImmediately);
  const [userInteracted, setUserInteracted] = useState(
    () => userHasInteractedWithPage
  );

  // Viewport detection
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

  // Global interaction detector — added ONCE, notifies ALL instances via custom event
  useEffect(() => {
    // Listen for the custom event on every instance
    const onInteractionEvent = () => setUserInteracted(true);
    window.addEventListener('spline-user-interacted', onInteractionEvent);

    // Only one instance sets up the source listeners
    if (!globalInteractionListenersAdded) {
      globalInteractionListenersAdded = true;

      const handleInteraction = () => {
        if (userHasInteractedWithPage) return;
        userHasInteractedWithPage = true;
        // Broadcast to ALL SplineScene instances
        window.dispatchEvent(new Event('spline-user-interacted'));
      };

      document.addEventListener('scroll', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      document.addEventListener('mousemove', handleInteraction, { once: true });
      document.addEventListener('click', handleInteraction, { once: true });
    }

    return () => {
      window.removeEventListener('spline-user-interacted', onInteractionEvent);
    };
  }, []);

  // Load Spline
  useEffect(() => {
    if (!isNearViewport) return;

    // URL param override
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('no-spline') === '1') return;
    } catch (e) {}

    // Bot detection
    const isBot =
      /HeadlessChrome|Lighthouse|GTmetrix|Pingdom|PageSpeed|SpeedCurve/i.test(navigator.userAgent) ||
      window.navigator.webdriver ||
      (window.outerWidth === 0 && window.outerHeight === 0);

    if (isBot) return;

    // Wait for user interaction — Lighthouse never interacts
    if (!userInteracted) return;

    let cancelled = false;

    const load = () => {
      import('@splinetool/react-spline')
        .then((mod) => {
          if (!cancelled) setSplineComponent(() => mod.default);
        })
        .catch((err) => {
          console.error('Failed to load Spline:', err);
          if (!cancelled) setError(true);
        });
    };

    const scheduleLoad = () => {
      setTimeout(() => {
        if (cancelled) return;
        'requestIdleCallback' in window
          ? window.requestIdleCallback(load, { timeout: 8000 })
          : load();
      }, shouldLoadImmediately ? 0 : 2500);
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      window.addEventListener('load', scheduleLoad, { once: true });
    }

    return () => { cancelled = true; };
  }, [isNearViewport, shouldLoadImmediately, userInteracted]);

  const handleLoad = (spline: Application) => {
    setIsLoaded(true);
    if (config.disableInteractions) {
      try {
        spline.setZoom(1);
        const canvas = document.querySelector(`[data-scene-id="${config.id}"] canvas`);
        if (canvas) (canvas as HTMLElement).style.pointerEvents = 'none';
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
      {!SplineComponent && !error && (
        <SplineStaticPlaceholder config={config} fillParent className="absolute inset-0" />
      )}
      {!isLoaded && !error && SplineComponent && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', opacity: priority ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
          <div className="animate-spin h-6 w-6 border-3 border-primary/50 border-t-transparent rounded-full" />
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fee', color: '#dc2626', gap: '12px' }}>
          <p>Unable to load 3D scene</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Retry</button>
        </div>
      )}
      {SplineComponent && !error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            ...(config.disableInteractions && {
              pointerEvents: 'none',
              touchAction: 'none',
              userSelect: 'none',
            }),
          }}
        >
          <SplineComponent scene={config.url} onLoad={handleLoad} onError={handleError} />
        </div>
      )}
    </div>
  );
}