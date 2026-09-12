import { NavLink, useNavigate } from 'react-router-dom'
import { endManagerSession } from '../../lib/auth'
import { currentManager } from '../mockData'
import {
  BarChartIcon,
  CalendarIcon,
  GridIcon,
  HeadsetIcon,
  LogoutIcon,
  SettingsIcon,
  UsersIcon,
} from '../icons'

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: GridIcon, end: true }],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Lead Management', to: '/dashboard/leads', icon: BarChartIcon, end: false },
      { label: 'Call Monitoring', to: '/dashboard/calls', icon: HeadsetIcon, end: false },
    ],
  },
  {
    title: 'Team',
    items: [
      { label: 'Performance', to: '/dashboard/performance', icon: UsersIcon, end: false },
      { label: 'Follow-ups', to: '/dashboard/follow-ups', icon: CalendarIcon, end: false },
    ],
  },
]

export function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    endManagerSession()
    navigate('/')
  }

  return (
    <aside className="border-line flex h-screen w-56 shrink-0 flex-col border-r bg-white">
      <div className="px-5 py-6">
        <p className="font-serif text-friday-blue text-lg font-semibold tracking-tight">
          FRIDAY
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-ink/35 mb-2 px-2 text-[10px] font-semibold tracking-widest uppercase">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-friday-blue text-white'
                          : 'text-ink/65 hover:bg-paper hover:text-ink'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-line border-t px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-friday-blue flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
            {currentManager.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{currentManager.name}</p>
            <p className="text-ink/45 truncate text-xs">{currentManager.role}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            title="Settings (coming soon)"
            disabled
            className="text-ink/30 cursor-not-allowed"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="text-ink/45 hover:text-friday-blue"
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
