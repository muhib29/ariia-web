'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from './lenis-provider';
import { HashScrollManager } from './hash-scroll-manager';
import { MobileSafariMode } from './MobileSafariMode';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeferredLenis>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <HashScrollManager />
        <MobileSafariMode>{children}</MobileSafariMode>
      </NextThemesProvider>
    </DeferredLenis>
  );
}

function DeferredLenis({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const activate = () => {
      if (!cancelled) setMounted(true);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(activate, { timeout: 2000 });
      return () => {
        cancelled = true;
        if ((window as any).cancelIdleCallback) {
          (window as any).cancelIdleCallback(id);
        }
      };
    }

    const t = setTimeout(activate, 1500) as unknown as number;
    return () => {
      cancelled = true;
      clearTimeout(t as unknown as number);
    };
  }, []);

  if (!mounted) return <>{children}</>;
  return <LenisProvider>{children}</LenisProvider>;
}
