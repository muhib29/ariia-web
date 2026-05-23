// LocationIcon.tsx
import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const LocationIcon: React.FC<IconProps> = ({
  size = 28,
  color = 'currentColor',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M23.9166 10.1487C22.6916 4.7587 17.99 2.33203 13.86 2.33203C13.86 2.33203 13.86 2.33203 13.8483 2.33203C9.72997 2.33203 5.01664 4.74703 3.79164 10.137C2.42664 16.157 6.11331 21.2554 9.44997 24.4637C10.6866 25.6537 12.2733 26.2487 13.86 26.2487C15.4466 26.2487 17.0333 25.6537 18.2583 24.4637C21.595 21.2554 25.2816 16.1687 23.9166 10.1487ZM13.86 15.9937C11.83 15.9937 10.185 14.3487 10.185 12.3187C10.185 10.2887 11.83 8.6437 13.86 8.6437C15.89 8.6437 17.535 10.2887 17.535 12.3187C17.535 14.3487 15.89 15.9937 13.86 15.9937Z"
      fill={color}
    />
  </svg>
);
