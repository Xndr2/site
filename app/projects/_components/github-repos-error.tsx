'use client';

import { useRouter } from 'next/navigation';

export default function GitHubReposError() {
  const router = useRouter();

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Open Source</h2>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600 mb-4">
          Unable to load GitHub repositories. Please try again.
        </p>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 text-sm font-medium text-white bg-cat-sky rounded-lg hover:bg-cat-sky/90 transition-colors"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
