export default function GitHubReposSkeleton() {
  return (
    <section>
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
    </section>
  );
}
