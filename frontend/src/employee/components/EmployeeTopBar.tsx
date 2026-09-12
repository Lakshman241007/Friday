import { MenuIcon, PersonIcon } from '../icons'

export function EmployeeTopBar() {
  return (
    <header className="border-line flex items-center justify-between border-b bg-white px-4 py-3.5">
      <div className="flex items-center gap-2">
        <p className="font-serif text-friday-blue text-base font-semibold tracking-tight">
          FRIDAY
        </p>
        <span className="text-line">|</span>
        <p className="text-ink/45 text-[11px] font-semibold tracking-widest uppercase">
          Dashboard
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          title="Profile (coming soon)"
          className="bg-panel flex h-8 w-8 items-center justify-center rounded-full text-white"
        >
          <PersonIcon className="h-4 w-4" />
        </button>
        <button type="button" title="Menu (coming soon)" className="text-ink/60">
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
