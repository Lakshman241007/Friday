import { LeadStatCard } from '../components/LeadStatCard'
import { PipelineDistributionCard } from '../components/PipelineDistributionCard'
import { LeadsTable } from '../components/LeadsTable'
import { LeadInsightsPanel } from '../components/LeadInsightsPanel'
import { DownloadIcon, PlusIcon } from '../icons'
import { leadInsights, leadStats, leads, pipelineDistribution } from '../mockData'

export default function LeadManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Lead Management</h1>
          <div className="bg-friday-blue mt-2 h-0.5 w-16" />
        </div>
        <div className="flex items-center gap-3">
          <button className="border-line flex items-center gap-2 rounded border bg-white px-4 py-2.5 text-xs font-semibold tracking-widest text-ink/70 uppercase">
            <DownloadIcon className="h-4 w-4" />
            Import Leads
          </button>
          <button className="bg-friday-blue hover:bg-friday-blue-dark flex items-center gap-2 rounded px-4 py-2.5 text-xs font-semibold tracking-widest text-white uppercase">
            <PlusIcon className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {leadStats.map((stat) => (
          <LeadStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PipelineDistributionCard stages={pipelineDistribution} />
          <LeadsTable leads={leads} />
        </div>
        <LeadInsightsPanel insights={leadInsights} />
      </div>
    </div>
  )
}
