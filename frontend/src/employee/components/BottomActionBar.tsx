import { Link } from 'react-router-dom'
import { BarChartIcon, PhoneIcon } from '../../dashboard/icons'

export function BottomActionBar() {
  return (
    <div className="border-line flex shrink-0 gap-3 border-t bg-white p-4">
      <Link
        to="/employee/upload"
        className="bg-panel flex flex-1 items-center justify-center gap-2 rounded px-4 py-3.5 text-sm font-semibold text-white"
      >
        <PhoneIcon className="h-4 w-4" />
        Quick Call
      </Link>
      <button className="border-line text-ink flex flex-1 items-center justify-center gap-2 rounded border px-4 py-3.5 text-sm font-semibold">
        <BarChartIcon className="h-4 w-4" />
        Review
      </button>
    </div>
  )
}
