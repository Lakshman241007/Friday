import { Card } from './Card'
import { ArrowRightIcon, SparkleIcon, WarningTriangleIcon } from '../icons'
import type { LeadInsights } from '../mockData'

export function LeadInsightsPanel({ insights }: { insights: LeadInsights }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SparkleIcon className="text-friday-blue h-4 w-4" />
        <h2 className="font-serif text-base font-semibold text-ink">Friday AI Insights</h2>
      </div>

      <div className="border-danger/30 bg-danger-soft/50 rounded-lg border p-4">
        <p className="text-danger flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <WarningTriangleIcon className="h-3.5 w-3.5" />
          Priority Alert
        </p>
        <p className="mt-1.5 text-sm text-ink/70">{insights.priorityAlert}</p>
        <button className="text-danger mt-2 flex items-center gap-1 text-xs font-semibold tracking-widest uppercase">
          View Leads
          <ArrowRightIcon className="h-3 w-3" />
        </button>
      </div>

      <div className="bg-friday-blue-soft rounded-lg border border-transparent p-4">
        <p className="text-friday-blue-dark flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <SparkleIcon className="h-3.5 w-3.5" />
          Intelligence
        </p>
        <p className="mt-1.5 text-sm text-ink/70">{insights.intelligence}</p>
        <button className="text-friday-blue-dark mt-2 flex items-center gap-1 text-xs font-semibold tracking-widest uppercase">
          Analyze Intent
          <ArrowRightIcon className="h-3 w-3" />
        </button>
      </div>

      <Card className="p-4">
        <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">
          Model Status
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 font-serif text-sm text-ink">
          <span className="bg-friday-blue h-1.5 w-1.5 rounded-full" />
          Active
        </p>
        <p className="text-ink/45 mt-1 text-xs">{insights.modelStatus}</p>
      </Card>
    </div>
  )
}
