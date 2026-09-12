const VARIANT_CLASSES = {
  info: 'bg-friday-blue-soft text-friday-blue-dark',
  warning: 'bg-friday-orange-soft text-friday-orange',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-line/60 text-ink/60',
} as const

export type BadgeVariant = keyof typeof VARIANT_CLASSES

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  )
}
