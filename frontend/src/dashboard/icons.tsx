import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  )
}

export function BarChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M12 20V4M20 20v-6" />
    </svg>
  )
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a3 3 0 0 1-3 3h-3" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M21 20c0-2.8-1.9-5.1-4.5-5.8" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.7-1.3-2-3.4-2 .6a7.8 7.8 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.4a7.8 7.8 0 0 0-2.6 1.5l-2-.6-2 3.4L4.6 10.5a7.6 7.6 0 0 0 0 3L2.9 14.8l2 3.4 2-.6a7.8 7.8 0 0 0 2.6 1.5l.5 2.4h4l.5-2.4a7.8 7.8 0 0 0 2.6-1.5l2 .6 2-3.4Z" />
    </svg>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </svg>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function WarningTriangleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 2.5 20h19L12 4Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M11 2c.4 2.7 1 4.3 2 5.3S16.3 8.6 19 9c-2.7.4-4.3 1-5.3 2S12.4 13.6 12 16c-.4-2.4-1-4-2-5S7.7 9.4 5 9c2.7-.4 4-1 5-2s1.6-2.3 1-5Z" />
      <path d="M19 15.5c.2 1.3.5 2 1 2.5s1.2.8 2.5 1c-1.3.2-2 .5-2.5 1s-.8 1.2-1 2.5c-.2-1.3-.5-2-1-2.5s-1.2-.8-2.5-1c1.3-.2 2-.5 2.5-1s.8-1.2 1-2.5Z" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2.5 3.5L16 11H5" strokeLinejoin="round" />
    </svg>
  )
}

export function SentimentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 15.5s1.2-2 3.5-2 3.5 2 3.5 2M8.5 9.5h.01M15.5 9.5h.01" />
    </svg>
  )
}

export function SyncIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6M4 13a8 8 0 0 0 13.7 4.7L20 15.4" />
      <path d="M4 4v4.6h4.6M20 20v-4.6h-4.6" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v13M7 11l5 5 5-5" />
      <path d="M4 19.5h16" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 4h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L16 14l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 4 5.6 1.5 1.5 0 0 1 5.5 4Z" />
    </svg>
  )
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5A8 8 0 1 1 5 15" />
      <path d="M4 4v5.5H9.5" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  )
}

export function StopwatchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5V13.5L15 15.5" />
      <path d="M9.5 2h5M12 5V2" />
    </svg>
  )
}

export function ExclamationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v10M12 18h.01" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16 10 10l4 4 6-6" />
      <path d="M15 8h5v5" />
    </svg>
  )
}

export function LiveDotIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <circle cx="12" cy="12" r="6" />
    </svg>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.2 11h9.6L19 8H6.5" />
      <circle cx="9" cy="19" r="1.3" />
      <circle cx="16" cy="19" r="1.3" />
    </svg>
  )
}

export function ObjectionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v10M6 7l6-4 6 4" />
      <path d="M4 21h16" />
    </svg>
  )
}

export function SmileyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 13.5s1.2 2 3.5 2 3.5-2 3.5-2M8.5 9.5h.01M15.5 9.5h.01" />
    </svg>
  )
}

export function FlagRequestIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2.5 3.5L16 11H5" strokeLinejoin="round" />
      <path d="M17.5 3.5v5" strokeLinecap="round" />
    </svg>
  )
}
