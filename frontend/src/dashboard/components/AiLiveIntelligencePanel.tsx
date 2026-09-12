import { Card } from './Card'
import { SettingsIcon } from '../icons'
import type { AiIntelligenceEvent, AiSignalTone } from '../callMonitoringData'

const DOT_TONE: Record<AiSignalTone, string> = {
  warning: 'bg-friday-orange',
  info: 'bg-friday-blue',
  neutral: 'bg-ink/25',
}

const TITLE_TONE: Record<AiSignalTone, string> = {
  warning: 'text-friday-orange',
  info: 'text-friday-blue',
  neutral: 'text-ink/60',
}

export function AiLiveIntelligencePanel({ events }: { events: AiIntelligenceEvent[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <SettingsIcon className="text-friday-blue h-4 w-4" />
        <h2 className="font-serif text-base font-semibold text-ink">
          Friday AI / Live Intelligence
        </h2>
      </div>

      <div className="relative mt-5 space-y-5 pl-4">
        <div className="bg-line absolute top-1 bottom-1 left-[3px] w-px" />
        {events.map((event) => (
          <div key={event.time} className={`relative ${event.muted ? 'opacity-60' : ''}`}>
            <span
              className={`absolute top-1.5 -left-4 h-2 w-2 rounded-full ${DOT_TONE[event.tone]}`}
            />
            <p className="text-ink/35 font-mono text-[10px]">{event.time}</p>
            <p className={`mt-0.5 text-sm font-semibold ${TITLE_TONE[event.tone]}`}>
              {event.title}{' '}
              <span className="text-ink/40 font-normal">- Call {event.callRef}</span>
            </p>
            {event.quote && (
              <div className="border-line bg-paper mt-2 rounded border p-3 text-xs text-ink/60 italic">
                {event.quote}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
