import { useState } from 'react'
import { Card } from './Card'
import { Badge, type BadgeVariant } from './Badge'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
  WarningTriangleIcon,
} from '../icons'
import type { Lead, LeadPriority, LeadStatus } from '../mockData'

const STATUS_VARIANT: Record<LeadStatus, BadgeVariant> = {
  New: 'neutral',
  Interested: 'info',
  Callback: 'neutral',
  'Not Interested': 'neutral',
}

const PRIORITY_STYLE: Record<LeadPriority, { color: string; glyph: string }> = {
  High: { color: 'text-danger', glyph: '⌃' },
  Medium: { color: 'text-ink/50', glyph: '−' },
  Low: { color: 'text-ink/40', glyph: '⌄' },
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button className="border-line flex items-center gap-1.5 rounded border bg-white px-3 py-2 text-xs text-ink/60">
      {label}
      <ChevronDownIcon className="h-3.5 w-3.5" />
    </button>
  )
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [page] = useState(1)

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="border-line flex flex-1 items-center gap-2 rounded border bg-white px-3 py-2">
          <SearchIcon className="text-ink/35 h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search Lead, Company, Contact..."
            className="w-full min-w-0 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </div>
        <FilterSelect label="Status: All" />
        <FilterSelect label="Assignee: All" />
        <FilterSelect label="Priority: All" />
        <button className="text-ink/50 hover:text-ink flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
          <FilterIcon className="h-3.5 w-3.5" />
          More Filters
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-ink/40 border-line border-b text-[11px] tracking-widest uppercase">
              <th className="w-8 pb-3">
                <input type="checkbox" className="accent-friday-blue h-3.5 w-3.5" />
              </th>
              <th className="pb-3 font-semibold">Lead / Company</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Priority</th>
              <th className="pb-3 font-semibold">Assigned To</th>
              <th className="pb-3 font-semibold">Friday</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const priority = PRIORITY_STYLE[lead.priority]
              return (
                <tr
                  key={lead.name}
                  className={`border-line border-b last:border-b-0 ${lead.unassigned ? 'bg-danger-soft/30' : ''}`}
                >
                  <td className="py-3.5 align-top">
                    <input type="checkbox" className="accent-friday-blue h-3.5 w-3.5" />
                  </td>
                  <td className="py-3.5 align-top">
                    <p
                      className={`font-serif font-medium ${lead.closed ? 'text-ink/40 line-through' : 'text-ink'}`}
                    >
                      {lead.name}
                    </p>
                    <p className="text-ink/45 text-xs">{lead.company}</p>
                  </td>
                  <td className="py-3.5 align-top">
                    <Badge variant={STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                  </td>
                  <td className={`py-3.5 align-top text-xs font-semibold ${priority.color}`}>
                    <span className="flex items-center gap-1">
                      <span aria-hidden>{priority.glyph}</span>
                      {lead.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 align-top">
                    {lead.assignedTo ? (
                      <span className="flex items-center gap-2 text-sm text-ink">
                        <span className="bg-friday-blue-soft text-friday-blue-dark flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold">
                          {lead.assignedTo.initials}
                        </span>
                        {lead.assignedTo.name}
                      </span>
                    ) : (
                      <span className="text-danger flex items-center gap-1.5 text-xs font-semibold">
                        <WarningTriangleIcon className="h-3.5 w-3.5" />
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 align-top">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full ${
                          lead.closed
                            ? 'bg-ink/20'
                            : lead.unassigned
                              ? 'bg-danger'
                              : 'bg-friday-blue'
                        }`}
                        style={{ width: `${lead.fridayScore * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-ink/50 text-xs">Showing 1–25 of 1,284 leads</p>
        <div className="flex items-center gap-1.5">
          <button className="border-line text-ink/40 rounded border p-1.5" disabled>
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`h-7 w-7 rounded text-xs font-semibold ${
                n === page ? 'bg-friday-blue text-white' : 'border-line border text-ink/60'
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-ink/40 px-1 text-xs">…</span>
          <button className="border-line text-ink/60 rounded border p-1.5">
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}
