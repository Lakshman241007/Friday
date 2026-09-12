import { Card } from './Card'
import { SettingsIcon } from '../icons'

export function AiSummaryCard({
  summary,
  recommendation,
}: {
  summary: string
  recommendation: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <SettingsIcon className="text-friday-blue h-4 w-4" />
        <h2 className="font-serif text-base font-semibold text-ink">AI Summary</h2>
      </div>
      <p className="text-ink/65 mt-3 text-sm leading-relaxed">{summary}</p>

      <div className="border-friday-orange bg-friday-orange-soft mt-4 rounded-r border-l-4 p-4">
        <p className="text-friday-orange text-[11px] font-semibold tracking-widest uppercase">
          Key Recommendation
        </p>
        <p className="mt-1 text-sm text-ink/75">{recommendation}</p>
      </div>
    </Card>
  )
}
