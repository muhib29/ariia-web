import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7ffff] via-[#fcfcfc] to-[#fcfcfc] flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Illustration */}
        <div className="-mb-40">
          <Image
            src="/images/customer-cards.png"
            alt="404 Illustration"
            width={400}
            height={300}
            className="mx-auto object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tight">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Currently Under Development
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or is still in development.
          </p>

          {/* In Progress Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            In Progress...
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#101828] text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/contact-us/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
