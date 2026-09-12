export function ProgressBar({
  value,
  tone = 'default',
}: {
  value: number
  tone?: 'default' | 'danger'
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full ${tone === 'danger' ? 'bg-danger' : 'bg-friday-blue'}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
