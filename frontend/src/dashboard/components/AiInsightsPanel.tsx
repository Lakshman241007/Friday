import { ArrowRightIcon, SparkleIcon } from '../icons'
import type { AiInsight } from '../mockData'

export function AiInsightsPanel({ insights }: { insights: AiInsight[] }) {
  return (
    <div className="bg-panel flex h-full flex-col rounded-lg text-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <SparkleIcon className="text-friday-orange h-4 w-4" />
          <h2 className="font-serif text-base font-semibold">Friday AI Insights</h2>
        </div>
        <span className="rounded border border-white/20 px-2 py-1 text-[10px] font-semibold tracking-widest text-white/60 uppercase">
          Scanning
        </span>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-2">
        {insights.map((insight) => (
          <div key={insight.tag + insight.body} className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <p
                className={`text-xs font-semibold tracking-wide uppercase ${
                  insight.tone === 'warning' ? 'text-friday-orange' : 'text-white'
                }`}
              >
                {insight.tag}
              </p>
              <span className="text-[10px] text-white/40">{insight.timeAgo}</span>
            </div>
            <p className="mt-1.5 text-sm text-white/70">{insight.body}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-1.5 border-t border-white/10 py-4 text-xs font-semibold tracking-widest text-white/70 uppercase hover:text-white"
      >
        View All Logs
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
