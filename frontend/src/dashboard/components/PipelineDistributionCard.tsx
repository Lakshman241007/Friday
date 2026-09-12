import { Card } from './Card'
import type { PipelineStage } from '../mockData'

export function PipelineDistributionCard({ stages }: { stages: PipelineStage[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink">Pipeline Distribution</h2>
        <span className="text-ink/40 text-xs">Vol. vs Stage</span>
      </div>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full">
        {stages.map((stage) => (
          <div
            key={stage.stage}
            style={{ width: `${stage.share}%`, backgroundColor: stage.color }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {stages.map((stage) => (
          <span key={stage.stage} className="text-ink/60 flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: stage.color }}
            />
            {stage.stage}
          </span>
        ))}
      </div>
    </Card>
  )
}
