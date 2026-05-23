import React from 'react';

interface GradientHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({ children, className = '' }) => (
  <span className={`gradient-header-animated ${className}`} style={{ display: 'inline' }}>
    {children}
  </span>
);

export default GradientHeader;
