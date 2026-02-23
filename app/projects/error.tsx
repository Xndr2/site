'use client';

export default function ProjectsError({
  error: _error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        <p className="text-sm text-slate-400 flex items-center gap-1.5 py-8">
          <span className="text-cat-pink text-base leading-none">·</span>
          Couldn&apos;t reach GitHub right now.
        </p>
      </main>
    </div>
  );
}
