import { TrendUpIcon } from '../../dashboard/icons'
import type { EmployeeStat } from '../mockData'

const ACCENT_BORDER = {
  default: 'border-l-line',
  orange: 'border-l-friday-orange',
  dark: 'border-l-panel',
} as const

export function StatCarousel({ stats }: { stats: EmployeeStat[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`border-line w-40 shrink-0 snap-start rounded-lg border border-l-4 bg-white p-4 ${ACCENT_BORDER[stat.accent]}`}
        >
          <p className="text-ink/45 text-[11px] font-semibold tracking-widest uppercase">
            {stat.label}
          </p>
          <p className="font-serif mt-1.5 text-2xl font-semibold text-ink">{stat.value}</p>
          <p className="text-friday-blue mt-1.5 flex items-center gap-1 text-xs font-medium">
            <TrendUpIcon className="h-3.5 w-3.5" />
            {stat.trend}
          </p>
        </div>
      ))}
    </div>
  )
}
