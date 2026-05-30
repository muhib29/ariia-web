'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLenis } from '@/lib/lenis';

export function Header({ isHomePage = true }: { isHomePage?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleMenuOpen = (open: boolean) => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop?.();
    } else {
      lenis?.start?.();
    }
    setMenuOpen(open);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'white',
      zIndex: 50,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #eee'
    }}>
      <a href="/" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none', color: 'black' }}>
        ARIIA
      </a>

      <nav style={{ display: 'flex', gap: '24px' }}>
        <a href="/features" style={{ color: '#333', textDecoration: 'none' }}>Features</a>
        <a href="/pricing" style={{ color: '#333', textDecoration: 'none' }}>Pricing</a>
        <a href="/contact-us" style={{ color: '#333', textDecoration: 'none' }}>Contact</a>
      </nav>

      <button
        onClick={() => handleMenuOpen(!menuOpen)}
        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          background: 'white',
          padding: '16px 24px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 100
        }}>
          <a href="/features" onClick={() => handleMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Features</a>
          <a href="/pricing" onClick={() => handleMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Pricing</a>
          <a href="/contact-us" onClick={() => handleMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Contact</a>
        </div>
      )}
    </header>
  );
}
