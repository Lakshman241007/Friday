import { Line, LineChart, ResponsiveContainer, XAxis } from 'recharts'
import type { SentimentPoint } from '../callDetailData'

function ConcernDot(concernIndex: number) {
  return function Dot(props: { cx?: number; cy?: number; index?: number }) {
    const { cx, cy, index } = props
    if (index !== concernIndex || cx == null || cy == null) return <g />
    return <circle cx={cx} cy={cy} r={4} fill="#e8590c" stroke="white" strokeWidth={1.5} />
  }
}

export function SentimentArcChart({
  points,
  concernIndex,
}: {
  points: SentimentPoint[]
  concernIndex: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-friday-blue-dark font-semibold">Positive</span>
        {concernIndex >= 0 && (
          <span className="text-friday-orange flex items-center gap-1.5 font-semibold">
            <span className="bg-friday-orange h-1.5 w-1.5 rounded-full" />
            Concern at {points[concernIndex]?.t}
          </span>
        )}
      </div>
      <div className="border-line mt-2 h-40 rounded border bg-white p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1d3fd6"
              strokeWidth={2}
              dot={concernIndex >= 0 ? ConcernDot(concernIndex) : false}
              isAnimationActive={false}
            />
            <XAxis dataKey="t" hide />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-ink/35 font-mono mt-1 flex justify-between text-[10px]">
        <span>{points[0]?.t}</span>
        <span>{points[points.length - 1]?.t}</span>
      </div>
    </div>
  )
}
