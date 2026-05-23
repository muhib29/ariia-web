'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from './lenis-provider';
import { HashScrollManager } from './hash-scroll-manager';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <HashScrollManager />
        {children}
      </NextThemesProvider>
    </LenisProvider>
  );
}
