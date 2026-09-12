import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from './Card'
import type { EmployeePerformancePoint } from '../mockData'

const RANGES = ['7D', '30D', '90D'] as const

export function EmployeePerformanceCard({ data }: { data: EmployeePerformancePoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>('7D')

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold text-ink">Employee Performance</h2>
            <span className="bg-friday-blue-soft text-friday-blue-dark rounded px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase">
              Live Data
            </span>
          </div>
          <p className="text-ink/50 mt-1 text-sm">
            Comparing success vs failure rates across the team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="border-line rounded border bg-white px-2.5 py-1.5 text-xs text-ink/70">
            <option>All Employees</option>
          </select>
          <div className="border-line flex overflow-hidden rounded border">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  range === r ? 'bg-friday-blue text-white' : 'bg-white text-ink/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="24%">
            <CartesianGrid vertical={false} stroke="#e2e2ec" />
            <XAxis
              dataKey="employee"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#0b1220', fillOpacity: 0.6 }}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#0b1220', fillOpacity: 0.4 }}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: '#f7f7fb' }}
              formatter={(value?: number | string | readonly (number | string)[]) => `${value}%`}
              contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: '#e2e2ec' }}
            />
            <Bar dataKey="successRate" name="Success Rate" fill="#1d3fd6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="failureRate" name="Failure Rate" fill="#e8590c" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-line mt-4 flex items-center gap-6 border-t pt-4 text-xs">
        <span className="flex items-center gap-2 text-ink/60">
          <span className="bg-friday-blue h-2.5 w-2.5 rounded-sm" />
          Success Rate
        </span>
        <span className="flex items-center gap-2 text-ink/60">
          <span className="bg-friday-orange h-2.5 w-2.5 rounded-sm" />
          Failure Rate
        </span>
      </div>
    </Card>
  )
}
