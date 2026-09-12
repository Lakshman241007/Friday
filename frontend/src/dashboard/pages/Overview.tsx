import { Card } from '../components/Card'
import { StatCard } from '../components/StatCard'
import { EmployeePerformanceCard } from '../components/EmployeePerformanceCard'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { RecentCallsTable } from '../components/RecentCallsTable'
import { TeamActivityCard } from '../components/TeamActivityCard'
import { AttentionRequiredCard } from '../components/AttentionRequiredCard'
import {
  attentionItems,
  employeePerformance,
  overviewInsights,
  overviewStats,
  performanceSummary,
  recentCalls,
  teamActivity,
} from '../mockData'

export default function Overview() {
  return (
    <div className="space-y-6">
      <Card className="grid grid-cols-2 gap-x-4 gap-y-6 p-6 sm:grid-cols-3 lg:grid-cols-6">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {performanceSummary.map((item) => (
          <Card key={item.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">
                {item.label}
              </p>
              <p className="font-serif mt-1 text-base font-medium text-ink">{item.name}</p>
            </div>
            <span
              className={`text-sm font-semibold ${item.tone === 'danger' ? 'text-danger' : 'text-friday-blue'}`}
            >
              {item.metric}
            </span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeePerformanceCard data={employeePerformance} />
        </div>
        <AiInsightsPanel insights={overviewInsights} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCallsTable calls={recentCalls} />
        </div>
        <div className="space-y-4">
          <TeamActivityCard rows={teamActivity} />
          <AttentionRequiredCard items={attentionItems} />
        </div>
      </div>
    </div>
  )
}
