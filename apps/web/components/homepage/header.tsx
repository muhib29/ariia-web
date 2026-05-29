'use client';
import { useState } from 'react';

export function Header({ isHomePage = true }: { isHomePage?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Desktop nav */}
      <nav style={{ display: 'flex', gap: '24px' }}>
        <a href="/features" style={{ color: '#333', textDecoration: 'none' }}>Features</a>
        <a href="/pricing" style={{ color: '#333', textDecoration: 'none' }}>Pricing</a>
        <a href="/industries" style={{ color: '#333', textDecoration: 'none' }}>Industries</a>
        <a href="/blog" style={{ color: '#333', textDecoration: 'none' }}>Blog</a>
        <a href="/contact-us" style={{ color: '#333', textDecoration: 'none' }}>Contact</a>
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        className="mobile-menu-btn"
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
          <a href="/features" onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Features</a>
          <a href="/pricing" onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Pricing</a>
          <a href="/industries" onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Industries</a>
          <a href="/blog" onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Blog</a>
          <a href="/contact-us" onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>Contact</a>
          <a href="/trial" onClick={() => setMenuOpen(false)} style={{ color: 'white', background: '#111', padding: '10px 20px', borderRadius: '999px', textDecoration: 'none', textAlign: 'center', fontSize: '16px' }}>Free Trial</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}

