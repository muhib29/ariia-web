// PlayIcon.tsx
import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ size = 25, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.2893 14.4543L9.3204 19.0079C7.98709 19.7698 6.32812 18.8071 6.32812 17.2714V12.7178V8.16413C6.32812 6.62849 7.98709 5.66575 9.3204 6.42765L17.2893 10.9813C18.6329 11.7491 18.6329 13.6865 17.2893 14.4543Z"
      fill={color}
    />
  </svg>
);
