import { Link, useParams } from 'react-router-dom'
import { getCallDetail } from '../callDetailData'
import { CallSummaryStrip } from '../components/CallSummaryStrip'
import { AiSummaryCard } from '../components/AiSummaryCard'
import { DetectedSignalsGrid } from '../components/DetectedSignalsGrid'
import { ConversationAnalysisCard } from '../components/ConversationAnalysisCard'
import { AiCallScoreCard } from '../components/AiCallScoreCard'
import { SentimentArcChart } from '../components/SentimentArcChart'
import { CallTranscript } from '../components/CallTranscript'
import { Card } from '../components/Card'

export default function CallDetails() {
  const { callId = '' } = useParams()
  const detail = getCallDetail(callId)

  if (!detail) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-3">
        <h1 className="font-serif text-2xl font-semibold text-ink">Call not found</h1>
        <p className="text-ink/50 max-w-sm text-sm">
          No details are available for call {callId || '(unknown)'}.
        </p>
        <Link to="/dashboard/calls" className="text-friday-blue text-sm font-semibold">
          ← Back to Call Monitoring
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard/calls"
            className="text-friday-blue text-xs font-semibold tracking-widest uppercase"
          >
            ← Call Monitoring
          </Link>
          <h1 className="font-serif mt-2 text-2xl font-semibold text-ink">
            Call {detail.callId}
          </h1>
          <p className="text-ink/50 mt-1 text-sm">
            {detail.leadName} &bull; {detail.company}
          </p>
        </div>
        <div className="text-right">
          <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">
            Status / {detail.status}
          </p>
          <p className="text-ink/60 mt-1 text-sm">{detail.completedAt}</p>
        </div>
      </div>

      <CallSummaryStrip detail={detail} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <AiSummaryCard summary={detail.summary} recommendation={detail.keyRecommendation} />
          <DetectedSignalsGrid signals={detail.signals} />
          <Card className="p-5">
            <ConversationAnalysisCard detail={detail} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <AiCallScoreCard detail={detail} />
          </Card>
          <Card className="p-5">
            <SentimentArcChart points={detail.sentimentArc} concernIndex={detail.concernIndex} />
          </Card>
          <Card className="p-5">
            <CallTranscript lines={detail.transcript} />
          </Card>
        </div>
      </div>
    </div>
  )
}
