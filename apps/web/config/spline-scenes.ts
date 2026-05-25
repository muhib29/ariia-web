export interface SplineSceneConfig {
  id: string;
  url: string;
  height: {
    mobile: string; // < 768px
    tablet: string; // 768px - 1024px
    desktop: string; // > 1024px
  };
  disableInteractions?: boolean;
  customInteractions?: {
    disableZoom?: boolean;
    disablePan?: boolean;
    disableOrbit?: boolean;
  };
  priority?: boolean;
}

export const SPLINE_SCENES: Record<string, SplineSceneConfig> = {
  hero: {
    id: 'hero',
    url: 'https://prod.spline.design/aFE3Y-GvjwaKCApS/scene.splinecode',
    height: {
      mobile: '290px',
      tablet: '200px',
      desktop: '300px',
    },
    disableInteractions: true,
    priority: false,
  },
  heroPattern: {
    id: 'hero-pattern',
    url: 'https://prod.spline.design/6Fj6ODYUPXYckdop/scene.splinecode',
    // 'https://prod.spline.design/6Fj6ODYUPXYckdop/scene.splinecode',
    // https://prod.spline.design/90RKKa80sOBJLo64/scene.splinecode
    height: {
      mobile: '690px',
      tablet: '500px',
      desktop: '690px',
    },
    disableInteractions: true,
  },
  heroPatternMobile: {
    id: 'hero-pattern-mobile',
    url: 'https://prod.spline.design/y3FHz5bH5vzw2W6F/scene.splinecode',
    height: {
      mobile: '400px',
      tablet: '500px',
      desktop: '690px',
    },
    disableInteractions: true,
  },
  aboutUs: {
    id: 'about-us',
    url: 'https://prod.spline.design/o7nPi14iqO3CulPv/scene.splinecode',
    height: {
      mobile: '300px',
      tablet: '350px',
      desktop: '450px',
    },
    disableInteractions: true,
  },
  career: {
    id: 'career',
    url: 'https://prod.spline.design/7Qc19lsG2tuIWsE4/scene.splinecode',
    height: {
      mobile: '300px',
      tablet: '350px',
      desktop: '300px',
    },
    disableInteractions: true,
  },
  careerRoles: {
    id: 'career-role',
    url: 'https://prod.spline.design/oTzTYZhi3efm7ypD/scene.splinecode',
    height: {
      mobile: '280px',
      tablet: '300px',
      desktop: '310px',
    },
    disableInteractions: true,
  },
};


export type SplineFallbackVariant = 'orb' | 'pattern';

export function getSplineFallbackVariant(config: SplineSceneConfig): SplineFallbackVariant {
  if (config.id.includes('pattern')) return 'pattern';
  return 'orb';
}