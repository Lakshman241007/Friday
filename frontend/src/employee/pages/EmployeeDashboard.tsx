import { EmployeeTopBar } from '../components/EmployeeTopBar'
import { StatCarousel } from '../components/StatCarousel'
import { WeeklyActivityChart } from '../components/WeeklyActivityChart'
import { InsightCard } from '../components/InsightCard'
import { LeadCard } from '../components/LeadCard'
import { BottomActionBar } from '../components/BottomActionBar'
import { employeeInsight, employeeLeads, employeeStats, weeklyActivity } from '../mockData'

export default function EmployeeDashboard() {
  return (
    <div className="bg-line/40 flex min-h-screen justify-center font-sans text-ink sm:px-4 sm:py-10">
      <div className="bg-paper flex w-full max-w-[420px] flex-col sm:h-[812px] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-line sm:shadow-2xl">
        <EmployeeTopBar />

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold text-ink">Dashboard</h1>
            <span className="border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase">
              <span className="bg-friday-orange h-1.5 w-1.5 rounded-full" />
              AI Online
            </span>
          </div>

          <StatCarousel stats={employeeStats} />
          <WeeklyActivityChart data={weeklyActivity} />
          <InsightCard insight={employeeInsight} />

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-ink">Active Leads</h2>
              <button className="text-friday-blue text-sm font-medium">View All</button>
            </div>
            <div className="mt-3 space-y-3">
              {employeeLeads.map((lead) => (
                <LeadCard key={lead.name} lead={lead} />
              ))}
            </div>
          </div>
        </div>

        <BottomActionBar />
      </div>
    </div>
  )
}
