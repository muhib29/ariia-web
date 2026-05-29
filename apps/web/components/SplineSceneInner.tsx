'use client';

import type { CSSProperties } from 'react';
import type { SplineSceneConfig } from '@/config/spline-scenes';
import { SplineStaticPlaceholder } from './SplineStaticPlaceholder';

export interface SplineSceneInnerProps {
  config: SplineSceneConfig;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fillParent?: boolean;
}

/**
 * Disabled SplineSceneInner: always render static placeholder to avoid loading WebGL.
 */
export default function SplineSceneInner({
  config,
  className = '',
  style = {},
  fillParent = false,
}: SplineSceneInnerProps) {
  return (
    <SplineStaticPlaceholder config={config} className={className} style={style} fillParent={fillParent} />
  );
}
