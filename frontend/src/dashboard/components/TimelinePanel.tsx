import { Card } from './Card'
import { SparkleIcon } from '../icons'
import type { AttentionFollowUp, TimelineItem } from '../followUpsData'

export function TimelinePanel({
  items,
  insight,
  attention,
}: {
  items: TimelineItem[]
  insight: { boldName: string; text: string }
  attention: AttentionFollowUp[]
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">Timeline</h2>
        <div className="bg-friday-blue mt-1.5 h-0.5 w-10" />
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.time} className="flex items-start gap-3">
            <input
              type="checkbox"
              readOnly
              checked={!!item.done}
              className="accent-friday-blue mt-1 h-3.5 w-3.5"
            />
            <div className={item.next ? 'border-friday-orange -ml-3 border-l-2 pl-3' : ''}>
              <div className="flex items-center gap-2">
                <p className="text-ink/40 font-mono text-xs">{item.time}</p>
                {item.next && (
                  <span className="bg-friday-orange-soft text-friday-orange rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-widest uppercase">
                    Next
                  </span>
                )}
              </div>
              <p
                className={`mt-0.5 text-sm font-medium ${
                  item.done ? 'text-ink/40 line-through' : 'text-ink'
                }`}
              >
                {item.title}
              </p>
              {item.subtitle && <p className="text-ink/40 text-xs">{item.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-friday-blue-soft rounded-lg p-4">
        <p className="text-friday-blue-dark flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
          <SparkleIcon className="h-3.5 w-3.5" />
          Friday AI
        </p>
        <p className="text-ink/70 mt-2 text-sm">
          <span className="font-semibold text-ink">{insight.boldName}</span> {insight.text}
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">
            Attention Req.
          </p>
          <span className="bg-friday-orange-soft text-friday-orange rounded px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase">
            {attention.length} Overdue
          </span>
        </div>
        <div className="divide-line mt-3 divide-y">
          {attention.map((item) => (
            <div key={item.lead} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-ink">{item.lead}</p>
                <p className="text-ink/45 text-xs">{item.task}</p>
              </div>
              <span className="bg-friday-orange-soft text-friday-orange rounded px-2 py-1 text-[10px] font-semibold">
                {item.overdueBy}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
