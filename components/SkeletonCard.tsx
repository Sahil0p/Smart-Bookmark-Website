export default function SkeletonCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-300 dark:bg-slate-700" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-slate-300 dark:bg-slate-700 mb-2" />
          <div className="h-3 w-64 rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
