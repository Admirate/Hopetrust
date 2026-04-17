export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F4]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00373E]/20 border-t-[#00373E]" />
        <p className="text-sm font-medium text-[#486364]">Loading…</p>
      </div>
    </main>
  );
}
