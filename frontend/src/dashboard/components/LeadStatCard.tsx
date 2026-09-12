import { Card } from './Card'
import { WarningTriangleIcon } from '../icons'
import type { StatVariant } from '../mockData'

export function LeadStatCard({
  label,
  value,
  detail,
  variant = 'default',
}: {
  label: string
  value: string
  detail?: string
  variant?: StatVariant
}) {
  const danger = variant === 'danger'
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">{label}</p>
        {danger && <span className="bg-danger h-1.5 w-1.5 rounded-full" />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <p className={`font-serif text-2xl font-medium ${danger ? 'text-danger' : 'text-ink'}`}>
          {value}
        </p>
        {detail && <span className="text-friday-blue text-xs font-semibold">{detail}</span>}
      </div>
      {danger && (
        <p className="text-danger/70 mt-1 flex items-center gap-1 text-[11px]">
          <WarningTriangleIcon className="h-3 w-3" />
          Needs review
        </p>
      )}
    </Card>
  )
}
