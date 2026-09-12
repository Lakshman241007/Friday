import { SparkleIcon } from '../../dashboard/icons'

export function InsightCard({
  insight,
}: {
  insight: { title: string; body: string; cta: string }
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <SparkleIcon className="text-friday-orange h-4 w-4" />
        <h2 className="font-serif text-lg font-semibold text-ink">Friday Insights</h2>
      </div>

      <div className="border-friday-orange bg-friday-orange-soft mt-3 rounded-lg border-l-4 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="bg-friday-orange h-1.5 w-1.5 shrink-0 rounded-full" />
          {insight.title}
        </p>
        <p className="text-ink/65 mt-2 text-sm leading-relaxed">{insight.body}</p>
        <button className="text-friday-orange mt-3 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
          {insight.cta}
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  )
}
