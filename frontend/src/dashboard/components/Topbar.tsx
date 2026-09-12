import { useLocation } from 'react-router-dom'
import { currentManager } from '../mockData'

const SECTION_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/leads': 'Lead Management',
  '/dashboard/calls': 'Call Monitoring',
  '/dashboard/performance': 'Performance',
  '/dashboard/follow-ups': 'Follow-Ups',
}

function getBreadcrumb(pathname: string): string[] {
  if (SECTION_TITLES[pathname]) return [SECTION_TITLES[pathname]]
  if (pathname.startsWith('/dashboard/calls/')) return ['Call Monitoring', 'Call Details']
  return ['Dashboard']
}

function getGreeting(firstName: string): string {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  return `Good ${part}, ${firstName}.`
}

export function Topbar() {
  const { pathname } = useLocation()
  const breadcrumb = getBreadcrumb(pathname)
  const firstName = currentManager.name.split(' ')[0]

  return (
    <header className="border-line flex h-16 shrink-0 items-center justify-between border-b bg-white px-8">
      <div className="flex items-center gap-3 text-xs">
        <span className="text-ink/40 font-mono tracking-widest uppercase">
          Friday / Manager /{' '}
          {breadcrumb.map((segment, i) => (
            <span key={segment}>
              {i === breadcrumb.length - 1 ? (
                <span className="text-ink font-semibold">{segment}</span>
              ) : (
                <>{segment} / </>
              )}
            </span>
          ))}
        </span>
        <span className="text-line">|</span>
        <span className="text-ink/70">{getGreeting(firstName)}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase">
          <span className="bg-friday-orange h-1.5 w-1.5 rounded-full" />
          Friday AI / Online
        </span>
        <div className="bg-friday-blue flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white">
          {currentManager.initials}
        </div>
      </div>
    </header>
  )
}
