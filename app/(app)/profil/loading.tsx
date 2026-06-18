export default function Loading() {
  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 md:py-14 space-y-10">
        <div className="h-10 w-64 rounded bg-panel animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-[5/7] rounded-clay bg-panel animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-20 rounded-clay bg-panel animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
