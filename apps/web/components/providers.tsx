'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from './lenis-provider';
import { HashScrollManager } from './hash-scroll-manager';
import { MobileSafariMode } from './MobileSafariMode';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
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
    </LenisProvider>
  );
}
