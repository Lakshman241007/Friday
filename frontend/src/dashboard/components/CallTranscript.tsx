import type { TranscriptLine } from '../callDetailData'

export function CallTranscript({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">Call Transcript</h2>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-friday-blue flex items-center gap-1.5 font-semibold">
            <span className="bg-friday-blue h-2 w-2 rounded-sm" />
            AI Signal
          </span>
          <span className="text-danger flex items-center gap-1.5 font-semibold">
            <span className="bg-danger h-2 w-2 rounded-sm" />
            Objection
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-4">
        {lines.map((line) => (
          <div key={line.time} className="flex gap-3 text-sm">
            <div className="w-14 shrink-0 text-right">
              <p className="text-ink/40 font-mono text-[11px]">{line.time}</p>
              <p className="text-ink/30 font-mono text-[10px] font-semibold">{line.speaker}</p>
            </div>
            <p className="text-ink/75 leading-relaxed">
              {line.parts.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.tone === 'signal'
                      ? 'bg-friday-blue-soft text-friday-blue-dark rounded px-0.5'
                      : part.tone === 'objection'
                        ? 'bg-danger-soft text-danger rounded px-0.5'
                        : undefined
                  }
                >
                  {part.text}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
