import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import { UsersIcon } from '../icons'
import type { TeamActivityRow } from '../mockData'

export function TeamActivityCard({ rows }: { rows: TeamActivityRow[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">Team Activity</h2>
        <UsersIcon className="text-ink/30 h-4 w-4" />
      </div>

      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{row.name}</span>
              <span className={`font-semibold ${row.tone === 'danger' ? 'text-danger' : 'text-friday-blue'}`}>
                {row.successRate}% Success
              </span>
            </div>
            <div className="mt-1.5">
              <ProgressBar value={row.successRate} tone={row.tone} />
            </div>
            <div className="text-ink/45 mt-1 flex items-center justify-between text-xs">
              <span>{row.callsToday} Calls Today</span>
              <span>{row.note}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
