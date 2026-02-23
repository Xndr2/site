export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-10 md:h-12 bg-slate-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-72 animate-pulse" />
        </div>

        {/* Featured section skeleton */}
        <div className="mb-16">
          <div className="h-5 bg-slate-200 rounded w-24 mb-5 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-white animate-pulse"
              >
                <div className="w-full h-40 bg-slate-200 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* GitHub repos section skeleton */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="h-5 bg-slate-200 rounded w-28 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse"
              >
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4 mb-4" />
                <div className="flex gap-3">
                  <div className="h-3 bg-slate-100 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
