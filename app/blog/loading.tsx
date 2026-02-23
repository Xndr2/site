export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="max-w-screen-md mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-10 md:h-12 bg-slate-200 rounded w-24 mb-4 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-64 animate-pulse" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-6 bg-slate-100 rounded-full w-16 animate-pulse"
            />
          ))}
        </div>

        {/* Timeline posts skeleton */}
        <div className="relative">
          {/* Timeline line placeholder */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />

          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative flex gap-6">
                {/* Timeline dot skeleton */}
                <div className="relative flex-shrink-0 z-10">
                  <div className="w-4 h-4 rounded-full bg-slate-200 mt-1 animate-pulse" />
                </div>

                {/* Post card skeleton */}
                <div className="flex-1 p-4 rounded-lg border border-slate-200 bg-white animate-pulse">
                  {/* Date + reading time row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 bg-slate-100 rounded w-24" />
                    <div className="h-3 bg-slate-100 rounded w-2" />
                    <div className="h-3 bg-slate-100 rounded w-14" />
                  </div>
                  {/* Title */}
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  {/* Description lines */}
                  <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
                  <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
                  {/* Tags */}
                  <div className="flex gap-2">
                    <div className="h-4 bg-slate-100 rounded w-12" />
                    <div className="h-4 bg-slate-100 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
