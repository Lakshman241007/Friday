import type { StatTone } from '../followUpsData'

const VALUE_TONE: Record<StatTone, string> = {
  default: 'text-ink',
  info: 'text-friday-blue',
  warning: 'text-friday-orange',
}

export function FollowUpStatsStrip({
  stats,
}: {
  stats: { label: string; value: string; tone: StatTone }[]
}) {
  return (
    <div className="border-line border-b pb-6">
      <div className="flex divide-x divide-line">
        {stats.map((stat) => (
          <div key={stat.label} className="flex-1 px-6 first:pl-0">
            <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">
              {stat.label}
            </p>
            <p className={`font-serif mt-2 text-4xl font-semibold ${VALUE_TONE[stat.tone]}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
