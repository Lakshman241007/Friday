import { WarningTriangleIcon, FlagIcon, SentimentIcon, SyncIcon } from '../icons'
import type { AttentionItem } from '../mockData'

const ICONS = {
  flag: FlagIcon,
  sentiment: SentimentIcon,
  sync: SyncIcon,
}

export function AttentionRequiredCard({ items }: { items: AttentionItem[] }) {
  return (
    <div className="border-danger/30 bg-danger-soft/40 rounded-lg border p-5">
      <div className="flex items-center gap-2">
        <WarningTriangleIcon className="text-danger h-4 w-4" />
        <h2 className="text-danger text-sm font-semibold tracking-wide uppercase">
          Attention Required
        </h2>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <div key={item.title} className="flex items-start gap-3">
              <Icon className="text-danger mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-ink/55 mt-0.5 text-xs">{item.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
