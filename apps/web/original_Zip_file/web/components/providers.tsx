'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from './lenis-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </LenisProvider>
  );
}
