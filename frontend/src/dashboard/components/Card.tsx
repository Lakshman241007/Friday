export function Card({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`border-line rounded-lg border bg-white ${className}`}>{children}</div>
  )
}
