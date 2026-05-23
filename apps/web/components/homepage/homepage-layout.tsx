import { Header } from './header';
import type React from 'react';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout = ({ children }: HomepageLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default HomepageLayout;
