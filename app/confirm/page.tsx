import type { Metadata } from 'next';
import Navbar from '../navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Subscription Confirmed',
  description: 'Your email subscription is confirmed.',
};

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="Confirmed" />

      <main className="max-w-screen-sm mx-auto px-6 pt-28 md:pt-36 pb-16 text-center">
        {/* Success icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-cat-sky"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          You&apos;re subscribed!
        </h1>
        <p className="text-slate-500 mb-8">
          You&apos;ll get an email whenever I publish a new post. No spam, ever.
        </p>

        <Link
          href="/blog"
          className="text-cat-sky hover:text-cat-pink transition-colors font-medium"
        >
          Back to blog
        </Link>
      </main>
    </div>
  );
}
