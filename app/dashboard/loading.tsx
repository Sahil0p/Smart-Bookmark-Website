export default function DashboardLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">
          Loading your bookmarks...
        </p>
      </div>
    </div>
  );
}
