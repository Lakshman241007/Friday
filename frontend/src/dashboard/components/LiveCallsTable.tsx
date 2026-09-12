import { Card } from './Card'
import { CheckIcon, HeadsetIcon, LiveDotIcon, TrendUpIcon, WarningTriangleIcon } from '../icons'
import type { AiSignalTone, LiveCall } from '../callMonitoringData'

const SIGNAL_STYLE: Record<AiSignalTone, string> = {
  warning: 'bg-friday-orange-soft text-friday-orange',
  info: 'bg-friday-blue-soft text-friday-blue-dark',
  neutral: 'text-ink/45',
}

const SIGNAL_ICON: Record<AiSignalTone, typeof WarningTriangleIcon> = {
  warning: WarningTriangleIcon,
  info: TrendUpIcon,
  neutral: CheckIcon,
}

export function LiveCallsTable({ calls }: { calls: LiveCall[] }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LiveDotIcon className="text-friday-blue h-3.5 w-3.5 animate-pulse" />
          <h2 className="font-serif text-lg font-semibold text-ink">Live Calls</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="border-line text-ink/50 rounded border px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase">
            Engine / Online
          </span>
          <span className="border-line text-ink/50 rounded border px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase">
            Transcription / Online
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-ink/40 border-line border-b text-[11px] tracking-widest uppercase">
              <th className="pb-3 font-semibold">Call ID</th>
              <th className="pb-3 font-semibold">Rep / Lead</th>
              <th className="pb-3 font-semibold">Dur</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">AI Signal</th>
              <th className="pb-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => {
              const SignalIcon = SIGNAL_ICON[call.signal.tone]
              return (
                <tr key={call.callId} className="border-line border-b last:border-b-0">
                  <td className="text-friday-blue py-4 align-top font-mono text-xs font-semibold">
                    {call.callId}
                  </td>
                  <td className="py-4 align-top">
                    <p className="font-serif font-medium text-ink">{call.rep}</p>
                    <p className="text-ink/45 text-xs">{call.company}</p>
                  </td>
                  <td className="text-ink/60 py-4 align-top text-xs">{call.duration}</td>
                  <td className="py-4 align-top">
                    <span className="text-friday-orange flex items-center gap-1.5 text-xs font-semibold">
                      <span className="bg-friday-orange h-1.5 w-1.5 rounded-sm" />
                      Live
                    </span>
                  </td>
                  <td className="py-4 align-top">
                    {call.signal.tone === 'neutral' ? (
                      <span className={`flex items-center gap-1.5 text-xs ${SIGNAL_STYLE.neutral}`}>
                        <SignalIcon className="h-3.5 w-3.5" />
                        {call.signal.label}
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium ${SIGNAL_STYLE[call.signal.tone]}`}
                      >
                        <SignalIcon className="h-3.5 w-3.5" />
                        {call.signal.label}
                      </span>
                    )}
                  </td>
                  <td className="py-4 align-top">
                    <button
                      type="button"
                      title="Live monitoring - coming soon"
                      className={`flex items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold tracking-widest uppercase ${
                        call.highlighted
                          ? 'bg-friday-blue text-white'
                          : 'border-line text-ink/70 border'
                      }`}
                    >
                      <HeadsetIcon className="h-3.5 w-3.5" />
                      Monitor
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
