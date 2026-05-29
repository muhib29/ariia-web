import Link from 'next/link';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-lg font-semibold">ARIIA Debug Isolation Build</div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/" prefetch={false} className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/features" prefetch={false} className="text-blue-600 hover:underline">
              Features
            </Link>
            <Link href="/pricing" prefetch={false} className="text-blue-600 hover:underline">
              Pricing
            </Link>
            <Link href="/blog" prefetch={false} className="text-blue-600 hover:underline">
              Blog
            </Link>
            <Link href="/contact-us" prefetch={false} className="text-blue-600 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Debug Isolation Build</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          This temporary build is intentionally stripped down to isolate the iPhone Safari/Chrome freeze.
          No custom scrolling, no providers, no animations, no loading boundaries, and no client-side navigation behavior.
        </p>
        <section className="mt-10 space-y-4 text-slate-700">
          <p>Navigate using the plain links above and test route transitions on iOS.</p>
          <p>All navigation links in this page explicitly use <code>prefetch={false}</code>.</p>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
          Static footer. No client-side state. No visual effects.
        </div>
      </footer>
    </div>
  );
}
