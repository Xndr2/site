export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#fafbfc]">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cat-pink animate-pulse" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-cat-sky animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-cat-pink animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
