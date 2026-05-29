
'use client';

export function Footer() {
  return (
    <footer style={{
      background: '#111',
      color: 'white',
      padding: '48px 24px',
      marginTop: '80px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '32px'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>ARIIA</div>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
            Autonomous AI agents for businesses of every size.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: '600', marginBottom: '12px', color: '#eee' }}>Product</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/features" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Features</a>
            <a href="/pricing" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
            <a href="/trial" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Free Trial</a>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: '600', marginBottom: '12px', color: '#eee' }}>Company</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/story-behind-ariia" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Our Story</a>
            <a href="/careers" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Careers</a>
            <a href="/customers" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Customers</a>
            <a href="/contact-us" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: '600', marginBottom: '12px', color: '#eee' }}>Resources</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/blog" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Blog</a>
            <a href="/industries" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Industries</a>
            <a href="/privacy-policy" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1000px',
        margin: '40px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid #333',
        color: '#666',
        fontSize: '13px',
        textAlign: 'center'
      }}>
        © {new Date().getFullYear()} ARIIA. All rights reserved.
      </div>
    </footer>
  );
}


export function NewsletterFooter({ isHomePage = true }: { isHomePage?: boolean }) {
  return (
    <div style={{
      background: '#f9f9f9',
      borderTop: '1px solid #eee',
      padding: '48px 24px',
      textAlign: 'center'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
        Stay in the loop
      </h3>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
        Get the latest ARIIA news and updates.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <input
          type="email"
          placeholder="Your email address"
          style={{
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid #ddd',
            fontSize: '15px',
            width: '260px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 24px',
            borderRadius: '999px',
            background: '#111',
            color: 'white',
            border: 'none',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

