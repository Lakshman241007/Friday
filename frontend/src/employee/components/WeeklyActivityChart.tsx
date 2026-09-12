import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis } from 'recharts'
import { Card } from '../../dashboard/components/Card'
import type { WeeklyActivityPoint } from '../mockData'

function HighlightDot(points: WeeklyActivityPoint[]) {
  return function Dot(props: {
    x?: number | string
    y?: number | string
    width?: number | string
    index?: number
  }) {
    const { index } = props
    const x = Number(props.x)
    const y = Number(props.y)
    const width = Number(props.width)
    if (index == null || !points[index]?.highlighted || [x, y, width].some(Number.isNaN)) {
      return <g />
    }
    return <circle cx={x + width / 2} cy={y - 8} r="4" fill="#e8590c" />
  }
}

export function WeeklyActivityChart({ data }: { data: WeeklyActivityPoint[] }) {
  return (
    <Card className="p-4">
      <h2 className="font-serif text-lg font-semibold text-ink">Weekly Activity</h2>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e2ec" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#0b1220', fillOpacity: 0.5 }}
            />
            <Bar dataKey="calls" radius={[3, 3, 0, 0]} label={HighlightDot(data)}>
              {data.map((point) => (
                <Cell key={point.day + point.calls} fill={point.highlighted ? '#0b1a3a' : '#e2e2ec'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
