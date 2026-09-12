import { ProgressBar } from './ProgressBar'
import type { CallDetail } from '../callDetailData'

export function AiCallScoreCard({ detail }: { detail: CallDetail }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">AI Call Score</h2>
        <span className="font-serif text-friday-blue text-lg font-semibold">
          {detail.aiScore}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
        {detail.scoreBreakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink/55">{item.label}</span>
              <span className="font-medium text-ink">{item.value}%</span>
            </div>
            <div className="mt-1.5">
              <ProgressBar value={item.value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
