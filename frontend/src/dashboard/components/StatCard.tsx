import { WarningTriangleIcon } from '../icons'
import { ProgressBar } from './ProgressBar'
import type { StatVariant } from '../mockData'

export function StatCard({
  label,
  eyebrow,
  value,
  detail,
  variant = 'default',
  progress,
}: {
  label: string
  eyebrow?: string
  value: string
  detail?: string
  variant?: StatVariant
  progress?: number
}) {
  const danger = variant === 'danger'
  return (
    <div className="border-line border-r px-4 py-4 first:pl-0 last:border-r-0 last:pr-0">
      <div className="flex items-center justify-between">
        <p className="text-ink/45 text-[11px] font-semibold tracking-widest uppercase">{label}</p>
        {danger && <WarningTriangleIcon className="text-danger h-3.5 w-3.5" />}
      </div>
      {eyebrow && (
        <p className="text-ink/35 mt-0.5 text-[10px] tracking-widest uppercase">{eyebrow}</p>
      )}
      <p
        className={`font-serif mt-1.5 text-3xl font-medium ${danger ? 'text-danger' : 'text-ink'}`}
      >
        {value}
      </p>
      {detail && (
        <p className={`mt-1 text-xs ${danger ? 'text-danger' : 'text-ink/50'}`}>{detail}</p>
      )}
      {typeof progress === 'number' && (
        <div className="mt-2">
          <ProgressBar value={progress} />
        </div>
      )}
    </div>
  )
}
