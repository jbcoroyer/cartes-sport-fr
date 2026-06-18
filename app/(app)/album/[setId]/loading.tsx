export default function Loading() {
  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12 space-y-8">
        <div className="h-5 w-32 rounded bg-panel animate-pulse" />
        <div className="h-40 md:h-48 rounded-clay bg-panel animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="h-28 rounded-clay bg-panel animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
