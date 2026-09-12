import { useMemo, useState } from 'react'
import { Card } from './Card'
import { ChevronDownIcon, SearchIcon } from '../icons'
import type { FollowUp, FollowUpFilter } from '../followUpsData'

const TABS: { label: string; value: FollowUpFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Due Today', value: 'today' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
]

function FilterSelect({ label }: { label: string }) {
  return (
    <button className="border-line flex items-center gap-1.5 rounded border bg-white px-3 py-2 text-xs text-ink/60">
      {label}
      <ChevronDownIcon className="h-3.5 w-3.5" />
    </button>
  )
}

export function FollowUpsTable({ followUps }: { followUps: FollowUp[] }) {
  const [tab, setTab] = useState<FollowUpFilter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return followUps.filter((item) => {
      const matchesTab = tab === 'all' || item.status === tab
      const matchesQuery =
        query.trim() === '' ||
        item.lead.toLowerCase().includes(query.toLowerCase()) ||
        item.company.toLowerCase().includes(query.toLowerCase()) ||
        item.task.toLowerCase().includes(query.toLowerCase())
      return matchesTab && matchesQuery
    })
  }, [followUps, tab, query])

  return (
    <Card className="p-6">
      <div className="border-line flex items-center gap-2 border-b pb-3">
        <SearchIcon className="text-ink/35 h-4 w-4 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search leads or follow-ups..."
          className="w-full text-sm text-ink outline-none placeholder:text-ink/35"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FilterSelect label="Status" />
          <FilterSelect label="Employee" />
          <FilterSelect label="Priority" />
        </div>
        <div className="flex items-center gap-5 text-xs font-semibold tracking-widest uppercase">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`border-b-2 pb-1 ${
                tab === t.value
                  ? 'border-friday-blue text-friday-blue'
                  : 'text-ink/40 border-transparent hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-ink/40 border-line border-b text-[11px] tracking-widest uppercase">
              <th className="w-8 pb-3 font-semibold">Pr</th>
              <th className="pb-3 font-semibold">Lead</th>
              <th className="pb-3 font-semibold">Company</th>
              <th className="pb-3 font-semibold">Follow-up</th>
              <th className="pb-3 font-semibold">Assigned</th>
              <th className="pb-3 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={`${item.lead}-${item.task}`} className="border-line border-b last:border-b-0">
                <td className="py-4 align-top">
                  <span
                    className={`inline-block h-2 w-2 rounded-sm ${
                      item.priority === 'high' ? 'bg-friday-orange' : 'bg-ink/20'
                    }`}
                  />
                </td>
                <td className="font-serif py-4 align-top font-medium text-ink">{item.lead}</td>
                <td className="text-ink/60 py-4 align-top">{item.company}</td>
                <td className="text-ink/75 py-4 align-top">{item.task}</td>
                <td className="text-ink/60 py-4 align-top">{item.assignedTo}</td>
                <td
                  className={`py-4 align-top font-medium ${
                    item.due.startsWith('Today') ? 'text-friday-blue' : 'text-ink'
                  }`}
                >
                  {item.due}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-ink/40 py-8 text-center text-sm">
                  No follow-ups match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
