import { Link } from 'react-router-dom'
import { Card } from './Card'
import { Badge } from './Badge'
import type { CompletedCall } from '../callMonitoringData'

export function CompletedCallsTable({ calls }: { calls: CompletedCall[] }) {
  return (
    <Card className="p-6">
      <h2 className="font-serif text-lg font-semibold text-ink">Recently Completed</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-ink/40 border-line border-b text-[11px] tracking-widest uppercase">
              <th className="pb-3 font-semibold">Call ID</th>
              <th className="pb-3 font-semibold">Rep / Lead</th>
              <th className="pb-3 font-semibold">Dur</th>
              <th className="pb-3 font-semibold">AI Outcome</th>
              <th className="pb-3 font-semibold">Sentiment</th>
              <th className="pb-3 text-right font-semibold">Completed</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.callId} className="border-line hover:bg-paper/60 border-b last:border-b-0">
                <td className="py-4 align-top">
                  <Link
                    to={`/dashboard/calls/${call.callId}`}
                    className="text-friday-blue font-mono text-xs font-semibold hover:underline"
                  >
                    {call.callId}
                  </Link>
                </td>
                <td className="py-4 align-top">
                  <Link to={`/dashboard/calls/${call.callId}`}>
                    <p className="font-serif font-medium text-ink">{call.rep}</p>
                    <p className="text-ink/45 text-xs">{call.company}</p>
                  </Link>
                </td>
                <td className="text-ink/60 py-4 align-top text-xs">{call.duration}</td>
                <td className="py-4 align-top">
                  <Badge variant={call.outcome.tone === 'info' ? 'info' : 'warning'}>
                    {call.outcome.label}
                  </Badge>
                </td>
                <td className="py-4 align-top">
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${call.sentiment >= 0.5 ? 'bg-friday-blue' : 'bg-danger'}`}
                      style={{ width: `${call.sentiment * 100}%` }}
                    />
                  </div>
                </td>
                <td className="text-ink/50 py-4 text-right align-top text-xs">
                  {call.completedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
