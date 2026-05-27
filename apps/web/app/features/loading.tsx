export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    </div>
  );
}
