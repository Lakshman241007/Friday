import { CartIcon, FlagRequestIcon, ObjectionIcon, SmileyIcon } from '../icons'
import type { DetectedSignal } from '../callDetailData'

const ICONS = {
  cart: CartIcon,
  objection: ObjectionIcon,
  smiley: SmileyIcon,
  flag: FlagRequestIcon,
}

export function DetectedSignalsGrid({ signals }: { signals: DetectedSignal[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">Detected Signals</h2>
        <span className="text-ink/35 text-[10px] font-semibold tracking-widest uppercase">
          AI Engine / Analyzed
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {signals.map((signal) => {
          const Icon = ICONS[signal.icon]
          return (
            <div key={signal.label} className="border-line rounded border bg-white p-4">
              <Icon className="text-friday-blue h-5 w-5" />
              <p className="mt-2 text-sm font-medium text-ink">{signal.label}</p>
              <p className="text-ink/50 text-xs">{signal.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
