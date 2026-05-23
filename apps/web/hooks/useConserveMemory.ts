'use client';

import { useSyncExternalStore } from 'react';
import { shouldConserveMemory } from '@/lib/device-capabilities';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', onChange);
  window.addEventListener('orientationchange', onChange);
  return () => {
    mq.removeEventListener('change', onChange);
    window.removeEventListener('orientationchange', onChange);
  };
}

function getSnapshot() {
  return shouldConserveMemory();
}

function getServerSnapshot() {
  return false;
}

/** True on mobile touch viewports — used for lazy section mount & lighter images. */
export function useConserveMemory(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
