'use client';

import type { CSSProperties } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import { SplineStaticPlaceholder } from './SplineStaticPlaceholder';

interface SplineSceneProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  /** Fill a sized parent (e.g. hero orb circle) instead of config height. */
  fillParent?: boolean;
}

/**
 * Disabled SplineScene: render static placeholder only to avoid loading WebGL bundles.
 * This file is intentionally minimal while troubleshooting WebGL freezes.
 */
export default function SplineScene({
  config,
  className = '',
  style = {},
  fillParent = false,
}: SplineSceneProps) {
  return (
    <SplineStaticPlaceholder config={config} className={className} style={style} fillParent={fillParent} />
  );
}