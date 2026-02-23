import type { Metadata } from 'next';
import Navbar from '../navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unsubscribed',
  description: 'You have been unsubscribed from email notifications.',
};

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="Unsubscribed" />

      <main className="max-w-screen-sm mx-auto px-6 pt-28 md:pt-36 pb-16 text-center">
        {/* Mail-off icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3l18 18"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          You&apos;ve been unsubscribed
        </h1>
        <p className="text-slate-500 mb-8">
          You won&apos;t receive any more emails from me. Changed your mind? You
          can always subscribe again on the blog.
        </p>

        <Link
          href="/blog"
          className="text-cat-sky hover:text-cat-pink transition-colors font-medium"
        >
          Visit the blog
        </Link>
      </main>
    </div>
  );
}
