import { Card } from './Card'
import {
  AlertCircleIcon,
  ExclamationIcon,
  HistoryIcon,
  PhoneIcon,
  StopwatchIcon,
  WarningTriangleIcon,
} from '../icons'

const ICONS = {
  phone: PhoneIcon,
  history: HistoryIcon,
  stopwatch: StopwatchIcon,
  warning: WarningTriangleIcon,
  exclamation: ExclamationIcon,
}

export function CallMonitoringStatCard({
  label,
  value,
  icon,
  tinted,
}: {
  label: string
  value: string
  icon: keyof typeof ICONS
  tinted: boolean
}) {
  const Icon = icon === 'exclamation' ? AlertCircleIcon : ICONS[icon]
  return (
    <Card className={`px-5 py-4 ${tinted ? 'bg-danger-soft/50 border-danger/20' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-ink/40 text-[11px] font-semibold tracking-widest uppercase">{label}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className={`font-serif text-2xl font-medium ${tinted ? 'text-danger' : 'text-ink'}`}>
          {value}
        </p>
        <Icon className={`h-5 w-5 ${tinted ? 'text-danger' : 'text-ink/30'}`} />
      </div>
    </Card>
  )
}
