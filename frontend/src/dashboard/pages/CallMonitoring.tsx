import { CallMonitoringStatCard } from '../components/CallMonitoringStatCard'
import { LiveCallsTable } from '../components/LiveCallsTable'
import { AiLiveIntelligencePanel } from '../components/AiLiveIntelligencePanel'
import { CompletedCallsTable } from '../components/CompletedCallsTable'
import { aiIntelligenceFeed, callMonitoringStats, completedCalls, liveCalls } from '../callMonitoringData'

export default function CallMonitoring() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Call Monitoring</h1>
          <p className="text-ink/50 mt-1 text-sm">
            Monitor active conversations and real-time AI signals across your team.
          </p>
        </div>
        <span className="border-friday-blue/30 text-friday-blue-dark inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-widest uppercase">
          <span className="bg-friday-blue h-2 w-2" />
          Live Telemetry Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {callMonitoringStats.map((stat) => (
          <CallMonitoringStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveCallsTable calls={liveCalls} />
        </div>
        <AiLiveIntelligencePanel events={aiIntelligenceFeed} />
      </div>

      <CompletedCallsTable calls={completedCalls} />
    </div>
  )
}
