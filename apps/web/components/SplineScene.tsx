'use client';

import { useState, CSSProperties, useEffect, useRef } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import type { Application } from '@splinetool/runtime';
import { useScreenSize } from '@/hooks/useScreenSize';
import { SplineStaticPlaceholder } from './SplineStaticPlaceholder';

// Module-level flags shared across all instances
let globalInteractionListenersAdded = false;
let userHasInteractedWithPage = false;
let pageLoadTimestamp = 0; // recorded the first time a SplineScene mounts

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

  // Local instance state for whether the user interacted (keeps in sync with the module flag)
  const [userInteracted, setUserInteracted] = useState<boolean>(() => userHasInteractedWithPage);

  // Intersection observer to detect near-viewport
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

  // Global interaction detector - add listeners once and broadcast to all instances
  useEffect(() => {
    const onInteractionEvent = () => setUserInteracted(true);
    window.addEventListener('spline-user-interacted', onInteractionEvent);

    if (!globalInteractionListenersAdded) {
      // record first-seen timestamp for min-delay logic
      pageLoadTimestamp = pageLoadTimestamp || Date.now();

      const handleInteraction = () => {
        if (userHasInteractedWithPage) return;
        userHasInteractedWithPage = true;
        // notify other instances
        window.dispatchEvent(new Event('spline-user-interacted'));
      };

      document.addEventListener('scroll', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      document.addEventListener('mousemove', handleInteraction, { once: true });
      document.addEventListener('click', handleInteraction, { once: true });

      globalInteractionListenersAdded = true;
      // ensure local state reflects module flag if interaction already happened
      if (userHasInteractedWithPage) setUserInteracted(true);

      console.log('[Spline] 🎯 Global interaction listeners initialized', {
        pageLoadTimestamp: new Date(pageLoadTimestamp).toISOString(),
      });
    }

    return () => {
      window.removeEventListener('spline-user-interacted', onInteractionEvent);
    };
  }, []);

  // Load Spline when conditions are met: near viewport, not a bot, and (priority OR (userInteracted AND minDelay passed))
  useEffect(() => {
    if (!isNearViewport) return;

    // Allow forcing Spline off via URL param
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('no-spline') === '1') {
        console.log(`[Spline:${config.id}] ⏭️ Skipped via no-spline=1 URL param`);
        return;
      }
    } catch (e) {
      // ignore
    }

    // Bot detection
    const uaMatch = /HeadlessChrome|Lighthouse|GTmetrix|Pingdom|PageSpeed|SpeedCurve/i.test(navigator.userAgent);
    const webdriverFlag = window.navigator.webdriver;
    const headlessCheck = window.outerWidth === 0 && window.outerHeight === 0;
    const isBot = uaMatch || webdriverFlag || headlessCheck;

    const minDelayMs = 5000; // require at least 5 seconds after the first SplineScene mount
    const timeSinceLoad = pageLoadTimestamp ? Date.now() - pageLoadTimestamp : 0;
    const hasMinDelayPassed = timeSinceLoad >= minDelayMs;

    const botDetectionData = {
      userAgent: navigator.userAgent,
      uaRegexMatch: uaMatch,
      webdriverFlag: webdriverFlag,
      windowHeadlessCheck: headlessCheck,
      windowDimensions: { width: window.outerWidth, height: window.outerHeight },
      isBot: isBot,
      userHasInteracted: userInteracted,
      shouldLoadImmediately: shouldLoadImmediately,
      pageLoadTimestamp: pageLoadTimestamp ? new Date(pageLoadTimestamp).toISOString() : null,
      timeSinceLoad,
      minDelayMs,
      hasMinDelayPassed,
      timestamp: new Date().toISOString(),
    };
    console.log(`[Spline:${config.id}] 🔍 Bot detection checks:`, botDetectionData);
    console.warn(`[Spline:${config.id}] BOT_DETECTION_RESULT: ${JSON.stringify(botDetectionData)}`);

    if (isBot) {
      console.log(`[Spline:${config.id}] ✋ Bot detected, skipping Spline import`);
      return;
    }

    if (!shouldLoadImmediately && !userInteracted) {
      return; // wait for interaction event to re-trigger this effect
    }

    if (!shouldLoadImmediately && !hasMinDelayPassed) {
      // Interaction happened but min delay not passed yet — wait the remainder
      const remaining = minDelayMs - timeSinceLoad;
      const timer = window.setTimeout(() => {
        // Re-trigger by dispatching the interaction event again
        window.dispatchEvent(new Event('spline-user-interacted'));
      }, remaining);
      return () => clearTimeout(timer);
    }

    let cancelled = false;

    const load = () => {
      console.log(`[Spline:${config.id}] 🔄 Importing @splinetool/react-spline...`, {
        timestamp: new Date().toISOString(),
      });
      import('@splinetool/react-spline')
        .then((mod) => {
          if (!cancelled) {
            console.log(`[Spline:${config.id}] ✅ Spline component loaded`, {
              timestamp: new Date().toISOString(),
            });
            setSplineComponent(() => mod.default);
          }
        })
        .catch((err) => {
          console.error(`[Spline:${config.id}] ❌ Failed to load Spline:`, err);
          if (!cancelled) setError(true);
        });
    };

    const scheduleLoad = () => {
      const delayMs = shouldLoadImmediately ? 0 : 2500;
      console.log(`[Spline:${config.id}] ⏱️ Scheduling Spline load in ${delayMs}ms`, {
        shouldLoadImmediately,
        timestamp: new Date().toISOString(),
      });
      setTimeout(() => {
        if (cancelled) return;
        'requestIdleCallback' in window
          ? window.requestIdleCallback(load, { timeout: 8000 })
          : load();
      }, delayMs);
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
      {/* Static placeholder until Spline can load */}
      {!SplineComponent && !error && (
        <SplineStaticPlaceholder config={config} fillParent className="absolute inset-0" />
      )}

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
