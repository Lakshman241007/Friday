import { Card } from './Card'
import { Badge, type BadgeVariant } from './Badge'
import { FilterIcon } from '../icons'
import type { CallOutcome, RecentCall } from '../mockData'

const OUTCOME_VARIANT: Record<CallOutcome, BadgeVariant> = {
  Positive: 'info',
  Escalate: 'warning',
  Neutral: 'neutral',
  Risk: 'danger',
}

const STATUS_DOT: Record<string, string> = {
  Closed: 'bg-friday-blue',
  Review: 'bg-friday-orange',
  Voicemail: 'bg-ink/30',
  'Follow-up': 'bg-friday-blue',
  Lost: 'bg-danger',
}

export function RecentCallsTable({ calls }: { calls: RecentCall[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink">Recent Call Activity</h2>
        <button className="text-ink/50 hover:text-ink flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
          <FilterIcon className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-ink/40 text-[11px] tracking-widest uppercase">
              <th className="pb-3 font-semibold">Call</th>
              <th className="pb-3 font-semibold">Lead</th>
              <th className="pb-3 font-semibold">Employee</th>
              <th className="pb-3 font-semibold">Time</th>
              <th className="pb-3 font-semibold">Duration</th>
              <th className="pb-3 font-semibold">AI Outcome</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.callId} className="border-line border-t">
                <td className="text-friday-blue py-3 font-mono text-xs font-semibold">
                  {call.callId}
                </td>
                <td className="font-serif py-3 text-ink">{call.lead}</td>
                <td className="py-3 text-ink/70">{call.employee}</td>
                <td className="text-ink/50 py-3 text-xs">{call.time}</td>
                <td className="text-ink/50 py-3 text-xs">{call.duration}</td>
                <td className="py-3">
                  <Badge variant={OUTCOME_VARIANT[call.outcome]}>{call.outcome}</Badge>
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5 text-xs text-ink/60">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[call.status] ?? 'bg-ink/30'}`}
                    />
                    {call.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="border-line text-ink/50 hover:text-ink mt-4 w-full rounded border border-dashed py-2.5 text-xs font-semibold tracking-widest uppercase">
        Load More Records
      </button>
    </Card>
  )
}
