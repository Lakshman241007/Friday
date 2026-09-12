export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-2">
      <h1 className="font-serif text-3xl font-semibold text-ink">{title}</h1>
      <p className="text-ink/50 max-w-sm text-sm">
        This section isn't built yet. Dashboard and Lead Management are the two pages designed
        so far.
      </p>
    </div>
  )
}
