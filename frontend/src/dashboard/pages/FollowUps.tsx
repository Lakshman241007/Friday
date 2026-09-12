import { FollowUpStatsStrip } from '../components/FollowUpStatsStrip'
import { FollowUpsTable } from '../components/FollowUpsTable'
import { TimelinePanel } from '../components/TimelinePanel'
import { DownloadIcon, PlusIcon } from '../icons'
import {
  aiFollowUpInsight,
  attentionFollowUps,
  followUpStats,
  followUps,
  timelineItems,
} from '../followUpsData'

export default function FollowUps() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black tracking-tight text-ink">Follow-ups</h1>
          <p className="text-ink/50 mt-2 text-sm">
            Keep every customer conversation moving forward.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border-line flex items-center gap-2 rounded border bg-white px-4 py-2.5 text-xs font-semibold tracking-widest text-ink/70 uppercase">
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
          <button className="bg-friday-blue hover:bg-friday-blue-dark flex items-center gap-2 rounded px-4 py-2.5 text-xs font-semibold tracking-widest text-white uppercase">
            <PlusIcon className="h-4 w-4" />
            Create Follow-up
          </button>
        </div>
      </div>

      <FollowUpStatsStrip stats={followUpStats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FollowUpsTable followUps={followUps} />
        </div>
        <TimelinePanel
          items={timelineItems}
          insight={aiFollowUpInsight}
          attention={attentionFollowUps}
        />
      </div>

      <div className="text-ink/40 border-line flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-[10px] tracking-widest uppercase">
        <span className="flex items-center gap-2">
          <span className="bg-friday-blue inline-block h-1.5 w-1.5" />
          Follow-up Engine / Active
          <span className="text-ink/25">&bull;</span>
          AI Prioritization / Enabled
          <span className="text-ink/25">&bull;</span>
          Task Sync / Live
        </span>
        <span>Last Update / 10:26 AM</span>
      </div>
    </div>
  )
}
