import { Card } from '../../dashboard/components/Card'
import { Badge } from '../../dashboard/components/Badge'
import { PhoneIcon } from '../../dashboard/icons'
import { MailIcon } from '../icons'
import type { EmployeeLead } from '../mockData'

export function LeadCard({ lead }: { lead: EmployeeLead }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-serif text-base font-medium text-ink">{lead.name}</p>
          <p className="text-ink/50 text-sm">{lead.company}</p>
          <p className="text-ink/40 mt-0.5 font-mono text-xs">{lead.maskedPhone}</p>
        </div>
        <Badge variant={lead.priority === 'High Priority' ? 'warning' : 'neutral'}>
          {lead.priority}
        </Badge>
      </div>

      <div className="border-line mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-ink/60 flex items-center gap-1.5 text-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              lead.status === 'Active' ? 'bg-friday-blue' : 'bg-ink/30'
            }`}
          />
          {lead.status}
        </span>
        {lead.action === 'Schedule' ? (
          <button className="bg-panel flex items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold text-white">
            <PhoneIcon className="h-3.5 w-3.5" />
            Schedule
          </button>
        ) : (
          <button className="border-line text-ink/70 flex items-center gap-1.5 rounded border px-3.5 py-2 text-xs font-semibold">
            <MailIcon className="h-3.5 w-3.5" />
            Follow Up
          </button>
        )}
      </div>
    </Card>
  )
}
